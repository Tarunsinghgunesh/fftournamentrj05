# 🎮 RJ05 ESPORTS — COMPLETE SETUP & DEPLOYMENT GUIDE

Welcome to the official deployment manual for **RJ05 Esports — Free Fire Tournament Portal**. This guide walks you through setting up the Google Sheet database, deploying the Google Apps Script Web App, configuring MacroDroid for zero-fee payment auto-verification, and deploying the React frontend on Vercel.

---

## 🏆 ORGANIZER CREDENTIALS SUMMARY
- **Tournament Organization:** RJ05 Esports
- **Organizer:** Anirudh Singh
- **Official Free Fire Host UID:** `3029117867`
- **WhatsApp / Phone:** `+91 8209071700`
- **Email:** `anirudhgunesh5@gmail.com`
- **Instagram:** `@i.e_anirudh_rj05` ([https://instagram.com/i.e_anirudh_rj05](https://instagram.com/i.e_anirudh_rj05))
- **Primary UPI ID:** `8209071700@ybl`
- **Agency Credit:** Designed & Developed by [TK Web Solutions](https://tkwebsolutions.in/)

---

## 📑 TABLE OF CONTENTS
1. [Google Sheets & Apps Script Setup](#1-google-sheets--apps-script-setup)
2. [MacroDroid Zero-Fee Auto-Verification Setup](#2-macrodroid-zero-fee-auto-verification-setup)
3. [Local Development & Environment Configuration](#3-local-development--environment-configuration)
4. [Deploying to Vercel (1-Click & CLI)](#4-deploying-to-vercel)
5. [Testing & Operational Checklist](#5-testing--operational-checklist)

---

## 1. GOOGLE SHEETS & APPS SCRIPT SETUP

The system uses Google Sheets as a free database and Google Apps Script (`backend/Code.gs`) as the serverless REST API and automated email sender.

### Step 1.1: Create Google Sheet
1. Open [Google Sheets](https://sheets.new) in your browser.
2. Title your spreadsheet: `RJ05 Esports - Tournament Database`.
3. The script automatically initializes the tabs if they don't exist, but you can also create them manually:
   - **Tab 1: `Bookings`**
     - Column Headers: `Timestamp | Order ID | Exact Amount | Slot No | Player Name | Free Fire UID | Mobile | Email | Match Type | Status`
   - **Tab 2: `Queries`**
     - Column Headers: `Timestamp | Name | Free Fire UID | Contact | Issue Type | Message`

### Step 1.2: Add Backend Code
1. In the Google Sheet top menu, click **Extensions** > **Apps Script**.
2. Rename the project to `RJ05 Esports Backend API`.
3. Clear any existing code in `Code.gs`.
4. Copy the entire contents of [`backend/Code.gs`](file:///c:/Users/hp/Downloads/free%20fire%20tournament/backend/Code.gs) and paste it into `Code.gs`.
5. Click the **Save** floppy disk icon (or `Ctrl + S`).

### Step 1.3: Deploy as Web App
1. At the top right of Apps Script, click **Deploy** > **New deployment**.
2. Select type: **Web app** (gear icon).
3. Set the following options:
   - **Description:** `RJ05 Esports API v1`
   - **Execute as:** `Me (your-email@gmail.com)`
   - **Who has access:** `Anyone` *(Crucial so players and MacroDroid can access without Google login)*
4. Click **Deploy**.
5. When prompted, click **Authorize Access**, select your Google account, click **Advanced**, and proceed to `RJ05 Esports Backend API (unsafe)`.
6. Copy the generated **Web App URL** (format: `https://script.google.com/macros/s/AKfycb.../exec`).

---

## 2. MACRODROID ZERO-FEE AUTO-VERIFICATION SETUP

MacroDroid runs on the organizer's Android device (where `8209071700@ybl` is active on PhonePe, Google Pay, Paytm, or BHIM). It automatically reads UPI incoming credit SMS/push notifications and calls the Google Apps Script webhook.

### How Dynamic Paise Matching Works:
- When a player registers for Solo (Base ₹50), the portal assigns a unique paise amount (e.g., `₹50.14`).
- The player scans the dynamic QR and pays exactly `₹50.14`.
- When the bank or UPI app posts notification: `"Received Rs 50.14 from XYZ..."`, MacroDroid intercepts this notification and hits your Google Script URL.
- The Google Script matches `50.14` with the pending order, marks it **CONFIRMED**, and instantly fires the HTML boarding pass email!

### MacroDroid Configuration:
1. Install **MacroDroid - Device Automation** from Google Play Store.
2. Create a new Macro:
   - **Name:** `RJ05 UPI Auto Verifier`
3. **Trigger:**
   - **Notification** > **Notification Received**
   - Select your UPI apps (e.g., PhonePe, Google Pay, Paytm, or your Bank SMS app).
   - Text Content: `Contains` -> `received` OR `credited` OR `INR` OR `Rs`.
4. **Action:**
   - **Web / HTTP Request**
   - **URL:** `YOUR_GOOGLE_SCRIPT_WEB_APP_URL`
   - **HTTP Method:** `POST`
   - **Content-Type:** `application/json`
   - **Request Body (JSON):**
     ```json
     {
       "action": "payment_received",
       "text": "[not_body]"
     }
     ```
     *(Note: `[not_body]` is MacroDroid's built-in variable that holds the incoming notification text)*
5. Turn the Macro **ON**.

---

## 3. LOCAL DEVELOPMENT & ENVIRONMENT CONFIGURATION

### Step 3.1: Configure Environment Variables
Open the `.env` file in the project root:
```env
# Paste your deployed Google Apps Script URL here
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ACTUAL_ID/exec

# Organizer UPI Payment Information
VITE_UPI_ID=8209071700@ybl
VITE_PAYEE_NAME=RJ05 Esports - Anirudh Singh

# Host Information
VITE_ORGANIZER_NAME=Anirudh Singh
VITE_ORGANIZER_UID=3029117867
VITE_ORGANIZER_PHONE=+918209071700
VITE_ORGANIZER_EMAIL=anirudhgunesh5@gmail.com
VITE_ORGANIZER_INSTA=https://instagram.com/i.e_anirudh_rj05
```

> **Note:** If `VITE_GOOGLE_SCRIPT_URL` is empty, the application automatically runs in **Offline Demo Mode** with built-in instant payment simulation and realistic mock roster lookup.

### Step 3.2: Run Locally
```bash
# Start Vite development server
npm run dev

# Or build for production preview
npm run build
npm run preview
```

---

## 4. DEPLOYING TO VERCEL

### Option A: Deploy via Vercel CLI (Recommended)
1. Install Vercel CLI globally if not installed:
   ```bash
   npm i -g vercel
   ```
2. In the project root, run:
   ```bash
   vercel
   ```
3. Follow the CLI prompts to link to your Vercel account.
4. Set Environment Variables in your Vercel dashboard:
   - `VITE_GOOGLE_SCRIPT_URL`
   - `VITE_UPI_ID`
   - `VITE_PAYEE_NAME`
5. Deploy to production:
   ```bash
   vercel --prod
   ```

### Option B: Deploy via GitHub & Vercel Dashboard
1. Push this repository to GitHub or GitLab.
2. Log in to [Vercel](https://vercel.com).
3. Click **Add New...** > **Project** and import your repository.
4. Under **Environment Variables**, add:
   - Key: `VITE_GOOGLE_SCRIPT_URL` | Value: Your Web App URL
   - Key: `VITE_UPI_ID` | Value: `8209071700@ybl`
   - Key: `VITE_PAYEE_NAME` | Value: `RJ05 Esports - Anirudh Singh`
5. Click **Deploy**. Vercel will build and assign your production domain.

---

## 5. TESTING & OPERATIONAL CHECKLIST

1. **Verify Host UID:**
   - Confirm official host UID `3029117867` displays properly across Hero, Cards, Footer, and Contact sections.
2. **Audio Synthesizer:**
   - Test mouse hover and button clicks. Click the speaker icon in the navbar to test mute/unmute.
3. **Registration & Dynamic QR:**
   - Submit a test registration (e.g., Solo ₹50).
   - Check that Step 2 displays the exact paise amount (e.g., `₹50.42`) and generates a valid UPI QR code.
   - Click **"I Have Paid / Verify Instantly"** to test the celebratory Booyah sound and confetti animation!
4. **Live Search:**
   - Search for `3029117867` or `SLOT-01` in the Live Roster search bar to test real-time filtering.
5. **Support Form:**
   - Fill out the support query in the Contact Section to verify it records into the `Queries` tab.
6. **Mandatory Agency Credit:**
   - Verify that the footer badge **"Designed & Developed by TK Web Solutions"** links directly to `https://tkwebsolutions.in/`.

---

**Tournament Operations Support:** Anirudh Singh (`+91 8209071700` | `3029117867`)  
**Portal Architecture:** [TK Web Solutions](https://tkwebsolutions.in/)
