# 🎮 RJ05 ESPORTS — SEASON 1 TOURNAMENT DEPLOYMENT & OPERATION GUIDE

Comprehensive guide to deploying and managing the **RJ05 Esports — Season 1 Tournament (1st Match)** gaming portal with 100% live Google Sheets sync, zero fake data, and mandatory 12-digit UTR payment cross-checking.

---

## 🏆 OFFICIAL TOURNAMENT SPECIFICATIONS
- **Tournament Title:** RJ05 Esports — Season 1 Tournament (1st Match)
- **Match Date:** Sunday, 29 November 2026
- **Battleground Map:** Bermuda (Only)
- **1st Prize (Booyah Squad):** ₹600 Cash
- **Entry Fee:** ₹25 per player (Solo) | ₹100 per Squad (4 players)
- **Total Capacity:** Strictly 12 Squads = 48 Players Maximum (Single Match)
- **Official UPI ID:** `8209071700@ptsbi`
- **Organizer:** Anirudh Singh
  - **In-Game IGN:** `ANIRUDH•RJ05` | **Level:** 61 | **Guild:** `ACE PRIMERS` | **FF UID:** `3029117867`
  - **WhatsApp / Phone:** `+91 8209071700`
  - **Email:** `anirudhgunesh5@gmail.com`
  - **Instagram:** `@i.e_anirudh_rj05` ([https://instagram.com/i.e_anirudh_rj05](https://instagram.com/i.e_anirudh_rj05))
- **Agency Credit:** Made by [TK Web Solutions](https://tkwebsolutions.in/)

---

## 📑 TABLE OF CONTENTS
1. [Google Sheets Database Schema & Setup](#1-google-sheets-database-schema--setup)
2. [Google Apps Script Deployment](#2-google-apps-script-deployment)
3. [Manual Admin Entry & Direct Live Sync](#3-manual-admin-entry--direct-live-sync)
4. [UTR Cross-Checking & Fraud Prevention](#4-utr-cross-checking--fraud-prevention)
5. [Frontend Configuration (.env) & Vercel Deployment](#5-frontend-configuration-env--vercel-deployment)

---

## 1. GOOGLE SHEETS DATABASE SCHEMA & SETUP

The database consists of two tabs in a single Google Spreadsheet:

### Tab 1: `Bookings`
Columns (Row 1 Header):
| Col | Header Name | Description |
|---|---|---|
| A | `Timestamp` | Date & time of registration |
| B | `Order ID` | Unique ID e.g. `RJ05-847291-382` |
| C | `Booking Type` | `Squad` (4 players) or `Solo` (1 player) |
| D | `Exact Amount` | `100` or `25` |
| E | `UTR Number` | 12-digit numeric UPI reference number |
| F | `Slot No` | Auto-assigned: `SQUAD-SLOT-01` to `SQUAD-SLOT-12` |
| G | `Squad / Team Name` | Team name or Solo player name |
| H | `Player 1 Name & UID` | Leader Name + UID e.g. `VIPER (3029117867)` |
| I | `Player 2 UID` | Teammate 2 Free Fire UID |
| J | `Player 3 UID` | Teammate 3 Free Fire UID |
| K | `Player 4 UID` | Teammate 4 Free Fire UID |
| L | `Players Count` | `4` for squad, `1` for solo |
| M | `Mobile` | 10-digit WhatsApp number |
| N | `Email` | Email for HTML boarding pass receipt |
| O | `Status` | `Confirmed` |

### Tab 2: `Queries`
Columns:
`Timestamp | Name | Free Fire UID | Contact | Issue Type | Message`

---

## 2. GOOGLE APPS SCRIPT DEPLOYMENT

1. Open your Google Spreadsheet.
2. Click **Extensions** > **Apps Script**.
3. Clear any existing code in `Code.gs`.
4. Copy the entire contents of [`backend/Code.gs`](file:///c:/Users/hp/Downloads/free%20fire%20tournament/backend/Code.gs) into `Code.gs`.
5. Click **Save** (`Ctrl + S`).
6. Click **Deploy** > **New deployment**.
7. Select type: **Web app** (gear icon).
   - **Description:** `RJ05 Season 1 Production API`
   - **Execute as:** `Me (your-email@gmail.com)`
   - **Who has access:** `Anyone` *(Crucial so players can query live slots and submit bookings)*
8. Click **Deploy**, authorize permissions with your Google Account.
9. Copy your **Web App URL** (format: `https://script.google.com/macros/s/.../exec`).

---

## 3. MANUAL ADMIN ENTRY & DIRECT LIVE SYNC

The Google Apps Script `GET` endpoint and frontend telemetry bar read **all rows** where `Status` is `"Confirmed"` (case-insensitive).

If an organizer receives payment offline or directly on WhatsApp, simply open the Google Sheet:
1. Add a new row in the `Bookings` tab.
2. Type in the Slot No (`SQUAD-SLOT-02`), Squad Name, Player UIDs, Mobile, and set `Status` = `Confirmed`.
3. Set `Players Count` = `4` (or `1`).
4. **Instantly:** The website's live slot counter, search bar, and confirmed roster will update on the next refresh!

---

## 4. UTR CROSS-CHECKING & FRAUD PREVENTION

- Every online entrant MUST input their **12-digit numeric UPI UTR / Reference Number** from their payment app receipt.
- **Duplicate Prevention:** The backend checks column E (`UTR Number`). If the same UTR is submitted twice, it is rejected immediately.
- **Verification:** Anirudh Singh can open his bank/UPI statement (`8209071700@ptsbi`), check the UTR against column E in Google Sheets, and verify the payment within seconds.

---

## 5. FRONTEND CONFIGURATION (.env) & VERCEL DEPLOYMENT

### Step 5.1: Set `.env`
```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ACTUAL_ID/exec
VITE_UPI_ID=8209071700@ptsbi
VITE_PAYEE_NAME=Sanjo Devi
```

### Step 5.2: Build & Preview
```bash
npm run build
npm run preview
```

### Step 5.3: Deploy to Vercel
1. Import repository to [Vercel](https://vercel.com).
2. Add environment variables:
   - `VITE_GOOGLE_SCRIPT_URL`
   - `VITE_UPI_ID`
   - `VITE_PAYEE_NAME`
3. Click **Deploy**. Vercel will build the SPA with the included `vercel.json` routing rules.

---

**Tournament Operations Support:** Anirudh Singh (`+91 8209071700` | UID: `3029117867`)  
**Portal Architecture:** [TK Web Solutions](https://tkwebsolutions.in/)
