'use strict';

class ChatMessage extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.

    // Attach a shadow root to <chat-input-bar>.
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = ChatMessage.TEMPLATE;
  }
}

  ChatMessage.TEMPLATE = `
  <link rel="stylesheet" href="../styles/chat-message.css">
  <div class="wrapper">
    This is a message
  </div>
`;

export default ChatMessage;