export interface CreateRoomResponse {
  roomId: string;
}
export interface BaseResponse<T> {
  isError: boolean;
  response: T;
  message?: string;
}
