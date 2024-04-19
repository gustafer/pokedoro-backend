import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function getPokemons(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .get('/pokemon', {
            schema: {
                querystring: z.object({
                    pageIndex: z.string().default('0').nullable().transform(Number),
                    query: z.string().nullish()
                })
            }
        }, async (req, res) => {
            const { pageIndex } = req.query
            const { query } = req.query

            const results = 20

            const totalResults = await prisma.pokemons.count()

            const totalPages = Math.ceil(totalResults / results)


            const pokemons = await prisma.pokemons.findMany({
                select: {
                    name: true,
                    id: true,
                    type_list: true,
                },
                take: results,
                skip: results * pageIndex,
                where: query ? {
                    name: {
                        contains: query,
                        mode: 'insensitive'
                    }
                } : {
                }
            })

            if (pokemons.length < 1) {
                res.status(400).send({ message: "Couldnt find any pokemons." })
            }

            return res.send({ pokemons, pageIndex, totalPages })
        })

}