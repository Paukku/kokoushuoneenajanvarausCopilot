import express from 'express';
import roomsRouter from './routes/rooms';
import bookingsRouter from './routes/bookings';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(express.json());

app.use('/rooms', roomsRouter);
app.use('/bookings', bookingsRouter);

// Health
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Error middleware MUST be last
app.use(errorHandler);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`Kokoushuoneiden varaus API käynnissä osoitteessa http://localhost:${port}`);
});
