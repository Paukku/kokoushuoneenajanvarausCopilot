import { Router } from 'express';
import * as bookingService from '../services/bookingService';
import { ApiError } from '../services/errors';

const router = Router();

router.post('/', (req, res) => {
  try {
    const { roomId, start, end } = req.body;
    const b = bookingService.createBooking(roomId, start, end);
    res.status(201).json(b);
  } catch (e) {
    if (e instanceof ApiError) return res.status(e.status).json({ error: e.message });
    return res.status(500).json({ error: 'Sisäinen palvelinvirhe' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    bookingService.cancelBooking(id);
    res.status(204).send();
  } catch (e) {
    if (e instanceof ApiError) return res.status(e.status).json({ error: e.message });
    return res.status(500).json({ error: 'Sisäinen palvelinvirhe' });
  }
});

export default router;
