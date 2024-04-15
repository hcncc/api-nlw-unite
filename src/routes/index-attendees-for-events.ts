import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function indexAttendeesForEvents(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .get("/attendees/:eventId", {
            schema: {
                params: z.object({
                    eventId: z.string().uuid()
                })
            }
        }, async (request, reply) => {
            const { eventId } = request.params

            const attendees = await prisma.attendee.findMany({
                where: {
                    eventId
                }
            })

            return reply.send({ attendees })
        })

}