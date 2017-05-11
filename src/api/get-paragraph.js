export default function getParagraph(dbPool, type, subtype) {
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
          `Select * from paragraphs where type= $1 AND subtype= $2`,
          [type,subtype],
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
