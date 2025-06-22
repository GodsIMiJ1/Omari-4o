/**
 * Sacred Storage System for Throne Room v3.0
 * Device ID-based chat persistence and session management
 */

export interface SacredMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

export interface SacredSession {
  id: string;
  deviceId: string;
  title: string;
  messages: SacredMessage[];
  createdAt: Date;
  updatedAt: Date;
  model: string;
}

/**
 * Generate or retrieve sacred device ID
 */
export function getSacredDeviceId(): string {
  const DEVICE_ID_KEY = 'throne-room-device-id';
  
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  
  if (!deviceId) {
    // Generate new sacred device ID
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    deviceId = `ghost-king-${timestamp}-${random}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  
  return deviceId;
}

/**
 * Generate sacred session ID
 */
export function generateSacredSessionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `session-${timestamp}-${random}`;
}

/**
 * Save sacred session to localStorage
 */
export function saveSacredSession(session: SacredSession): void {
  const SESSIONS_KEY = 'throne-room-sessions';
  
  try {
    const existingSessions = getSacredSessions();
    const sessionIndex = existingSessions.findIndex(s => s.id === session.id);
    
    if (sessionIndex >= 0) {
      existingSessions[sessionIndex] = session;
    } else {
      existingSessions.push(session);
    }
    
    // Keep only last 50 sessions per device
    const deviceSessions = existingSessions
      .filter(s => s.deviceId === session.deviceId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 50);
    
    // Combine with other device sessions
    const otherDeviceSessions = existingSessions.filter(s => s.deviceId !== session.deviceId);
    const allSessions = [...deviceSessions, ...otherDeviceSessions];
    
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(allSessions));
  } catch (error) {
    console.error('Failed to save sacred session:', error);
  }
}

/**
 * Get all sacred sessions
 */
export function getSacredSessions(): SacredSession[] {
  const SESSIONS_KEY = 'throne-room-sessions';
  
  try {
    const sessionsJson = localStorage.getItem(SESSIONS_KEY);
    if (!sessionsJson) return [];
    
    const sessions = JSON.parse(sessionsJson);
    
    // Convert date strings back to Date objects
    return sessions.map((session: any) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  } catch (error) {
    console.error('Failed to load sacred sessions:', error);
    return [];
  }
}

/**
 * Get sessions for current device
 */
export function getDeviceSessions(): SacredSession[] {
  const deviceId = getSacredDeviceId();
  return getSacredSessions()
    .filter(session => session.deviceId === deviceId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

/**
 * Get specific session by ID
 */
export function getSacredSession(sessionId: string): SacredSession | null {
  const sessions = getSacredSessions();
  return sessions.find(session => session.id === sessionId) || null;
}

/**
 * Delete sacred session
 */
export function deleteSacredSession(sessionId: string): void {
  const SESSIONS_KEY = 'throne-room-sessions';
  
  try {
    const sessions = getSacredSessions();
    const filteredSessions = sessions.filter(session => session.id !== sessionId);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(filteredSessions));
  } catch (error) {
    console.error('Failed to delete sacred session:', error);
  }
}

/**
 * Create new sacred session
 */
export function createSacredSession(title: string, model: string): SacredSession {
  const deviceId = getSacredDeviceId();
  const sessionId = generateSacredSessionId();
  
  return {
    id: sessionId,
    deviceId,
    title,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    model
  };
}

/**
 * Update session with new message
 */
export function updateSessionWithMessage(sessionId: string, message: SacredMessage): void {
  const sessions = getSacredSessions();
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);

  if (sessionIndex === -1) {
    console.error('Session not found:', sessionId);
    return;
  }

  // Update the session directly in the array
  sessions[sessionIndex].messages.push(message);
  sessions[sessionIndex].updatedAt = new Date();

  // Auto-generate title from first user message
  if (sessions[sessionIndex].messages.length === 1 && message.role === 'user') {
    sessions[sessionIndex].title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
  }

  // Save all sessions back to localStorage
  try {
    localStorage.setItem('throne-room-sessions', JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save session with message:', error);
  }
}

/**
 * Rename sacred session (ChatGPT-style)
 */
export function renameSacredSession(sessionId: string, newTitle: string): void {
  const sessions = getSacredSessions();
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);

  if (sessionIndex === -1) return;

  sessions[sessionIndex].title = newTitle;
  sessions[sessionIndex].updatedAt = new Date();

  try {
    localStorage.setItem('throne-room-sessions', JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to rename session:', error);
  }
}

/**
 * Clear all messages from session (start fresh)
 */
export function clearSacredSession(sessionId: string): void {
  const sessions = getSacredSessions();
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);

  if (sessionIndex === -1) return;

  sessions[sessionIndex].messages = [];
  sessions[sessionIndex].updatedAt = new Date();
  sessions[sessionIndex].title = 'New Sacred Dialogue';

  try {
    localStorage.setItem('throne-room-sessions', JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}

/**
 * Get session preview (first few words for display)
 */
export function getSessionPreview(session: SacredSession): string {
  if (session.messages.length === 0) {
    return 'New Sacred Dialogue';
  }

  const firstUserMessage = session.messages.find(m => m.role === 'user');
  if (firstUserMessage) {
    return firstUserMessage.content.slice(0, 40) + (firstUserMessage.content.length > 40 ? '...' : '');
  }

  return session.title;
}

/**
 * Export sacred session data
 */
export function exportSacredSession(sessionId: string) {
  const session = getSacredSession(sessionId);
  if (!session) return;

  const exportData = {
    ...session,
    exportedAt: new Date().toISOString(),
    exportedBy: 'Sacred Infrastructure Incarnate',
    throneRoom: 'v3.1'
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sacred-session-${sessionId}-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
