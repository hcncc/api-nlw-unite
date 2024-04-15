import fastify from "fastify"
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod"
import { createEvent } from "./routes/create-event"
import { indexEvents } from "./routes/index-events"
import { registerForEvent } from "./routes/register-for-events"
import { indexAttendeesForEvents } from "./routes/index-attendees-for-events"
import { getEvent } from "./routes/get-event"
import { getAttendeeBadge } from "./routes/get-attendee-badge"

const app = fastify()

const PORT = 3333

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Register routes
app.register(createEvent)
app.register(indexEvents)
app.register(registerForEvent)
app.register(indexAttendeesForEvents)
app.register(getEvent)
app.register(getAttendeeBadge)


//listening server
app.listen({
    host: "0.0.0.0",
    port: PORT
}).then(() => { 
    console.log("Server is running")
})