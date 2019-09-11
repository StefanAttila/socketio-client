'use strict';

import SocketService from './socket.service.js';

class MessageBox extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.

    // Attach a shadow root to <chat-input-bar>.
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = MessageBox.TEMPLATE;

    // get container
    this.container = shadowRoot.getElementById('message-container');

    // get socket service instance
    const socketService = new SocketService();
    socketService.subscribeToMessage((message) => {
      this.addMessage(message);
    });
  }

  addMessage(message) {
    if (!message) {
      return;
    }
    // create new note
    const item = document.createElement('chat-message');
    item.setMessage(message);
    this.container.appendChild(item);
  }
}

  MessageBox.TEMPLATE = `
  <link rel="stylesheet" href="../styles/message-box.css">
  <div id="message-container" class="wrapper">
  </div>
`;

export default MessageBox;