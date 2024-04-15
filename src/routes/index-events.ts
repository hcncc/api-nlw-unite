import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function indexEvents(app: FastifyInstance) {

    app.get("/events", async (request, reply) => {

        const events = await prisma.event.findMany()

        return reply.send({ events })
    })

}