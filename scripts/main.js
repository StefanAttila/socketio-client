'use strict';

import SocketService from './socket.service.js';

class SocketIoChatApp {
  constructor() {
    const socketService = new SocketService();
    socketService.init();
    socketService.subscribeToStatusChanges(connected => {
      console.log('socket status change', connected);
    });
    socketService.subscribeToMessage(message => {
      console.log('message received', message);
    });
  }
}

// On load start the app.
window.addEventListener('load', () => new SocketIoChatApp());