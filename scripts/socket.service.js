'use strict';

import EventObserver from './event.observer.js';

let instance = null;

/**
 * Singleton class that manages socket.io status changes and events.
 */
class SocketService {
  constructor() {
    if (!instance) {
      this._isConnected = false;
      this.statusObserver = new EventObserver();
      this.messageObserver = new EventObserver();
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
      this.statusObserver.broadcast(this._isConnected);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      this._isConnected = this.socket.connected;
      this.statusObserver.broadcast(this._isConnected);
    });

    this.socket.on('disconnect', (reason) => {
      this._isConnected = this.socket.connected;
      this.statusObserver.broadcast(this._isConnected);

      if (reason === 'io server disconnect') {
        // manually reconnect
        this.socket.connect();
      }
    });

    this.socket.on("message", (message) => {
      this.messageObserver.broadcast(message);
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
    this.statusObserver.subscribe(fn);
  }
  /**
   * Unsubscibe from socket status changes.
   * @param fn callback function to delete
   */
  unsubscribeFromStatusChanges(fn) {
    this.statusObserver.unsubscribe(fn);
  }

  /**
   * Subscribe to incoming messages.
   * @param fn callback function to add
   */
  subscribeToMessage(fn) {
    this.messageObserver.subscribe(fn);
  }
  /**
   * Unsubscibe from incoming messages.
   * @param fn callback function to delete
   */
  unsubscribeFromMessage(fn) {
    this.messageObserver.unsubscribe(fn);
  }

  /**
   * Returns if the socket is connected or not.
   */
  get isConnected() {
    return this._isConnected;
  }
}

export default SocketService;