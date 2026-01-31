import { Room, Booking, Booker } from './models';
import { v4 as uuidv4 } from 'uuid';

// Predefined rooms (5 rooms)
export const ROOMS: Room[] = [
  { id: 'room-1', name: 'Neuvotteluhuone 1' },
  { id: 'room-2', name: 'Neuvotteluhuone 2' },
  { id: 'room-3', name: 'Neuvotteluhuone 3' },
  { id: 'room-4', name: 'Neuvotteluhuone 4' },
  { id: 'room-5', name: 'Neuvotteluhuone 5' }
];

export const bookings: Booking[] = [];

// Track bookers by email to prevent duplicate emails with different names
export const bookers: Map<string, Booker> = new Map();

// Generate a 6-character reservation ID
function generateReservationId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Ensure uniqueness of reservation IDs
function generateUniqueReservationId(): string {
  let reservationId: string;
  do {
    reservationId = generateReservationId();
  } while (bookings.some(b => b.reservationId === reservationId));
  return reservationId;
}

export function roomExists(roomId: string): boolean {
  return ROOMS.some(r => r.id === roomId);
}

export function getBookingsForRoom(roomId: string): Booking[] {
  return bookings
    .filter(b => b.roomId === roomId)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export function isOverlap(roomId: string, startIso: Date, endIso: Date): boolean {
  const start = startIso.getTime();
  const end = endIso.getTime();
  for (const b of bookings) {
    if (b.roomId !== roomId) continue;
    const s = new Date(b.start).getTime();
    const e = new Date(b.end).getTime();
    // overlap if intervals intersect at all (strict: start < e && end > s)
    if (start < e && end > s) return true;
  }
  return false;
}

export function addBooking(roomId: string, startIso: Date, endIso: Date, booker: Booker): Booking {
  const b: Booking = {
    uuid: uuidv4(),
    reservationId: generateUniqueReservationId(),
    roomId,
    start: startIso.toISOString(),
    end: endIso.toISOString(),
    booker,
    createdAt: new Date().toISOString()
  };
  bookings.push(b);
  return b;
}

export function deleteBooking(reservationId: string): boolean {
  const idx = bookings.findIndex(b => b.reservationId === reservationId);
  if (idx === -1) return false;
  bookings.splice(idx, 1);
  return true;
}

// Clear all bookings (for testing)
export function clearBookings(): void {
  bookings.length = 0;
}

// Get booker by email
export function getBookerByEmail(email: string): Booker | undefined {
  return bookers.get(email.toLowerCase());
}

// Add or get existing booker - returns booker or null if email exists with different name
export function addBookerIfNotExists(email: string, name: string): Booker | null {
  const lowerEmail = email.toLowerCase();
  const existingBooker = bookers.get(lowerEmail);
  
  if (existingBooker) {
    // Email exists - check if name matches
    if (existingBooker.name === name) {
      // Same name, return existing booker
      return existingBooker;
    }
    // Different name with same email - return null to signal error
    return null;
  }
  
  // Email doesn't exist - create new booker
  const newBooker: Booker = {
    uuid: uuidv4(),
    name,
    email
  };
  bookers.set(lowerEmail, newBooker);
  return newBooker;
}

// Clear bookers (for testing)
export function clearBookers(): void {
  bookers.clear();
}
