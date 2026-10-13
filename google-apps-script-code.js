/**
 * Google Apps Script for Zafir Hasan's Portfolio CV Download Tracking
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.new) and name the spreadsheet (e.g. "Zafir Portfolio CV Downloads").
 * 2. In Google Sheets menu, click: Extensions -> Apps Script.
 * 3. Delete any default code in the editor, and paste this entire file.
 * 4. (Optional) Set NOTIFY_MY_EMAIL to true and update your email if you want instant email alerts on each download.
 * 5. Click "Deploy" (top right) -> "New deployment".
 * 6. Click the gear icon next to "Select type" -> choose "Web app".
 * 7. Configure:
 *    - Description: "Portfolio CV Tracker"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (IMPORTANT: select "Anyone", so visitors can submit without Google login)
 * 8. Click "Deploy", authorize permissions when prompted, and copy the Web App URL (ends with /exec).
 * 9. Paste this URL into your portfolio (in `src/config/cvTracking.ts` or as `PUBLIC_GOOGLE_SHEET_URL` in `.env`).
 */

// Configuration
var NOTIFY_MY_EMAIL = false; // Change to true if you want an email alert on every download
var MY_EMAIL_ADDRESS = "your.email@example.com"; // Your email to receive alerts

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for concurrent requests
  try {
    lock.waitLock(10000);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Server busy, please retry"
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // Initialize headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Email Address",
        "Organization / Role",
        "Page URL",
        "Referrer",
        "User Agent"
      ]);
      // Format header row
      var headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0f172a");
      headerRange.setFontColor("#38bdf8");
      sheet.setFrozenRows(1);
    }

    // Parse incoming data
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        // Fallback for form-encoded data
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var timestamp = new Date();
    var name = (data.name || "").toString().trim();
    var email = (data.email || "").toString().trim();
    var company = (data.company || "").toString().trim();
    var pageUrl = (data.pageUrl || "").toString().trim();
    var referrer = (data.referrer || "").toString().trim();
    var userAgent = (data.userAgent || "").toString().trim();

    // Append lead row
    sheet.appendRow([
      timestamp,
      name,
      email,
      company,
      pageUrl,
      referrer,
      userAgent
    ]);

    // Optional email notification
    if (NOTIFY_MY_EMAIL && MY_EMAIL_ADDRESS && MY_EMAIL_ADDRESS.indexOf("@") !== -1) {
      try {
        var subject = "📄 New CV Download: " + name + " (" + (company || "Individual") + ")";
        var body = "Someone just requested and downloaded your CV from your portfolio!\n\n" +
          "• Name: " + name + "\n" +
          "• Email: " + email + "\n" +
          "• Organization/Role: " + (company || "N/A") + "\n" +
          "• Time: " + timestamp.toString() + "\n" +
          "• Referrer: " + referrer + "\n\n" +
          "Check your Google Sheet to view all tracked downloads.";
        MailApp.sendEmail(MY_EMAIL_ADDRESS, subject, body);
      } catch (mailErr) {
        // Log mail error silently so response to visitor is not interrupted
        Logger.log("Email notification error: " + mailErr.toString());
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Lead recorded successfully"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Health check endpoint for browser verification
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "Zafir Hasan Portfolio CV Tracking Webhook is active and listening for POST requests."
  })).setMimeType(ContentService.MimeType.JSON);
}
