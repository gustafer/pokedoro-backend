import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import { z } from "zod";
import bcrypt from 'bcrypt'

export async function createUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/user', {
        schema: {
            body: z.object({
                name: z.string().min(1).max(100),
                email: z.string().email().max(100),
                password: z.string().min(5).max(100)
            }),
            response: {
            }
        },
    }, async (req, res) => {
        const { name, email, password } = req.body

        const existingEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (existingEmail) {
            throw new Error("User email already registered")
        }  

        // hash password so if i get hacked no one knows the password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)


        const createdUser = await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash
            }
        })

        return res.status(201).send({ createdUser })
    })
}