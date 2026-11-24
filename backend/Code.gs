/**
 * ============================================================================
 * RJ05 ESPORTS — OFFICIAL BACKEND API (Google Apps Script)
 * ============================================================================
 * Project: fftournamentrj05
 * Tournament: Season 1 Tournament (1st Match)
 * Match Date: Sunday, 29 November 2026 | Map: Bermuda (Only) | 1st Prize: ₹600
 * Capacity: Strictly 12 Squads = 48 Players Maximum
 * Official Spreadsheet: https://docs.google.com/spreadsheets/d/1-lN0IcUEDyn3ju54xD7y8yiU1LTmkWGxbgfO2tXWmJ0/edit
 * 
 * Organizer: Anirudh Singh
 * In-Game Name: ANIRUDH•RJ05 | Level: 61 | Guild: ACE PRIMERS | FF UID: 3029117867
 * WhatsApp / Phone: +91 8209071700 | Email: anirudhgunesh5@gmail.com
 * Official UPI ID: 8209071700@ptsbi
 * Agency: Made by TK Web Solutions (https://tkwebsolutions.in/)
 * ============================================================================
 */

// OFFICIAL GOOGLE SPREADSHEET ID & WEB APP DEPLOYMENT URL
const SPREADSHEET_ID = '1-lN0IcUEDyn3ju54xD7y8yiU1LTmkWGxbgfO2tXWmJ0';
const ORGANIZER_EMAIL = 'anirudhgunesh5@gmail.com';
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyMY1QMMwgojSUjp0lV8egZ9XqAKTihTXCE9Hn2QglnE9_soJxPn4qzgJk7iD1AMrQECQ/exec';

const SHEET_BOOKINGS = 'Bookings';
const SHEET_QUERIES = 'Queries';
const MAX_CAPACITY = 48; // 48 Players (12 Squads)
const MAX_SQUADS = 12;

const HEADERS_BOOKINGS = [
  'Timestamp',
  'Order ID',
  'Booking Type',
  'Exact Amount',
  'UTR Number',
  'Slot No',
  'Squad / Team Name',
  'Player 1 Name & UID',
  'Player 2 UID',
  'Player 3 UID',
  'Player 4 UID',
  'Players Count',
  'Mobile',
  'Email',
  'Status'
];

const HEADERS_QUERIES = [
  'Timestamp',
  'Name',
  'Free Fire UID',
  'Contact',
  'Issue Type',
  'Message'
];

/**
 * 🛠️ ONE-CLICK INITIALIZATION & TEST FUNCTION
 * You can select "testSetup" in the Apps Script top bar and click "▷ Run"
 * to verify and create both sheets with headers without any error!
 */
function testSetup() {
  const ss = getSpreadsheet();
  const bookings = getOrCreateSheet(ss, SHEET_BOOKINGS, HEADERS_BOOKINGS);
  const queries = getOrCreateSheet(ss, SHEET_QUERIES, HEADERS_QUERIES);
  Logger.log('✅ SUCCESS: Both sheets Bookings & Queries initialized in your Google Sheet!');
  Logger.log('Google Sheet URL: ' + ss.getUrl());
  return 'SUCCESS: Initialized ' + ss.getName();
}

/**
 * Robust spreadsheet getter:
 * Opens exact spreadsheet ID or falls back to active bound spreadsheet
 */
