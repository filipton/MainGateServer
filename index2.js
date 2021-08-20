var sec_key = process.env.secret;

const http = require('http');
const https = require('https');
const options = {
  hostname: 'reediest-bullfrog-1425.dataplicity.io',
  port: 443,
  path: '/?m=info',
  method: 'GET'
}

http.createServer(function (req, res) { 
  var url = req.url.substring(1);
  var args = url.split("/");

  if(args.length == 1 && args[0] == "info"){
    res.writeHead(200, {'Content-Type': 'text/html'}); res.write("Ok!"); 
    res.end();
  }
  else if(args.length == 1 && args[0] == "test"){
    let data = '';
    const req = https.request(options, resp => {
      console.log(`statusCode: ${resp.statusCode}`)

      resp.on('data', d => {
        data += d;
      })
      resp.on('end', () => {
        res.writeHead(200, {'Content-Type': 'text/html'}); res.write(data);
        res.end();
      })
    })

    req.on('error', error => {
      console.error(error)
    })
    req.end();
//    res.writeHead(200, {'Content-Type': 'text/html'}); res.write(data);
//    res.end();
  }
  else{
    res.writeHead(200, {'Content-Type': 'text/html'}); res.write("BAD REQUEST");
    res.end(); 
  }
}).listen(process.env.PORT || 8081);