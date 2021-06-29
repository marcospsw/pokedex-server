import { Router } from 'express';

import pokemonsRouter from './controllers/pokemons';

const routes = Router();

routes.use('/pokemons', pokemonsRouter);

export default routes;