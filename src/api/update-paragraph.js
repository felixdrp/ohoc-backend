export default function updateParagraph(dbPool, type, subtype, paragraph) {
  return new Promise( (resolve, reject) => {
    dbPool.connect(
      (err, client, done) => {
        let errorMessage
        console.log (type + " - "+ subtype+" - "+ paragraph)

        if(err) {
          errorMessage = 'error fetching client from pool' + err
          reject( errorMessage )
          return console.error( errorMessage );
        }
        console.log (type + " - "+ subtype+" - "+ paragraph)
        client.query(
          `update paragraphs set paragraph = $1::jsonb where paragraphs.type=$2 AND paragraphs.subtype=$3`,
          [paragraph, type, subtype],
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
