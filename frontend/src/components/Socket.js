import io from 'socket.io-client';

let socket = io("//localhost:3000", { transports : ['websocket'] });

export default socket;