export default function deleteRecord(dbPool, recordId) {
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
          'DELETE FROM data WHERE id = $1',
          // 'SELECT $1::int AS number', [1],
          [recordId],
          (err, result) => {
            //call `done()` to release the client back to the pool
            done();

            if(err) {
              errorMessage = 'error running query' + err
              reject( errorMessage )
              console.error( errorMessage );
            }

            // console.log(result)
            // return the new recordId
            resolve( true )
        });
      }
    )
  })
}
