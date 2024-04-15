import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { sendError } from "../utils/responses";

export async function getEvent(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get("/events/:eventId", {
            schema: {
                params: z.object({
                    eventId: z.string().uuid()
                }),
                response: {
                    200: {
                        id: z.string().uuid(),
                        title: z.string(),
                        slug: z.string(),
                        deatils: z.string().nullable(),
                        maximumAttendees: z.number().int().nullable(),
                        amountAttendees: z.number().int(),
                    }
                }
            }
        }, async (request, reply) => {
            const { eventId } = request.params

            const event = await prisma.event.findUnique({
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    details: true,
                    maximumAttendees: true,
                    _count: {
                        select: {
                            attendees: true
                        }
                    }
                },
                where: {
                    id: eventId
                }
            })

            if (event === null) {
                return sendError(reply, 404, "Event not found")
            }

            return {
                event: {
                    id: event.id,
                    title: event.title,
                    slug: event.slug,
                    deatils: event.details,
                    maximumAttendees: event.maximumAttendees,
                    amountAttendees: event._count.attendees
                }
            }
        })
}