'use strict';

let instance = null;

class SocketService {
  constructor() {
    if (!instance) {
      instance = this;
    }

    this._isConnected = false;

    return instance;
  }

  init() {
    this.socket = io("http://35.157.80.184:8080");

    this.socket.on('connect', () => {
      this._isConnected = this.socket.connected;
    });

    this.socket.on('reconnect', (attemptNumber) => {
      this._isConnected = this.socket.connected;
    });

    this.socket.on('disconnect', (reason) => {
      this._isConnected = this.socket.connected;

      if (reason === 'io server disconnect') {
        // manually reconnect
        this.socket.connect();
      }
    });

    this.socket.on("message", (message) => {
      console.log(message);
    });
  }

  send(message, user) {
    if (!this.socket) {
      return;
    }

    const data = { message, user };
    this.socket.emit('message', data);
  }

  close() {
    if (!this.socket) {
      return;
    }

    this.socket.close();
  }

  get isConnected() {
    return this._isConnected;
  }
}

export default SocketService;