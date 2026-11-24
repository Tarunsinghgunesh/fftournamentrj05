/**
 * ============================================================================
 * RJ05 ESPORTS — OFFICIAL BACKEND API (Google Apps Script)
 * ============================================================================
 * Brand: RJ05 Esports
 * Organizer: Anirudh Singh (Official Free Fire UID: 3029117867)
 * WhatsApp: +91 8209071700
 * Email: anirudhgunesh5@gmail.com
 * UPI ID: 8209071700@ybl
 * Developer: TK Web Solutions (https://tkwebsolutions.in/)
 * 
 * Instructions:
 * 1. Open Google Sheets -> Extensions -> Apps Script
 * 2. Paste this entire Code.gs code and save
 * 3. Deploy -> New Deployment -> Web app -> Execute as 'Me' -> Who has access: 'Anyone'
 * 4. Copy the Web App URL into your React .env (VITE_GOOGLE_SCRIPT_URL)
 * ============================================================================
 */

const SHEET_BOOKINGS = 'Bookings';
const SHEET_QUERIES = 'Queries';
const HOST_NAME = 'Anirudh Singh';
const HOST_UID = '3029117867';
const HOST_PHONE = '+91 8209071700';

/**
 * Handle incoming GET requests:
 * - ?action=list : Fetch all confirmed/pending bookings for live directory
 * - ?action=check_order&orderId=... : Poll order payment status
 * - ?action=search_uid&uid=... : Look up player by Free Fire UID
 */
