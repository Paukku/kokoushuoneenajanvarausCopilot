import * as bookingService from '../services/bookingService';
import { clearBookings } from '../data';
import { ApiError, ErrorCodes } from '../services/errors';

describe('Booking Service - Overlap Detection', () => {
  beforeEach(() => {
    clearBookings();
  });

  test('should detect partial overlap at start', () => {
    const now = Date.now();
    const start1 = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end1 = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    bookingService.createBooking({
      roomId: 'room-1',
      start: start1,
      end: end1,
      bookerName: 'John',
      bookerEmail: 'john@example.com'
    });

    // Overlap at start: starts 30min before first, ends 30min after first start
    const start2 = new Date(now + 24 * 60 * 60 * 1000 - 30 * 60 * 1000).toISOString();
    const end2 = new Date(now + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString();

    expect(() => {
      bookingService.createBooking({
        roomId: 'room-1',
        start: start2,
        end: end2,
        bookerName: 'Jane',
        bookerEmail: 'jane@example.com'
      });
    }).toThrow(ApiError);
  });

  test('should detect partial overlap at end', () => {
    const now = Date.now();
    const start1 = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end1 = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    bookingService.createBooking({
      roomId: 'room-1',
      start: start1,
      end: end1,
      bookerName: 'John',
      bookerEmail: 'john@example.com'
    });

    // Overlap at end: starts 30min before first ends, ends 30min after first ends
    const start2 = new Date(now + 25 * 60 * 60 * 1000 - 30 * 60 * 1000).toISOString();
    const end2 = new Date(now + 25 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString();

    expect(() => {
      bookingService.createBooking({
        roomId: 'room-1',
        start: start2,
        end: end2,
        bookerName: 'Jane',
        bookerEmail: 'jane@example.com'
      });
    }).toThrow(ApiError);
  });

  test('should detect full overlap', () => {
    const now = Date.now();
    const start1 = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end1 = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    bookingService.createBooking({
      roomId: 'room-1',
      start: start1,
      end: end1,
      bookerName: 'John',
      bookerEmail: 'john@example.com'
    });

    // Completely overlapping
    const start2 = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end2 = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    expect(() => {
      bookingService.createBooking({
        roomId: 'room-1',
        start: start2,
        end: end2,
        bookerName: 'Jane',
        bookerEmail: 'jane@example.com'
      });
    }).toThrow(ApiError);
  });

  test('should detect nested booking (contained within)', () => {
    const now = Date.now();
    const start1 = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end1 = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    bookingService.createBooking({
      roomId: 'room-1',
      start: start1,
      end: end1,
      bookerName: 'John',
      bookerEmail: 'john@example.com'
    });

    // Nested: starts 15min after first, ends 15min before first ends
    const start2 = new Date(new Date(start1).getTime() + 15 * 60 * 1000).toISOString();
    const end2 = new Date(new Date(end1).getTime() - 15 * 60 * 1000).toISOString();

    expect(() => {
      bookingService.createBooking({
        roomId: 'room-1',
        start: start2,
        end: end2,
        bookerName: 'Jane',
        bookerEmail: 'jane@example.com'
      });
    }).toThrow(ApiError);
  });

  test('should allow same time in different rooms', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    bookingService.createBooking({
      roomId: 'room-1',
      start,
      end,
      bookerName: 'John',
      bookerEmail: 'john@example.com'
    });

    // Same time but different room - should be allowed
    expect(() => {
      bookingService.createBooking({
        roomId: 'room-2',
        start,
        end,
        bookerName: 'Jane',
        bookerEmail: 'jane@example.com'
      });
    }).not.toThrow();
  });

  test('should use room-specific overlap detection', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    bookingService.createBooking({
      roomId: 'room-1',
      start,
      end,
      bookerName: 'John',
      bookerEmail: 'john@example.com'
    });

    // Multiple bookings in different rooms at same time
    bookingService.createBooking({
      roomId: 'room-2',
      start,
      end,
      bookerName: 'Jane',
      bookerEmail: 'jane@example.com'
    });

    bookingService.createBooking({
      roomId: 'room-3',
      start,
      end,
      bookerName: 'Bob',
      bookerEmail: 'bob@example.com'
    });

    expect(bookingService.listBookings('room-1')).toHaveLength(1);
    expect(bookingService.listBookings('room-2')).toHaveLength(1);
    expect(bookingService.listBookings('room-3')).toHaveLength(1);
  });
});
