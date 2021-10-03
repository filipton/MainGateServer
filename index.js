var WebSocketServer = require("ws").Server
var http = require("http")
var port = process.env.PORT || 5000

class Client {
  constructor(ws, localip, lasthb) {
    this.ws = ws;
    this.localip = localip;
    this.lasthb = lasthb;
  }

  get isAlive() {
    return Date.now() - this.lasthb < 45000;
  }
}

var Clients = new Map();

var server = http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on("end", function(){
    if(req.url.includes("/check/"))
    {
      var tuid = req.url.replace("/check/", "");
      if(Clients.has(tuid) && Clients.get(tuid).isAlive){
        res.write('true');
        res.end();
        return;
      }
      res.statusCode = 404;
      res.write('false');
      res.end();
    }
    else if(req.url.includes("/gate/"))
    {
      const args = req.url.replace("/gate/", "").split('/');
      if(args.length == 2){
        if(Clients.has(args[0]) && Clients.get(args[0]).isAlive){
          Clients.get(args[0]).ws.send("GATE;" + args[1]);
          res.write('Otwieranie bramy...');
          res.end();
        }
        else{
          res.statusCode = 404;
          res.write('Brama nie jest dostepna!');
          res.end();
        }
      }
      else{
        res.statusCode = 400;
        res.write('Bad request! /gate/{device_id}/{key}');
        res.end();
      }
    }
    else if(req.url.includes("/update/"))
    {
      var tuid = req.url.replace("/update/", "");
      if(Clients.has(tuid) && body != ""){
        Clients.get(tuid).ws.send("UPDATE;" + body);
        res.write('UPDATING FROM URL: ' + body);
        res.end();
      }
      else if(body == "") {
        res.write('Url not specified! (text/plain body)');
        res.end();
      }
      else{
        res.write('Something went wrong!');
        res.end();
      }
    }
    else if(req.url.includes("/listall")){
      var outp = "List of devices: \r\n";
      Clients.forEach((value,key)=>{
        outp += `ID: ${key} => IS_ALIVE: ${value.isAlive} | LOCAL_IP: ${value.localip} | LASTHB: ${value.lasthb} \r\n`;
      })
      res.write(outp);
      res.end();
    }
    else{
      res.write('Api for gate system!');
      res.end();
    }
  });
}).listen(port);

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server, path: "/ws"})
console.log("websocket server created")

wss.on("connection", function(ws) {
  var uid = null;
  var id = null

  console.log("websocket connection open")
  ws.on("message", function incoming(message) {
    var msg = message.toString();
    if(msg.includes("SETUP")){
      const args = msg.split(';');
      if(args.length == 3){
        uid = args[1];
        localip = args[2];
        Clients.set(args[1], new Client(ws, localip, Date.now()));

        id = setInterval(function() {
          ws.send("HB", function() {  })
        }, 30000);
        console.log("NEW DEVICE REGISTERED! ID: " + uid + ", LOCALIP: " + localip);
      }
    }
    if(msg.includes("ACK")){
      if(Clients.has(uid)){
        Clients.get(uid).lasthb = Date.now();
      }
    }
  })

  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
    if(Clients.has(uid) && Clients.get(uid).ws == ws){
      Clients.delete(uid);
    }
  })
})