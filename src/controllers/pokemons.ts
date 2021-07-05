import axios from "axios";
import { Router } from "express";
import { CompletePokemon, PokemonsByType } from "../models/pokemon";

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
      const pokemon: CompletePokemon = data;

      return {
        url,
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprites.other.dream_world.front_default 
          ? pokemon.sprites.other.dream_world.front_default 
          : pokemon.sprites.other['official-artwork'].front_default,
        types: pokemon.types,
      };
    }
  
    try {
      let { pokemons, next_url } = await getPokemons();
      const completePokemons = await Promise.all(pokemons.map(async (pokemon: CompletePokemon): Promise<Object> => {
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
        completePokemons: completePokemons.filter(Boolean),
      });
    } catch (error) {
      console.log(error);
    }
});

pokemonsRouter.get(
  '/bytype', async (req, res) => {
    const { type } = req.query;

    async function getPokemons(){
      const { data } = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);  
      const pokemons = data.pokemon;
      return pokemons;    
    }
  
    async function getPokemon(url: string) {
      const { data } = await axios.get(url);
      const pokemon: CompletePokemon = data;

      return {
        url,
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprites.other.dream_world.front_default 
          ? pokemon.sprites.other.dream_world.front_default 
          : pokemon.sprites.other['official-artwork'].front_default,
        types: pokemon.types,
      };
    }
  
    try {
      const pokemons = await getPokemons();
      const completePokemons = await Promise.all(pokemons.map(async (pokemon: PokemonsByType): Promise<Object> => {
        const completePokemon = await getPokemon(pokemon.pokemon.url);        
        if(completePokemon.id > 898) {
          return null;
        }
        return completePokemon;
      }));

      return res.json(completePokemons.filter(Boolean));
    } catch (error) {
      console.log(error);
    }
});

pokemonsRouter.get(
  '/filter', async (req, res) => {
    const { search } = req.query;
    const valor = search.toString();
    const isNumber = parseInt(valor);

    async function getPokemons(){
      const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=898`);  
      const pokemons = data.results;
      return pokemons;    
    }
  
    async function getPokemon(url: string) {
      const { data } = await axios.get(url);
      const pokemon: CompletePokemon = data;

      return {
        url,
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprites.other.dream_world.front_default 
          ? pokemon.sprites.other.dream_world.front_default 
          : pokemon.sprites.other['official-artwork'].front_default,
        types: pokemon.types,
      };
    }
  
    try {
      const pokemons = await getPokemons();
      const filteredPokemons = pokemons.map((pokemon: CompletePokemon) => {
        if(isNaN(isNumber) && pokemon.name.includes(valor)){
          return pokemon;
        }
        const last4Numbers = pokemon.url.slice(-4);
        if(!isNaN(isNumber) && last4Numbers.includes(valor)){
          return pokemon;     
        }
        return null;
      });

      const completePokemons = await Promise.all(filteredPokemons.filter(Boolean).map(async (pokemon: CompletePokemon): Promise<Object> => {
        const completePokemon = await getPokemon(pokemon.url);   
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
    const pokemon: CompletePokemon = data;
  
    return res.json({
      name: pokemon.name,
      sprite: data.sprites.other.dream_world.front_default 
      ? data.sprites.other.dream_world.front_default 
      : data.sprites.other['official-artwork'].front_default,
    });
  } catch (error) {
    console.log(error);
  }
});

export default pokemonsRouter;