'use strict';

import SocketService from './socket.service.js';

/**
 * The message box custom element that contains the received chat messages.
 */
class MessageBox extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.

    // Attach a shadow root to <chat-input-bar>.
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = MessageBox.TEMPLATE;

    // get container
    this.container = shadowRoot.getElementById('message-container');

    // get socket service instance
    this.socketService = new SocketService();
    this.socketService.subscribeToMessage((message) => {
      this.addMessage(message);
    });
  }

  /**
   * Appends a new <chat-message> to the container as child and scrolls to bottom.
   * @param message the message to add
   */
  addMessage(message) {
    if (!message) {
      return;
    }
    // create new note
    const item = document.createElement('chat-message');
    item.setMessage(message);
    this.container.appendChild(item);
    // scroll to bottom if needed
    if (this.container.scrollHeight > this.container.offsetHeight) {
      console.log('scroll needed');
      setTimeout(() => {
        this.container.scrollTo(0, this.container.scrollHeight);
      }, 10);
    }
  }
}

  MessageBox.TEMPLATE = `
  <link rel="stylesheet" href="../styles/message-box.css">
  <div id="message-container" class="wrapper">
  </div>
`;

export default MessageBox;