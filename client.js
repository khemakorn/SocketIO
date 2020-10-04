const io = require('socket.io-client');

const socket = io('http://localhost:3000');

console.log(socket.connected); // false

socket.on('connect', () => {
  console.log(socket.connected); // true
  socket.emit('userID', 2);
  socket.emit('request', {
      src: {
          lat: 0.1,
          lng: 0.1
      },
      dest: {
          lat: 1.1,
          lng: 1.1
      }
  });
});

socket.on('result', (result) => {
    console.log(`We can go with userID: ${result}`);
});

socket.on('disconnect', () => {
  console.log(socket.connected); // false
});