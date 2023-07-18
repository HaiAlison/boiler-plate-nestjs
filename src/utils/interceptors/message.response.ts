export interface MessageResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  duration: string;
}
