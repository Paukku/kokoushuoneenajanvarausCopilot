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

// Generate a 6-character booking ID
function generateBookingId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Ensure uniqueness of booking IDs
function generateUniqueBookingId(): string {
  let id: string;
  do {
    id = generateBookingId();
  } while (bookings.some(b => b.id === id));
  return id;
}

export function roomExists(roomId: string): boolean {
  return ROOMS.some(r => r.id === roomId);
}

export function getBookingsForRoom(roomId: string): Booking[] {
  return bookings
    .filter(b => b.roomId === roomId)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export function isOverlap(roomId: string, startIso: string, endIso: string): boolean {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  for (const b of bookings) {
    if (b.roomId !== roomId) continue;
    const s = new Date(b.start).getTime();
    const e = new Date(b.end).getTime();
    // overlap if intervals intersect at all (strict: start < e && end > s)
    if (start < e && end > s) return true;
  }
  return false;
}

export function addBooking(roomId: string, startIso: string, endIso: string, booker: Booker): Booking {
  const b: Booking = {
    uuid: uuidv4(),
    id: generateUniqueBookingId(),
    roomId,
    start: startIso,
    end: endIso,
    booker,
    createdAt: new Date().toISOString()
  };
  bookings.push(b);
  return b;
}

export function deleteBooking(id: string): boolean {
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return false;
  bookings.splice(idx, 1);
  return true;
}

// Clear all bookings (for testing)
export function clearBookings(): void {
  bookings.length = 0;
}
