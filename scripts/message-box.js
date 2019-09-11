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
    this.statusContainer = shadowRoot.getElementById('status-container');
    // set container visibility
    this.showHideContainer(false);
    this.statusContainer.innerHTML = '<p>Socket is not connected</p>';
    
    // get socket service instance
    this.socketService = new SocketService();
    this.socketService.subscribeToMessage((message) => {
      this.addMessage(message);
    });
    this.socketService.subscribeToStatusChanges((connected) => {
      if (!connected) {
        this.statusContainer.innerHTML = '<p>Socket is not connected!</p>';
      }
      this.showHideContainer(connected);
    });

    window.addEventListener('online', () => {
      this.showHideContainer(true);
    });
    window.addEventListener('offline', () => {
      this.showHideContainer(false);
      this.statusContainer.innerHTML = '<p>No internet connection!</p>';
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

  /**
   * Switches betwwe nthe message and the status container visibility.
   * @param show to show the message container or not
   */
  showHideContainer(show) {
    if (show) {
      this.container.style.display = 'block';
      this.statusContainer.style.display = 'none';
    } else {
      this.container.style.display = 'none';
      this.statusContainer.style.display = 'flex';
    }
  }
}

  MessageBox.TEMPLATE = `
  <link rel="stylesheet" href="../styles/message-box.css">
  <div id="message-container" class="wrapper"></div>
  <div id="status-container" class="wrapper not-connected"></div>
`;

export default MessageBox;