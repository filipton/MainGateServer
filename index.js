var sec_key = process.env.secret;
MakeGateAction = false;

const request = require('request');
const http = require('http'); 

http.createServer(function (req, res) { 
  var url = req.url.substring(1);
  var args = url.split("/");

  if(args.length == 1 && args[0] == "info"){
    res.writeHead(200, {'Content-Type': 'text/html'}); res.write("Ok!"); 
    res.end();
  }
  else if(args.length == 1 && args[0] == "get"){
    if(MakeGateAction == true){
      MakeGateAction = false;
      res.writeHead(200, {'Content-Type': 'text/html'}); res.write("true"); 
    }
    else{
      res.writeHead(200, {'Content-Type': 'text/html'}); res.write("false"); 
    }

    res.end();
  }
  else if(args.length == 2 && args[0] == "gate"){
    request(`https://reediest-bullfrog-1425.dataplicity.io/?sk=${args[1]}`, function (error, response, body) {
      if(error || body == "" || body.includes("Device not Connected")){
        if(args[1] == sec_key){
          if(MakeGateAction == false){
            MakeGateAction = true;
            res.writeHead(200, {'Content-Type': 'text/html'}); res.write("Otwieranie bramy... (System 4)"); 
          }
          else{
            res.writeHead(200, {'Content-Type': 'text/html'}); res.write("Poczekaj na zakończenie poprzedniego zapytania... (System 4)"); 
          }
        }
        else{
          res.writeHead(200, {'Content-Type': 'text/html'}); res.write("Zły klucz dostępu... (System 4)"); 
        }
        res.end();
      }
      else{
        res.writeHead(200, {'Content-Type': 'text/html'}); res.write(body); 
        res.end();
        console.log("S3: " + body);
      }
    });
  }
  else{
    res.writeHead(200, {'Content-Type': 'text/html'}); res.write("BAD REQUEST");
    res.end(); 
  }
}).listen(process.env.PORT || 8088);