import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export async function createPokemon(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/pokemon', {
            schema: {
                body: z.object({
                    name: z.string().min(1),
                })
            }
        }, async (req, res) => {
            const { name } = req.body

            const existingPokemon = await prisma.pokemons.findUnique({
                where: {
                    name
                } 
            })

            if (existingPokemon) {
                throw new Error("Pokemon already exists!")
            }

            const createdPokemon = await prisma.pokemons.create({
                data: {
                    name,
                }
            })
         

            return res.status(201).send({ createdPokemon })
        })
}