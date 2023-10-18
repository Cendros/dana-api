import Elysia from "elysia";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";
import { UserTypes } from "../../consts/userTypes";
import { accessibilityController } from "./accessibility";


export const adminController = new Elysia({ prefix: '/admin' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
    }))
    .use(bearer())

    .onBeforeHandle(async ({ set, jwt, bearer }) => {
        const tokenData = await jwt.verify(bearer);
        
        if (!tokenData || tokenData.role !== UserTypes.Admin.toString()) {
            set.status = 401;
            return 'Unauthorized';
        }
    })

    .use(accessibilityController);