export interface Room {
  id: string;
  name: string;
}

export interface Booking {
  id: string;
  roomId: string;
  start: string; // ISO 8601
  end: string; // ISO 8601
  createdAt: string; // ISO 8601
}
