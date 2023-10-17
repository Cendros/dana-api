import { eq } from "drizzle-orm"
import { db } from "../db"

export const verifyCredentials = async (email: string, password: string) => {
    return false;
    // const user = await db.query.employeeUserTable.findFirst({
    //     where: eq(employeeUserTable.email, email)
    // });
    // if (!user)
    //     return false;
        
    // const valid = await Bun.password.verify(password, user!.password);
    // return valid ? {
    //     id: String(user.id),
    //     type: String(user.type),
    //     societyId: String(user?.societyId),
    //     structureId: String(user?.structureId)
    // } : false;
}

export const registerUser = async (email: string, password: string, type: string, societyId: number | undefined, structureId: number | undefined) => {
    // await db.insert(employeeUserTable).values({
    //     email: email,
    //     password: password,
    //     type: type,
    //     societyId: societyId,
    //     structureId: structureId
    // });
}