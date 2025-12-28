# Dekstop Hud Info
This is a Spicetify extension for Spotify that will replace the dekstop-daemon-node.  It allows deeper integration, such as queue and shuffle.  You must run a Socket.IO server (example in server.js) for it to connect to.  This cannot start a server due to web limitations.  It tries to connect to 0.0.0.0:3000

# NOTE:
You must pass the flags ```--disable-web-security --allow-running-insecure-content --user-data-dir=<dir>``` to connect to a server.
Simply copy (or slightly rename) the user data dir from ~/.config/spotify to something else and provide it.
