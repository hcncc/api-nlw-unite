import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { sendError } from "../utils/responses";

export async function registerForEvent(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post("/events/:eventId/attendees", {
            schema: {
                body: z.object({
                    name: z.string().min(4),
                    email: z.string().email(),
                }),
                params: z.object({
                    eventId: z.string().uuid()
                }),
                response: {
                    201: z.object({
                        attendeeId: z.number()
                    })
                }
            }
        }, async (request, reply) => {
            const { name, email } = request.body
            const { eventId } = request.params
            
            const attendeeWithEmail = await prisma.attendee.findUnique({
                where:{
                    eventId_email:{
                        email,
                        eventId
                    }
                }
            })

            if(attendeeWithEmail){
                return sendError(reply, 302, `Attendee with this email: ${email} alread registered in event`)
            }
            
            const [eventIdFound, amountOfAttendeesForEvent] = await Promise.all([
                prisma.event.findUnique({
                    where:{
                        id: eventId
                    }
                }),
                prisma.attendee.count({
                    where: {
                        eventId
                    }
                }) 
            ])

            if(eventIdFound?.maximumAttendees && amountOfAttendeesForEvent >= eventIdFound?.maximumAttendees){
                return sendError(reply, 200, "The maximum number of attendees for this event has been reached.")
            }

            const attendee = await prisma.attendee.create({
                data: {
                    email,
                    name,
                    eventId
                }
            })

            return reply.status(201).send({ attendeeId: attendee.id })
        })
}