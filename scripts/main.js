'use strict';

import SocketService from './socket.service.js';

class SocketIoChatApp {
  constructor() {
    const socketService = new SocketService();
    socketService.init();
  }
}

// On load start the app.
window.addEventListener('load', () => new SocketIoChatApp());