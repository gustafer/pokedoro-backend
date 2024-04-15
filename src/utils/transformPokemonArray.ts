import { TPokemon } from "../types/TPokemon";
import { transformPokemonTypelist } from "./transformPokemonTypelist";

export function transformPokemonArray(pokemon) {
    return pokemon.map((pokemon: TPokemon) => ( {name: pokemon.name, id: pokemon.id, typelist: transformPokemonTypelist(pokemon)}))
}