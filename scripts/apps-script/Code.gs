/**
 * RCMS Google Apps Script Backend — Code.gs
 * ==========================================
 * This file is your entire backend for RCMS Milestone 1.
 *
 * SETUP INSTRUCTIONS:
 *  1. Open your Google Sheet (the one that receives Google Form responses)
 *  2. Extensions → Apps Script
 *  3. Paste this entire file into the editor (replace any existing code)
 *  4. Click "Project Settings" (gear icon) → Script Properties
 *     → Add property: API_TOKEN = your-secret-token
 *  5. Click Deploy → New Deployment
 *     → Type: Web App
 *     → Execute as: Me
 *     → Who has access: Anyone
 *  6. Copy the web app URL and paste into RCMS Settings page
 *
 * SHEET STRUCTURE REQUIRED:
 *  Tab 1: "Members_Raw"  — target of your Google Form responses
 *  Tab 2: "Members"      — canonical records (managed by this script)
 *  Tab 3: "SyncLog"      — sync audit trail (auto-created)
 *
 * API USAGE:
 *  All requests must include ?token=YOUR_TOKEN
 *  GET  ?resource=members                 → all members
 *  GET  ?resource=members&id=UUID         → single member
 *  POST body: { token, resource, action, payload }
 *       actions: create | update | delete | syncFromForms
 */

// ─── Sheet Names ──────────────────────────────────────────────────────
var SHEETS = {
  MEMBERS_RAW: 'Members_Raw',
  MEMBERS:     'Members',
  SYNC_LOG:    'SyncLog',
};

// ─── Members sheet column order (0-based array index) ─────────────────
var MEMBER_HEADER = [
  'id', 'communityId', 'fullName', 'email', 'phone', 'city',
  'dateJoined', 'readingInterests', 'membershipStatus', 'notes',
  'sourceFormResponseId', 'createdAt', 'updatedAt'
];

// ─── Helpers ──────────────────────────────────────────────────────────

function getSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === SHEETS.MEMBERS) {
      sheet.appendRow(MEMBER_HEADER);
      sheet.getRange(1, 1, 1, MEMBER_HEADER.length).setFontWeight('bold');
    }
    if (name === SHEETS.SYNC_LOG) {
      sheet.appendRow(['id','syncType','triggeredBy','startedAt','completedAt','status','recordsSynced','errorMessage']);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
    }
  }
  return sheet;
}

function generateUUID() {
  return Utilities.getUuid();
}

function getNextCommunityId() {
  var props = PropertiesService.getScriptProperties();
  var counter = parseInt(props.getProperty('MEMBER_COUNTER') || '0', 10) + 1;
  props.setProperty('MEMBER_COUNTER', String(counter));
  return 'RC-' + String(counter).padStart(3, '0');
}

function nowISO() {
  return new Date().toISOString();
}

function dateToISO(date) {
  if (!date) return '';
  if (date instanceof Date) return Utilities.formatDate(date, 'UTC', 'yyyy-MM-dd');
  return String(date).split('T')[0];
}

function validateToken(token) {
  var stored = PropertiesService.getScriptProperties().getProperty('API_TOKEN');
  if (!stored) return true; // no token set = open (not recommended for production)
  return token === stored;
}

function response(data, status) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ─── Read helpers ─────────────────────────────────────────────────────

function getAllMembersRaw() {
  var sheet = getSheet(SHEETS.MEMBERS);
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return []; // only header
  var rows = sheet.getRange(2, 1, lastRow - 1, MEMBER_HEADER.length).getValues();
  return rows
    .filter(function(row) { return row[0]; }) // skip empty rows
    .map(function(row) {
      var obj = {};
      MEMBER_HEADER.forEach(function(key, i) { obj[key] = row[i]; });
      return obj;
    });
}

function findMemberRowById(id) {
  var sheet = getSheet(SHEETS.MEMBERS);
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return -1;
  var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0] === id) return i + 2; // 1-based, +1 for header
  }
  return -1;
}

