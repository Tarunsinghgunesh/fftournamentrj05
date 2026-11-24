/**
 * ============================================================================
 * RJ05 ESPORTS — OFFICIAL BACKEND API (Google Apps Script)
 * ============================================================================
 * Tournament: Season 1 Tournament (1st Match)
 * Match Date: Sunday, 29 November 2026 | Map: Bermuda | 1st Prize: ₹600
 * Capacity: Exactly 12 Squads = 48 Players Maximum
 * Organizer: Anirudh Singh (FF IGN: ANIRUDH•RJ05 | UID: 3029117867 | Guild: CEXPRIMER'S | Lv: 61)
 * WhatsApp: +91 8209071700 | Email: anirudhgunesh5@gmail.com
 * Official UPI ID: 8209071700@ptsbi
 * Developer: TK Web Solutions (https://tkwebsolutions.in/)
 * ============================================================================
 */

const SHEET_BOOKINGS = 'Bookings';
const SHEET_QUERIES = 'Queries';
const MAX_CAPACITY = 48; // 48 Players Total (12 Squads)
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
 * Handle incoming GET requests:
 * - ?action=stats : Live telemetry counter (Confirmed players, remaining, squads filled)
 * - ?action=list : Read all confirmed rows (works for both online bookings and manual admin entries!)
 * - ?action=search&q=... : Real-time search across UID, Team Name, Slot No, Order ID, UTR
 */
