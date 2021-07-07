export interface CompletePokemon {
  url: string,
  id: number,
  name: string,  
  sprites: {
    other: {
      dream_world: {
        front_default: string,
      },
    },
  },
  types: Types[],
}

export interface Types {
  slot: number,
  type: {
    name: string,
    url: string,
  }
}

export interface PokemonsByType {
  pokemon: {
    name: string,
    url: string,
  }
}

export interface SpecificPokemon {
  id: number,
  height: number,
  name: string,  
  sprites: {
    other: {
      dream_world: {
        front_default: string,
      },
    },
  },
  types: Types[],
  stats: Stat[],
  species: {
    name: string,
    url: string,
  }
}

export interface Stat {
  base_stat: number,
  effort: number,
  stat: {
    name: string,
    url: string,
  }
}

