const express = require('express');
var bodyParser = require('body-parser')
var formidable = require('formidable')
var util = require('util');
var dbDriver = require('./src/api/db-driver').default;



var app = express();

app.use(bodyParser.json())

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
});

// Get the All record list
// curl -v -X GET http://localhost:3001/api/getAllRecords
app.route('/api/getAllRecords')
  .get( async (req, res) => {
    let recordsAllList = await dbDriver.getAllRecords()

    res.writeHead(200, {'content-type': 'application/json'});
    res.end( JSON.stringify({recordsAllList}) );
  })

// Get the record list by type
// curl -v -X GET http://localhost:3001/api/getRecordsByType/academia
app.route('/api/getRecordsByType/:type')
  .get( async (req, res) => {
    // console.log(req)
    let recordsByType = await dbDriver.getRecordsByType(req.params.type)

    res.writeHead(200, {'content-type': 'application/json'});
    res.end( JSON.stringify({recordsByType}) );
  })


// Get the template list
// curl -v -X GET http://localhost:3001/api/templates/list
app.route('/api/templates/list')
  .get( async (req, res) => {
    let templateList = await dbDriver.templateList()

    res.writeHead(200, {'content-type': 'application/json'});
    res.end( JSON.stringify({templateList}) );
  })

// Create a new record.
app.route('/api/record/create')
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
app.route('/api/getRecord/:recordId')
  .get( async (req, res) => {
    // console.log(req)
    let recordById = await dbDriver.getRecordData(req.params.recordId)

    res.writeHead(200, {'content-type': 'application/json'});
    res.end( JSON.stringify({recordById}) );
  })

// Set record by recordId
// curl -v -H "Content-Type: application/json" -X POST -d '{"username":"xyz","password":"xyz"}' http://localhost:3001/api/setRecord/21
app.route('/api/setRecord/:recordId')
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

app.route('/api/record/upload/:recordId')
  .put(async (req, res) => {
    try {
      var form = new formidable.IncomingForm();
      form.uploadDir = __dirname + '/data'
      form.keepExtensions = true;

      form.on('end', (err, fields, files) => {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
      })

      form.on('file', async (name, file) => {
        console.log(name)
        console.log(file)
      })

      // Process the files
      form.parse(req, function(err, fields, files) {
        // console.log('parse!!')
        // console.log(err)
        // console.log(fields)
        // console.log(files)
      });

    } catch(error) {
      console.log('ERROR: ' + error)
    }
  })


app.use(async function(req, res) {
  console.log(req.headers)
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    console.log('uploading file')
    // parse a file upload
    try {
      var form = new formidable.IncomingForm();
      form.uploadDir = __dirname + '/data'
      form.keepExtensions = true;

      form.on('end', (err, fields, files) => {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
      })

      form.on('file', async (name, file) => {
        console.log(name)
        console.log(file)
      })

      form.parse(req, function(err, fields, files) {
        console.log('parse!!')
        console.log(err)
        console.log(fields)
        console.log(files)
      });
    } catch(error) {
      console.log('ERROR: ' + error)
    }

    return;
  }
  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
})

app.listen(3001)
