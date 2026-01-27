import { Router } from 'express';
import * as roomService from '../services/roomService';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', (_req, res) => {
  res.json(roomService.getRooms());
});

router.get('/:roomId/bookings', asyncHandler((req, res) => {
  const { roomId } = req.params;
  const bookings = roomService.getBookings(roomId);
  res.json(bookings);
}));

export default router;
