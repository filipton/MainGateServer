var WebSocketServer = require("ws").Server
var http = require("http")
var port = process.env.PORT || 5000

var Clients = new Map();
var LastHB = new Map();

var server = http.createServer(function (req, res) {
  if(req.url.includes("/test/")){
    var tuid = req.url.replace("/test/", "");
    if(LastHB.has(tuid)){
      if(Date.now() - LastHB.get(tuid) >= 45000 || !Clients.has(tuid)){
        res.statusCode = 404;
        res.write('NOT');
        res.end();
      }
      else{
        res.statusCode = 200;
        res.write('YES');
        res.end();
      }
    }
    else{
      res.statusCode = 404;
      res.write('NOT');
      res.end();
    }
  }
  else if(req.url.includes("/gate/")){
    var tuid = req.url.replace("/gate/", "");
    if(Clients.has(tuid)){
      Clients.get(tuid).send("GATE;xyz");
    }
    res.write('OPENING');
    res.end();
  }
  else if(req.url.includes("/update/")){
    const args = req.url.replace("/update/", "").split('/');
    var upurl = req.url.replace("/update/", "").replace(args[0] + "/", "");
    if(upurl != null){
      if(Clients.has(args[0])){
        Clients.get(args[0]).send("UPDATE;" + upurl);
      }
      res.write('UPDATING...' + "UPDATE;" + upurl);
      res.end();
    }
  }
  else{
    res.write('Hello World!');
    res.end();
  }
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
      if(args.length == 2){
        Clients.set(args[1], ws);
        uid = args[1];
        console.log(msg);
        LastHB.set(uid, Date.now());

        id = setInterval(function() {
          ws.send("HB", function() {  })
        }, 30000);
      }
    }
    if(msg.includes("ACK")){
      LastHB.set(uid, Date.now());
    }
  })

  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
    if(Clients.has(uid) && Clients.get(uid) == ws){
      Clients.delete(uid);
    }
  })
})