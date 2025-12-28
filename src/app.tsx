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
    socket.emit("metadata",Spicetify.Queue.track.contextTrack.metadata)
    socket.emit("playbackState", Spicetify.Player.data.isPaused ? "Paused" : "Playing")
    socket.emit("progress", Spicetify.Player.data.position)
  });
  socket.on("command", async(data) => {
    // console.log(data)
    switch(data){
      case "playpause":
        Spicetify.Player.togglePlay();
        // socket.emit("command",Spicetify.Queue.track.contextTrack.metadata.title)
        break
      case "play":
        Spicetify.Player.play();
      case "play":
        Spicetify.Player.pause();
      case "next":
        Spicetify.Player.next();
        // socket.emit("command",Spicetify.Queue.nextTracks[0].contextTrack.metadata.title)
        break
      case "prev":
        Spicetify.Player.back();
        // socket.emit("command",Spicetify.Queue.prevTracks.at(-1).contextTrack.metadata.title)
        break
      case "shuffle":
        Spicetify.Player.setShuffle(data == "true");
        // Spicetify.Player.toggleShuffle();
        // socket.emit("command",Spicetify.Queue.track.contextTrack.metadata.title)
        break
      case "repeat":
        Spicetify.Player.setRepeat(data == "true" ? 1 : 0);
        // socket.emit("command",Spicetify.Queue.track.contextTrack.metadata.title)
        break
      case "getdata":
        socket.emit("metadata",Spicetify.Queue.track.contextTrack.metadata);
        socket.emit("queue",Spicetify.Queue);
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
  });
  // Try to make this work with the package structure
  // Spicetify.Player.addEventListener("songchange",()=>{
  //   console.log("HUH")
  //   socket.emit("command",Spicetify.Queue.track.contextTrack.metadata.title)
  // })
}

export default main;