function findMemberByEmail(email) {
  var members = getAllMembersRaw();
  for (var i = 0; i < members.length; i++) {
    if (members[i].email === email) return members[i];
  }
  return null;
}

// ─── CRUD Operations ─────────────────────────────────────────────────

function getAllMembers() {
  return getAllMembersRaw();
}

function getMemberById(id) {
  var members = getAllMembersRaw();
  for (var i = 0; i < members.length; i++) {
    if (members[i].id === id) return members[i];
  }
  return null;
}

function createMember(payload) {
  var sheet = getSheet(SHEETS.MEMBERS);
  var now = nowISO();
  var newMember = {
    id:                  generateUUID(),
    communityId:         getNextCommunityId(),
    fullName:            payload.fullName            || '',
    email:               payload.email               || '',
    phone:               payload.phone               || '',
    city:                payload.city                || '',
    dateJoined:          payload.dateJoined          || now.split('T')[0],
    readingInterests:    payload.readingInterests    || '',
    membershipStatus:    payload.membershipStatus    || 'active',
    notes:               payload.notes               || '',
    sourceFormResponseId: payload.sourceFormResponseId || ('manual-' + Date.now()),
    createdAt:           now,
    updatedAt:           now,
  };
  var row = MEMBER_HEADER.map(function(key) { return newMember[key]; });
  sheet.appendRow(row);
  return newMember;
}

function updateMember(payload) {
  var sheet = getSheet(SHEETS.MEMBERS);
  var rowNum = findMemberRowById(payload.id);
  if (rowNum === -1) throw new Error('Member not found: ' + payload.id);

  var range = sheet.getRange(rowNum, 1, 1, MEMBER_HEADER.length);
  var row = range.getValues()[0];
  var current = {};
  MEMBER_HEADER.forEach(function(key, i) { current[key] = row[i]; });

  // Only update provided fields; never overwrite id, communityId, createdAt
  var protected_ = ['id', 'communityId', 'createdAt', 'sourceFormResponseId'];
  Object.keys(payload).forEach(function(key) {
    if (protected_.indexOf(key) === -1) current[key] = payload[key];
  });
  current.updatedAt = nowISO();

  var updatedRow = MEMBER_HEADER.map(function(key) { return current[key]; });
  range.setValues([updatedRow]);
  return current;
}

function deleteMember(id) {
  var sheet = getSheet(SHEETS.MEMBERS);
  var rowNum = findMemberRowById(id);
  if (rowNum === -1) throw new Error('Member not found: ' + id);
  sheet.deleteRow(rowNum);
  return { deleted: true, id: id };
}

// ─── Google Forms → Members Sync ─────────────────────────────────────

/**
 * Sync strategy:
 *  1. Read all rows from Members_Raw (Google Form responses)
 *  2. For each row, check if a Member with that email already exists
 *  3. If not, create a new Member record with auto-generated ID
 *  4. Skip rows with missing email or name
 *  5. Return count of newly created records
 *
 * Google Form field mapping (adjust column numbers to match your Form):
 *  Column A (0): Timestamp
 *  Column B (1): Full Name
 *  Column C (2): Email Address
 *  Column D (3): Phone Number
 *  Column E (4): City
 *  Column F (5): Reading Interests (comma-separated from checkboxes)
 */
