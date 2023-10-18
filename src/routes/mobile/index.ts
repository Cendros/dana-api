import Elysia from "elysia";
import { checkController } from "./check";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";
import { UserTypes } from "../../consts/userTypes";


export const mobileController = new Elysia({ prefix: '/app' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    .use(bearer())

    .onBeforeHandle(async ({ set, jwt, bearer }) => {
        const tokenData = await jwt.verify(bearer);
        
        if (!tokenData || tokenData.role !== UserTypes.Employee.toString()) {
            set.status = 401;
            return 'Unauthorized';
        }
    })

    .use(checkController);