import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes';
import { errors } from 'celebrate';
import AppError from './utils/error';
import morgan from 'morgan';
import 'dotenv/config';
import './config/connection';

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(morgan('dev'));
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

app.listen(process.env.PORT || 4000, () =>
	console.log(`🚀🚀🚀Servidor rodando na porta ${process.env.PORT || 4000}🚀🚀🚀`)
);
