import * as bookingService from '../services/bookingService';
import { clearBookings } from '../data';
import { ApiError, ErrorCodes } from '../services/errors';

describe('Booking Service - Error Handling', () => {
  beforeEach(() => {
    clearBookings();
  });

  test('should return consistent error structure', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    try {
      bookingService.createBooking({
        roomId: 'room-1',
        start,
        end,
        bookerName: '',
        bookerEmail: 'john@example.com'
      });
      fail('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.status).toBeDefined();
        expect(error.code).toBeDefined();
        expect(error.message).toBeDefined();
        expect(error.timestamp).toBeDefined();
        // Timestamp should be ISO 8601 format
        expect(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(error.timestamp)).toBe(true);
      } else {
        fail('Should be ApiError');
      }
    }
  });

  test('should return correct error code for missing fields', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    try {
      bookingService.createBooking({
        roomId: 'room-1',
        start,
        end,
        bookerName: 'John Doe',
        bookerEmail: ''
      });
      fail('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.MISSING_REQUIRED_FIELD);
      } else {
        fail('Should be ApiError');
      }
    }
  });

  test('should return INVALID_EMAIL error for bad email', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    try {
      bookingService.createBooking({
        roomId: 'room-1',
        start,
        end,
        bookerName: 'John Doe',
        bookerEmail: 'notanemail'
      });
      fail('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.INVALID_EMAIL);
      } else {
        fail('Should be ApiError');
      }
    }
  });

  test('should return INVALID_NAME error for whitespace-only name', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    try {
      bookingService.createBooking({
        roomId: 'room-1',
        start,
        end,
        bookerName: '   ',
        bookerEmail: 'john@example.com'
      });
      fail('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.INVALID_NAME);
      } else {
        fail('Should be ApiError');
      }
    }
  });

  test('should return ROOM_NOT_FOUND for unknown room', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    try {
      bookingService.createBooking({
        roomId: 'unknown-room',
        start,
        end,
        bookerName: 'John Doe',
        bookerEmail: 'john@example.com'
      });
      fail('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.ROOM_NOT_FOUND);
        expect(error.status).toBe(404);
      } else {
        fail('Should be ApiError');
      }
    }
  });

  test('should return BOOKING_OVERLAP for overlapping bookings', () => {
    const now = Date.now();
    const start1 = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end1 = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    bookingService.createBooking({
      roomId: 'room-1',
      start: start1,
      end: end1,
      bookerName: 'John Doe',
      bookerEmail: 'john@example.com'
    });

    try {
      bookingService.createBooking({
        roomId: 'room-1',
        start: start1,
        end: end1,
        bookerName: 'Jane Doe',
        bookerEmail: 'jane@example.com'
      });
      fail('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.BOOKING_OVERLAP);
        expect(error.status).toBe(409);
      } else {
        fail('Should be ApiError');
      }
    }
  });

  test('should return BOOKING_IN_PAST for past booking', () => {
    const now = Date.now();
    const start = new Date(now - 60 * 60 * 1000).toISOString(); // 1 hour ago
    const end = new Date(now + 60 * 60 * 1000).toISOString();

    try {
      bookingService.createBooking({
        roomId: 'room-1',
        start,
        end,
        bookerName: 'John Doe',
        bookerEmail: 'john@example.com'
      });
      fail('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.BOOKING_IN_PAST);
      } else {
        fail('Should be ApiError');
      }
    }
  });

  test('should return INVALID_TIME_RANGE for invalid date format', () => {
    try {
      bookingService.createBooking({
        roomId: 'room-1',
        start: 'not-a-date',
        end: '2026-01-22T10:30:00Z',
        bookerName: 'John Doe',
        bookerEmail: 'john@example.com'
      });
      fail('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.INVALID_TIME_RANGE);
      } else {
        fail('Should be ApiError');
      }
    }
  });

  test('should return INVALID_TIME_RANGE when start >= end', () => {
    const now = Date.now();
    const start = new Date(now + 25 * 60 * 60 * 1000).toISOString();
    const end = new Date(now + 24 * 60 * 60 * 1000).toISOString();

    try {
      bookingService.createBooking({
        roomId: 'room-1',
        start,
        end,
        bookerName: 'John Doe',
        bookerEmail: 'john@example.com'
      });
      fail('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.INVALID_TIME_RANGE);
      } else {
        fail('Should be ApiError');
      }
    }
  });

  test('should return BOOKING_NOT_FOUND for non-existent reservation ID', () => {
    try {
      bookingService.cancelBooking('NONEXISTENT');
      fail('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.BOOKING_NOT_FOUND);
        expect(error.status).toBe(404);
      } else {
        fail('Should be ApiError');
      }
    }
  });
});
