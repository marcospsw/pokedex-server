import axios from "axios";
import { Router } from "express";
import { Pokemon } from "../models/pokemon";

const pokemonsRouter = Router();

pokemonsRouter.get(
  '/', async (req, res) => {
    const { url } = req.query;

    async function getPokemons(){
      const { data } = await axios.get(`${url}`);
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
        sprite: data.sprites.other.dream_world.front_default 
          ? data.sprites.other.dream_world.front_default 
          : data.sprites.other['official-artwork'].front_default,
        types: data.types,
      };
    }
  
    try {
      let { pokemons, next_url } = await getPokemons();
      const completePokemons = await Promise.all(pokemons.map(async (pokemon: Pokemon): Promise<Object> => {
        const completePokemon = await getPokemon(pokemon.url);
        if(completePokemon.id === 898) {
          next_url = null;
        }
        if(completePokemon.id > 898) {
          return null;
        }
        return completePokemon;
      }));    
      return res.json({
        next_url,
        completePokemons,
      });
    } catch (error) {
      console.log(error);
    }
});

pokemonsRouter.get(
  '/complete', async (req, res) => {
    const { type } = req.query;

    async function getPokemons(){
      const { data } = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);  
      const pokemons = data.pokemon;
      return pokemons;    
    }
  
    async function getPokemon(url: string) {
      const { data } = await axios.get(url);

      return {
        url,
        id: data.id,
        name: data.name,
        sprite: data.sprites.other.dream_world.front_default 
          ? data.sprites.other.dream_world.front_default 
          : data.sprites.other['official-artwork'].front_default,
        types: data.types,
      };
    }
  
    try {
      const pokemons = await getPokemons();
      const completePokemons = await Promise.all(pokemons.map(async (pokemon): Promise<Object> => {
        const completePokemon = await getPokemon(pokemon.pokemon.url);        
        if(completePokemon.id > 898) {
          return null;
        }
        return completePokemon;
      }));    
      return res.json(completePokemons);
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