export default function createRecord(dbPool, data) {
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
          'insert into public.data (type, subtype, data) values ($1, $2, $3) RETURNING *',
          // 'SELECT $1::int AS number', [1],
          [data.template, data.subtemplate, {}],
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
            resolve( result.rows[0].id )
        });
      }
    )
  })
}
