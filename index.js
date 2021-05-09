var sec_key = process.env.secret;
MakeGateAction = false;

var http = require('http'); http.createServer(function (req, res) { 
  var url = req.url.substring(1);
  var args = url.split("/");

  if(args.length == 1 && args[0] == "info"){
    //res.writeHead(200, {'Content-Type': 'text/html'}); res.write("Ok!"); 
    res.writeHead(200, {'Content-Type': 'text/html'}); res.write(sec_key); 
  }
  else if(args.length == 1 && args[0] == "get"){
    if(MakeGateAction == true){
      MakeGateAction = false;
      res.writeHead(200, {'Content-Type': 'text/html'}); res.write("true"); 
    }
    else{
      res.writeHead(200, {'Content-Type': 'text/html'}); res.write("false"); 
    }
  }
  else if(args.length == 2 && args[0] == "gate"){
    if(args[1] == sec_key){
      if(MakeGateAction == false){
        MakeGateAction = true;
        res.writeHead(200, {'Content-Type': 'text/html'}); res.write("Otwieranie bramy... (Main System)"); 
      }
      else{
        res.writeHead(200, {'Content-Type': 'text/html'}); res.write("Poczekaj na zakończenie poprzedniego zapytania... (Main System)"); 
      }
    }
    else{
      res.writeHead(200, {'Content-Type': 'text/html'}); res.write("Zły klucz dostępu... (Main System)"); 
    }
  }
  res.end();
}).listen(process.env.PORT);