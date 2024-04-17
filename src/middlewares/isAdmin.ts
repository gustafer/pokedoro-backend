import { HookHandlerDoneFunction } from 'fastify/types/hooks'
import { FastifyReply } from 'fastify/types/reply'
import { FastifyRequest } from 'fastify/types/request'
import jwt, { JwtPayload } from 'jsonwebtoken'

export function isAdmin(req: FastifyRequest, res: FastifyReply, done: HookHandlerDoneFunction): void {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) res.status(401).send({ message: 'no tokens were found' })
  else {
    const decodedJwt = jwt.decode(token) as JwtPayload

    if (decodedJwt.role != 'admin') {
      res.status(401).send({ message: "only admins should use this route" })
    }

    done()
  }
}