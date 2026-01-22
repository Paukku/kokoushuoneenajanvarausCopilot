import express from 'express';
import roomsRouter from './routes/rooms';
import bookingsRouter from './routes/bookings';

const app = express();
app.use(express.json());

app.use('/rooms', roomsRouter);
app.use('/bookings', bookingsRouter);

// Health
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`Kokoushuoneiden varaus API käynnissä osoitteessa http://localhost:${port}`);
});
