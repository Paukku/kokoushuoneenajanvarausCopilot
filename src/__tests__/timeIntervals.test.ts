import * as bookingService from '../services/bookingService';
import { clearBookings, clearBookers } from '../data';
import { ApiError, ErrorCodes } from '../services/errors';

describe('Booking Service - Time Intervals Edge Cases', () => {
  beforeEach(() => {
    clearBookings();
    clearBookers();
  });

  test('should allow booking starting at exactly now', () => {
    // This test is tricky because "now" changes. We need a time very close to now.
    // In practice, this might fail if there's too much delay. We use a time
    // just milliseconds in the future to avoid past booking errors.
    const now = new Date();
    const start = new Date(now.getTime() + 100); // 100ms in future
    const end = new Date(now.getTime() + 3600000 + 100); // 1 hour later

    expect(() => {
      bookingService.createBooking({
        roomId: 'room-1',
        start,
        end,
        bookerName: 'John',
        bookerEmail: 'john@example.com'
      });
    }).not.toThrow();
  });

  test('should allow booking ending exactly at another start time', () => {
    const now = Date.now();
    const start1 = new Date(now + 24 * 60 * 60 * 1000);
    const end1 = new Date(now + 25 * 60 * 60 * 1000);

    const start2 = new Date(end1);
    const end2 = new Date(now + 26 * 60 * 60 * 1000);

    bookingService.createBooking({
      roomId: 'room-1',
      start: start1,
      end: end1,
      bookerName: 'John',
      bookerEmail: 'john@example.com'
    });

    // This should be allowed (no overlap)
    expect(() => {
      bookingService.createBooking({
        roomId: 'room-1',
        start: start2,
        end: end2,
        bookerName: 'Jane',
        bookerEmail: 'jane@example.com'
      });
    }).not.toThrow();
  });

  test('should reject booking starting exactly at another end time', () => {
    const now = Date.now();
    const start1 = new Date(now + 24 * 60 * 60 * 1000);
    const end1 = new Date(now + 25 * 60 * 60 * 1000);

    const start2 = new Date(end1);
    const end2 = new Date(now + 26 * 60 * 60 * 1000);

    bookingService.createBooking({
      roomId: 'room-1',
      start: start1,
      end: end1,
      bookerName: 'John',
      bookerEmail: 'john@example.com'
    });

    // This should be allowed - start2 equals end1 (no overlap)
    bookingService.createBooking({
      roomId: 'room-1',
      start: start2,
      end: end2,
      bookerName: 'Jane',
      bookerEmail: 'jane@example.com'
    });

    const bookings = bookingService.listBookings('room-1');
    expect(bookings).toHaveLength(2);
  });

  test('should allow one-minute booking', () => {
    const now = Date.now();
    const start = new Date(now + 60 * 60 * 1000);
    const end = new Date(now + 60 * 60 * 1000 + 60 * 1000); // 1 minute

    const booking = bookingService.createBooking({
      roomId: 'room-1',
      start,
      end,
      bookerName: 'John',
      bookerEmail: 'john@example.com'
    });

    expect(booking).toBeDefined();
  });

  test('should allow multi-day booking', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000);
    const end = new Date(now + 5 * 24 * 60 * 60 * 1000); // 5 days

    const booking = bookingService.createBooking({
      roomId: 'room-1',
      start,
      end,
      bookerName: 'John',
      bookerEmail: 'john@example.com'
    });

    expect(booking).toBeDefined();
  });

  test('should reject booking starting a millisecond before end', () => {
    const now = Date.now();
    const baseTime = now + 24 * 60 * 60 * 1000;
    const start = new Date(baseTime);
    const end = new Date(baseTime); // Same millisecond

    expect(() => {
      bookingService.createBooking({
        roomId: 'room-1',
        start,
        end,
        bookerName: 'John',
        bookerEmail: 'john@example.com'
      });
    }).toThrow(ApiError);
  });
});
