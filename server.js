const express = require('express');
var bodyParser = require('body-parser')
var formidable = require('formidable')
var util = require('util');
var dbDriver = require('./src/api/db-driver').default;
var fs = require('fs')

// const urlRoot = process.env.NODE_ENV == 'production'? '/ohoc/'
const urlRoot = '/'

const promisesLibrary = '<script src="//cdn.jsdelivr.net/bluebird/3.5.0/bluebird.min.js"></script>'

const webTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Oral History Of Intellectual Property</title>
    <!--[if IE ]>
        ${promisesLibrary}
    <![endif]-->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,500' rel='stylesheet' type='text/css'>
    <style>
      body {
        margin: 0;
        height: 100%;
        background-color:#f2f2f2;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script src="${urlRoot}lib/bundle.min.js"></script>
  </body>
</html>
`


var app = express();

app.use(bodyParser.json())

app.use(urlRoot, express.static('public'))
app.use(urlRoot + 'multimedia', express.static('data'))

app.get(urlRoot, (req, res) => {
  res.writeHead(200, {'content-type': 'text/html'});
  res.end( webTemplate );
});

// Get the All record list
// curl -v -X GET http://localhost:3001/api/getAllRecords
app.route(urlRoot + 'api/getAllRecords')
  .get( async (req, res) => {
    let recordsAllList = await dbDriver.getAllRecords()

    res.writeHead(200, {'content-type': 'application/json'});
    res.end( JSON.stringify({recordsAllList}) );
  })

// Get the record list by type
// curl -v -X GET http://localhost:3001/api/getRecordsByType/academia
app.route(urlRoot + 'api/getRecordsByType/:type')
  .get( async (req, res) => {
    // console.log(req)
    let recordsByType = await dbDriver.getRecordsByType(req.params.type)

    res.writeHead(200, {'content-type': 'application/json'});
    res.end( JSON.stringify({recordsByType}) );
  })


// Get the template list
// curl -v -X GET http://localhost:3001/api/templates/list
app.route(urlRoot + 'api/templates/list')
  .get( async (req, res) => {
    let templateList = await dbDriver.templateList()
    console.log('templateList')
    console.log(templateList)
    res.writeHead(200, {'content-type': 'application/json'});
    res.end( JSON.stringify({templateList}) );
  })

// Create a new record.
app.route(urlRoot + 'api/record/create')
  .put( async (req, res) => {
    if (
      !req.body &&
      (!(
        'template' in req.body &&
        'subtemplate' in req.body
      ))
    ) {
      return
    }

    const {template, subtemplate} = req.body

    let recordId = await dbDriver.createRecord({template, subtemplate})
    // Read the template and subtemplate from the headers
    console.log('PUT !!!')
    // console.log( recordId )
    console.log( req.body )

    // In the response add the new recordId.
    // So the client will use the new recordId to go to edit mode.
    res.writeHead(200, {'content-type': 'application/json'});
    res.end( JSON.stringify({recordId}) );
  })
  // .delete( (req, res) => {
  //   console.log('delete !!!')
  //   res.writeHead(200, {'content-type': 'text/html'});
  //   res.end(
  //     `
  //     <div>
  //       Un delete!!!
  //     </div>
  //     `
  //   );
  // })


// Get record by recordId
// curl -v -X GET http://localhost:3001/api/getRecord/24
app.route(urlRoot + 'api/getRecord/:recordId')
  .get( async (req, res) => {
    // console.log(req)
    let recordById = await dbDriver.getRecordData(req.params.recordId)

    res.writeHead(200, {'content-type': 'application/json'});
    res.end( JSON.stringify({recordById}) );
  })

// Set record by recordId
// curl -v -H "Content-Type: application/json" -X POST -d '{"username":"xyz","password":"xyz"}' http://localhost:3001/api/setRecord/21
app.route(urlRoot + 'api/setRecord/:recordId')
  .post( async (req, res) => {
    if (
      !req.body &&
      typeof req.params.recordId != 'number' &&
      (!(
        'id' in req.body &&
        'data' in req.body
      ))
    ) {
      return
    }

    const data = JSON.stringify(req.body)
    let result

    try {
      result = await dbDriver.setRecordData(req.params.recordId, data)
    } catch (error) {
      console.error('Set record: ' + error)
    }

    // Returns {"updated": true/false}
    res.writeHead(200, {'content-type': 'application/json'});
    res.end( JSON.stringify({updated: result}) );
  })

// Delete record by recordId
// curl -v -X POST http://localhost:3001/api/deleteRecord/47
app.route(urlRoot + 'api/deleteRecord/:recordId')
  .post( async (req, res) => {
    console.log(req)

    let deleteRecord
    try {
      deleteRecord = await dbDriver.deleteRecord(req.params.recordId)
    } catch (error) {
      console.error('Delete record: ' + error)
      deleteRecord = false
    }

    res.writeHead(200, {'content-type': 'application/json'});
    res.end( JSON.stringify({deletedRecord: deleteRecord}) );
  })

// Upload a file to a record.
app.route(urlRoot + 'api/record/upload/:recordId')
  .post(async (req, res) => {
    try {
      var form = new formidable.IncomingForm();
      form.uploadDir = __dirname + '/data'
      form.keepExtensions = true;

      // Events sorted by FIFO first in (list) first out (executed)

      // form.on('file', async (name, file) => {
      //   // console.log('1 > ' + Date.now())
      //   console.log(name)
      //   console.log(file)
      // })
      //
      // form.on('end', (err) => {
      //   console.log('2 > ' + Date.now())
      // })

      // Process the files
      form.parse(req, function(err, fields, files) {
        let recordId = req.params.recordId
        let uploads = []
        // console.log('3 > ' + Date.now())

        // console.log('parse!!')
        // console.log(err)
        // console.log(fields)
        // console.log(files)

        // Process files:
        // rename
        // Future use async fs.rename()

        // console.log(form)
        // console.log(files)
        // console.log(form.openedFiles.constructor.name)
        for ( let {path, name, type} of form.openedFiles ) {
          let newPath =  recordId + '_' + name
          // console.log(path, name, type)
          fs.renameSync( path, __dirname + '/data/' + newPath )
          uploads.push({
            src: newPath,
            type
          })

        }

        res.writeHead(200, {'content-type': 'application/json'});
        res.end( JSON.stringify({ upload: { files: uploads } }) );
      });

    } catch(error) {
      console.log('ERROR: ' + error)
    }
  })

// Set record by recordId
// curl -v -H "Content-Type: application/json" -X POST -d '{"username":"xyz","password":"xyz"}' http://localhost:3001/api/category/paragraphUpdate/
app.route(urlRoot + 'api/category/paragraphUpdate/:template/:subtemplate')
  .post( async (req, res) => {

    if (
      !req.body &&
      typeof req.params.template != 'number' &&
      (!(
        'id' in req.body &&
        'data' in req.body
      ))
    ) {
      return
    }

    const data = JSON.stringify(req.body)
    let result

    try {
      console.log(JSON.stringify(req.params))
      result = await dbDriver.updateParagraph(req.params.template, req.params.subtemplate, data)
    } catch (error) {
      console.error('Set record: ' + error)
    }

    // Returns {"updated": true/false}
    res.writeHead(200, {'content-type': 'application/json'});
    res.end( JSON.stringify({updated: result}) );
  })


// Get paragraph by type and subtype
// curl -v -X GET http://localhost:3001/api/getParagraph/
app.route(urlRoot + 'api/category/getParagraph/:template/:subtemplate')
  .get( async (req, res) => {
    console.log(req)
    let paragraph = await dbDriver.getParagraph(req.params.template, req.params.subtemplate)

    res.writeHead(200, {'content-type': 'application/json'});
    res.end( JSON.stringify(paragraph[0]) );
  })


app.use(async function(req, res) {
  console.log(req.headers)

  res.writeHead(200, {'content-type': 'text/html'});
  res.end( webTemplate );

})

app.listen(3001)
