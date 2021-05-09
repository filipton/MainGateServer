var sec_key = process.env.secret;

var http = require('http'); http.createServer(function (req, res) { 
  var url = req.url.replace("/", "");
  var args = url.split("/");
  res.writeHead(200, {'Content-Type': 'text/html'}); res.write("Ok!");
  res.end();
}).listen(process.env.PORT);
