import { Elysia } from "elysia";
import swagger from "./consts/swagger.config";
import cors from "@elysiajs/cors";
import staticPlugin from "@elysiajs/static";
import { mobileController } from "./routes/mobile";
import { societyController } from "./routes/society";
import { structureController } from "./routes/structure";
import { adminController } from "./routes/admin";
import { scannerController } from "./routes/scanner";

const app = new Elysia()
    .use(cors())
    .use(staticPlugin())

    .onError(({ code, error, set }) => {
        console.log(code);
        set.status = 400;
        return new Response(error.toString())
    })

    .use(swagger)

    .use(mobileController)
    .use(societyController)
    .use(structureController)
    .use(adminController)
    .use(scannerController)

    .listen(8000);

export default app;