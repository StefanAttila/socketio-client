'use strict';

let instance = null;

class SocketService {
  constructor() {
    if (!instance) {
      this._isConnected = false;
      this.statusObservers = [];
      this.messageObservers = [];
      instance = this;
    }

    return instance;
  }

  /**
   * Initialize socket connection and handle socket status changes and message events.
   */
  init() {
    this.socket = io("http://35.157.80.184:8080");

    this.socket.on('connect', () => {
      this._isConnected = this.socket.connected;
      this.broadcastStatusChange(this._isConnected);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      this._isConnected = this.socket.connected;
      this.broadcastStatusChange(this._isConnected);
    });

    this.socket.on('disconnect', (reason) => {
      this._isConnected = this.socket.connected;

      if (reason === 'io server disconnect') {
        // manually reconnect
        this.socket.connect();
      }
    });

    this.socket.on("message", (message) => {
      this.broadcastMessage(message);
    });
  }

  /**
   * Close the socket connection manually.
   */
  close() {
    if (!this.socket) {
      return;
    }

    this.socket.close();
  }

  /**
   * Send a new message via socket.
   * @param message the text of the message
   * @param user the user who sends the message
   */
  send(message, user) {
    if (!this.socket) {
      return;
    }

    const data = { message, user };
    this.socket.emit('message', data);
  }

  /**
   * Subscribe to socket status changes.
   * @param fn callback function to add
   */
  subscribeToStatusChanges(fn) {
    this.statusObservers.push(fn);
  }
  /**
   * Unsubscibe from socket status changes.
   * @param fn callback function to delete
   */
  unsubscribeFromStatusChanges(fn) {
    const idx = this.statusObservers.findIndex(f => f === fn);
    if (idx > -1) {
      this.statusObservers.splice(idx, 1);
    }
  }
  /**
   * Broadcast a data to all observers.
   * @param data the data to broadcast 
   */
  broadcastStatusChange(data) {
    for(let i = 0; i < this.statusObservers.length; i++) {
      this.statusObservers[i](data);
    }
  }

  /**
   * Subscribe to incoming messages.
   * @param fn callback function to add
   */
  subscribeToMessage(fn) {
    this.messageObservers.push(fn);
  }
  /**
   * Unsubscibe from incoming messages.
   * @param fn callback function to delete
   */
  unsubscribeFromMessage(fn) {
    const idx = this.messageObservers.findIndex(f => f === fn);
    if (idx > -1) {
      this.messageObservers.splice(idx, 1);
    }
  }
  /**
   * Broadcast a message to all observers.
   * @param data the data to broadcast 
   */
  broadcastMessage(data) {
    for(let i = 0; i < this.messageObservers.length; i++) {
      this.messageObservers[i](data);
    }
  }

  /**
   * Returns if the socket is connected or not.
   */
  get isConnected() {
    return this._isConnected;
  }
}

export default SocketService;