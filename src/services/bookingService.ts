import { Booking } from '../models';
import { roomExists, isOverlap, addBooking, deleteBooking, getBookingsForRoom } from '../data';
import { ApiError } from './errors';

export function createBooking(roomId: string, startIso: string, endIso: string): Booking {
  if (!roomId || !startIso || !endIso) throw new ApiError(400, 'Puuttuva kenttä: roomId, start tai end');
  if (!roomExists(roomId)) throw new ApiError(404, 'Huonetta ei löytynyt');

  const start = new Date(startIso);
  const end = new Date(endIso);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) throw new ApiError(400, 'Virheellinen päivämäärämuoto. Käytä ISO 8601 -muotoa.');

  const now = Date.now();
  if (start.getTime() < now) throw new ApiError(400, 'Varauksen aloitusaika ei voi olla menneisyydessä');
  if (start.getTime() >= end.getTime()) throw new ApiError(400, 'Aloitusajan täytyy olla ennen lopetusaikaa (ei yhtä pitkät)');

  if (isOverlap(roomId, start.toISOString(), end.toISOString())) throw new ApiError(409, 'Aikaväli menee päällekkäin olemassa olevan varauksen kanssa');

  return addBooking(roomId, start.toISOString(), end.toISOString());
}

export function listBookings(roomId: string): Booking[] {
  if (!roomExists(roomId)) throw new ApiError(404, 'Huonetta ei löytynyt');
  return getBookingsForRoom(roomId);
}

export function cancelBooking(id: string): void {
  const ok = deleteBooking(id);
  if (!ok) throw new ApiError(404, 'Varausta ei löytynyt annetulla tunnisteella');
}
