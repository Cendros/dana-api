import Elysia from "elysia";
import { checkController } from "./check";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";
import { authController } from "./auth";
import { userController } from "./user";


export const mobileController = new Elysia({ prefix: '/app' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    .use(bearer())

    .use(authController)
    .use(checkController)
    .use(userController)