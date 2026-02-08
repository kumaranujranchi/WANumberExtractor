document.addEventListener('DOMContentLoaded', () => {
  const extractBtn = document.getElementById('extract-btn');
  const downloadBtn = document.getElementById('download-btn');
  const statusDiv = document.getElementById('status');
  const statusText = document.getElementById('status-text');
  const resultsDiv = document.getElementById('results');
  const numberList = document.getElementById('number-list');
  const countSpan = document.getElementById('count');
  const errorDiv = document.getElementById('error');
  const errorText = document.getElementById('error-text');
  const instructionsDiv = document.getElementById('instructions');

  let extractedNumbers = [];

  extractBtn.addEventListener('click', () => {
    extractNumbers();
  });

  downloadBtn.addEventListener('click', () => {
    downloadExcel();
  });

  async function extractNumbers() {
    // Hide previous results/errors
    hideAllSections();
    showStatus('Scanning for phone numbers...');
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url.includes('web.whatsapp.com')) {
        showError('Please open WhatsApp Web first!');
        return;
      }

      // Send message to content script
      chrome.tabs.sendMessage(tab.id, { action: 'extractNumbers' }, (response) => {
        if (chrome.runtime.lastError) {
          showError('Please reload the WhatsApp Web page and try again.');
          return;
        }

        if (response && response.success) {
          extractedNumbers = response.numbers;
          
          if (extractedNumbers.length === 0) {
            showError('No numbers found!\n\nTroubleshooting:\n1. Open "View all" member list\n2. Scroll to BOTTOM\n3. Keep the list visible on SCREEN\n4. If window is very narrow, make it wider');
          } else {
            showResults(extractedNumbers);
          }
        } else {
          showError(response.error || 'Unknown error occurred');
        }
      });
    } catch (err) {
      showError(err.message);
    }
  }

  function showStatus(text) {
    statusDiv.classList.remove('hidden');
    resultsDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    if (instructionsDiv) instructionsDiv.classList.add('hidden');
    statusText.textContent = text;
    extractBtn.disabled = true;
  }

  function showResults(numbers) {
    statusDiv.classList.add('hidden');
    resultsDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    if (instructionsDiv) instructionsDiv.classList.add('hidden');
    extractBtn.disabled = false;
    
    // Show download button
    downloadBtn.classList.remove('hidden');
    
    // Update count text
    countSpan.textContent = `${numbers.length} Numbers Found`;
    
    // Clear list
    numberList.innerHTML = '';
    
    // Add numbers to list
    numbers.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'number-item';
      
      const indexSpan = document.createElement('span');
      indexSpan.className = 'number-index';
      indexSpan.textContent = `${index + 1}.`;
      
      const detailsDiv = document.createElement('div');
      detailsDiv.className = 'number-details';
      
      const nameDiv = document.createElement('div');
      nameDiv.className = 'number-name';
      nameDiv.textContent = item.name;
      
      const phoneDiv = document.createElement('div');
      phoneDiv.className = 'number-value';
      phoneDiv.textContent = item.formatted;
      
      detailsDiv.appendChild(nameDiv);
      detailsDiv.appendChild(phoneDiv);
      
      li.appendChild(indexSpan);
      li.appendChild(detailsDiv);
      
      numberList.appendChild(li);
    });
  }

  function showError(text) {
    statusDiv.classList.add('hidden');
    resultsDiv.classList.add('hidden');
    errorDiv.classList.remove('hidden');
    // Don't hide instructions on error so user can see what to do
    if (instructionsDiv) instructionsDiv.classList.remove('hidden');
    
    errorText.textContent = text;
    extractBtn.disabled = false;
  }

  function hideAllSections() {
    statusDiv.classList.add('hidden');
    resultsDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
  }

  function downloadExcel() {
    if (extractedNumbers.length === 0) return;
    
    // Create CSV content
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Phone Number\n"
      + extractedNumbers.map(e => `"${e.name}","${e.number}"`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `whatsapp_contacts_${new Date().getTime()}.csv`); // Fixed filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});
