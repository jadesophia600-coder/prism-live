// Real-time Chat Pub-Sub Event Bus Service

class ChatService {
  constructor() {
    this.listeners = new Map();
    this.streamChats = new Map();
  }

  // Subscribe to chat events for a specific stream
  subscribe(streamId, callback) {
    if (!this.listeners.has(streamId)) {
      this.listeners.set(streamId, new Set());
    }
    this.listeners.get(streamId).add(callback);

    // Return unsubscribe function
    return () => {
      if (this.listeners.has(streamId)) {
        this.listeners.get(streamId).delete(callback);
      }
    };
  }

  // Broadcast a new chat message
  sendMessage(streamId, messageObj) {
    const formattedMsg = {
      id: "msg-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      user: messageObj.user || "Viewer",
      badge: messageObj.badge || "Viewer",
      message: messageObj.message,
      color: messageObj.color || "#6366f1",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDeleted: false
    };

    if (this.listeners.has(streamId)) {
      this.listeners.get(streamId).forEach(cb => cb({ type: 'NEW_MESSAGE', payload: formattedMsg }));
    }

    return formattedMsg;
  }

  // Moderator actions
  deleteMessage(streamId, messageId) {
    if (this.listeners.has(streamId)) {
      this.listeners.get(streamId).forEach(cb => cb({ type: 'DELETE_MESSAGE', payload: messageId }));
    }
  }

  timeoutUser(streamId, username, durationMinutes) {
    if (this.listeners.has(streamId)) {
      this.listeners.get(streamId).forEach(cb => cb({
        type: 'SYSTEM_NOTICE',
        payload: `[MOD ACTION] ${username} was timed out for ${durationMinutes} minutes.`
      }));
    }
  }

  banUser(streamId, username) {
    if (this.listeners.has(streamId)) {
      this.listeners.get(streamId).forEach(cb => cb({
        type: 'SYSTEM_NOTICE',
        payload: `[MOD ACTION] ${username} was permanently banned from chat.`
      }));
    }
  }

  // Floating Emoji Reaction Broadcast
  sendReaction(streamId, emoji) {
    if (this.listeners.has(streamId)) {
      this.listeners.get(streamId).forEach(cb => cb({ type: 'FLOATING_REACTION', payload: emoji }));
    }
  }
}

export const chatService = new ChatService();
