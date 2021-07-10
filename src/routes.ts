import { Router } from 'express';

import pokemonsRouter from './controllers/pokemons';
import typesRouter from './controllers/types';


const routes = Router();

routes.use('/pokemons', pokemonsRouter);
routes.use('/types', typesRouter);

export default routes;