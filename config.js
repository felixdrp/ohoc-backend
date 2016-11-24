const config = {
  dbConfig: {
    user: 'admin', //env var: PGUSER
    database: 'ohoc', //env var: PGDATABASE
    password: 'secret', //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  },
}

export default config
