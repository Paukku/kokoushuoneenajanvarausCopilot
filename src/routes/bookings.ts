import { Router } from 'express';
import * as bookingService from '../services/bookingService';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.post('/', asyncHandler((req, res) => {
  const { roomId, start, end, bookerName, bookerEmail } = req.body;
  const booking = bookingService.createBooking({
    roomId,
    start,
    end,
    bookerName,
    bookerEmail
  });
  res.status(201).json(booking);
}));

router.delete('/:reservationId', asyncHandler((req, res) => {
  const { reservationId } = req.params;
  bookingService.cancelBooking(reservationId);
  res.status(204).send();
}));

export default router;
