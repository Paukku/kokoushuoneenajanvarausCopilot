import { Router } from 'express';
import * as bookingService from '../services/bookingService';
import { ApiError } from '../services/errors';

const router = Router();

router.post('/', (req, res) => {
  try {
    const { roomId, start, end, bookerName, bookerEmail } = req.body;
    const booking = bookingService.createBooking({
      roomId,
      start,
      end,
      bookerName,
      bookerEmail
    });
    res.status(201).json(booking);
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

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    bookingService.cancelBooking(id);
    res.status(204).send();
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
