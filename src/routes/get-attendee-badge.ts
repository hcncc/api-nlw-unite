import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function getAttendeeBadge(app: FastifyInstance){
    app
        .withTypeProvider<ZodTypeProvider>()
        .get("/attendees/:attendeeId/badge", {
            schema: {
                params: z.object({
                    attendeeId: z.coerce.number() // .transform(Number) Assim como corece, ambos métodos transformam ou fazem parse de um dado
                }),
                response:{}
            }
        }, async(request, reply)=>{
            
        })
}