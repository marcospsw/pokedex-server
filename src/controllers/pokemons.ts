import axios from "axios";
import { Router } from "express";
import { CompletePokemon, PokemonsByType, SpecificPokemon } from "../models/pokemon";

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
        if(isNaN(isNumber) && pokemon.name.includes(valor.toLowerCase())){
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
  const { pokemon } = req.query;
  const pokemonId = parseInt(pokemon.toString());

  async function getPokemon(id: number | string){
    let { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const pokemon: SpecificPokemon = data;
    return pokemon;
  }

  async function getSpecie(url: string){
    let { data } = await axios.get(url);
    const pokemonSpecie = data;
    return pokemonSpecie;
  }

  async function getEvolutionChain(url: string){
    let { data } = await axios.get(url);
    const evolutionChain = data;
    return evolutionChain;
  }

  try {
    const pokemon = await getPokemon(pokemonId);
    const speciePokemon = await getSpecie(pokemon.species.url);

    const evolutionChain = await getEvolutionChain(speciePokemon.evolution_chain.url);
    const firstEvolution = evolutionChain.chain.species.name;
    const secondEvolution = evolutionChain.chain.evolves_to[0]
      ? evolutionChain.chain.evolves_to[0].species.name 
      : null; 
    
    let thirdEvolution;
    if(secondEvolution){
      thirdEvolution = evolutionChain.chain.evolves_to[0].evolves_to[0] && secondEvolution
      ? evolutionChain.chain.evolves_to[0].evolves_to[0].species.name 
      : null;
    }
    
    const firstEvolutionPokemon = await getPokemon(firstEvolution);
    const secondEvolutionPokemon = secondEvolution ? await getPokemon(secondEvolution) : null;
    const thirdEvolutionPokemon = thirdEvolution ? await getPokemon(thirdEvolution) : null;

    const damageRelations = await Promise.all(pokemon.types.map(async (item): Promise<Object> => {
      const { data } = await axios.get(item.type.url);
      return {
        name: item.type.name,
        weaknes: data.damage_relations.double_damage_from,
        advantages: data.damage_relations.double_damage_to,
      }
    }));
  
    return res.json({
      name: pokemon.name,
      id: pokemon.id,
      height: pokemon.height,
      sprite: pokemon.sprites.other.dream_world.front_default 
        ? pokemon.sprites.other.dream_world.front_default 
        : pokemon.sprites.other['official-artwork'].front_default,
      types: damageRelations,
      stats: pokemon.stats,
      firstEvolution: {
        name: firstEvolutionPokemon.name,
        id: firstEvolutionPokemon.id,
        sprite: firstEvolutionPokemon.sprites.other.dream_world.front_default 
          ? firstEvolutionPokemon.sprites.other.dream_world.front_default 
          : firstEvolutionPokemon.sprites.other['official-artwork'].front_default,
        types: firstEvolutionPokemon.types,
      },
      secondEvolution: secondEvolution ? {
        name: secondEvolutionPokemon.name,
        id: secondEvolutionPokemon.id,
        sprite: secondEvolutionPokemon.sprites.other.dream_world.front_default 
          ? secondEvolutionPokemon.sprites.other.dream_world.front_default 
          : secondEvolutionPokemon.sprites.other['official-artwork'].front_default,
        types: secondEvolutionPokemon.types,
      } : null,
      thirdEvolution: thirdEvolution ? {
        name: thirdEvolutionPokemon.name,
        id: thirdEvolutionPokemon.id,
        sprite: thirdEvolutionPokemon.sprites.other.dream_world.front_default 
          ? thirdEvolutionPokemon.sprites.other.dream_world.front_default 
          : thirdEvolutionPokemon.sprites.other['official-artwork'].front_default,
        types: thirdEvolutionPokemon.types,
      } : null,
    });
  } catch (error) {
    console.log(error);
  }
});

export default pokemonsRouter;