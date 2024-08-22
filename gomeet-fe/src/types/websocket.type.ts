export enum EWSType {
  CONNECTED = "CONNECTED",
  CONNECT_FAILED = "CONNECT_FAILED",
  NEW_USER = "NEW_USER",
  EXISTING_USER_LIST = "EXISTING_USER_LIST",
  CHAT = "CHAT",
  LEAVE = "LEAVE",

  RTC_OFFER = "RTC_OFFER",
  RTC_ICE_CANDIDATE = "RTC_ICE_CANDIDATE",
  RTC_ANSWER = "RTC_ANSWER",
}
export interface WSReceive<T> {
  from: string;
  type: EWSType;
  content: T;
}
export interface WSSend<T> {
  type: EWSType;
  to?: string;
  content: T;
}
