import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from "../../lib/prisma";

export async function userLogin(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/user/login', {
        schema: {
            body: z.object({
                email: z.string().min(1).email(),
                password: z.string().min(1)
            })
        }
    }, async (req, res) => {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(403).send({ message: "email and password required!" })
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return res.status(404).send({ message: "user not found." })
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            return res.status(401).send({ message: "password does not match." })
        }

        const secret = process.env.SECRET

        if (!secret) return res.status(404).send({ meessage: "secret not found" })

        const token = jwt.sign({ id: user.id, name: user.name, role: user.role },
            secret
        )

        res.status(200).send({ token, userId: user.id })
    })
}