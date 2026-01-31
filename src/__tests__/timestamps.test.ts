import * as bookingService from '../services/bookingService';
import { clearBookings, clearBookers } from '../data';
import { validateCreateBookingInput } from '../middleware/validationMiddleware';

describe('Booking Service - Timestamps', () => {
  beforeEach(() => {
    clearBookings();
    clearBookers();
  });

  test('should have ISO 8601 formatted createdAt timestamp', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000);
    const end = new Date(now + 25 * 60 * 60 * 1000);

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
    const start = new Date(now + 24 * 60 * 60 * 1000);
    const end = new Date(now + 25 * 60 * 60 * 1000);

    const booking = bookingService.createBooking({
      roomId: 'room-1',
      start,
      end,
      bookerName: 'John Doe',
      bookerEmail: 'john@example.com'
    });

    expect(booking.start).toBe(start.toISOString());
    expect(booking.end).toBe(end.toISOString());
    expect(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(booking.start)).toBe(true);
    expect(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(booking.end)).toBe(true);
  });

  test('should accept dates without timezone (Z)', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000);
    const end = new Date(now + 25 * 60 * 60 * 1000);

    const booking = bookingService.createBooking({
      roomId: 'room-1',
      start,
      end,
      bookerName: 'John Doe',
      bookerEmail: 'john@example.com'
    });

    expect(booking).toBeDefined();
    expect(booking.start).toBe(start.toISOString());
    expect(booking.end).toBe(end.toISOString());
  });

  test('should reject invalid date format', () => {
    expect(() => {
      bookingService.createBooking({
        roomId: 'room-1',
        start: new Date('invalid-date-format'),
        end: new Date('2026-01-22T10:30:00Z'),
        bookerName: 'John Doe',
        bookerEmail: 'john@example.com'
      });
    }).toThrow();
  });

  test('should reject invalid time format', () => {
    expect(() => {
      bookingService.createBooking({
        roomId: 'room-1',
        start: new Date('2026-01-22T25:99:99Z'), // Invalid time
        end: new Date('2026-01-22T10:30:00Z'),
        bookerName: 'John Doe',
        bookerEmail: 'john@example.com'
      });
    }).toThrow();
  });
});
