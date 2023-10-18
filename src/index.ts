import { Elysia } from "elysia";
import swagger from "./consts/swagger.config";
import cors from "@elysiajs/cors";
import staticPlugin from "@elysiajs/static";
import { authController } from "./routes/auth";
import { accessibilityController } from "./routes/admin/accessibility";
import { mobileController } from "./routes/mobile";
import { societyController } from "./routes/society";
import { structureController } from "./routes/structure";

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
    .use(mobileController)
    .use(societyController)
    .use(structureController)
    .use(accessibilityController)
    
    .listen(4000);

export default app;