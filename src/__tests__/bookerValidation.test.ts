import * as bookingService from '../services/bookingService';
import { clearBookings } from '../data';
import { ApiError, ErrorCodes } from '../services/errors';

describe('Booking Service - Booker Validation', () => {
  beforeEach(() => {
    clearBookings();
  });

  test('should reject booking with name that is only whitespace', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    expect(() => {
      bookingService.createBooking({
        roomId: 'room-1',
        start,
        end,
        bookerName: '   ',
        bookerEmail: 'john@example.com'
      });
    }).toThrow(ApiError);
  });

  test('should allow email with whitespace and trim it', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    const booking = bookingService.createBooking({
      roomId: 'room-1',
      start,
      end,
      bookerName: 'John Doe',
      bookerEmail: '  john@example.com  '
    });

    expect(booking.booker.email).toBe('john@example.com');
  });

  test('should allow same email with different case', () => {
    const now = Date.now();
    const start1 = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end1 = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    const start2 = new Date(now + 26 * 60 * 60 * 1000).toISOString();
    const end2 = new Date(now + 27 * 60 * 60 * 1000).toISOString();

    bookingService.createBooking({
      roomId: 'room-1',
      start: start1,
      end: end1,
      bookerName: 'John Doe',
      bookerEmail: 'john@example.com'
    });

    // Same email with different case - should be allowed (case-insensitive email in practice)
    // but our implementation accepts it as is
    const booking2 = bookingService.createBooking({
      roomId: 'room-2',
      start: start2,
      end: end2,
      bookerName: 'Jane Doe',
      bookerEmail: 'JOHN@EXAMPLE.COM'
    });

    expect(booking2).toBeDefined();
  });

  test('should allow very long name', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now + 25 * 60 * 60 * 1000).toISOString();
    const longName = 'A'.repeat(500);

    const booking = bookingService.createBooking({
      roomId: 'room-1',
      start,
      end,
      bookerName: longName,
      bookerEmail: 'john@example.com'
    });

    expect(booking.booker.name).toBe(longName);
  });

  test('should allow very long valid email', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now + 25 * 60 * 60 * 1000).toISOString();
    // RFC 5321: email max length is 254 characters
    const longEmail = 'a'.repeat(240) + '@example.com';

    const booking = bookingService.createBooking({
      roomId: 'room-1',
      start,
      end,
      bookerName: 'John Doe',
      bookerEmail: longEmail
    });

    expect(booking.booker.email).toBe(longEmail);
  });

  test('should reject invalid email formats', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    const invalidEmails = [
      'notanemail',
      '@example.com',
      'john@',
      'john @example.com',
      'john@ example.com'
    ];

    for (const email of invalidEmails) {
      expect(() => {
        bookingService.createBooking({
          roomId: 'room-1',
          start,
          end,
          bookerName: 'John Doe',
          bookerEmail: email
        });
      }).toThrow(ApiError);
    }
  });
});
