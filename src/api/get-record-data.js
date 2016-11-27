export default function getRecordData(dbPool, recordId) {
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
          `select
              id, data.type, data.subtype, data, structure
            from
              data, templates
            where
              data.type=templates.type and
              data.id=$1`,
          [recordId],
          (err, result) => {
            //call `done()` to release the client back to the pool
            done();

            if(err) {
              errorMessage = 'error running query' + err
              reject( errorMessage )
              console.error( errorMessage );
            }

            // return the recordId data
            resolve( result.rows )
        });
      }
    )
  })
}