function doGet(e) {
  try {
    const params = e.parameter || {};
    const action = params.action || 'stats';
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet(ss, SHEET_BOOKINGS, HEADERS_BOOKINGS);
    const data = sheet.getDataRange().getValues();

    // Parse all confirmed bookings (Row 1 is headers)
    const confirmedBookings = [];
    let totalConfirmedPlayers = 0;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const status = String(row[14] || '').trim().toLowerCase();

      // STRICT LIVE SYNC: Any row where status is "confirmed" (case-insensitive)
      // Supports both web bookings and manual admin entries!
      if (status === 'confirmed') {
        const count = parseInt(row[11]) || (String(row[2]).toLowerCase().includes('squad') ? 4 : 1);
        totalConfirmedPlayers += count;

        confirmedBookings.push({
          rowId: i + 1,
          timestamp: formatTimestamp(row[0]),
          orderId: String(row[1] || 'OFFLINE-' + i),
          bookingType: String(row[2] || (count === 4 ? 'Squad' : 'Solo')),
          amount: parseFloat(row[3]) || (count === 4 ? 100 : 25),
          utr: String(row[4] || 'N/A'),
          slotNo: String(row[5] || ('SLOT-' + String(confirmedBookings.length + 1).padStart(2, '0'))),
          teamName: String(row[6] || (row[7] ? String(row[7]).split('-')[0] : 'Squad ' + i)),
          player1: String(row[7] || ''),
          player2: String(row[8] || ''),
          player3: String(row[9] || ''),
          player4: String(row[10] || ''),
          playersCount: count,
          mobile: maskMobile(String(row[12] || '')),
          status: 'Confirmed'
        });
      }
    }

    // 1. Live Telemetry Stats
    if (action === 'stats') {
      const remaining = Math.max(0, MAX_CAPACITY - totalConfirmedPlayers);
      const squadsFilled = Math.min(MAX_SQUADS, Math.floor(totalConfirmedPlayers / 4));

      return jsonResponse({
        success: true,
        confirmedPlayers: totalConfirmedPlayers,
        maxCapacity: MAX_CAPACITY,
        remainingPlayers: remaining,
        confirmedSquads: squadsFilled,
        maxSquads: MAX_SQUADS,
        isFull: remaining <= 0,
        tournament: 'RJ05 Esports — Season 1 Tournament (1st Match)',
        date: 'Sunday, 29 November 2026',
        map: 'Bermuda',
        firstPrize: '₹600'
      });
    }

    // 2. Confirmed Roster Directory List
    if (action === 'list') {
      return jsonResponse({
        success: true,
        count: confirmedBookings.length,
        totalPlayers: totalConfirmedPlayers,
        remainingSlots: Math.max(0, MAX_CAPACITY - totalConfirmedPlayers),
        roster: confirmedBookings.reverse() // Newest entries first
      });
    }

    // 3. Real-time Search Lookup
    if (action === 'search' || params.q) {
      const query = String(params.q || '').trim().toLowerCase();
      if (!query) {
        return jsonResponse({ success: true, count: confirmedBookings.length, results: confirmedBookings });
      }

      const results = confirmedBookings.filter(b => {
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

    // Default API Info
    return jsonResponse({
      status: 'ONLINE',
      api: 'RJ05 Esports Season 1 Automated API',
      organizer: 'Anirudh Singh',
      hostUid: '3029117867',
      totalConfirmed: totalConfirmedPlayers,
      remaining: Math.max(0, MAX_CAPACITY - totalConfirmedPlayers)
    });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Handle incoming POST requests:
 * - action: "create_booking" / "create_order"
 * - action: "contact_query"
 */
function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else {
      payload = e.parameter || {};
    }

    const action = payload.action || 'create_booking';
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // =========================================================================
    // ACTION: CREATE BOOKING WITH 12-DIGIT UTR CROSS-CHECK
    // =========================================================================
    if (action === 'create_booking' || action === 'create_order') {
      const sheet = getOrCreateSheet(ss, SHEET_BOOKINGS, HEADERS_BOOKINGS);
      const data = sheet.getDataRange().getValues();

      const bookingType = payload.bookingType || 'Squad'; // 'Squad' (4) or 'Solo' (1)
      const requestedPlayers = bookingType === 'Squad' ? 4 : 1;
      const utrNumber = String(payload.utrNumber || '').trim();

      // 1. Mandatory 12-digit UTR validation
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
            message: 'This 12-digit UTR number (' + utrNumber + ') has already been submitted. If this is an error, please contact organizer Anirudh Singh on WhatsApp (+91 8209071700).'
          });
        }
      }

      // 3. Slot Capacity Check
      if (currentConfirmedPlayers + requestedPlayers > MAX_CAPACITY) {
        return jsonResponse({
          success: false,
          error: 'SLOTS_FULL',
          message: 'Only ' + Math.max(0, MAX_CAPACITY - currentConfirmedPlayers) + ' player slot(s) remaining. Cannot book ' + requestedPlayers + ' player(s).'
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
      const status = 'Confirmed'; // Instantly confirmed upon UTR submission

      // 5. Append to Google Sheet
      sheet.appendRow([
        new Date(),
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

      // 6. Send Automated HTML Confirmation Email
      if (email && email.includes('@')) {
        sendTournamentConfirmationEmail({
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
        });
      }

      return jsonResponse({
        success: true,
        orderId: orderId,
        slotNo: slotNo,
        bookingType: bookingType,
        amount: amount,
        utr: utrNumber,
        teamName: teamName,
        status: status,
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

      return jsonResponse({
        success: true,
        message: 'Your query has been logged to Anirudh Singh\'s organizer desk.'
      });
    }

    return jsonResponse({ success: false, message: 'Unrecognized action: ' + action });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Send Cyberpunk Free Fire Esports HTML Confirmation Pass via MailApp
 */
function sendTournamentConfirmationEmail(data) {
  try {
    const subject = `[RJ05 ESPORTS] Confirmed Entry Pass: ${data.slotNo} (${data.teamName})`;
    const htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #07090E; color: #FFFFFF; padding: 32px 24px; border-radius: 16px; max-width: 620px; margin: auto; border: 2px solid #FF5500;">
        <div style="text-align: center; border-bottom: 1px solid rgba(255,85,0,0.3); padding-bottom: 20px;">
          <h1 style="color: #FF5500; font-size: 28px; margin: 0; letter-spacing: 2px; font-weight: 900;">RJ05 ESPORTS</h1>
          <p style="color: #FFAA00; font-size: 14px; margin: 4px 0 0 0; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
            Season 1 Tournament (1st Match) • Official Boarding Pass
          </p>
        </div>

        <div style="text-align: center; margin: 24px 0; background: rgba(0, 255, 102, 0.08); border: 1.5px solid #00FF66; padding: 18px; border-radius: 12px;">
          <span style="font-size: 11px; color: #00FF66; text-transform: uppercase; font-weight: 800; letter-spacing: 2px;">RESERVED SEAT ALLOCATION</span>
          <div style="font-size: 34px; font-weight: 900; color: #FFFFFF; letter-spacing: 3px; margin-top: 4px;">${data.slotNo}</div>
          <span style="display: inline-block; margin-top: 6px; padding: 3px 10px; background: rgba(255,170,0,0.2); color: #FFAA00; border-radius: 20px; font-size: 12px; font-weight: bold;">
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
            <td style="padding: 10px 0; color: #00F0FF; font-weight: bold; text-align: right;">Bermuda</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 0; color: #94A3B8;">1st Prize (Booyah):</td>
            <td style="padding: 10px 0; color: #FFAA00; font-weight: bold; text-align: right;">₹600 Cash</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 0; color: #94A3B8;">Leader / Player 1:</td>
            <td style="padding: 10px 0; color: #FFFFFF; font-weight: bold; text-align: right;">${data.player1}</td>
          </tr>
          ${data.player2 !== 'N/A' ? `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 0; color: #94A3B8;">Player 2 UID:</td>
            <td style="padding: 10px 0; color: #00F0FF; font-family: monospace; text-align: right;">${data.player2}</td>
          </tr>` : ''}
          ${data.player3 !== 'N/A' ? `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 0; color: #94A3B8;">Player 3 UID:</td>
            <td style="padding: 10px 0; color: #00F0FF; font-family: monospace; text-align: right;">${data.player3}</td>
          </tr>` : ''}
          ${data.player4 !== 'N/A' ? `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 0; color: #94A3B8;">Player 4 UID:</td>
            <td style="padding: 10px 0; color: #00F0FF; font-family: monospace; text-align: right;">${data.player4}</td>
          </tr>` : ''}
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 0; color: #94A3B8;">Order ID:</td>
            <td style="padding: 10px 0; color: #FFFFFF; font-family: monospace; text-align: right;">${data.orderId}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 0; color: #94A3B8;">Verified 12-Digit UTR:</td>
            <td style="padding: 10px 0; color: #00FF66; font-family: monospace; font-weight: bold; text-align: right;">${data.utr}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94A3B8;">Entry Status:</td>
            <td style="padding: 10px 0; color: #00FF66; font-weight: bold; text-align: right;">CONFIRMED (₹${data.amount})</td>
          </tr>
        </table>

        <div style="background-color: #101522; padding: 16px; border-radius: 10px; font-size: 12px; color: #CBD5E1; line-height: 1.6; border-left: 3px solid #00F0FF;">
          <strong style="color: #00F0FF;">MANDATORY MATCH INSTRUCTIONS:</strong><br/>
          • Custom Room ID & Password will be delivered directly to your registered WhatsApp (${data.mobile}) 15 minutes before the match.<br/>
          • All squad members must join strictly under their registered Free Fire UIDs. Unregistered UIDs will be kicked by the host before start.<br/>
          • Official Host: <strong>Anirudh Singh</strong> (In-Game: <code style="color:#FFAA00;">ANIRUDH•RJ05</code> | FF UID: <code style="color:#00F0FF;">3029117867</code> | Level: 61 | Guild: CEXPRIMER'S)
        </div>

        <div style="text-align: center; margin-top: 24px; font-size: 11px; color: #64748B; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">
          RJ05 Esports • WhatsApp Support: +91 8209071700<br/>
          Designed & Developed by <a href="https://tkwebsolutions.in/" style="color: #00F0FF; text-decoration: none; font-weight: bold;">TK Web Solutions</a>
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: data.email,
      name: 'RJ05 Esports - Anirudh Singh',
      replyTo: 'anirudhgunesh5@gmail.com',
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (err) {
    Logger.log('Error sending email: ' + err.toString());
  }
}

/**
 * Mask mobile number for public safety in directory
 */
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
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return 'Today';
  }
}

function getOrCreateSheet(ss, sheetName, headers) {
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
