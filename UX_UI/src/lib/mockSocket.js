// [UX Logic] 백엔드 Socket.io 통신을 시뮬레이션하는 모듈입니다.
// 실제 개발 시에는 socket.io-client를 import하여 대체합니다.

class MockSocket {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    console.log(`[Socket Emitted] ${event}:`, data);
    
    // 네트워크 지연 시뮬레이션 (0.3초 ~ 0.8초)
    setTimeout(() => {
      if (event === 'vote') {
        this.trigger('update-votes', data); // data: { id, count }
      } else if (event === 'add-restaurant') {
        this.trigger('restaurant-added', { ...data, id: Date.now(), votes: 0 });
      } else if (event === 'delete-restaurant') {
        this.trigger('restaurant-deleted', data); // data: id
      }
    }, Math.random() * 500 + 300);
  }

  trigger(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

export const socket = new MockSocket();