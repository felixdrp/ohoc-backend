export default function getRecordsByType(dbPool, type) {
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
          'select * from public.data where type=$1 order by subtype',
          [type],
          (err, result) => {
            //call `done()` to release the client back to the pool
            done();

            if(err) {
              errorMessage = 'error running query' + err
              reject( errorMessage )
              console.error( errorMessage );
            }

            console.log(result)
            // return the new recordId
            resolve( result.rows )
        });
      }
    )
  })
}
