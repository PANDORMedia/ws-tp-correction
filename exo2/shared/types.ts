export type ClientMessage =
  | { type: 'set-nick';  nick: string }
  | { type: 'chat';  text: string, room: string }
  | { type: 'typing';  room: string}
  | { type: 'join-room'; room: string }
  | { type: 'leave-room'; room: string }

export type ServerMessage =
  | { type: 'chat'; nick: string; text: string; room: string; ts: number }
  | { type: 'system';    text: string }
  | { type: 'user-list'; users: string[]; }
  | { type: 'typing';    nick: string; }
  | { type: 'join-room'; room: string }
  | { type: 'leave-room'; room: string }