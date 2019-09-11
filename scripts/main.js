'use strict';

import SocketService from './socket.service.js';
import InputBar from './input-bar.js';
import MessageBox from './message-box.js';
import ChatMessage from './chat-message.js';

class SocketIoChatApp {
  constructor() {
    // create socket service instance and initialize connection
    const socketService = new SocketService();
    socketService.init();
    // set default nickname in localStorage if not exists
    if (!localStorage.getItem('nickname')) {
      localStorage.setItem('nickname', 'guest0001');
    }
  }
}

// on load start the app.
window.addEventListener('load', () => new SocketIoChatApp());

// define custom elements
customElements.define('chat-input-bar', InputBar);
customElements.define('message-box', MessageBox);
customElements.define('chat-message', ChatMessage);