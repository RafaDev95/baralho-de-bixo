export type WebSocketMessageType =
  | 'join_room'
  | 'ready_status'
  | 'chat_message'
  | 'leave_room';

export type WebSocketEventType =
  | 'connected'
  | 'player_joined'
  | 'player_left'
  | 'ready_status_changed'
  | 'game_started'
  | 'game_event'
  | 'chat_message'
  | 'error';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  roomId?: number;
  playerId?: number;
  isReady?: boolean;
  message?: string;
}

export interface WebSocketEvent {
  type: WebSocketEventType;
  data: Record<string, unknown>;
  timestamp: string;
}

export interface JoinRoomMessage extends WebSocketMessage {
  type: 'join_room';
  roomId: number;
  playerId: number;
}

export interface ReadyStatusMessage extends WebSocketMessage {
  type: 'ready_status';
  isReady: boolean;
}

export interface ChatMessage extends WebSocketMessage {
  type: 'chat_message';
  message: string;
}

export interface LeaveRoomMessage extends WebSocketMessage {
  type: 'leave_room';
}

