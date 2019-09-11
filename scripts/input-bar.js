'use strict';

import SocketService from './socket.service.js';

/**
 * The bottom input bar custom element which handles the message sending, nickname changing.
 */
class InputBar extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.

    // Attach a shadow root to <chat-input-bar>.
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = InputBar.TEMPLATE;

    // get socket service instance
    this.socketService = new SocketService();

    // get form, inputs, buttons
    this.form = shadowRoot.getElementById('form');
    this.nickname = shadowRoot.getElementById('nickname');
    this.message = shadowRoot.getElementById('message');
    this.sendButton = shadowRoot.getElementById('send');
    this.sendButton.disabled = true;

    // set eventlisteners
    this.form.addEventListener('submit', this.sendMessage.bind(this));
    this.message.addEventListener('input', this.onMessageInputChanged.bind(this));
    this.dHandler = this.debounce(500, this.onNicknameInputChanged.bind(this));
    this.nickname.addEventListener('input', this.dHandler);
    // handle online, offline events
    window.addEventListener('online', () => {
      this.disableEnableInputs(true);
    });
    window.addEventListener('offline', () => {
      this.disableEnableInputs(false);
    });

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
   *  Invoked when the element is disconnected from the document's DOM.
   */
  disconnectedCallback() {
    // remove eventlisteners
    this.form.removeEventListener('submit', this.sendMessage.bind(this));
    this.message.removeEventListener('input', this.onMessageInputChanged.bind(this));
    this.nickname.removeEventListener('input', this.dHandler);
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

  /**
   * Enables/disables all inputs and the button.
   * @param enable enable inputs and button
   */
  disableEnableInputs(enable) {
    this.message.disabled = !enable;
    this.nickname.disabled = !enable;
    this.sendButton.disabled = !enable;
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