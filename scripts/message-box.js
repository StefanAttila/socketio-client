'use strict';

class MessageBox extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.

    // Attach a shadow root to <chat-input-bar>.
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = MessageBox.TEMPLATE;
  }
}

  MessageBox.TEMPLATE = `
  <link rel="stylesheet" href="../styles/message-box.css">
  <div class="wrapper">
    <chat-message></chat-message>
  </div>
`;

export default MessageBox;