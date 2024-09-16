import { io } from "socket.io-client";

const client = io("http://localhost:3000");
client.connect()
client.on("latencyCheck", (callback) => {
  const timeToRespond = Math.random() * 10
  setTimeout(() => {
    console.log(`waited for ${timeToRespond}`)
    callback();
  }, timeToRespond)
});
