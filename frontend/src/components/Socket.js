import io from 'socket.io-client';

let socket = io(window.location.origin, { transports : ['websocket'] });

export default socket;