import * as bookingService from '../services/bookingService';
import { clearBookings } from '../data';
import { ApiError, ErrorCodes } from '../services/errors';
import { validateCreateBookingInput } from '../middleware/validationMiddleware';

describe('Booking Service - Error Handling', () => {
  beforeEach(() => {
    clearBookings();
  });

  test('should return consistent error structure', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000);
    const end = new Date(now + 25 * 60 * 60 * 1000);

    try {
      validateCreateBookingInput({
        roomId: 'room-1',
        start,
        end,
        bookerName: '',
        bookerEmail: 'john@example.com'
      });
      throw new Error('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.status).toBeDefined();
        expect(error.code).toBeDefined();
        expect(error.message).toBeDefined();
        expect(error.timestamp).toBeDefined();
        // Timestamp should be ISO 8601 format
        expect(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(error.timestamp)).toBe(true);
      } else {
        throw new Error('Should be ApiError');
      }
    }
  });

  test('should return correct error code for missing fields', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000);
    const end = new Date(now + 25 * 60 * 60 * 1000);

    try {
      validateCreateBookingInput({
        roomId: 'room-1',
        start,
        end,
        bookerName: 'John Doe',
        bookerEmail: ''
      });
      throw new Error('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.MISSING_REQUIRED_FIELD);
      } else {
        throw new Error('Should be ApiError');
      }
    }
  });

  test('should return INVALID_EMAIL error for bad email', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000);
    const end = new Date(now + 25 * 60 * 60 * 1000);

    try {
      validateCreateBookingInput({
        roomId: 'room-1',
        start,
        end,
        bookerName: 'John Doe',
        bookerEmail: 'notanemail'
      });
      throw new Error('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.INVALID_EMAIL);
      } else {
        throw new Error('Should be ApiError');
      }
    }
  });

  test('should return INVALID_NAME error for whitespace-only name', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000);
    const end = new Date(now + 25 * 60 * 60 * 1000);

    try {
      validateCreateBookingInput({
        roomId: 'room-1',
        start,
        end,
        bookerName: '   ',
        bookerEmail: 'john@example.com'
      });
      throw new Error('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.INVALID_NAME);
      } else {
        throw new Error('Should be ApiError');
      }
    }
  });

  test('should return ROOM_NOT_FOUND for unknown room', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000);
    const end = new Date(now + 25 * 60 * 60 * 1000);

    try {
      validateCreateBookingInput({
        roomId: 'unknown-room',
        start,
        end,
        bookerName: 'John Doe',
        bookerEmail: 'john@example.com'
      });
      throw new Error('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.ROOM_NOT_FOUND);
        expect(error.status).toBe(404);
      } else {
        throw new Error('Should be ApiError');
      }
    }
  });

  test('should return BOOKING_OVERLAP for overlapping bookings', () => {
    const now = Date.now();
    const start1 = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const end1 = new Date(now + 25 * 60 * 60 * 1000).toISOString();

    bookingService.createBooking({
      roomId: 'room-1',
      start: new Date(start1),
      end: new Date(end1),
      bookerName: 'John Doe',
      bookerEmail: 'john@example.com'
    });

    try {
      bookingService.createBooking({
        roomId: 'room-1',
        start: new Date(start1),
        end: new Date(end1),
        bookerName: 'Jane Doe',
        bookerEmail: 'jane@example.com'
      });
      throw new Error('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.BOOKING_OVERLAP);
        expect(error.status).toBe(409);
      } else {
        throw new Error('Should be ApiError');
      }
    }
  });

  test('should return BOOKING_IN_PAST for past booking', () => {
    const now = Date.now();
    const start = new Date(now - 60 * 60 * 1000); // 1 hour ago
    const end = new Date(now + 60 * 60 * 1000);

    try {
      bookingService.createBooking({
        roomId: 'room-1',
        start,
        end,
        bookerName: 'John Doe',
        bookerEmail: 'john@example.com'
      });
      throw new Error('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.BOOKING_IN_PAST);
      } else {
        throw new Error('Should be ApiError');
      }
    }
  });

  test('should return INVALID_TIME_RANGE for invalid date format', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000);
    const end = new Date(now + 23 * 60 * 60 * 1000); // end before start

    try {
      bookingService.createBooking({
        roomId: 'room-1',
        start,
        end,
        bookerName: 'John Doe',
        bookerEmail: 'john@example.com'
      });
      throw new Error('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.INVALID_TIME_RANGE);
      } else {
        throw new Error('Should be ApiError');
      }
    }
  });

  test('should return INVALID_TIME_RANGE when start >= end', () => {
    const now = Date.now();
    const start = new Date(now + 25 * 60 * 60 * 1000);
    const end = new Date(now + 24 * 60 * 60 * 1000);

    try {
      bookingService.createBooking({
        roomId: 'room-1',
        start,
        end,
        bookerName: 'John Doe',
        bookerEmail: 'john@example.com'
      });
      throw new Error('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.INVALID_TIME_RANGE);
      } else {
        throw new Error('Should be ApiError');
      }
    }
  });

  test('should return BOOKING_NOT_FOUND for non-existent reservation ID', () => {
    try {
      bookingService.cancelBooking('NONEXISTENT');
      throw new Error('Should have thrown');
    } catch (error) {
      if (error instanceof ApiError) {
        expect(error.code).toBe(ErrorCodes.BOOKING_NOT_FOUND);
        expect(error.status).toBe(404);
      } else {
        throw new Error('Should be ApiError');
      }
    }
  });
});
