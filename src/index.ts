import { Elysia } from "elysia";
import { checkController } from "./routes/check";
import swagger from "./consts/swagger.config";
import { societyController } from "./routes/society";
import { structureController } from "./routes/structure";
import { userController } from "./routes/user";
import cors from "@elysiajs/cors";
import staticPlugin from "@elysiajs/static";
import { authController } from "./routes/auth";

const app = new Elysia()
    .use(cors())
    .use(staticPlugin())
    
    .onError(({ code, error, set }) => {
        console.log(code);
        set.status = 400;
        return new Response(error.toString())
    })

    .use(swagger)

    .use(authController)
    .use(checkController)
    .use(societyController)
    .use(structureController)
    .use(userController)
    
    .listen(3000)

export default app;