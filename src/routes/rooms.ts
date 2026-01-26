import { Router } from 'express';
import * as roomService from '../services/roomService';
import { ApiError } from '../services/errors';

const router = Router();

router.get('/', (_req, res) => {
  res.json(roomService.getRooms());
});

router.get('/:roomId/bookings', (req, res) => {
  try {
    const { roomId } = req.params;
    const bookings = roomService.getBookings(roomId);
    res.json(bookings);
  } catch (e) {
    if (e instanceof ApiError) {
      return res.status(e.status).json({
        code: e.code,
        message: e.message,
        timestamp: e.timestamp
      });
    }
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Sisäinen palvelinvirhe',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
