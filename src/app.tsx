import { io } from "socket.io-client";

function sleep(ms:number) {return new Promise(resolve => setTimeout(resolve, ms));}

async function main() {
  var lastProgressUpdate = Date.now();
  await sleep(200)
  const socket = io("http://0.0.0.0:3000");
  socket.on("connect", () => {
    console.log("\n\n\n\tDekstop-Hud-Info: Initialized!")
    const engine = socket.io.engine;
    console.log(engine.transport.name);
    socket.emit("identification", "spotify")
    socket.emit("metadata",Spicetify.Queue.track.contextTrack.metadata)
    socket.emit("playbackState", Spicetify.Player.data.isPaused ? "Paused" : "Playing")
    socket.emit("progress", Spicetify.Player.data.position)
    var q = Spicetify.Queue;
    delete q.queueRevision;
    socket.emit("queue",q);
  });
  socket.on("command", async(data) => {
    // console.log(data)
    switch(data){
      case "playpause":
        Spicetify.Player.togglePlay();
        break
      case "play":
        Spicetify.Player.play();
        break;
      case "pause":
        Spicetify.Player.pause();
        break;
      case "next":
        Spicetify.Player.next();
        break
      case "prev":
        Spicetify.Player.back();
        break
      case "shuffle":
        console.log("Shuffling")
        Spicetify.Player.setShuffle(data.split("=")[1] == "true");
        break
      case "repeat":
        Spicetify.Player.setRepeat(data.split("=")[1] == "true" ? 1 : 0);
        break
      case "getdata":
        socket.emit("metadata",Spicetify.Queue.track.contextTrack.metadata);
        var q = Spicetify.Queue;
        delete q.queueRevision;
        socket.emit("queue",q);
        socket.emit("playbackState", Spicetify.Player.data.isPaused ? "Paused" : "Playing")
        socket.emit("progress", Spicetify.Player.data.position)
        break;
    }
  });
  Spicetify.Player.addEventListener("onplaypause",(p)=>{
    // var info = Spicetify.Queue.track.contextTrack.metadata
    socket.emit("playbackState", p.data.isPaused ? "Paused" : "Playing")
  });
  Spicetify.Player.addEventListener("onprogress",(p)=>{
    // var info = Spicetify.Queue.track.contextTrack.metadata
    // console.log(p)
    if(Date.now() - lastProgressUpdate >= 1000){
      lastProgressUpdate = Date.now()
      socket.emit("progress", p.data)
    }
  });
  Spicetify.Player.addEventListener("songchange",(p)=>{
    // var info = Spicetify.Queue.track.contextTrack.metadata
    // Also include queue...
    var info = p.data.item.metadata
    socket.emit("metadata", info)
    var q = Spicetify.Queue;
    delete q.queueRevision;
    socket.emit("queue",q);
  });
  // Try to make this work with the package structure
  // Spicetify.Player.addEventListener("songchange",()=>{
  //   console.log("HUH")
  //   socket.emit("command",Spicetify.Queue.track.contextTrack.metadata.title)
  // })
}

export default main;

