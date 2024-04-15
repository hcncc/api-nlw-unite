import { FastifyReply } from "fastify";

export function sendError(context: FastifyReply, httpStatusCode: number, message: string){
    return context.status(httpStatusCode).send({
        status: httpStatusCode,
        message
    })
}