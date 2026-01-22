import { ROOMS } from '../data';
import { listBookings as _listBookings } from './bookingService';

export function getRooms() {
  return ROOMS;
}

export function getBookings(roomId: string) {
  return _listBookings(roomId);
}
