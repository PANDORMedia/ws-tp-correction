export type ClientMessage =
  | { type: 'set-nick';  nick: string }
  | { type: 'chat';  text: string }
  | { type: 'typing';}

export type ServerMessage =
  | { type: 'chat';      nick: string; text: string; ts: number }
  | { type: 'system';    text: string }
  | { type: 'user-list'; users: string[] }
  | { type: 'typing';    nick: string }