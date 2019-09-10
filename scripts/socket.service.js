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

  close() {
    if (!this.socket) {
      return;
    }

    this.socket.close();
  }

  send(message, user) {
    if (!this.socket) {
      return;
    }

    const data = { message, user };
    this.socket.emit('message', data);
  }

  subscribeToStatusChanges(fn) {
    this.statusObservers.push(fn);
  }

  unsubscribeFromStatusChanges(fn) {
    const idx = this.statusObservers.findIndex(f => f === fn);
    if (idx > -1) {
      this.statusObservers.splice(idx, 1);
    }
  }

  broadcastStatusChange(data) {
    for(let i = 0; i < this.statusObservers.length; i++) {
      this.statusObservers[i](data);
    }
  }

  subscribeToMessage(fn) {
    this.messageObservers.push(fn);
  }

  unsubscribeFromMessage(fn) {
    const idx = this.messageObservers.findIndex(f => f === fn);
    if (idx > -1) {
      this.messageObservers.splice(idx, 1);
    }
  }

  broadcastMessage(data) {
    for(let i = 0; i < this.messageObservers.length; i++) {
      this.messageObservers[i](data);
    }
  }

  get isConnected() {
    return this._isConnected;
  }
}

export default SocketService;