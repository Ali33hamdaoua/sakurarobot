import { SupervisionEvent } from './types';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.100.120:8080';
const WS_URL = BACKEND_URL.replace('http', 'ws');

type EventHandler = (event: SupervisionEvent) => void;

class SupervisionWebSocket {
  private ws: WebSocket | null = null;
  private handlers: EventHandler[] = [];
  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;
  private shouldReconnect = true;

  connect() {
    this.shouldReconnect = true;
    this.connectInternal();
  }

  private connectInternal() {
    try {
      this.ws = new WebSocket(`${WS_URL}/ws/supervision`);

      this.ws.onopen = () => {
        console.log('[WS] Connected to supervision');
        this.reconnectDelay = 1000;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as SupervisionEvent;
          this.handlers.forEach(handler => handler(data));
        } catch (e) {
          console.error('[WS] Failed to parse message:', e);
        }
      };

      this.ws.onclose = () => {
        console.log('[WS] Disconnected');
        if (this.shouldReconnect) {
          setTimeout(() => this.connectInternal(), this.reconnectDelay);
          this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[WS] Error:', error);
      };
    } catch (e) {
      console.error('[WS] Connection failed:', e);
      if (this.shouldReconnect) {
        setTimeout(() => this.connectInternal(), this.reconnectDelay);
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
      }
    }
  }

  onEvent(handler: EventHandler) {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter(h => h !== handler);
    };
  }

  disconnect() {
    this.shouldReconnect = false;
    this.ws?.close();
    this.ws = null;
  }
}

export const supervisionWs = new SupervisionWebSocket();
