'use strict';

class ChatMessage extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.

    // Attach a shadow root to <chat-input-bar>.
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = ChatMessage.TEMPLATE;

    // get wrapper, sender, and message
    this.container = shadowRoot.getElementById('message-wrapper');
    this.sender = shadowRoot.getElementById('sender');
    this.message = shadowRoot.getElementById('message');
  }

  /**
   * Sets a message style.
   * @param message the message object
   */
  setMessage(message) {
    const nickname = localStorage.getItem('nickname');
    // if it's an own message style it as sent
    if (nickname === message.user) {
      this.container.classList.add('sent');
    // else style it as received
    } else {
      this.sender.innerHTML = `${message.user}:&nbsp;`;
    }
    this.message.textContent = message.message;
  }
}

  ChatMessage.TEMPLATE = `
  <link rel="stylesheet" href="../styles/chat-message.css">
  <div id="message-wrapper" class="wrapper">
    <span id="sender"></span>
    <span id="message"></span>
  </div>
`;

export default ChatMessage;