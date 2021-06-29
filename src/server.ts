import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes';
import { errors } from 'celebrate';
import AppError from './utils/error';
import 'dotenv/config';


const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

const port = process.env.SERVER_PORT || 4000;
app.listen(port, () => console.log(`🚀🚀🚀Servidor rodando na porta ${port}🚀🚀🚀`));