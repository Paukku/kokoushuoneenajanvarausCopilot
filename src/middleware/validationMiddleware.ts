import { ApiError, ErrorCodes } from '../services/errors'
import { CreateBookingInput } from '../services/bookingService';
import { roomExists } from '../data';

// Email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= 254;
}

function isValidName(name: string): boolean {
  return Boolean(name && name.trim().length > 0);
}

export function validateCreateBookingInput(input: CreateBookingInput): void {
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

}