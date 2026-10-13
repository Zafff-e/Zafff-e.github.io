# Google Sheets CV Download Tracking Setup Guide

This guide will show you how to automatically track everyone who downloads your CV from your portfolio directly inside a **private Google Spreadsheet**.

---

## 🚀 3-Minute Setup

### Step 1: Create a New Google Sheet
1. Go to [sheets.new](https://sheets.new) in your browser.
2. Rename the spreadsheet to something memorable, e.g.:
   `Zafir Portfolio — CV Downloads`

### Step 2: Open the Apps Script Editor
1. In the Google Sheets top menu bar, click **Extensions** → **Apps Script**.
2. A new tab will open with code editor.

### Step 3: Paste the Tracking Script
1. Delete any boilerplate code (e.g. `function myFunction() {}`).
2. Open the file `google-apps-script-code.js` located in this repository.
3. Copy its entire content and paste it into the Apps Script editor.
4. *(Optional)* If you'd like an email alert whenever someone downloads your CV:
   - Change `var NOTIFY_MY_EMAIL = false;` to `var NOTIFY_MY_EMAIL = true;`
   - Set `var MY_EMAIL_ADDRESS = "your.real.email@gmail.com";`
5. Click the **Save** icon (disk) or press `Ctrl + S`.

### Step 4: Deploy as a Web App
1. In the top-right corner of the Apps Script window, click the blue **Deploy** button → **New deployment**.
2. Click the **gear icon** (⚙️) next to *Select type* and choose **Web app**.
3. Fill in the fields:
   - **Description**: `Portfolio CV Tracker`
   - **Execute as**: `Me (your_email@gmail.com)`
   - **Who has access**: **`Anyone`** *(⚠️ IMPORTANT: Must be set to "Anyone" so that recruiters and visitors can submit without being forced to log into your Google domain).*
4. Click **Deploy**.
5. When prompted with *Authorization required*, click **Authorize access**, choose your Google account:
   - If Google shows a warning saying *"Google hasn't verified this app"*, click **Advanced** (bottom left), then click **Go to Untitled project (unsafe)**, and finally click **Allow**. *(This is standard for personal Google Apps Scripts).*
6. Google will give you a **Web app URL** that looks like:
   `https://script.google.com/macros/s/AKfycbx.../exec`
7. Copy this URL!

---

## 🔗 Step 5: Connect It to Your Portfolio

You have two easy ways to plug the URL into your project:

### Option A: Edit `src/config/cvTracking.ts` (Quickest)
Open `src/config/cvTracking.ts` and paste your URL into `googleSheetWebAppUrl`:
```typescript
export const cvTrackingConfig = {
  googleSheetWebAppUrl: "https://script.google.com/macros/s/AKfycb.../exec",
  resumeUrl: "/resume.pdf",
  resumeFileName: "AHM_Zafir_Hasan_Resume.pdf",
};
```

### Option B: Using an Environment Variable
Create or edit a `.env` file inside `repo_temp`:
```env
PUBLIC_GOOGLE_SHEET_URL="https://script.google.com/macros/s/AKfycb.../exec"
```

---

## 📊 What Data Is Logged in the Google Sheet?

Every time a visitor fills the form and downloads your CV, a new row is automatically recorded with:
1. **Timestamp**: Exact date and time of the download.
2. **Full Name**: The name entered by the visitor.
3. **Email Address**: Their email address.
4. **Organization / Role**: Company or affiliation (optional field).
5. **Page URL**: Portfolio page URL.
6. **Referrer**: Where they came from (e.g. LinkedIn, GitHub, Google, direct).
7. **User Agent**: Browser/Device information.

---

## 🛡️ Built-in Offline & Failure Protection
Even if someone has an ad-blocker or the Google Sheet service takes a second:
- The lead is **always safely backed up in `localStorage`** under the key `zafir_cv_leads`.
- The CV PDF download will **never freeze or block the recruiter** — their download begins automatically regardless.
