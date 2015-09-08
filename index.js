
var express = require('express');
var os = require('os');

var app = express();
app.set('port', process.env.PORT || 8081);
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.write('<h1>Look and my lovely tug boat!</h1>')
  res.write('<img src="tug.png" /> <p> <h2>.. and some sweet cpu info</h2>')
  cpuinfo = JSON.stringify(os.cpus(),null,'\t')
  res.end('<pre>'+cpuinfo+'</pre')
});

var server = app.listen(app.get('port'), function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})
