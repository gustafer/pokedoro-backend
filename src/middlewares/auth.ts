import jwt from "jsonwebtoken";

export function auth(req, res, done) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) return res.status(401).send({ message: 'no tokens were found'})

    const secret = process.env.SECRET as string

    try {
        jwt.verify(token, secret)
    } catch (error) {
        return res.status(400).send({ message: 'invalid token' })
    }

    done()
}
