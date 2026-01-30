import { Booking, Booker } from '../models';
import { roomExists, isOverlap, addBooking, deleteBooking, getBookingsForRoom } from '../data';
import { ApiError, ErrorCodes } from './errors';
import { v4 as uuidv4 } from 'uuid';

export interface CreateBookingInput {
  roomId: string;
  start: Date;
  end: Date;
  bookerName: string;
  bookerEmail: string;
}

export function createBooking(input: CreateBookingInput): Booking {
  const { roomId, start, end, bookerName, bookerEmail } = input;

  const trimmedEmail = bookerEmail.trim();
  
 // business logic validations
  // Check for past bookings
  const now = new Date();
  if (start < now) {
    throw new ApiError(400, ErrorCodes.BOOKING_IN_PAST, 'Varauksen aloitusaika ei voi olla menneisyydessä');
  }

  // Check start is before end
  if (start >= end) {
    throw new ApiError(400, ErrorCodes.INVALID_TIME_RANGE, 'Aloitusajan täytyy olla ennen lopetusaikaa');
  }

  // Check for overlaps
  if (isOverlap(roomId, start, end)) {
    throw new ApiError(409, ErrorCodes.BOOKING_OVERLAP, 'Aikaväli menee päällekkäin olemassa olevan varauksen kanssa');
  }

  // Create booking
  const booker: Booker = {
    uuid: uuidv4(),
    name: bookerName.trim(),
    email: trimmedEmail
  };

  return addBooking(roomId, start, end, booker);
}

export function listBookings(roomId: string): Booking[] {
  if (!roomExists(roomId)) throw new ApiError(404, ErrorCodes.ROOM_NOT_FOUND, 'Huonetta ei löytynyt');
  return getBookingsForRoom(roomId);
}

export function cancelBooking(reservationId: string): void {
  if (!reservationId) throw new ApiError(400, ErrorCodes.MISSING_REQUIRED_FIELD, 'Puuttuva kenttä: reservationId');
  const ok = deleteBooking(reservationId);
  if (!ok) throw new ApiError(404, ErrorCodes.BOOKING_NOT_FOUND, 'Varausta ei löytynyt annetulla tunnisteella');
}
