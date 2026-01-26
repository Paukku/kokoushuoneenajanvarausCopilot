export interface Room {
  id: string;
  name: string;
}

export interface Booker {
  uuid: string;
  name: string;
  email: string;
}

export interface Booking {
  uuid: string;
  id: string;
  roomId: string;
  start: string; // ISO 8601
  end: string; // ISO 8601
  booker: Booker;
  createdAt: string; // ISO 8601
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  timestamp: string;
}
