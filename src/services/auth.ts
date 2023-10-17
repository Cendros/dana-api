import { eq } from "drizzle-orm"
import { db } from "../db"
import { userTable } from "../db/schema"
import { UserTypes } from "../types/user";

export const verifyCredentials = async (email: string, password: string) => {
    const user = await db.query.userTable.findFirst({
        where: eq(userTable.email, email)
    });
    if (!user)
        return false;
        
    const valid = await Bun.password.verify(password, user!.password);
    return valid ? {
        id: String(user.id),
        type: String(user.type),
        societyId: String(user?.societyId),
        structureId: String(user?.structureId)
    } : false;
}

export const registerUser = async (email: string, password: string, type: UserTypes, societyId: number | undefined, structureId: number | undefined) => {
    await db.insert(userTable).values({
        email: email,
        password: password,
        type: type,
        societyId: societyId,
        structureId: structureId
    });
}