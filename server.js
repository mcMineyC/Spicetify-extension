const { Server } = require("socket.io");

const io = new Server(3000, {
    cors: {
        origin: "*", // allow all origins for testing
    },
});

io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
  socket.emit("command", "shuffle=true")

    // Listen for any message
    socket.on("playbackState", (msg) => {
      console.log("Playing", msg == "Playing")
    });
    socket.on("progress", (msg) => {
      console.log("Progress", msg/1000)
    })
    socket.on("metadata", (msg) => {
      // console.log(msg)
      console.log("Metadata", ({
        title: msg.title,
        album: msg.album_title,
        artist: msg.artist_name,
        imageUrl: "https://i.scdn.co/image/"+(msg.image_url || "").split(":")[2],
        explicit: msg.is_explicit == true,
        canvasUrl: msg["canvas.url"] || "",
        length: parseInt(msg.duration)/1000,
      }))
    })

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

console.log("Socket.io server running on port 3000");

