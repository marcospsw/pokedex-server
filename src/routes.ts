import { Router } from 'express';
import loginRouter from './controllers/login';
import pokemonsRouter from './controllers/pokemons';
import typesRouter from './controllers/types';
import userRouter from './controllers/user';

const routes = Router();

routes.use('/pokemons', pokemonsRouter);
routes.use('/types', typesRouter);
routes.use('/user', userRouter);
routes.use('/login', loginRouter);

export default routes;
