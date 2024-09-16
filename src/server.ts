import { Server } from "socket.io";

const latencyCheckIntervalMS = 2000
const port = 3000

const io = new Server(port);

function pp(num: number): string {
    return (Math.round(num*100)/100).toString().padStart(4, '0')
}

io.on("connection", (socket) => {
    console.log(`Client connected id: ${socket.id}`)
    let sumRTT = 0
    let numPings = 0
    let sumRTTSq = 0
    const x = setInterval(() => {
        const latencyCheckInitTime = Date.now();
        socket.emit("latencyCheck", () => {
            const ackRecTime = Date.now()
            numPings++
            const duration = ackRecTime - latencyCheckInitTime
            sumRTT += duration
            sumRTTSq += (duration*duration)
            const mean = sumRTT/numPings
            const variance = (sumRTTSq/numPings) - (mean*mean)
            const standardDeviation = Math.sqrt(variance)
            console.log(`new: ${pp(duration)} mean: ${pp(mean)} std: ${pp(standardDeviation)}`);
        });
      }, latencyCheckIntervalMS);
    socket.on("disconnect", () => {
        console.info(`Client gone id: ${socket.id}`);
        clearInterval(x)
    });
});