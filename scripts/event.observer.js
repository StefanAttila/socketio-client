'use strict';

/**
 * Event observer class for communication using the observer pattern.
 */
class EventObserver {
  constructor() {
    this.observers = [];
  }

  /**
   * Subscribe to events.
   * @param fn callback function to add
   */
  subscribe(fn) {
    this.observers.push(fn);
  }
  /**
   * Unsubscibe from events.
   * @param fn callback function to delete
   */
  unsubscribe(fn) {
    const idx = this.observers.findIndex(f => f === fn);
    if (idx > -1) {
      this.observers.splice(idx, 1);
    }
  }
  /**
   * Broadcast a data to all observers.
   * @param data the data to broadcast 
   */
  broadcast(data) {
    for(let i = 0; i < this.observers.length; i++) {
      this.observers[i](data);
    }
  }
}

export default EventObserver;