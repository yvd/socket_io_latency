import { Server } from "socket.io";

const io = new Server(3000);
console.log(`staring server`)

function round(num: number): number {
    return Math.round(num*100)/100
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
            console.log(`new: ${duration} mean: ${round(mean)} variance: ${round(variance)} std: ${round(standardDeviation)}`);
        });
      }, 5000);
    socket.on("disconnect", () => {
        console.info(`Client gone id: ${socket.id}`);
        clearInterval(x)
    });
});