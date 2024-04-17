import { HookHandlerDoneFunction } from 'fastify/types/hooks'
import { FastifyReply } from 'fastify/types/reply'
import { FastifyRequest } from 'fastify/types/request'
import jwt from "jsonwebtoken";

export function auth(req: FastifyRequest, res: FastifyReply, done: HookHandlerDoneFunction): void {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) res.status(401).send({ message: 'no tokens were found' })
    else {
        const secret = process.env.SECRET as string

        try {
            jwt.verify(token, secret)
        } catch (error) {
            res.status(400).send({ message: 'invalid token' })
        }

        done()
    }
}
