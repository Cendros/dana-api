import Elysia from "elysia";
import { eventController } from "./event";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";
import { authController } from "./auth";
import { userController } from "./user";
import { structureController } from "./structure";


export const mobileController = new Elysia({ prefix: '/app' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    .use(bearer())

    .use(authController)
    .use(eventController)
    .use(userController)
    .use(structureController)