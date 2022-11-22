export interface Session {
  username: string;
}

const sessions = new Map<string, Session>();

export function registerSession(sessionId: string, username: string) {
  sessions.set(sessionId, { username });
}

export function getSession(sessionId: string) {
  return sessions.get(sessionId);
}

export function removeSession(sessionId: string) {
  sessions.delete(sessionId);
}
