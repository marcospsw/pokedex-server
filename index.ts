import express from 'express';

const app = express();

const backendPort = 4000;

app.listen(backendPort, () => console.log(`Servidor rodando na porta ${backendPort}`));

