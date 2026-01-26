import * as bookingService from '../services/bookingService';
import { clearBookings } from '../data';

describe('Booking Service - Timestamps', () => {
  beforeEach(() => {
    clearBookings();
  });

  test('should have ISO 8601 formatted createdAt timestamp', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    const booking = bookingService.createBooking({
      roomId: 'room-1',
      start,
      end,
      bookerName: 'John Doe',
      bookerEmail: 'john@example.com'
    });

    // ISO 8601 format: YYYY-MM-DDTHH:mm:ssZ
    expect(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(booking.createdAt)).toBe(true);
    expect(booking.createdAt.endsWith('Z')).toBe(true);
  });

  test('should have start and end in ISO 8601 format', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    const booking = bookingService.createBooking({
      roomId: 'room-1',
      start,
      end,
      bookerName: 'John Doe',
      bookerEmail: 'john@example.com'
    });

    expect(booking.start).toBe(start);
    expect(booking.end).toBe(end);
    expect(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(booking.start)).toBe(true);
    expect(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(booking.end)).toBe(true);
  });

  test('should accept dates without timezone (Z)', () => {
    // Dates without timezone info should still work if they parse
    // Use future dates
    const now = Date.now();
    const futureDate = new Date(now + 24 * 60 * 60 * 1000);
    const start = futureDate.toISOString().split('Z')[0]; // Remove Z
    const end = new Date(futureDate.getTime() + 60 * 60 * 1000).toISOString().split('Z')[0];

    // This might parse or fail depending on implementation
    // JavaScript's Date() is lenient with timezone info
    const booking = bookingService.createBooking({
      roomId: 'room-1',
      start,
      end,
      bookerName: 'John Doe',
      bookerEmail: 'john@example.com'
    });

    expect(booking).toBeDefined();
  });

  test('should reject invalid date format', () => {
    expect(() => {
      bookingService.createBooking({
        roomId: 'room-1',
        start: '2026-13-32T25:70:00Z', // Invalid date
        end: '2026-01-22T10:30:00Z',
        bookerName: 'John Doe',
        bookerEmail: 'john@example.com'
      });
    }).toThrow();
  });

  test('should reject invalid time format', () => {
    expect(() => {
      bookingService.createBooking({
        roomId: 'room-1',
        start: '2026-01-22T99:99:99Z', // Invalid time
        end: '2026-01-22T10:30:00Z',
        bookerName: 'John Doe',
        bookerEmail: 'john@example.com'
      });
    }).toThrow();
  });
});
