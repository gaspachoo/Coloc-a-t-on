import express, { Request, Response } from 'express';
import routes from './routes';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

const FRONT_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const corsOptions = {
  origin: FRONT_URL,
  credentials: true,
  methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  optionsSuccessStatus: 200,  // réponse aux pré-vol
};

app.use(cors(corsOptions));
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