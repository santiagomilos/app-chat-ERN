import io from 'socket.io-client';

let url = `${window.location.protocol}//${window.location.hostname}:3000`;
let socket = io(url, { transports : ['websocket'] });

export default socket;