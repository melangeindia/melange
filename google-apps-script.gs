/* =========================================================================
   Melange India — Lead Capture Backend (Google Apps Script)
   Receives form submissions and appends them as a row in a Google Sheet.

   SETUP (5 minutes, completely free):
   1. Create a Google Sheet. Name the first tab "Leads".
   2. In the Sheet menu: Extensions ▸ Apps Script.
   3. Delete any sample code, paste THIS entire file, and Save.
   4. Click "Deploy" ▸ "New deployment".
        - Type:        Web app  (click the gear ▸ Web app)
        - Description:  Melange Leads
        - Execute as:   Me
        - Who has access: Anyone        <-- important, so the website can post
   5. Click Deploy ▸ Authorize access ▸ allow your Google account.
   6. Copy the "Web app URL" it gives you.
   7. Paste that URL into contact.js  ->  const SHEET_ENDPOINT = "...";
   Done. Submissions will appear as new rows in the sheet.

   To get email alerts on every lead, set NOTIFY_EMAIL below.
   ========================================================================= */

const SHEET_NAME   = "Leads";
const NOTIFY_EMAIL = "";   // e.g. "info@melangeindia.in"  (leave "" to disable)

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Add header row once
    const headers = ["Timestamp","Source","Name","Company","Email","Phone","City","Interest","Message","Page URL"];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.getRange(1,1,1,headers.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.source    || "website",
      data.name      || "",
      data.company   || "",
      data.email     || "",
      data.phone     || "",
      data.city      || "",
      data.interest  || "",
      data.message   || "",
      data.page_url  || ""
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "New Melange lead (" + (data.source || "website") + "): " + (data.name || ""),
        body: ["Source: "  + (data.source  || ""),
               "Name: "    + (data.name     || ""),
               "Company: " + (data.company  || ""),
               "Email: "   + (data.email    || ""),
               "Phone: "   + (data.phone    || ""),
               "City: "    + (data.city     || ""),
               "Interest: "+ (data.interest || ""),
               "Message: " + (data.message  || "")].join("\n")
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you open the Web app URL in a browser to confirm it's live
function doGet() {
  return ContentService.createTextOutput("Melange lead endpoint is running.");
}
