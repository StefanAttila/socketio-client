'use strict';

import SocketService from './socket.service.js';

class InputBar extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.

    // Attach a shadow root to <chat-input-bar>.
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = InputBar.TEMPLATE;

    // get socket service instance
    this.socketService = new SocketService();

    // get form, inputs, buttons
    const form = shadowRoot.getElementById('form');
    this.nickname = shadowRoot.getElementById('nickname');
    this.message = shadowRoot.getElementById('message');
    this.sendButton = shadowRoot.getElementById('send');
    this.sendButton.disabled = true;

    // set eventlisteners
    form.addEventListener('submit', this.sendMessage.bind(this));
    this.message.addEventListener('input', this.onMessageInputChanged.bind(this));
    const dHandler = this.debounce(500, this.onNicknameInputChanged.bind(this));
    this.nickname.addEventListener('input', dHandler);

    // subscribe to socket status events
    this.socketService.subscribeToStatusChanges((connected) => {
      if (connected && this.message.value) {
        this.sendButton.disabled = false;
      } else {
        this.sendButton.disabled = true;
      }
    });

    // set the nickname from localStorage
    const savedNickname = localStorage.getItem('nickname');
    if (savedNickname) {
      this.nickname.value = savedNickname;
    }
  }

  /**
   * Create and send message via socket service.
   * @param event 
   */
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

  /**
   * Returns a message object from input values.
   */
  createMessage() {
    return {
      message: this.message.value,
      user: this.nickname.value || 'guest0001',
    };
  }

  /**
   * Set the status of send button on message input changes.
   */
  onMessageInputChanged() {
    if (this.message.value && this.sendButton.disabled) {
      this.sendButton.disabled = false;
    } else if (!this.message.value) {
      this.sendButton.disabled = true;
    }
  }

  /**
   * Set nickname in localstorage.
   */
  onNicknameInputChanged() {
    let name = this.nickname.value || 'guest0001';
    localStorage.setItem('nickname', name);
  }

  /**
   * Helps to run any function after a debounce time.
   * @param delay the delay in ms
   * @param fn function to call after delay
   */
  debounce(delay, fn) {
    let timerId;
    return function(...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    }
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