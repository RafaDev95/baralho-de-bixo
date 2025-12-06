'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useRoomWebSocket } from '../../hooks/websocket/use-room-websocket';
import type { WebSocketEvent } from '../../types/websocket';

interface ChatMessage {
  playerId: number;
  message: string;
  timestamp: string;
}

interface RoomChatProps {
  roomId: number;
}

export function RoomChat({ roomId }: RoomChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendChatMessage } = useRoomWebSocket({
    roomId,
    onChatMessage: (event: WebSocketEvent) => {
      const chatData = event.data as ChatMessage;
      setMessages((prev) => [...prev, chatData]);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendChatMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-64 space-y-2 overflow-y-auto rounded border p-2">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="text-sm">
                <span className="font-semibold">Player {msg.playerId}:</span>{' '}
                <span>{msg.message}</span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            maxLength={500}
          />
          <Button type="submit" disabled={!inputMessage.trim()}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
