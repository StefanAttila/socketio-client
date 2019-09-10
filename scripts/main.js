'use strict';

import SocketService from './socket.service.js';
import InputBar from './input-bar.js';

class SocketIoChatApp {
  constructor() {
    // create socket service instance and initialize connection
    const socketService = new SocketService();
    socketService.init();
    // set default nickname in localStorage if not exists
    if (!localStorage.getItem("nickname")) {
      localStorage.setItem("nickname", "guest0001");
    }

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

customElements.define('chat-input-bar', InputBar);