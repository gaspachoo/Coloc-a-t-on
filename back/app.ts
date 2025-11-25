import express, { Request, Response } from 'express';
import routes from './routes';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Backend is running in the background!');
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});