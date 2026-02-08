# 📱 WhatsApp Number Extractor

A Chrome extension that extracts phone numbers from WhatsApp Web groups and exports them to Excel (CSV format).

## ✨ Features

- 🔍 Extract all phone numbers from WhatsApp group members
- 📊 Export to CSV/Excel format
- 👥 Shows member names along with numbers
- 🎨 Clean, modern UI
- ⚡ Fast and easy to use

## 📋 Installation Instructions

### Step 1: Enable Developer Mode in Chrome

1. Open Google Chrome
2. Go to `chrome://extensions/` (paste this in the address bar)
3. Toggle **Developer mode** ON (top-right corner)

### Step 2: Load the Extension

1. Click **Load unpacked** button
2. Navigate to and select this folder: `/Users/anujkumar/Library/Mobile Documents/com~apple~CloudDocs/whatapp-number-extractor`
3. The extension will now appear in your extensions list

### Step 3: Pin the Extension (Optional but Recommended)

1. Click the puzzle icon (🧩) in Chrome toolbar
2. Find "WhatsApp Number Extractor"
3. Click the pin icon to keep it visible

## 🚀 How to Use

1. **Open WhatsApp Web**
   - Go to [web.whatsapp.com](https://web.whatsapp.com)
   - Log in with your phone

2. **Open a Group**
   - Click on any WhatsApp group

3. **View Group Members**
   - Click on the group name at the top
   - This will open the group info panel showing all members
   - Scroll through the member list to load all members

4. **Extract Numbers**
   - Click the extension icon in Chrome toolbar
   - Click **"Extract Numbers"** button
   - Wait a moment while numbers are extracted

5. **Download Excel File**
   - Once extraction is complete, you'll see the count of numbers found
   - Click **"Download Excel"** button
   - A CSV file will be downloaded (opens in Excel)

## 📁 File Structure

```
whatapp-number-extractor/
├── manifest.json          # Extension configuration
├── content.js            # Extracts numbers from WhatsApp Web
├── popup.html            # Extension popup interface
├── popup.js              # Popup logic and CSV export
├── popup.css             # Styling
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

## ⚠️ Important Notes

- **Only works on WhatsApp Web** (web.whatsapp.com)
- You must be logged into WhatsApp Web
- You must open the group info panel to see members
- Some contacts may show names instead of numbers if saved in your contacts
- The extension extracts numbers as they appear in WhatsApp

## 🔧 Troubleshooting

### "No numbers found" error?

- Make sure you clicked on the group name to open the member list
- Scroll through all members to load them
- Try clicking "Extract Numbers" again

### Extension not working?

- Refresh the WhatsApp Web page
- Make sure you're on web.whatsapp.com
- Check if the extension is enabled in chrome://extensions/

### Numbers missing?

- Some members may have privacy settings that hide their numbers
- Contacts saved in your phone may show names instead of numbers

## 📝 CSV Format

The exported CSV file contains two columns:

- **Name**: Contact name (or "Unknown" if not available)
- **Phone Number**: Full phone number with country code

## 🔒 Privacy

- This extension runs entirely in your browser
- No data is sent to any external servers
- All extraction happens locally on your computer
- Only you have access to the extracted numbers

## 📄 License

Free to use for personal purposes.

---

**Made with ❤️ for easy contact management**
