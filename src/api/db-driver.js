// Pool of connections with the dataBase
var dbPool = require('./db-pool').default;
var templateList = require('./template-list').default;
var createRecord = require('./create-record').default;
var getAllRecords = require('./get-all-records').default;
var getRecordsByType = require('./get-records-by-type').default;
var getRecordData = require('./get-record-data').default;
var setRecordData = require('./set-record-data').default;
var deleteRecord = require('./delete-record').default;


const dbDriver = {
  // get the template list. return the template list
  templateList: async () => await templateList(dbPool),

  // Get all records.
  getAllRecords: async () => await getAllRecords(dbPool),

  // Get all records with the same type.
  getRecordsByType: async (type) => await getRecordsByType(dbPool, type),

  // Get record by recordId
  getRecordData: async (recordId) => await getRecordData(dbPool, recordId),

  // Set record by recordId
  setRecordData: async (recordId, data) => await setRecordData(dbPool, recordId, data),

  // Create a record. return the new recordId
  createRecord: async (data) => await createRecord(dbPool, data),

  // Delete a record
  deleteRecord: async (recordId) => await deleteRecord(dbPool, recordId),
}

export default dbDriver
