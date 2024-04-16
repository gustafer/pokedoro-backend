import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function getPokemons(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .get('/pokemon', {
            schema: {
                querystring: z.object({
                    pageIndex: z.string().default('0').nullable().transform(Number)
                })
            }
        }, async (req, res) => {
            const { pageIndex } = req.query

            const results = 20
            const pokemons = await prisma.pokemons.findMany({
                select: {
                    name: true,
                    id: true,
                    type_list: true
                },
                take: results,
                skip: results * pageIndex
            })

            if (pokemons.length < 1) {
                res.status(400).send({ message: "Couldnt find any pokemons." })
            }

            return res.send({ pokemons, pageIndex })
        })

}