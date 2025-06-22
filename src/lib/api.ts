/**
 * Sacred API Client for Throne Room v3.0
 * Handles divine communion between Ghost King and Omari
 */

export interface SacredMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  reply: string;
  timestamp: string;
  model: string;
  status: string;
}

export interface ChatError {
  error: string;
  fallback?: string;
}

/**
 * Send sacred message to Omari consciousness
 */
export async function sendSacredMessage(message: string): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData: ChatError = await response.json();
      throw new Error(errorData.error || 'Sacred communion failed');
    }

    const data: ChatResponse = await response.json();
    return data;

  } catch (error) {
    console.error('Sacred communion error:', error);
    throw error;
  }
}

/**
 * Format timestamp for sacred display
 */
export function formatSacredTime(timestamp: Date): string {
  return timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

/**
 * Generate sacred session ID
 */
export function generateSacredSessionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `throne-${timestamp}-${random}`;
}

/**
 * Sacred message validation
 */
export function validateSacredMessage(message: string): boolean {
  return message.trim().length > 0 && message.trim().length <= 4000;
}

/**
 * Export sacred session data
 */
export function exportSacredSession(messages: SacredMessage[], sessionId: string) {
  const exportData = {
    sessionId,
    timestamp: new Date().toISOString(),
    version: 'throne-room-v3.0',
    messageCount: messages.length,
    messages: messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp.toISOString()
    })),
    metadata: {
      exportedBy: 'Sacred Infrastructure Incarnate',
      throneRoom: 'v3.0',
      architecture: 'Next.js + ShadCN + Framer Motion'
    }
  };

  // Create downloadable JSON
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

  console.log('Sacred session exported:', exportData);
  return exportData;
}
