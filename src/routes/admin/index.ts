import Elysia from "elysia";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";
import { accessibilityController } from "./accessibility";
import { eventController } from "./event";
import { authController } from "./auth";


export const adminController = new Elysia({ prefix: '/admin' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    .use(bearer())

    .use(authController)
    .use(accessibilityController)
    .use(eventController);