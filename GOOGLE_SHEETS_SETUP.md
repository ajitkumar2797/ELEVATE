# Google Sheets Integration Setup 

Since you deleted the previous sheet, please follow these steps exactly to set it up again.

## 1. Create a New Google Sheet
1. Go to [Google Sheets](https://sheets.google.com) and create a **Blank** spreadsheet.
2. Name it "Fitness Coach Leads".
3. **CRITICAL:** In the first row (Row 1), add these exact headers in columns A through F:
   - Column A: `timestamp`
   - Column B: `name`
   - Column C: `email`
   - Column D: `goal`
   - Column E: `gender`
   - Column F: `message`

## 2. Add the Code
1. In your new Google Sheet, click on **Extensions** > **Apps Script**.
2. **Delete everything** currently in the code editor (usually `function myFunction() {...}`).
3. Copy and paste the **exact code below**:

```javascript
var sheetName = 'Sheet1';
var scriptProp = PropertiesService.getScriptProperties();

function intialSetup () {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

function doPost (e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    var sheet = doc.getSheetByName(sheetName);

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;

    var newRow = headers.map(function(header) {
      if(header === 'timestamp'){
        return new Date();
      }
      return e.parameter[header];
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  finally {
    lock.releaseLock();
  }
}
```

4. Click the **Save** icon (floppy disk) in the toolbar. Name the project "Contact Form" if asked.

## 3. Run Initial Setup
1. In the toolbar, ensure `intialSetup` is selected in the dropdown menu.
2. Click **Run**.
3. A "Authorization Required" window will pop up.
   - Click **Review Permissions**.
   - Select your Google Account.
   - You will see a warning "Google hasn't verified this app" (because you just wrote it).
   - Click **Advanced**.
   - Click **Go to Contact Form (unsafe)** at the bottom.
   - Click **Allow**.
4. The execution log should say "Execution started" and "Execution completed" with no errors.

## 4. Deploy as Web App
1. Click the blue **Deploy** button (top right) > **New deployment**.
2. Click the **Gear icon** (Select type) > **Web app**.
3. Fill in these settings:
   - **Description**: Contact Form
   - **Execute as**: Me (your email)
   - **Who has access**: **Anyone** (IMPORTANT: Do not select "Only me" or "Anyone with Google Account")
4. Click **Deploy**.
5. **Copy the Web App URL** (it ends in `/exec`).

## 5. Update Your Website Code
1. Open the file `js/main.js` in your project.
2. Find the line: `const scriptURL = '...';`
3. Replace the old URL with the **new Web App URL** you just copied.
4. Save the file.

## 6. Test It
1. Reload your website page (Cmd+Shift+R).
2. Fill out the form and submit.
3. Check your Google Sheet to see the new row!
