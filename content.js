// DOM extraction with Coordinate-Based Filtering
// Scans entire page but excludes elements on the left side (Chat List)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractNumbers') {
    console.log('Starting coordinate-based extraction...');
    const numbers = extractVisibleNumbers();
    sendResponse({ success: true, numbers: numbers });
  }
  return true;
});

function extractVisibleNumbers() {
  const phoneNumbers = [];
  const seenNumbers = new Set();
  
  console.log('Scanning all visible elements...');
  
  // Use a TreeWalker to find text nodes - fastest and most comprehensive
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Optimization: Skip hidden elements
        if (node.parentElement && node.parentElement.offsetParent === null) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    },
    false
  );
  
  const nodesToCheck = [];
  let node;
  while (node = walker.nextNode()) {
    nodesToCheck.push(node);
  }
  
  console.log(`Found ${nodesToCheck.length} visible text nodes`);
  
  // Define the Chat List width threshold (pixels from left)
  // Chat list is usually on the left side. Elements here should be ignored.
  const CHAT_LIST_THRESHOLD = 200; 
  
  let skippedChatList = 0;
  
  nodesToCheck.forEach(textNode => {
    const text = textNode.textContent;
    const element = textNode.parentElement;
    
    if (!element) return;
    
    // Check for phone number
    // Matches: +91 12345 67890, +91-12345-67890, +911234567890
    const phoneRegex = /\+\d{1,4}[\s\-]?\d{4,5}[\s\-]?\d{4,6}/g;
    const matches = text.match(phoneRegex);
    
    if (matches) {
      // Check position
      const rect = element.getBoundingClientRect();
      
      // Filter out elements that are on the left side (Chat List)
      if (rect.left < CHAT_LIST_THRESHOLD) {
        skippedChatList++;
        return;
      }
      
      matches.forEach(match => {
        const cleanNumber = match.replace(/[\s\-]/g, '');
        
        if (cleanNumber.length >= 10 && !seenNumbers.has(cleanNumber)) {
          seenNumbers.add(cleanNumber);
          
          // Find Name
          let name = findNameForNumber(element, match);
          
          phoneNumbers.push({
            name: name,
            number: cleanNumber,
            formatted: match
          });
        }
      });
    }
  });
  
  console.log(`Skipped ${skippedChatList} numbers from Chat List (left side)`);
  console.log(`Extracted ${phoneNumbers.length} unique group members`);
  
  return phoneNumbers;
}

function findNameForNumber(phoneElement, phoneNumber) {
  const ignoreTexts = [
    'संपर्क करें:', 'संपर्क करें', 'Contact', 'View all', 
    'Search', 'Group info', 'Media', 'Mute', 'Exit group',
    'Report group', 'Add to favourites', 'Group admin',
    'You', 'Click to chat', 'Message', 'Group', 'Admin',
    'participants', 'members', 'typing', 'online', 'last seen'
  ];
  
  // Strategy: Look in nearby elements
  
  // 1. Check Previous Sibling (Most common for "Name" then "Number" lists)
  let parent = phoneElement.parentElement; // The container of the text node
  
  // If the text node is directly inside a span/div, use that. 
  // If it's deep, bubble up slightly.
  
  // Try to find a row container
  let rowElement = parent;
  for(let i=0; i<3; i++) {
    if(!rowElement) break;
    // Heuristic: A row usually spans some width but not full height
    if(rowElement.clientWidth > 200 && rowElement.clientHeight < 100) break;
    rowElement = rowElement.parentElement;
  }
  
  if (rowElement) {
    // Search within this row for name
    const validNames = [];
    
    // Recursive search for text in the row
    function searchRow(el) {
      if (el.nodeType === Node.TEXT_NODE) {
        const t = el.textContent.trim();
        if (isValidName(t, phoneNumber, ignoreTexts)) {
          validNames.push(t);
        }
      } else if (el.nodeType === Node.ELEMENT_NODE) {
        // Don't descend into the phone number's own element if it's isolated
        if (el === phoneElement && el.textContent.includes(phoneNumber)) {
            // skip
        } else {
            for (let child of el.childNodes) searchRow(child);
        }
      }
    }
    
    searchRow(rowElement);
    
    // Pick the best name candidate
    // Usually the one that appears BEFORE the number in DOM order
    if (validNames.length > 0) {
      return validNames[0]; // First valid text in the row
    }
  }
  
  // Fallback: Use the old bubbling strategy if row search fails
  parent = phoneElement.parentElement; 
  for (let i = 0; i < 5 && parent; i++) {
     const nameSpans = parent.querySelectorAll('span[dir="auto"], span[title]');
     for (const span of nameSpans) {
         const t = span.getAttribute('title') || span.textContent.trim();
         if (isValidName(t, phoneNumber, ignoreTexts)) return t;
     }
     parent = parent.parentElement;
  }

  return 'Unknown';
}

function isValidName(text, phoneNumber, ignoreTexts) {
  if (!text || text.length < 2) return false;
  if (text.length > 50) return false;
  
  if (text === phoneNumber || text.includes(phoneNumber)) return false;
  if (text.includes('+') || text.match(/\d{10,}/)) return false;
  if (text.match(/^\d+$/)) return false;
  
  // Date/Time checks
  if (text.match(/\d{1,2}:\d{2}/)) return false; // Time
  if (text.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)) return false; // Date
  if (text.toLowerCase() === 'yesterday' || text.toLowerCase() === 'today') return false;
  
  if (ignoreTexts.some(ignore => text.toLowerCase().includes(ignore.toLowerCase()))) return false;
  
  return true;
}

console.log('WhatsApp Number Extractor - Coordinate-based filtering loaded');
