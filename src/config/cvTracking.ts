// Configuration for CV Download Tracking & Google Sheets Integration
export const cvTrackingConfig = {
  // Google Apps Script Web App URL for automatic Google Sheet logging.
  // Setup steps are documented in GOOGLE_SHEET_SETUP.md in the project root.
  // If left as empty string or placeholder, submissions are logged locally to localStorage
  // and the CV download still proceeds seamlessly for recruiters.
  googleSheetWebAppUrl: import.meta.env.PUBLIC_GOOGLE_SHEET_URL || "",

  // File paths and download attributes
  resumeUrl: "/AhmZafirHasan_Resume_Modern.pdf",
  resumeFileName: "AHM_Zafir_Hasan_Resume.pdf",
};
