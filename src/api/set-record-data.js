export default function setRecordData(dbPool, recordId, data) {
  return new Promise( (resolve, reject) => {
    dbPool.connect(
      (err, client, done) => {
        let errorMessage
        if(err) {
          errorMessage = 'error fetching client from pool' + err
          reject( errorMessage )
          return console.error( errorMessage );
        }

        client.query(
          `update data set data = $1::jsonb where data.id=$2`,
          [data, recordId],
          (err, result) => {
            //call `done()` to release the client back to the pool
            done();

            if(err) {
              errorMessage = 'error running query' + err
              reject( errorMessage )
              console.error( errorMessage );
            }

            // return true if update ok, or false
            resolve( result.rowCount == 1 )
        });
      }
    )
  })
}
