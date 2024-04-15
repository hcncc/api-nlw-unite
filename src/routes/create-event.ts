import { ZodTypeProvider } from "fastify-type-provider-zod"
import { prisma } from "../lib/prisma"
import { generateSlug } from "../utils/generate-slug"
import { sendError } from "../utils/responses"
import { z } from "zod"
import { FastifyInstance } from "fastify"

export async function createEvent(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post("/events", {
            schema: {
                body: z.object({
                    title: z.string().min(4),
                    details: z.string().nullable(),
                    maximumAttendees: z.number().int().positive().nullable()
                }),
                response: {
                    201: z.object({
                        eventId: z.string().uuid(),
                    })
                }
            }
        }, async (request, reply) => {

            const eventData = request.body
            const slug = generateSlug(eventData.title)

            const eventWithSameSlug = await prisma.event.findFirst({
                where: {
                    slug
                }
            })

            if (eventWithSameSlug) {
                return sendError(reply, 302, "Event has been created")
            }

            const event = await prisma.event.create({
                data: {
                    title: eventData.title,
                    details: eventData.details,
                    maximumAttendees: eventData.maximumAttendees,
                    slug
                }
            })

            return reply.status(201).send({ eventId: event.id })
        })
}