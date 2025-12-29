import { io } from "socket.io-client";

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function main() {
  var lastProgressUpdate = Date.now();
  await sleep(200)
  const socket = io("http://0.0.0.0:3000");
  socket.on("connect", () => {
    console.log("\n\n\n\tDekstop-Hud-Info: Initialized!")
    const engine = socket.io.engine;
    console.log(engine.transport.name);
    socket.emit("identification", "spotify")
    socket.emit("metadata", Spicetify.Queue.track.contextTrack.metadata)
    socket.emit("playbackState", {
      playing: Spicetify.Player.data.isPaused ? "Paused" : "Playing",
      shuffle: Spicetify.Player.data.shuffle,
      repeat: Spicetify.Player.data.repeat == 1,
    });
    socket.emit("progress", Spicetify.Player.data.position)
    var q = Spicetify.Queue;
    delete q.queueRevision;
    socket.emit("queue", q);
  });

  socket.on("playpause", () => {
    Spicetify.Player.togglePlay();
  });

  socket.on("play", () => {
    Spicetify.Player.play();
  });

  socket.on("pause", () => {
    Spicetify.Player.pause();
  });

  socket.on("next", () => {
    Spicetify.Player.next();
  });

  socket.on("prev", () => {
    Spicetify.Player.back();
  });

  socket.on("shuffle", (enabled) => {
    // enabled: boolean
    // enabled = enabled == "true"
    console.log("Shuffling", enabled);
    Spicetify.Player.setShuffle(enabled);
  });

  socket.on("repeat", (enabled) => {
    // enabled: boolean
    // enabled = enabled == "true"
    Spicetify.Player.setRepeat(enabled ? 1 : 0);
  });

  socket.on("seek", (positionMs) => {
    // positionMs: number (milliseconds)
    Spicetify.Player.seek(parseInt(positionMs, 10));
  });

  socket.on("getdata", () => {
    // Track metadata
    socket.emit(
      "metadata",
      Spicetify.Queue.track.contextTrack.metadata
    );

    // Queue (remove unstable field)
    const q = { ...Spicetify.Queue };
    delete q.queueRevision;
    socket.emit("queue", q);

    // Playback state
    socket.emit(
      "playbackState",
      {
        playing: Spicetify.Player.data.isPaused ? "Paused" : "Playing",
        shuffle: Spicetify.Player.data.shuffle,
        repeat: Spicetify.Player.data.repeat == 1,
      }
    );

    // Progress
    socket.emit("progress", Spicetify.Player.data.position);
  });
  Spicetify.Player.addEventListener("onplaypause", (p) => {
    // var info = Spicetify.Queue.track.contextTrack.metadata
    socket.emit("playbackState", {
      playing: p.data.isPaused ? "Paused" : "Playing",
      shuffle: p.data.shuffle,
      repeat: p.data.repeat == 1,
    });
  });
  Spicetify.Player.addEventListener("onprogress", (p) => {
    // var info = Spicetify.Queue.track.contextTrack.metadata
    // console.log(p)
    if (Date.now() - lastProgressUpdate >= 1000) {
      lastProgressUpdate = Date.now()
      socket.emit("position", p.data)
    }
  });
  Spicetify.Player.addEventListener("songchange", (p) => {
    // var info = Spicetify.Queue.track.contextTrack.metadata
    // Also include queue...
    var info = p.data.item.metadata
    socket.emit("metadata", info)
    var q = Spicetify.Queue;
    delete q.queueRevision;
    socket.emit("queue", q);
  });
  // Try to make this work with the package structure
  // Spicetify.Player.addEventListener("songchange",()=>{
  //   console.log("HUH")
  //   socket.emit("command",Spicetify.Queue.track.contextTrack.metadata.title)
  // })
}

export default main;

