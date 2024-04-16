import fastify from 'fastify'
import { getPokemons } from './routes/pokemon/get-pokemons'
import { getPokemon } from './routes/pokemon/get-pokemon'
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod';
import { createPokemon } from './routes/pokemon/create-pokemon';
import { createUser } from './routes/user/create-user';
import { getUser } from './routes/user/get-user';
import { getUsers } from './routes/user/get-users';
import { addPokemonToUser } from './routes/user/add-pokemon-to-user';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { userLogin } from './routes/user/user-login';
import cors from '@fastify/cors'

const app = fastify()

app.register(cors, {
 origin: (origin, cb) => {
    const hostname = new URL(origin).hostname
    if(hostname === "localhost"){
      //  Request from localhost will pass
      cb(null, true)
      return
    }
    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"), false)
  }
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
    swagger: {
        consumes: ['application/json'],
        produces: ['application/json'],
        info: {
            title: 'Pokedoro API',
            description: "The api which should be only used by developers",
            version: "1.0.0"
        },
    },
    transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
    routePrefix: '/swagger',
})


app.get('/', (req, res) => {
    res.send({
        message: 'server up and running!'
    })
})
// /user
app.register(createUser)
app.register(getUser)
app.register(getUsers)

// user / login
app.register(userLogin)


// //GET /pokemon/:id
app.register(getPokemon)
// GET /pokemon?pageIndex=0
app.register(getPokemons)
// POST /pokemon
app.register(createPokemon)
// PUT /user/pokemon
app.register(addPokemonToUser)

const port = 1333
app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : port
})
    .then(() => {
        console.log(`server running on port: ${port}`)
    })