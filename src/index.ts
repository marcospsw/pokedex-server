import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);


const backendPort = 4000;

app.listen(backendPort, () => console.log(`Servidor rodando na porta ${backendPort}`));