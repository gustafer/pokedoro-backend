import { FastifyReply, FastifyRequest } from "fastify"
import jwt, { JwtPayload } from "jsonwebtoken"

export function checkUserId(req: FastifyRequest, res: FastifyReply, userId: string) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) return res.status(401).send({ message: 'no tokens were found'})
    const decodedJwt = jwt.decode(token) as JwtPayload

    if (decodedJwt.id != userId) {
        return res.status(401).send({ message: "you're not allowed to see other users info"})
    }
}