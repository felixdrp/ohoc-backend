// Pool of connections with the dataBase
var dbPool = require('./db-pool').default;
var templateList = require('./template-list').default;
var createRecord = require('./create-record').default;

const dbDriver = {
  createRecord: async (data) => await createRecord(dbPool, data),
  templateList: async () => await templateList(dbPool),
}

export default dbDriver
