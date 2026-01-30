import { Router } from 'express';
import * as bookingService from '../services/bookingService';
import { asyncHandler } from '../middleware/errorHandler';
import { validateCreateBookingInput } from '../middleware/validationMiddleware';

const router = Router();

router.post('/', asyncHandler((req, res) => {
  const { roomId, start, end, bookerName, bookerEmail } = req.body;
   // Validate input using middleware
  const validatedInput = validateCreateBookingInput(req.body);

  const booking = bookingService.createBooking(validatedInput);
  res.status(201).json(booking);
}));

router.delete('/:reservationId', asyncHandler((req, res) => {
  const { reservationId } = req.params;
  bookingService.cancelBooking(reservationId);
  res.status(204).send();
}));

export default router;