function doGet(e) {
  try {
    const params = e.parameter || {};
    const action = params.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet(ss, SHEET_BOOKINGS, [
      'Timestamp', 'Order ID', 'Exact Amount', 'Slot No', 'Player Name', 
      'Free Fire UID', 'Mobile', 'Email', 'Match Type', 'Status'
    ]);

    // 1. Fetch Roster List
    if (action === 'list') {
      const data = sheet.getDataRange().getValues();
      const roster = [];
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[1]) { // If Order ID exists
          roster.push({
            orderId: row[1],
            amount: row[2],
            slotNo: row[3] || ('SLOT-' + i),
            ign: row[4] || 'Player',
            uid: String(row[5] || ''),
            mobile: row[6],
            email: row[7],
            mode: row[8] || 'Solo',
            status: row[9] || 'CONFIRMED',
            time: formatTime(row[0])
          });
        }
      }
      return jsonResponse({ success: true, count: roster.length, roster: roster.reverse() });
    }

    // 2. Poll Order Status
    const orderId = params.orderId;
    if (action === 'check_order' || orderId) {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][1] == orderId) {
          return jsonResponse({
            success: true,
            orderId: data[i][1],
            exactAmount: data[i][2],
            slotNo: data[i][3],
            ign: data[i][4],
            uid: String(data[i][5]),
            status: data[i][9] || 'PENDING'
          });
        }
      }
      return jsonResponse({ success: false, status: 'NOT_FOUND', orderId: orderId });
    }

    // 3. Search by Free Fire UID
    const uid = params.uid;
    if (action === 'search_uid' || uid) {
      const data = sheet.getDataRange().getValues();
      const results = [];
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][5]).trim() === String(uid).trim()) {
          results.push({
            orderId: data[i][1],
            slotNo: data[i][3],
            ign: data[i][4],
            uid: data[i][5],
            mode: data[i][8],
            status: data[i][9]
          });
        }
      }
      return jsonResponse({ success: true, found: results.length > 0, results: results });
    }

    // Default health ping
    return jsonResponse({
      status: 'ONLINE',
      service: 'RJ05 Esports API',
      organizer: HOST_NAME,
      hostUid: HOST_UID,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Handle incoming POST requests:
 * - action: "create_order" (New registration)
 * - action: "payment_received" (MacroDroid automated UPI webhook)
 * - action: "contact_query" (Support & query logging)
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

    const action = payload.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // =========================================================================
    // CASE 1: CREATE ORDER
    // =========================================================================
    if (action === 'create_order') {
      const sheet = getOrCreateSheet(ss, SHEET_BOOKINGS, [
        'Timestamp', 'Order ID', 'Exact Amount', 'Slot No', 'Player Name', 
        'Free Fire UID', 'Mobile', 'Email', 'Match Type', 'Status'
      ]);

      const timestamp = new Date();
      const orderId = payload.orderId || ('RJ05-' + Date.now().toString().slice(-6));
      const exactAmount = parseFloat(payload.exactAmount) || 50.00;
      const slotNo = payload.slotNo || ('SLOT-' + (sheet.getLastRow()));
      const ign = payload.ign || payload.name || 'Anonymous';
      const uid = String(payload.uid || '');
      const mobile = String(payload.mobile || '');
      const email = payload.email || '';
      const matchMode = payload.matchMode || 'Solo';
      const status = 'PENDING';

      sheet.appendRow([
        timestamp, orderId, exactAmount, slotNo, ign, uid, mobile, email, matchMode, status
      ]);

      return jsonResponse({
        success: true,
        orderId: orderId,
        exactAmount: exactAmount,
        slotNo: slotNo,
        status: status
      });
    }

    // =========================================================================
    // CASE 2: PAYMENT RECEIVED (MacroDroid Webhook)
    // =========================================================================
    if (action === 'payment_received') {
      const sheet = getOrCreateSheet(ss, SHEET_BOOKINGS, [
        'Timestamp', 'Order ID', 'Exact Amount', 'Slot No', 'Player Name', 
        'Free Fire UID', 'Mobile', 'Email', 'Match Type', 'Status'
      ]);

      let receivedAmt = null;

      // Extract amount either directly or via notification body regex
      if (payload.amount) {
        receivedAmt = parseFloat(payload.amount);
      } else if (payload.body || payload.text) {
        const text = payload.body || payload.text;
        // Regex for UPI notification: e.g. "credited by Rs 50.01" or "Rs.50.02 received"
        const match = text.match(/(?:Rs\.?|INR|₹)\s*([\d]+\.[\d]{2})/i);
        if (match && match[1]) {
          receivedAmt = parseFloat(match[1]);
        }
      }

      if (!receivedAmt) {
        return jsonResponse({ success: false, message: 'Could not extract exact paise amount from payload' });
      }

      const data = sheet.getDataRange().getValues();
      let matchedIndex = -1;
      let matchedBooking = null;

      // Search bottom-up for fastest matching of recent pending orders
      for (let i = data.length - 1; i >= 1; i--) {
        const rowAmt = parseFloat(data[i][2]);
        const rowStatus = String(data[i][9]).toUpperCase();

        if (Math.abs(rowAmt - receivedAmt) < 0.005 && rowStatus === 'PENDING') {
          matchedIndex = i + 1; // 1-based index for Google Sheets
          matchedBooking = {
            orderId: data[i][1],
            exactAmount: data[i][2],
            slotNo: data[i][3],
            ign: data[i][4],
            uid: data[i][5],
            mobile: data[i][6],
            email: data[i][7],
            matchMode: data[i][8]
          };
          break;
        }
      }

      if (matchedIndex !== -1 && matchedBooking) {
        // Mark status as CONFIRMED in Column J (10th column)
        sheet.getRange(matchedIndex, 10).setValue('CONFIRMED');

        // Send automated confirmation email with HTML Boarding Pass
        if (matchedBooking.email && matchedBooking.email.includes('@')) {
          sendConfirmationEmail(matchedBooking);
        }

        return jsonResponse({
          success: true,
          verified: true,
          slotNo: matchedBooking.slotNo,
          orderId: matchedBooking.orderId,
          ign: matchedBooking.ign,
          uid: matchedBooking.uid
        });
      }

      return jsonResponse({
        success: false,
        message: 'No matching pending order found for exact amount: ' + receivedAmt
      });
    }

    // =========================================================================
    // CASE 3: CONTACT QUERY (Queries Tab)
    // =========================================================================
    if (action === 'contact_query') {
      const sheet = getOrCreateSheet(ss, SHEET_QUERIES, [
        'Timestamp', 'Name', 'Free Fire UID', 'Contact', 'Issue Type', 'Message'
      ]);

      sheet.appendRow([
        new Date(),
        payload.name || 'Anonymous',
        payload.uid || 'N/A',
        payload.contact || 'N/A',
        payload.issueType || 'General',
        payload.message || ''
      ]);

      return jsonResponse({ success: true, message: 'Query recorded successfully' });
    }

    return jsonResponse({ success: false, message: 'Unrecognized action: ' + action });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Send Professional HTML Esports Boarding Pass via MailApp
 */
function sendConfirmationEmail(booking) {
  try {
    const subject = `[RJ05 ESPORTS] Confirmed Tournament Slot Pass: ${booking.slotNo} (${booking.ign})`;
    const htmlBody = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #07090E; color: #FFFFFF; padding: 30px; border-radius: 16px; max-width: 600px; margin: auto; border: 1px solid #FF5500;">
        <div style="text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px;">
          <h1 style="color: #FF5500; font-size: 26px; margin: 0; letter-spacing: 2px;">RJ05 ESPORTS</h1>
          <p style="color: #FFAA00; font-size: 13px; margin: 4px 0 0 0; text-transform: uppercase; font-weight: bold;">Official Tournament Boarding Pass</p>
        </div>

        <div style="text-align: center; margin: 25px 0; background: rgba(0, 255, 102, 0.1); border: 1px solid #00FF66; padding: 15px; border-radius: 12px;">
          <span style="font-size: 12px; color: #00FF66; text-transform: uppercase; font-weight: bold;">Officially Reserved Slot</span>
          <div style="font-size: 36px; font-weight: 900; color: #FFFFFF; letter-spacing: 2px;">${booking.slotNo}</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
            <td style="padding: 10px; color: #8892b0;">Player IGN:</td>
            <td style="padding: 10px; color: #FFFFFF; font-weight: bold; text-align: right;">${booking.ign}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
            <td style="padding: 10px; color: #8892b0;">Free Fire UID:</td>
            <td style="padding: 10px; color: #00F0FF; font-weight: bold; font-family: monospace; text-align: right;">${booking.uid}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
            <td style="padding: 10px; color: #8892b0;">Category:</td>
            <td style="padding: 10px; color: #FFAA00; font-weight: bold; text-align: right;">${booking.matchMode} Tier</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
            <td style="padding: 10px; color: #8892b0;">Order ID:</td>
            <td style="padding: 10px; color: #FFFFFF; font-family: monospace; text-align: right;">${booking.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #8892b0;">Status:</td>
            <td style="padding: 10px; color: #00FF66; font-weight: bold; text-align: right;">VERIFIED & ACTIVE</td>
          </tr>
        </table>

        <div style="background-color: #101522; padding: 15px; border-radius: 10px; font-size: 12px; color: #A0AEC0; line-height: 1.6;">
          <strong style="color: #FFFFFF;">CRITICAL PROTOCOLS:</strong><br/>
          • Room ID and password will be sent to your WhatsApp number (${booking.mobile}) 15 minutes before match kickoff.<br/>
          • Join the room ONLY under your registered UID (${booking.uid}). All other entrants will be kicked by host.<br/>
          • Tournament Host: <strong>${HOST_NAME}</strong> (Official UID: <span style="color:#00F0FF;">${HOST_UID}</span>)
        </div>

        <div style="text-align: center; margin-top: 25px; font-size: 11px; color: #718096; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
          RJ05 Esports • WhatsApp: ${HOST_PHONE}<br/>
          Designed & Developed by <a href="https://tkwebsolutions.in/" style="color: #00F0FF; text-decoration: none;">TK Web Solutions</a>
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: booking.email,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (e) {
    Logger.log('Could not send confirmation email: ' + e.toString());
  }
}

/**
 * Helper to retrieve or create a specific Sheet with headers
 */
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

/**
 * Helper to return standard CORS-friendly JSON responses
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper to format readable time
 */
function formatTime(val) {
  if (!val) return 'Today';
  try {
    const d = new Date(val);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return 'Today';
  }
}
