import express, { Request, Response } from 'express';
import routes from './routes';
import path from 'path';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Backend is running in the background!');
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});