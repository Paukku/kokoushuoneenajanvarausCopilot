import * as bookingService from '../services/bookingService';
import { clearBookings, clearBookers, ROOMS } from '../data';
import { ApiError, ErrorCodes } from '../services/errors';

describe('Booking Service - Basic Functionality', () => {
  beforeEach(() => {
    clearBookings();
    clearBookers();
  });

  describe('Booking Creation', () => {
    test('should create a booking with valid input', () => {
      const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const end = new Date(Date.now() + 25 * 60 * 60 * 1000);

      const booking = bookingService.createBooking({
        roomId: 'room-1',
        start,
        end,
        bookerName: 'John Doe',
        bookerEmail: 'john@example.com'
      });

      expect(booking).toBeDefined();
      expect(booking.roomId).toBe('room-1');
      expect(booking.start).toBe(start.toISOString());
      expect(booking.end).toBe(end.toISOString());
      expect(booking.booker.name).toBe('John Doe');
      expect(booking.booker.email).toBe('john@example.com');
    });

    test('should return a reservation ID that is 6 characters long', () => {
      const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const end = new Date(Date.now() + 25 * 60 * 60 * 1000);

      const booking = bookingService.createBooking({
        roomId: 'room-1',
        start,
        end,
        bookerName: 'John Doe',
        bookerEmail: 'john@example.com'
      });

      expect(booking.reservationId).toHaveLength(6);
      expect(/^[A-Z0-9]{6}$/.test(booking.reservationId)).toBe(true);
    });

    test('should store the booking in the system', () => {
      const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const end = new Date(Date.now() + 25 * 60 * 60 * 1000);

      const booking = bookingService.createBooking({
        roomId: 'room-1',
        start,
        end,
        bookerName: 'Jane Smith',
        bookerEmail: 'jane@example.com'
      });

      const bookings = bookingService.listBookings('room-1');
      expect(bookings).toHaveLength(1);
      expect(bookings[0].reservationId).toBe(booking.reservationId);
    });
  });

  describe('Booking Cancellation', () => {
    test('should cancel a booking with valid reservation ID', () => {
      const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const end = new Date(Date.now() + 25 * 60 * 60 * 1000);

      const booking = bookingService.createBooking({
        roomId: 'room-1',
        start,
        end,
        bookerName: 'John Doe',
        bookerEmail: 'john@example.com'
      });

      expect(bookingService.listBookings('room-1')).toHaveLength(1);

      bookingService.cancelBooking(booking.reservationId);

      expect(bookingService.listBookings('room-1')).toHaveLength(0);
    });

    test('should throw error when canceling non-existent booking', () => {
      expect(() => {
        bookingService.cancelBooking('NONEXISTENT');
      }).toThrow(ApiError);
    });
  });

  describe('View Bookings', () => {
    test('should list bookings in correct time order', () => {
      const now = Date.now();
      const start1 = new Date(now + 24 * 60 * 60 * 1000);
      const end1 = new Date(now + 25 * 60 * 60 * 1000);

      const start2 = new Date(now + 26 * 60 * 60 * 1000);
      const end2 = new Date(now + 27 * 60 * 60 * 1000);

      const start3 = new Date(now + 22 * 60 * 60 * 1000);
      const end3 = new Date(now + 23 * 60 * 60 * 1000);

      bookingService.createBooking({
        roomId: 'room-1',
        start: start1,
        end: end1,
        bookerName: 'John',
        bookerEmail: 'john@example.com'
      });

      bookingService.createBooking({
        roomId: 'room-1',
        start: start2,
        end: end2,
        bookerName: 'Jane',
        bookerEmail: 'jane@example.com'
      });

      bookingService.createBooking({
        roomId: 'room-1',
        start: start3,
        end: end3,
        bookerName: 'Bob',
        bookerEmail: 'bob@example.com'
      });

      const bookings = bookingService.listBookings('room-1');
      expect(bookings).toHaveLength(3);
      expect(bookings[0].start).toBe(start3.toISOString());
      expect(bookings[1].start).toBe(start1.toISOString());
      expect(bookings[2].start).toBe(start2.toISOString());
    });

    test('should return empty list for room without bookings', () => {
      const bookings = bookingService.listBookings('room-5');
      expect(bookings).toHaveLength(0);
    });
  });
});
