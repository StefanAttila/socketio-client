'use strict';

import SocketService from './socket.service.js';

class InputBar extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.

    // Attach a shadow root to <chat-input-bar>.
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = InputBar.TEMPLATE;

    const form = shadowRoot.getElementById('form');
    form.addEventListener('submit', this.sendMessage.bind(this));

    this.nickname = shadowRoot.getElementById('nickname');
    this.message = shadowRoot.getElementById('message');
    this.sendButton = shadowRoot.getElementById('send');

    this.socketService = new SocketService();
  }

  sendMessage(event) {
    event.preventDefault();

    if (!this.message.value) {
      return;
    }

    // send message via socket server instance
    this.sendButton.disabled = true;
    const { message, user } = this.createMessage();
    this.socketService.send(message, user);

    // delete value of message input
    this.message.value = '';
    this.sendButton.disabled = false;
  }

  createMessage() {
    return {
      message: this.message.value,
      user: this.nickname.value || 'guest0001',
    };
  }
}

InputBar.TEMPLATE = `
  <link rel="stylesheet" href="../styles/input-bar.css">
  <div class="wrapper">
    <input id="nickname" class="nickname" type="text" autocomplete="off" placeholder="Nickname">
    <form id="form">
      <input id="message" class="message" type="text" autocomplete="off" placeholder="Your message">
      <button id="send" class="send-button" type="submit">Send</button>
    </<form>
  </div>
`;

export default InputBar;