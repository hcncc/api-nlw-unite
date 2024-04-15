import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { sendError } from "../utils/responses";

export async function getAttendeeBadge(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get("/attendees/:attendeeId/badge", {
            schema: {
                params: z.object({
                    attendeeId: z.coerce.number().int() // .transform(Number) Assim como corece, ambos métodos transformam ou fazem parse de um dado
                }),
                response: {}
            }
        }, async (request, reply) => {
            const { attendeeId } = request.params

            const attendee = await prisma.attendee.findUnique({
                select: {
                    name: true,
                    email: true,
                    event:{
                        select:{
                            title: true
                        }
                    }
                },
                where: {
                    id: attendeeId
                }
            })

            if (attendee === null) {
                return sendError(reply, 404, "Attendee not found")
            }

            return reply.send({ attendee })
        })
}