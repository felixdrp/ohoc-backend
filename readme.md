var xhr = new XMLHttpRequest();
xhr.open('POST', 'http://localhost:3000/uploadFiles', true, 'usuario', 'palabraClave');
xhr.onload = function(e) { console.log(e) }
xhr.setRequestHeader('Content-MLK', 'NNNombre de fichero')
xhr.send('yesoooooo')



curl -v -X PUT http://localhost:3001/createRecord

curl -v -X DELETE http://localhost:3001/createRecord

# URL MAP

Front End
---------




Backend api services
--------------------

/api/record/create
  PUT > it will create a new record. template or categories expesified on headers

/api/record/update/:recordId
  POST > A POST with the json data to update the record info.

/api/record/upload/:recordId
