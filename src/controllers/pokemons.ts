import axios from "axios";
import { Router } from "express";
import { Pokemon } from "../models/pokemon";

const pokemonsRouter = Router();

pokemonsRouter.get(
  '/', async (req, res) => {
    async function getPokemons(){
      // let { data } = await axios('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=898');
      const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=50');
      const pokemons = data.results;
      return {
        pokemons,
        next_url: data.next,
      };
    }
  
    async function getPokemon(url: string) {
      const { data } = await axios.get(url);
      return {
        url,
        id: data.id,
        name: data.name,
        sprite: data.sprites.other.dream_world.front_default,
        types: data.types,
      };
    }
  
    try {
      const { pokemons, next_url } = await getPokemons();
      const completePokemons = await Promise.all(pokemons.map(async (pokemon: Pokemon): Promise<Object> => {
        const completePokemon = await getPokemon(pokemon.url);
        return completePokemon;
      }));    
      return res.json({
        next_url,
        completePokemons
      });
    } catch (error) {
      console.log(error);
    }
});

pokemonsRouter.get('/id', async (req, res) => {
  try {
    let { data } = await axios(`https://pokeapi.co/api/v2/pokemon/${req.query.pokemon}/`);
    const pokemon = data;
  
    return res.json({
      name: pokemon.name,
      sprite: pokemon.sprites.other.dream_world.front_default,
    });
  } catch (error) {
    console.log(error);
  }
});

export default pokemonsRouter;

//CASO PRECISE DE PAGINAÇÃO

// while (data.next !== null) {
//   const response = await axios(data.next);
//   response.data.results.map(pokemon => {
//     return pokemons.push(pokemon);
//   });
//   data.next = response.data.next;
// }