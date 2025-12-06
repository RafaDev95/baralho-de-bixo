import { env } from '../config/env';
import type {
  WebSocketMessage,
  WebSocketEvent,
  JoinRoomMessage,
  ReadyStatusMessage,
  ChatMessage,
  LeaveRoomMessage,
  WebSocketEventType,
} from '../types/websocket';

type EventHandler = (event: WebSocketEvent) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventHandlers: Map<WebSocketEventType, Set<EventHandler>> = new Map();
  private isConnecting = false;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        // Wait for existing connection attempt
        const checkInterval = setInterval(() => {
          if (!this.isConnecting) {
            clearInterval(checkInterval);
            if (this.ws?.readyState === WebSocket.OPEN) {
              resolve();
            } else {
              reject(new Error('Connection failed'));
            }
          }
        }, 100);
        return;
      }

      this.isConnecting = true;
      const wsUrl = env.NEXT_PUBLIC_WS_URL;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        resolve();
      };

      this.ws.onerror = (error) => {
        this.isConnecting = false;
        reject(error);
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        this.handleReconnect();
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketEvent = JSON.parse(event.data);
          this.handleEvent(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  private handleEvent(event: WebSocketEvent): void {
    const handlers = this.eventHandlers.get(event.type);
    if (handlers) {
      handlers.forEach((handler) => handler(event));
    }

    // Also call 'all' handlers if they exist
    const allHandlers = this.eventHandlers.get('*' as WebSocketEventType);
    if (allHandlers) {
      allHandlers.forEach((handler) => handler(event));
    }
  }

  send(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  joinRoom(roomId: number, playerId: number): void {
    const message: JoinRoomMessage = {
      type: 'join_room',
      roomId,
      playerId,
    };
    this.send(message);
  }

  updateReadyStatus(isReady: boolean): void {
    const message: ReadyStatusMessage = {
      type: 'ready_status',
      isReady,
    };
    this.send(message);
  }

  sendChatMessage(message: string): void {
    const chatMessage: ChatMessage = {
      type: 'chat_message',
      message,
    };
    this.send(chatMessage);
  }

  leaveRoom(): void {
    const message: LeaveRoomMessage = {
      type: 'leave_room',
    };
    this.send(message);
  }

  on(eventType: WebSocketEventType, handler: EventHandler): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(eventType);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }

  off(eventType: WebSocketEventType, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.eventHandlers.clear();
    this.reconnectAttempts = 0;
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();
