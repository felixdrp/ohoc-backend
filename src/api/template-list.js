export default function templateList(dbPool) {
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
          'select type, array_agg(subtype) as subtypes from public.templates group by type',
          [],
          (err, result) => {
            let templateList
            //call `done()` to release the client back to the pool
            done();

            if(err) {
              errorMessage = 'error running query' + err
              reject( errorMessage )
              console.error( errorMessage );
            }

            templateList = result.rows.reduce(
              (prev, row) => {
                prev[row.type] = row.subtypes
                return prev
              },
              {}
            )
            // console.log(templateList)

            resolve( templateList )
        });
      }
    )
  })
}
