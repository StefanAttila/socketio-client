'use strict';

class InputBar extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.

    // Attach a shadow root to <chat-input-bar>.
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = InputBar.TEMPLATE;
  }
}

InputBar.TEMPLATE = `
  <link rel="stylesheet" href="../styles/input-bar.css">
  <div class="wrapper">
    <input class="nickname" type="text" placeholder="Nickname">
    <input class="message" type="text" placeholder="Your message">
    <button class="send-button">Send</button>
  </div>
`;

export default InputBar;