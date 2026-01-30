import * as bookingService from '../services/bookingService';
import { clearBookings } from '../data';
import { ApiError, ErrorCodes } from '../services/errors';
import { validateCreateBookingInput } from '../middleware/validationMiddleware';

describe('Booking Service - Room Validation', () => {
  beforeEach(() => {
    clearBookings();
  });

  test('should reject booking for empty room ID', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000);
    const end = new Date(now + 25 * 60 * 60 * 1000);

    expect(() => {
      validateCreateBookingInput({
        roomId: '',
        start,
        end,
        bookerName: 'John Doe',
        bookerEmail: 'john@example.com'
      });
    }).toThrow(ApiError);
  });

  test('should reject booking for unknown room', () => {
    const now = Date.now();
    const start = new Date(now + 24 * 60 * 60 * 1000);
    const end = new Date(now + 25 * 60 * 60 * 1000);

    expect(() => {
      validateCreateBookingInput({
        roomId: 'unknown-room',
        start,
        end,
        bookerName: 'John Doe',
        bookerEmail: 'john@example.com'
      });
    }).toThrow(ApiError);
  });

  test('should list bookings for room without any bookings', () => {
    // Room exists but has no bookings
    const bookings = bookingService.listBookings('room-1');
    expect(bookings).toHaveLength(0);
    expect(Array.isArray(bookings)).toBe(true);
  });

  test('should reject listing bookings for non-existent room', () => {
    expect(() => {
      bookingService.listBookings('non-existent-room');
    }).toThrow(ApiError);
  });

  test('should accept all valid room IDs', () => {
    const validRoomIds = ['room-1', 'room-2', 'room-3', 'room-4', 'room-5'];
    const now = Date.now();

    for (let i = 0; i < validRoomIds.length; i++) {
      const roomId = validRoomIds[i];
      const start = new Date(now + (i + 1) * 24 * 60 * 60 * 1000);
      const end = new Date(now + (i + 1) * 24 * 60 * 60 * 1000 + 60 * 60 * 1000);

      expect(() => {
        bookingService.createBooking({
          roomId,
          start,
          end,
          bookerName: `User ${i}`,
          bookerEmail: `user${i}@example.com`
        });
      }).not.toThrow();
    }
  });
});
