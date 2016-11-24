var pg = require('pg');

var config = require('../../config').default;

console.log(config)
var pool = new pg.Pool(config.dbConfig);

pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack)
})

export default pool
