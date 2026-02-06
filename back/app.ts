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

// Autoriser plusieurs origines pour le développement local et mobile
const allowedOrigins = [
  FRONT_URL,
  'http://localhost:5173',
  'http://172.19.111.125:5173', // Accès depuis téléphone
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Autoriser les requêtes sans origin (comme Postman) ou celles dans la liste
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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