import { Booking, Booker } from '../models';
import { roomExists, isOverlap, addBooking, deleteBooking, getBookingsForRoom } from '../data';
import { ApiError, ErrorCodes } from './errors';
import { v4 as uuidv4 } from 'uuid';

// Email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= 254;
}

function isValidName(name: string): boolean {
  return Boolean(name && name.trim().length > 0);
}

export interface CreateBookingInput {
  roomId: string;
  start: string;
  end: string;
  bookerName: string;
  bookerEmail: string;
}

export function createBooking(input: CreateBookingInput): Booking {
  const { roomId, start, end, bookerName, bookerEmail } = input;

  // Validate required fields
  if (!roomId) throw new ApiError(400, ErrorCodes.MISSING_REQUIRED_FIELD, 'Puuttuva kenttä: roomId');
  if (!start) throw new ApiError(400, ErrorCodes.MISSING_REQUIRED_FIELD, 'Puuttuva kenttä: start');
  if (!end) throw new ApiError(400, ErrorCodes.MISSING_REQUIRED_FIELD, 'Puuttuva kenttä: end');
  if (!bookerName) throw new ApiError(400, ErrorCodes.MISSING_REQUIRED_FIELD, 'Puuttuva kenttä: bookerName');
  if (!bookerEmail) throw new ApiError(400, ErrorCodes.MISSING_REQUIRED_FIELD, 'Puuttuva kenttä: bookerEmail');

  // Validate name (not just whitespace)
  if (!isValidName(bookerName)) {
    throw new ApiError(400, ErrorCodes.INVALID_NAME, 'Varaajan nimi ei voi olla tyhjä tai pelkkää välilyöntejä');
  }

  // Validate email (trim first)
  const trimmedEmail = bookerEmail.trim();
  if (!isValidEmail(trimmedEmail)) {
    throw new ApiError(400, ErrorCodes.INVALID_EMAIL, 'Virheellinen sähköpostiosoite');
  }

  // Validate room exists
  if (!roomExists(roomId)) throw new ApiError(404, ErrorCodes.ROOM_NOT_FOUND, 'Huonetta ei löytynyt');

  // Parse dates
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new ApiError(400, ErrorCodes.INVALID_TIME_RANGE, 'Virheellinen päivämäärämuoto. Käytä ISO 8601 -muotoa (YYYY-MM-DDTHH:mm:ssZ).');
  }

  // Check for past bookings
  const now = new Date();
  if (startDate < now) {
    throw new ApiError(400, ErrorCodes.BOOKING_IN_PAST, 'Varauksen aloitusaika ei voi olla menneisyydessä');
  }

  // Check start is before end
  if (startDate >= endDate) {
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
