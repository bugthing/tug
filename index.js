var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('<h1>Check it!</h1><img src="tug.png" />')
})

app.use(express.static('public', { index: false }));

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})
