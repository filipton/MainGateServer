var sec_key = process.env.secret;

const request = require('request');
const http = require('http'); 

http.createServer(function (req, res) { 
  var url = req.url.substring(1);
  var args = url.split("/");

  if(args.length == 1 && args[0] == "info"){
    res.writeHead(200, {'Content-Type': 'text/html'}); res.write("Ok!"); 
    res.end();
  }
  else if(args.length == 2 && args[0] == "gate"){
    request(`https://reediest-bullfrog-1425.dataplicity.io/?sk=${args[1]}`, function (error, response, body) {
      if(error || body == "" || body.includes("Device not Connected")){
        res.writeHead(500, {'Content-Type': 'text/html'}); res.write("Nie mozna nawiazac polaczenia z brama!"); 
        res.end();
      }
      else{
        res.writeHead(200, {'Content-Type': 'text/html'}); res.write(body); 
        res.end();
      }
    });
  }
  else{
    res.writeHead(200, {'Content-Type': 'text/html'}); res.write("BAD REQUEST");
    res.end(); 
  }
}).listen(process.env.PORT || 8088);