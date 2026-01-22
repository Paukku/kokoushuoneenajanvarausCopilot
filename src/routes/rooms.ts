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
    const b = roomService.getBookings(roomId);
    res.json(b);
  } catch (e) {
    if (e instanceof ApiError) return res.status(e.status).json({ error: e.message });
    return res.status(500).json({ error: 'Sisäinen palvelinvirhe' });
  }
});

export default router;
