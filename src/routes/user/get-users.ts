import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import { z } from "zod";
import { auth } from "../../middlewares/auth";
import { isAdmin } from "../../middlewares/isAdmin";
import { transformPokemonArray } from "../../utils/transformPokemonArray";

export async function getUsers(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/user', {
            preValidation: (req, res, done) => auth(req, res, done),
            preHandler: (req, res, done) => isAdmin(req, res, done),
            schema: {
                querystring: z.object({
                    pageIndex: z.string().nullable().default('0').transform(Number)
                })
            }
        }, async (req, res) => {
            const { pageIndex } = req.query
            console.log(req.query)

            const results = 20
            const users = await prisma.user.findMany({
                select: {
                    email: true,
                    id: true,
                    name: true,
                    pokemons: {
                        select: {
                            name: true,
                            id: true,
                            type_list: {
                                select: {
                                    type: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            pokemons: true
                        }
                    }
                },
                take: results,
                skip: results * pageIndex
            })

            if (users.length < 1) {
                throw new Error("No users were found")
            }



            const usersArray = users.map((user) => {
                const pokemonsArray = transformPokemonArray(user.pokemons)
                return { name: user.name, email: user.email, id: user.id, pokemons: pokemonsArray, pokemonsCount: user._count.pokemons }
            })
            return res.send({ users: usersArray })
        })
}