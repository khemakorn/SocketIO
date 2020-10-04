const io = require('socket.io')();
const PORT = 3000;

const userIDs = {};

const all = [];

const CRITERIA = 0.003;

const findAll = (socket, src, dest) => {
    const other = all.filter(e => e.socket != socket && e.alive);
    other.forEach(e => {
        const eSrc = e.src;
        const eDest = e.dest;
        const distanceSrc = Math.sqrt(Math.pow(eSrc.lat - src.lat, 2) + Math.pow(eSrc.lng - src.lng, 2));
        const distanceDest = Math.sqrt(Math.pow(eDest.lat - dest.lat, 2) + Math.pow(eDest.lng - dest.lng, 2));
        if(distanceSrc <= CRITERIA && distanceDest <= CRITERIA ) {
            e.socket.emit('result', userIDs[socket.id]);
            socket.emit('result', userIDs[e.socket.id]);
        }
    });
};

io.on('connection', socket => { 
    console.log('Client Connected');
    socket.on('userID', (userID) => {
        console.log(`User ID: ${userID}`);
        userIDs[socket.id] = userID;
    });
    socket.on('request', ({src, dest}) => {
        const s = all.filter(e => e.socket == socket);
        if(!s.alive) {
            all.push({
                socket,
                dest,
                src,
                alive: true
            });
        } else {
            s.dest = dest;
            s.src = src;
        }
        findAll(socket, src, dest);
    });
    socket.on('disconnect', (reason) => {
        const userID = userIDs[socket];
        console.log(`UserID ${userID} disconnected with ` + reason);
        const found = all.find(s => s.socket == socket)
        if(found) {
            found.alive = false;
        }
    });
});

console.log(`Running Socket IO on port ${PORT}`);
io.listen(PORT);