import express, { Request, Response } from 'express';
import routes from './routes';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

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