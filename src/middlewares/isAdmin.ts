import jwt, { JwtPayload } from 'jsonwebtoken'

export function isAdmin(req, res, done) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) return res.status(401).send({ message: 'no tokens were found'})

    const decodedJwt = jwt.decode(token) as JwtPayload

    if (decodedJwt.role != 'admin') {
        return res.status(401).send({ message: "only admins should use this route"})
    }

    done()
}