function syncMembersFromForms() {
  var rawSheet = getSheet(SHEETS.MEMBERS_RAW);
  var lastRow = rawSheet.getLastRow();

  if (lastRow <= 1) {
    return { success: true, recordsSynced: 0, message: 'No form responses found.' };
  }

  // Get all raw rows (skip header row 1)
  var rawData = rawSheet.getRange(2, 1, lastRow - 1, 6).getValues();
  var newCount = 0;

  rawData.forEach(function(row, idx) {
    var timestamp    = row[0];
    var fullName     = String(row[1] || '').trim();
    var email        = String(row[2] || '').trim().toLowerCase();
    var phone        = String(row[3] || '').trim();
    var city         = String(row[4] || '').trim();
    var rawInterests = String(row[5] || '').trim();

    // Skip incomplete rows
    if (!fullName || !email) return;

    // Check for existing member with this email
    var existing = findMemberByEmail(email);
    if (existing) return; // already synced

    // Convert comma-separated interests to pipe-separated
    var interests = rawInterests
      ? rawInterests.split(',').map(function(s) { return s.trim(); }).filter(Boolean).join('|')
      : '';

    // Determine join date from Form timestamp
    var dateJoined = timestamp ? dateToISO(timestamp) : nowISO().split('T')[0];

    createMember({
      fullName:            fullName,
      email:               email,
      phone:               phone,
      city:                city,
      dateJoined:          dateJoined,
      readingInterests:    interests,
      membershipStatus:    'active',
      notes:               '',
      sourceFormResponseId: 'form-row-' + (idx + 2),
    });

    newCount++;
  });

  // Log the sync
  logSync('syncFromForms', 'manual', newCount);

  return {
    success: true,
    recordsSynced: newCount,
    timestamp: nowISO(),
    message: newCount === 0
      ? 'All form responses already synced.'
      : 'Synced ' + newCount + ' new member(s).',
  };
}

// ─── Sync Log ─────────────────────────────────────────────────────────

function logSync(syncType, triggeredBy, recordsSynced, errorMessage) {
  try {
    var sheet = getSheet(SHEETS.SYNC_LOG);
    var now = nowISO();
    sheet.appendRow([
      generateUUID(), syncType, triggeredBy, now, now,
      errorMessage ? 'failed' : 'success',
      recordsSynced || 0,
      errorMessage || ''
    ]);
  } catch (e) {
    // don't let logging errors break the main flow
  }
}

// ─── HTTP Entry Points ────────────────────────────────────────────────

function doGet(e) {
  try {
    var token = e.parameter.token;
    if (!validateToken(token)) {
      return response({ success: false, error: 'Unauthorized. Check your API token.' });
    }

    var resource = e.parameter.resource;

    if (resource === 'members') {
      var id = e.parameter.id;
      if (id) {
        var member = getMemberById(id);
        if (!member) return response({ success: false, error: 'Member not found.' });
        return response({ success: true, data: member });
      }
      return response({ success: true, data: getAllMembers() });
    }

    return response({ success: false, error: 'Unknown resource: ' + resource });

  } catch (err) {
    return response({ success: false, error: err.message });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var token = body.token;

    if (!validateToken(token)) {
      return response({ success: false, error: 'Unauthorized. Check your API token.' });
    }

    var resource = body.resource;
    var action   = body.action;
    var payload  = body.payload || {};

    if (resource === 'members') {
      switch (action) {
        case 'create':
          return response({ success: true, data: createMember(payload) });
        case 'update':
          return response({ success: true, data: updateMember(payload) });
        case 'delete':
          return response({ success: true, data: deleteMember(payload.id) });
        case 'syncFromForms':
          return response({ success: true, data: syncMembersFromForms() });
        default:
          return response({ success: false, error: 'Unknown action: ' + action });
      }
    }

    return response({ success: false, error: 'Unknown resource: ' + resource });

  } catch (err) {
    return response({ success: false, error: err.message });
  }
}

// ─── Manual trigger (run from Apps Script editor to test) ─────────────

function testSync() {
  var result = syncMembersFromForms();
  Logger.log(JSON.stringify(result, null, 2));
}

function testGetAllMembers() {
  var members = getAllMembers();
  Logger.log('Total members: ' + members.length);
  Logger.log(JSON.stringify(members[0], null, 2));
}

function initializeSheets() {
  getSheet(SHEETS.MEMBERS);
  getSheet(SHEETS.SYNC_LOG);
  Logger.log('Sheets initialized. You can now set your API_TOKEN in Script Properties.');
}
