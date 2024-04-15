import { TPokemon } from "../types/TPokemon";


export function transformPokemonTypelist(pokemon: TPokemon) {
    return pokemon.type_list.map((e) => (e.type))
}