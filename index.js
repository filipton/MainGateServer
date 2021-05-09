var sec_key = process.env.secret;
MakeGateAction = false;

const request = require('request');
const http = require('http'); 

console.log("STARTING...");

http.createServer(function (req, res) { 
  var url = req.url.substring(1);
  var args = url.split("/");

  console.log(url);

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
    request(`http://51.83.133.89:21371/_token/NiktNieMozeTegoUkrasc/gate/${args[1]}`, function (error, response, body) {
      if(error || body == ""){
        request(`http://51.83.133.89:21372/_token/NiktNieMozeTegoUkrasc/gate/${args[1]}`, function (error2, response2, body2) {
          if(error2 || body2 == ""){
            request(`http://51.83.133.89:21373/_token/NiktNieMozeTegoUkrasc/gate/${args[1]}`, function (error3, response3, body3) {
              if(error3 || body3 == ""){
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
                res.writeHead(200, {'Content-Type': 'text/html'}); res.write(body3); 
                res.end();
                console.log("S3: " + body3);
              }
            });
          }
          else{
            res.writeHead(200, {'Content-Type': 'text/html'}); res.write(body2); 
            res.end();
            console.log("S2: " + body2);
          }
        });
      }
      else{
        res.writeHead(200, {'Content-Type': 'text/html'}); res.write(body);
        res.end(); 
        console.log("S1: " + body);
      }
    });
  }
  else{
    res.writeHead(200, {'Content-Type': 'text/html'}); res.write("BAD REQUEST");
    res.end(); 
  }
}).listen(process.env.PORT | 8088);