function getSpreadsheet() {
  try {
    if (SPREADSHEET_ID && SPREADSHEET_ID !== 'YOUR_SPREADSHEET_ID') {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    }
  } catch (err) {
    Logger.log('Could not open by SPREADSHEET_ID, falling back to getActiveSpreadsheet: ' + err.toString());
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Handle GET requests:
 * - ?action=stats : Live telemetry counter (Confirmed players, remaining, squads filled)
 * - ?action=list : Read all confirmed rows (supports web bookings + manual admin entries)
 * - ?action=search&q=... : Real-time search across UID, Team Name, Slot No, Order ID, UTR
 */
function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const action = params.action || 'stats';
    const ss = getSpreadsheet();

    // 0. Action: 1-Click Email Review (Accept / Reject directly from Gmail)
    if (action === 'review') {
      const orderId = String(params.orderId || '').trim();
      const decision = String(params.decision || '').trim().toLowerCase();
      return handleReviewDecision(ss, orderId, decision);
    }

    // 0.1 Action: MacroDroid Webhook Auto-Verification
    if (action === 'macrodroid_webhook' || action === 'auto_verify') {
      const utr = String(params.utr || '').trim();
      const amount = parseFloat(params.amount) || 0;
      return handleMacroDroidWebhook(ss, utr, amount);
    }

    const sheet = getOrCreateSheet(ss, SHEET_BOOKINGS, HEADERS_BOOKINGS);
    const data = sheet.getDataRange().getValues();

    const confirmedBookings = [];
    const pendingBookings = [];
    let totalConfirmedPlayers = 0;
    let totalPendingPlayers = 0;
    let squadBookingsCount = 0;
    let soloBookingsCount = 0;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const status = String(row[14] || '').trim().toLowerCase();
      const rawType = String(row[2] || '').trim().toLowerCase();
      const isSquad = rawType.includes('squad') || parseInt(row[11]) === 4;
      const count = isSquad ? 4 : (parseInt(row[11]) || 1);

      if (status === 'confirmed') {
        if (isSquad) {
          squadBookingsCount++;
        } else {
          soloBookingsCount++;
        }
        totalConfirmedPlayers += count;

        confirmedBookings.push({
          rowId: i + 1,
          timestamp: formatTimestamp(row[0]),
          orderId: String(row[1] || 'OFFLINE-' + i),
          bookingType: isSquad ? 'Squad' : 'Solo',
          amount: parseFloat(row[3]) || (isSquad ? 100 : 25),
          utr: String(row[4] || 'N/A'),
          slotNo: String(row[5] || (isSquad ? ('SQUAD-SLOT-' + String(squadBookingsCount).padStart(2, '0')) : ('SOLO-SLOT-' + String(soloBookingsCount).padStart(2, '0')))),
          teamName: String(row[6] || (row[7] ? String(row[7]).split('-')[0] : (isSquad ? 'Squad ' + squadBookingsCount : 'Solo Player ' + soloBookingsCount))),
          player1: String(row[7] || ''),
          player2: String(row[8] || ''),
          player3: String(row[9] || ''),
          player4: String(row[10] || ''),
          playersCount: count,
          mobile: maskMobile(String(row[12] || '')),
          status: 'Confirmed'
        });
      } else if (status === 'pending') {
        totalPendingPlayers += count;
        pendingBookings.push({
          rowId: i + 1,
          timestamp: formatTimestamp(row[0]),
          orderId: String(row[1] || 'OFFLINE-' + i),
          bookingType: isSquad ? 'Squad' : 'Solo',
          amount: parseFloat(row[3]) || (isSquad ? 100 : 25),
          utr: String(row[4] || 'N/A'),
          slotNo: String(row[5] || 'PENDING'),
          teamName: String(row[6] || 'Pending Verification'),
          player1: String(row[7] || ''),
          player2: String(row[8] || ''),
          player3: String(row[9] || ''),
          player4: String(row[10] || ''),
          playersCount: count,
          mobile: maskMobile(String(row[12] || '')),
          status: 'Pending Verification'
        });
      }
    }

    const soloFormedSquads = Math.floor(soloBookingsCount / 4);
    const soloWaitingPlayers = soloBookingsCount % 4;
    const totalSquadsFilled = Math.min(MAX_SQUADS, squadBookingsCount + soloFormedSquads);
    const remainingPlayers = Math.max(0, MAX_CAPACITY - totalConfirmedPlayers);
    const remainingSquads = Math.max(0, MAX_SQUADS - totalSquadsFilled);

    // 1. Live Telemetry Stats
    if (action === 'stats') {
      return jsonResponse({
        success: true,
        confirmedPlayers: totalConfirmedPlayers,
        pendingPlayers: totalPendingPlayers,
        maxCapacity: MAX_CAPACITY,
        remainingPlayers: remainingPlayers,
        squadBookingsCount: squadBookingsCount,
        soloBookingsCount: soloBookingsCount,
        soloFormedSquads: soloFormedSquads,
        soloWaitingPlayers: soloWaitingPlayers,
        totalSquadsFilled: totalSquadsFilled,
        remainingSquads: remainingSquads,
        maxSquads: MAX_SQUADS,
        isFull: remainingPlayers <= 0,
        tournament: 'RJ05 Esports — Season 1 Tournament (1st Match)',
        date: 'Sunday, 29 November 2026',
        map: 'Bermuda (Only)',
        firstPrize: '₹600 Cash'
      });
    }

    // 2. Confirmed & Pending Roster Directory List
    if (action === 'list') {
      const allRoster = [...confirmedBookings.reverse(), ...pendingBookings.reverse()];
      return jsonResponse({
        success: true,
        count: allRoster.length,
        confirmedCount: confirmedBookings.length,
        pendingCount: pendingBookings.length,
        totalPlayers: totalConfirmedPlayers,
        remainingSlots: remainingPlayers,
        squadBookingsCount: squadBookingsCount,
        soloBookingsCount: soloBookingsCount,
        soloFormedSquads: soloFormedSquads,
        soloWaitingPlayers: soloWaitingPlayers,
        totalSquadsFilled: totalSquadsFilled,
        remainingSquads: remainingSquads,
        roster: allRoster
      });
    }

    // 3. Real-time Search Lookup
    if (action === 'search' || params.q) {
      const query = String(params.q || '').trim().toLowerCase();
      const allSearchList = [...confirmedBookings, ...pendingBookings];
      if (!query) {
        return jsonResponse({ success: true, count: allSearchList.length, results: allSearchList });
      }

      const results = allSearchList.filter(b => {
        return (
          b.slotNo.toLowerCase().includes(query) ||
          b.teamName.toLowerCase().includes(query) ||
          b.orderId.toLowerCase().includes(query) ||
          b.utr.toLowerCase().includes(query) ||
          b.player1.toLowerCase().includes(query) ||
          b.player2.toLowerCase().includes(query) ||
          b.player3.toLowerCase().includes(query) ||
          b.player4.toLowerCase().includes(query)
        );
      });

      return jsonResponse({
        success: true,
        query: query,
        count: results.length,
        results: results
      });
    }

    // Default Ping
    return jsonResponse({
      status: 'ONLINE',
      api: 'RJ05 Esports Season 1 Automated API',
      organizer: 'Anirudh Singh',
      hostUid: '3029117867',
      totalConfirmed: totalConfirmedPlayers,
      totalPending: totalPendingPlayers,
      squadBookings: squadBookingsCount,
      soloBookings: soloBookingsCount,
      remaining: remainingPlayers,
      sheetUrl: 'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '/edit'
    });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Handle POST requests:
 * - action: "create_booking" / "create_order"
 * - action: "contact_query"
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter || {};
    }

    const action = payload.action || 'create_booking';
    const ss = getSpreadsheet();

    // =========================================================================
    // ACTION: CREATE BOOKING WITH MANDATORY 12-DIGIT UTR CROSS-CHECK
    // =========================================================================
    if (action === 'create_booking' || action === 'create_order') {
      const sheet = getOrCreateSheet(ss, SHEET_BOOKINGS, HEADERS_BOOKINGS);
      const data = sheet.getDataRange().getValues();

      const bookingType = payload.bookingType || 'Squad';
      const requestedPlayers = bookingType === 'Squad' ? 4 : 1;
      const utrNumber = String(payload.utrNumber || '').trim();

      // 1. Mandatory 12-Digit Numeric UTR Validation
      if (!/^\d{12}$/.test(utrNumber)) {
        return jsonResponse({
          success: false,
          error: 'INVALID_UTR',
          message: 'A valid 12-digit numeric UPI UTR / Reference Number is strictly required.'
        });
      }

      // 2. Duplicate UTR Check
      let currentConfirmedPlayers = 0;
      let lastSquadIndex = 0;

      for (let i = 1; i < data.length; i++) {
        const rowUtr = String(data[i][4] || '').trim();
        const rowStatus = String(data[i][14] || '').trim().toLowerCase();
        const rowCount = parseInt(data[i][11]) || (String(data[i][2]).toLowerCase().includes('squad') ? 4 : 1);

        if (rowStatus === 'confirmed') {
          currentConfirmedPlayers += rowCount;
          if (String(data[i][2]).toLowerCase().includes('squad')) {
            lastSquadIndex++;
          }
        }

        if (rowUtr && rowUtr === utrNumber) {
          return jsonResponse({
            success: false,
            error: 'DUPLICATE_UTR',
            message: 'This 12-digit UTR (' + utrNumber + ') has already been registered. If this is an error, contact Anirudh Singh on WhatsApp (+91 8209071700).'
          });
        }
      }

      // 3. Slot Capacity Check
      if (currentConfirmedPlayers + requestedPlayers > MAX_CAPACITY) {
        return jsonResponse({
          success: false,
          error: 'SLOTS_FULL',
          message: 'Tournament lobby full! Only ' + Math.max(0, MAX_CAPACITY - currentConfirmedPlayers) + ' player slot(s) left.'
        });
      }

      // 4. Generate Order ID and Slot Number
      const orderId = payload.orderId || ('RJ05-' + Date.now().toString().slice(-6) + '-' + Math.floor(100 + Math.random() * 900));
      let slotNo = '';
      if (bookingType === 'Squad') {
        const nextSquadNo = lastSquadIndex + 1;
        slotNo = 'SQUAD-SLOT-' + String(nextSquadNo).padStart(2, '0');
      } else {
        slotNo = 'SOLO-SLOT-' + String(currentConfirmedPlayers + 1).padStart(2, '0');
      }

      const teamName = payload.teamName || (bookingType === 'Squad' ? 'Team ' + payload.player1Name : payload.player1Name);
      const player1 = payload.player1Name + ' (UID: ' + payload.player1Uid + ')';
      const player2 = payload.player2Uid ? 'UID: ' + payload.player2Uid : 'N/A';
      const player3 = payload.player3Uid ? 'UID: ' + payload.player3Uid : 'N/A';
      const player4 = payload.player4Uid ? 'UID: ' + payload.player4Uid : 'N/A';
      const amount = bookingType === 'Squad' ? 100 : 25;
      const mobile = String(payload.mobile || '').trim();
      const email = String(payload.email || '').trim();
      const status = 'Pending';
      const timestamp = new Date();

      // 5. Append to Google Sheet (marked as Pending until verified)
      sheet.appendRow([
        timestamp,
        orderId,
        bookingType,
        amount,
        utrNumber,
        slotNo,
        teamName,
        player1,
        player2,
        player3,
        player4,
        requestedPlayers,
        mobile,
        email,
        status
      ]);

      const bookingInfo = {
        timestamp: formatTimestamp(timestamp),
        email: email,
        slotNo: slotNo,
        teamName: teamName,
        orderId: orderId,
        utr: utrNumber,
        bookingType: bookingType,
        amount: amount,
        player1: player1,
        player2: player2,
        player3: player3,
        player4: player4,
        mobile: mobile
      };

      // 6. Send Organizer Email with 1-Click Accept & Reject Buttons
      sendOrganizerReviewEmail(bookingInfo);

      // 7. Send Player Acknowledgment Email
      sendPlayerAcknowledgmentEmail(bookingInfo);

      return jsonResponse({
        success: true,
        orderId: orderId,
        slotNo: slotNo,
        bookingType: bookingType,
        amount: amount,
        utr: utrNumber,
        teamName: teamName,
        status: status,
        message: 'Registration received. Awaiting host payment verification.',
        remainingPlayers: Math.max(0, MAX_CAPACITY - (currentConfirmedPlayers + requestedPlayers))
      });
    }

    // =========================================================================
    // ACTION: CONTACT / SUPPORT QUERY
    // =========================================================================
    if (action === 'contact_query') {
      const sheet = getOrCreateSheet(ss, SHEET_QUERIES, HEADERS_QUERIES);
      sheet.appendRow([
        new Date(),
        payload.name || 'Anonymous',
        payload.uid || 'N/A',
        payload.contact || 'N/A',
        payload.issueType || 'General Inquiry',
        payload.message || ''
      ]);

      // Also notify organizer of new support dispute
      try {
        MailApp.sendEmail({
          to: ORGANIZER_EMAIL,
          name: 'RJ05 Support Desk',
          subject: '[RJ05 DISPUTE / QUERY] ' + (payload.issueType || 'New Query') + ' - ' + (payload.name || 'User'),
          htmlBody: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background: #07090E; color: #FFF; border: 1px solid #FF5500; border-radius: 10px;">
              <h2 style="color: #FF5500;">New Support Ticket Received</h2>
              <p><strong>Name:</strong> ${payload.name}</p>
              <p><strong>FF UID:</strong> ${payload.uid}</p>
              <p><strong>Contact:</strong> ${payload.contact}</p>
              <p><strong>Category:</strong> ${payload.issueType}</p>
              <p><strong>Message:</strong><br/>${payload.message}</p>
              <hr style="border: 0.5px solid #333;"/>
              <p><a href="https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit" style="color: #00F0FF;">Open Google Sheet Queries Tab</a></p>
            </div>
          `
        });
      } catch (e) {}

      return jsonResponse({
        success: true,
        message: 'Your query has been transmitted to organizer Anirudh Singh.'
      });
    }

    return jsonResponse({ success: false, message: 'Unrecognized action: ' + action });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * ============================================================================
 * 1-CLICK EMAIL REVIEW HANDLER (ACCEPT / REJECT DIRECTLY FROM ORGANIZER'S GMAIL)
 * ============================================================================
 */
function handleReviewDecision(ss, orderId, decision) {
  const sheet = getOrCreateSheet(ss, SHEET_BOOKINGS, HEADERS_BOOKINGS);
  const data = sheet.getDataRange().getValues();

  let targetRowIndex = -1;
  let targetRow = null;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === orderId) {
      targetRowIndex = i + 1;
      targetRow = data[i];
      break;
    }
  }

  if (targetRowIndex === -1) {
    return HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html>
      <head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
      <body style="font-family: Arial, sans-serif; background: #0B0F19; color: #FFF; text-align: center; padding: 50px 20px;">
        <h2 style="color: #EF4444;">❌ Order Not Found</h2>
        <p style="color: #94A3B8;">Order ID: <code>${orderId}</code> was not found in the Google Sheet database.</p>
      </body>
      </html>
    `);
  }

  const currentStatus = String(targetRow[14] || '').trim();
  const slotNo = String(targetRow[5] || '');
  const teamName = String(targetRow[6] || '');
  const playerEmail = String(targetRow[13] || '');
  const amount = targetRow[3];
  const utr = targetRow[4];

  if (currentStatus.toLowerCase() === 'confirmed' && decision === 'approve') {
    return HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html>
      <head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
      <body style="font-family: Arial, sans-serif; background: #0B0F19; color: #FFF; text-align: center; padding: 50px 20px;">
        <div style="font-size: 45px; margin-bottom: 10px;">⚡</div>
        <h2 style="color: #00FF66;">Already Confirmed!</h2>
        <p style="color: #94A3B8;">Slot <strong>${slotNo}</strong> (${teamName}) is already confirmed and active.</p>
      </body>
      </html>
    `);
  }

  if (decision === 'approve') {
    // 1. Update Status to Confirmed in Google Sheet (Column 15)
    sheet.getRange(targetRowIndex, 15).setValue('Confirmed');
    sheet.getRange(targetRowIndex, 15).setBackground('#D4EDDA').setFontColor('#155724');

    // 2. Send official Booyah boarding pass to player
    sendPlayerConfirmedPass({
      slotNo: slotNo,
      teamName: teamName,
      bookingType: targetRow[2],
      amount: amount,
      utr: utr,
      timestamp: formatTimestamp(targetRow[0]),
      mobile: targetRow[12],
      email: playerEmail,
      player1: targetRow[7],
      player2: targetRow[8],
      player3: targetRow[9],
      player4: targetRow[10],
      orderId: orderId
    });

    return HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Slot Approved - RJ05 Esports</title>
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; background: #0B0F19; color: #FFFFFF; text-align: center; padding: 40px 20px;">
        <div style="max-width: 520px; margin: auto; background: #141C2E; border: 2px solid #00FF66; border-radius: 16px; padding: 32px 24px; box-shadow: 0 0 35px rgba(0,255,102,0.35);">
          <div style="font-size: 55px; margin-bottom: 12px;">✅</div>
          <h1 style="color: #00FF66; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 1px;">SLOT APPROVED & CONFIRMED!</h1>
          <p style="color: #94A3B8; font-size: 14px; margin: 8px 0 24px;">The payment was verified by Host Anirudh Singh.</p>
          
          <div style="background: rgba(0,255,102,0.08); border: 1.5px solid #00FF66; padding: 18px; border-radius: 12px; margin-bottom: 24px;">
            <div style="font-size: 32px; font-weight: 900; color: #FFF; letter-spacing: 2px;">${slotNo}</div>
            <div style="font-size: 16px; color: #FFAA00; font-weight: bold; margin-top: 4px;">${teamName}</div>
            <div style="font-size: 12px; color: #94A3B8; margin-top: 6px;">UTR: <span style="color:#00F0FF; font-family: monospace;">${utr}</span> • Amount: ₹${amount}</div>
          </div>

          <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; font-size: 13px; color: #CBD5E1; text-align: left; line-height: 1.8;">
            ✓ Google Sheet status updated to <strong>"Confirmed"</strong>.<br/>
            ✓ Official Boarding Pass emailed to <strong>${playerEmail}</strong>.<br/>
            ✓ Website live counter and search roster updated!
          </div>

          <div style="margin-top: 25px;">
            <a href="https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit" style="display: inline-block; padding: 12px 24px; background: #FF5500; color: #FFF; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px;">
              Open Google Sheet
            </a>
          </div>
        </div>
      </body>
      </html>
    `);
  } else if (decision === 'reject') {
    // 1. Update Status to Rejected in Google Sheet (Column 15)
    sheet.getRange(targetRowIndex, 15).setValue('Rejected');
    sheet.getRange(targetRowIndex, 15).setBackground('#F8D7DA').setFontColor('#721C24');

    // 2. Send rejection email to player
    sendPlayerRejectedNotification({
      email: playerEmail,
      teamName: teamName,
      slotNo: slotNo,
      orderId: orderId,
      utr: utr,
      amount: amount
    });

    return HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Slot Rejected - RJ05 Esports</title>
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; background: #0B0F19; color: #FFFFFF; text-align: center; padding: 40px 20px;">
        <div style="max-width: 520px; margin: auto; background: #141C2E; border: 2px solid #EF4444; border-radius: 16px; padding: 32px 24px; box-shadow: 0 0 35px rgba(239,68,68,0.35);">
          <div style="font-size: 55px; margin-bottom: 12px;">❌</div>
          <h1 style="color: #EF4444; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 1px;">BOOKING REJECTED!</h1>
          <p style="color: #94A3B8; font-size: 14px; margin: 8px 0 24px;">The 12-Digit UTR could not be verified by the host.</p>
          
          <div style="background: rgba(239,68,68,0.08); border: 1.5px solid #EF4444; padding: 18px; border-radius: 12px; margin-bottom: 24px;">
            <div style="font-size: 20px; font-weight: bold; color: #FFF;">${teamName} (${orderId})</div>
            <div style="font-size: 13px; color: #EF4444; margin-top: 6px;">Unverified UTR: <span style="font-family: monospace;">${utr}</span></div>
          </div>

          <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; font-size: 13px; color: #CBD5E1; line-height: 1.6;">
            • Google Sheet marked as <strong>"Rejected"</strong>.<br/>
            • The slot has been released back into open capacity so genuine players can book.<br/>
            • Rejection email sent to player with support contact.
          </div>
        </div>
      </body>
      </html>
    `);
  }

  return HtmlService.createHtmlOutput('Invalid decision action.');
}

/**
 * ============================================================================
 * MACRODROID WEBHOOK AUTO-VERIFICATION HANDLER
 * ============================================================================
 */
function handleMacroDroidWebhook(ss, utr, amount) {
  let cleanUtr = String(utr || '').trim().replace(/\D/g, '');
  if (cleanUtr.length >= 12) {
    cleanUtr = cleanUtr.slice(-12);
  }
  if (cleanUtr.length < 12) {
    return jsonResponse({ success: false, error: 'INVALID_UTR', message: 'Valid 12-digit numeric UTR required.' });
  }

  const sheet = getOrCreateSheet(ss, SHEET_BOOKINGS, HEADERS_BOOKINGS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const rowUtr = String(data[i][4] || '').trim();
    const rowStatus = String(data[i][14] || '').trim().toLowerCase();

    // Match if 12-digit UTR matches and status is Pending
    if (rowUtr === cleanUtr && rowStatus === 'pending') {
      const rowIndex = i + 1;
      sheet.getRange(rowIndex, 15).setValue('Confirmed');
      sheet.getRange(rowIndex, 15).setBackground('#D4EDDA').setFontColor('#155724');

      const passData = {
        slotNo: String(data[i][5] || ''),
        teamName: String(data[i][6] || ''),
        bookingType: data[i][2],
        amount: data[i][3],
        utr: data[i][4],
        timestamp: formatTimestamp(data[i][0]),
        mobile: data[i][12],
        email: data[i][13],
        player1: data[i][7],
        player2: data[i][8],
        player3: data[i][9],
        player4: data[i][10],
        orderId: data[i][1]
      };

      sendPlayerConfirmedPass(passData);

      return jsonResponse({
        success: true,
        matched: true,
        orderId: data[i][1],
        slotNo: data[i][5],
        message: 'MacroDroid auto-verified and confirmed!'
      });
    }
  }

  return jsonResponse({
    success: true,
    matched: false,
    message: 'No pending booking found matching UTR ' + cleanUtr
  });
}

/**
 * ============================================================================
 * SEND ORGANIZER REVIEW EMAIL WITH 1-CLICK ACTION BUTTONS
 * ============================================================================
 */
function sendOrganizerReviewEmail(data) {
  try {
    const organizerSubject = `🚨 [VERIFY PAYMENT] ${data.slotNo}: ${data.teamName} (₹${data.amount}) • UTR: ${data.utr}`;
    const organizerHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #0B0F19; color: #FFFFFF; padding: 25px; border-radius: 14px; max-width: 600px; margin: auto; border: 2px solid #FFAA00;">
        <div style="text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
          <h2 style="color: #FFAA00; margin: 0; font-size: 22px;">⚡ NEW TOURNAMENT SLOT WAITING FOR VERIFICATION!</h2>
          <p style="font-size: 13px; color: #94A3B8; margin: 6px 0 0 0;">Check your PhonePe / Paytm / GPay transaction history for ₹${data.amount} and click Accept or Reject below.</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 8px 0; color: #94A3B8;">Slot Reserved:</td><td style="font-weight: bold; color: #00F0FF; text-align: right; font-size: 16px;">${data.slotNo}</td></tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 8px 0; color: #94A3B8;">Team / Player:</td><td style="font-weight: bold; color: #FFFFFF; text-align: right;">${data.teamName} (${data.bookingType})</td></tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 8px 0; color: #94A3B8;">Expected Amount:</td><td style="font-weight: bold; color: #00FF66; text-align: right; font-size: 16px;">₹${data.amount} INR</td></tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 8px 0; color: #94A3B8;">Submitted 12-Digit UTR:</td><td style="font-family: monospace; font-weight: bold; color: #FFAA00; text-align: right; font-size: 15px; letter-spacing: 1px;">${data.utr}</td></tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 8px 0; color: #94A3B8;">Player WhatsApp:</td><td style="font-weight: bold; color: #FFFFFF; text-align: right;">${data.mobile}</td></tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 8px 0; color: #94A3B8;">Player Email:</td><td style="color: #FFFFFF; text-align: right;">${data.email}</td></tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 8px 0; color: #94A3B8;">Leader (P1):</td><td style="color: #FFFFFF; text-align: right;">${data.player1}</td></tr>
          ${data.player2 !== 'N/A' ? `<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 8px 0; color: #94A3B8;">Player 2 UID:</td><td style="font-family: monospace; color: #00F0FF; text-align: right;">${data.player2}</td></tr>` : ''}
          ${data.player3 !== 'N/A' ? `<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 8px 0; color: #94A3B8;">Player 3 UID:</td><td style="font-family: monospace; color: #00F0FF; text-align: right;">${data.player3}</td></tr>` : ''}
          ${data.player4 !== 'N/A' ? `<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 8px 0; color: #94A3B8;">Player 4 UID:</td><td style="font-family: monospace; color: #00F0FF; text-align: right;">${data.player4}</td></tr>` : ''}
        </table>

        <!-- 1-CLICK ACTION BUTTONS -->
        <div style="text-align: center; margin: 25px 0 10px 0; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1.5px dashed rgba(255,170,0,0.4);">
          <div style="font-size: 13px; color: #E2E8F0; margin-bottom: 16px; font-weight: bold;">
            DID YOU RECEIVE ₹${data.amount} FOR UTR <span style="color:#FFAA00;">${data.utr}</span>?
          </div>
          
          <a href="${WEB_APP_URL}?action=review&orderId=${data.orderId}&decision=approve" 
             style="display: inline-block; padding: 14px 28px; background: #00FF66; color: #000; text-decoration: none; border-radius: 8px; font-weight: 900; font-size: 14px; margin: 6px; letter-spacing: 1px;">
            ✅ ACCEPT & CONFIRM SLOT
          </a>
          
          <a href="${WEB_APP_URL}?action=review&orderId=${data.orderId}&decision=reject" 
             style="display: inline-block; padding: 14px 28px; background: #EF4444; color: #FFF; text-decoration: none; border-radius: 8px; font-weight: 900; font-size: 14px; margin: 6px; letter-spacing: 1px;">
            ❌ REJECT FAKE ENTRY
          </a>
        </div>

        <div style="text-align: center; margin-top: 15px;">
          <a href="https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit" style="color: #94A3B8; font-size: 11px; text-decoration: underline;">
            Open Google Sheet Directly
          </a>
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: ORGANIZER_EMAIL,
      name: 'RJ05 Esports Approval System',
      subject: organizerSubject,
      htmlBody: organizerHtml
    });
  } catch (err) {
    Logger.log('Error sending review email: ' + err.toString());
  }
}

/**
 * ============================================================================
 * SEND PLAYER ACKNOWLEDGMENT EMAIL (PENDING VERIFICATION)
 * ============================================================================
 */
function sendPlayerAcknowledgmentEmail(data) {
  if (!data.email || !data.email.includes('@')) return;
  try {
    const subject = `[RJ05 ESPORTS] Booking Received: ${data.slotNo} (UTR Verification Pending)`;
    const html = `
      <div style="font-family: Arial, sans-serif; background: #0B0F19; color: #FFFFFF; padding: 25px; border-radius: 12px; max-width: 580px; margin: auto; border: 1.5px solid #00F0FF;">
        <h2 style="color: #00F0FF; margin-top: 0; text-align: center;">RJ05 ESPORTS — SEASON 1</h2>
        <div style="background: rgba(0,240,255,0.08); padding: 16px; border-radius: 10px; text-align: center; margin: 15px 0; border: 1px solid rgba(0,240,255,0.3);">
          <span style="font-size: 11px; color: #00F0FF; font-weight: bold; letter-spacing: 1px;">STATUS: PENDING HOST VERIFICATION</span>
          <div style="font-size: 26px; font-weight: 900; color: #FFF; margin-top: 4px;">${data.slotNo}</div>
          <div style="font-size: 13px; color: #FFAA00;">${data.teamName} (${data.bookingType})</div>
        </div>

        <p style="font-size: 13px; color: #CBD5E1; line-height: 1.6;">
          Hello <strong>${data.teamName}</strong>,<br/><br/>
          Your payment registration with 12-Digit UTR <code style="color: #00FF66; font-size: 14px; font-weight: bold;">${data.utr}</code> has been successfully received.
          Host <strong>Anirudh Singh</strong> is verifying your payment against bank records. Your seat is temporarily reserved.
          <br/><br/>
          As soon as verified, your status turns to <strong>CONFIRMED</strong> on the website, and you will receive your official Booyah boarding pass email!
        </p>

        <div style="background: #141C2E; padding: 12px 16px; border-radius: 8px; font-size: 12px; color: #94A3B8; margin-top: 15px;">
          • Match: Sunday, 29 November 2026 (Bermuda Only)<br/>
          • WhatsApp Support: +91 8209071700
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: data.email,
      name: 'RJ05 Esports',
      replyTo: ORGANIZER_EMAIL,
      subject: subject,
      htmlBody: html
    });
  } catch (err) {
    Logger.log('Error sending player ack: ' + err.toString());
  }
}

/**
 * ============================================================================
 * SEND PLAYER CONFIRMED BOARDING PASS (FIRES WHEN HOST ACCEPTS OR MACRODROID MATCHES)
 * ============================================================================
 */
function sendPlayerConfirmedPass(data) {
  if (!data.email || !data.email.includes('@')) return;
  try {
    const playerSubject = `[RJ05 ESPORTS] Confirmed Entry Pass: ${data.slotNo} (${data.teamName})`;
    const playerHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #07090E; color: #FFFFFF; padding: 32px 24px; border-radius: 16px; max-width: 620px; margin: auto; border: 2px solid #FF5500;">
        <div style="text-align: center; border-bottom: 1px solid rgba(255,85,0,0.3); padding-bottom: 20px;">
          <h1 style="color: #FF5500; font-size: 28px; margin: 0; letter-spacing: 2px; font-weight: 900;">RJ05 ESPORTS</h1>
          <p style="color: #FFAA00; font-size: 14px; margin: 4px 0 0 0; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
            Season 1 Tournament (1st Match) • Official Boarding Pass
          </p>
        </div>

        <div style="text-align: center; margin: 24px 0; background: rgba(0, 255, 102, 0.08); border: 1.5px solid #00FF66; padding: 18px; border-radius: 12px;">
          <span style="font-size: 11px; color: #00FF66; text-transform: uppercase; font-weight: 800; letter-spacing: 2px;">CONFIRMED SLOT ALLOCATION</span>
          <div style="font-size: 34px; font-weight: 900; color: #FFFFFF; letter-spacing: 3px; margin-top: 4px;">${data.slotNo}</div>
          <span style="display: inline-block; margin-top: 6px; padding: 3px 12px; background: rgba(255,170,0,0.2); color: #FFAA00; border-radius: 20px; font-size: 12px; font-weight: bold;">
            ${data.teamName} (${data.bookingType})
          </span>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 0; color: #94A3B8;">Match Date:</td>
            <td style="padding: 10px 0; color: #FFFFFF; font-weight: bold; text-align: right;">Sunday, 29 November 2026</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 0; color: #94A3B8;">Battleground Map:</td>
            <td style="padding: 10px 0; color: #00F0FF; font-weight: bold; text-align: right;">Bermuda (Only)</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 0; color: #94A3B8;">1st Prize (Booyah):</td>
            <td style="padding: 10px 0; color: #FFAA00; font-weight: bold; text-align: right;">₹600 Cash</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 0; color: #94A3B8;">Amount Paid:</td>
            <td style="padding: 10px 0; color: #00FF66; font-weight: bold; text-align: right;">₹${data.amount} INR</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 0; color: #94A3B8;">Verified 12-Digit UTR:</td>
            <td style="padding: 10px 0; color: #00FF66; font-family: monospace; font-weight: bold; text-align: right;">${data.utr}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 0; color: #94A3B8;">Leader / Player 1:</td>
            <td style="padding: 10px 0; color: #FFFFFF; font-weight: bold; text-align: right;">${data.player1}</td>
          </tr>
          ${data.player2 && data.player2 !== 'N/A' ? `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 0; color: #94A3B8;">Player 2 UID:</td>
            <td style="padding: 10px 0; color: #00F0FF; font-family: monospace; text-align: right;">${data.player2}</td>
          </tr>` : ''}
          ${data.player3 && data.player3 !== 'N/A' ? `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 0; color: #94A3B8;">Player 3 UID:</td>
            <td style="padding: 10px 0; color: #00F0FF; font-family: monospace; text-align: right;">${data.player3}</td>
          </tr>` : ''}
          ${data.player4 && data.player4 !== 'N/A' ? `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 0; color: #94A3B8;">Player 4 UID:</td>
            <td style="padding: 10px 0; color: #00F0FF; font-family: monospace; text-align: right;">${data.player4}</td>
          </tr>` : ''}
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 0; color: #94A3B8;">Order ID:</td>
            <td style="padding: 10px 0; color: #FFFFFF; font-family: monospace; text-align: right;">${data.orderId}</td>
          </tr>
        </table>

        <div style="background-color: #101522; padding: 16px; border-radius: 10px; font-size: 12px; color: #CBD5E1; line-height: 1.6; border-left: 3px solid #00F0FF;">
          <strong style="color: #00F0FF;">MATCH DAY NOTICE:</strong><br/>
          • Custom Room ID & Password will be delivered via WhatsApp to <strong style="color: #FFF;">${data.mobile}</strong> 15 minutes before match kickoff.<br/>
          • All squad members must join strictly under their registered Free Fire UIDs.<br/>
          • Official Host: <strong>Anirudh Singh</strong> (IGN: <span style="color:#FFAA00;">ANIRUDH•RJ05</span> | UID: <span style="color:#00F0FF;">3029117867</span> | Level: 61 | Guild: ACE PRIMERS)
        </div>

        <div style="text-align: center; margin-top: 24px; font-size: 11px; color: #64748B; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">
          RJ05 Esports • WhatsApp Support: +91 8209071700<br/>
          Made by <a href="https://tkwebsolutions.in/" style="color: #00F0FF; text-decoration: none; font-weight: bold;">TK Web Solutions</a>
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: data.email,
      name: 'RJ05 Esports - Anirudh Singh',
      replyTo: ORGANIZER_EMAIL,
      subject: playerSubject,
      htmlBody: playerHtml
    });
  } catch (err) {
    Logger.log('Error sending player confirmed pass: ' + err.toString());
  }
}

/**
 * ============================================================================
 * SEND PLAYER REJECTION NOTIFICATION
 * ============================================================================
 */
function sendPlayerRejectedNotification(data) {
  if (!data.email || !data.email.includes('@')) return;
  try {
    const subject = `[RJ05 ESPORTS] Action Required: Slot Booking #${data.orderId} Verification Failed`;
    const html = `
      <div style="font-family: Arial, sans-serif; background: #0B0F19; color: #FFFFFF; padding: 25px; border-radius: 12px; max-width: 580px; margin: auto; border: 1.5px solid #EF4444;">
        <h2 style="color: #EF4444; margin-top: 0; text-align: center;">RJ05 ESPORTS — VERIFICATION FAILED</h2>
        
        <p style="font-size: 13px; color: #CBD5E1; line-height: 1.6;">
          Hello <strong>${data.teamName}</strong>,<br/><br/>
          Your payment verification for 12-Digit UTR <code style="color: #EF4444; font-weight: bold;">${data.utr}</code> could not be matched with bank records by Host <strong>Anirudh Singh</strong>.
          <br/><br/>
          Your temporary slot reservation (<strong>${data.slotNo}</strong>) has been released.
          <br/><br/>
          <strong>If you actually made the payment:</strong><br/>
          Please send a clear screenshot of your PhonePe / Paytm / Google Pay payment receipt showing the 12-digit UTR to Host Anirudh Singh directly on WhatsApp:
          <br/><br/>
          <a href="https://wa.me/918209071700?text=Hi%20Anirudh,%20my%20RJ05%20order%20is%20${data.orderId}%20and%20UTR%20is%20${data.utr}" 
             style="display: inline-block; padding: 12px 24px; background: #25D366; color: #FFF; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px;">
            Send Screenshot on WhatsApp (+91 8209071700)
          </a>
        </p>
      </div>
    `;

    MailApp.sendEmail({
      to: data.email,
      name: 'RJ05 Esports',
      replyTo: ORGANIZER_EMAIL,
      subject: subject,
      htmlBody: html
    });
  } catch (err) {
    Logger.log('Error sending player rejection: ' + err.toString());
  }
}

function maskMobile(m) {
  if (!m || m.length < 6) return 'Hidden';
  const clean = m.replace(/\D/g, '');
  if (clean.length === 10) {
    return clean.slice(0, 3) + '••••' + clean.slice(7);
  }
  return 'Registered';
}

function formatTimestamp(t) {
  if (!t) return 'Today';
  try {
    const d = new Date(t);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return 'Today';
  }
}

/**
 * Foolproof getOrCreateSheet:
 * If ss, sheetName, or headers are missing, automatically falls back to defaults!
 */
function getOrCreateSheet(ss, sheetName, headers) {
  if (!ss) {
    ss = getSpreadsheet();
  }
  if (!sheetName) {
    sheetName = SHEET_BOOKINGS;
  }
  if (!headers) {
    headers = HEADERS_BOOKINGS;
  }
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#101522').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
