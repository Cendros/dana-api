import { eq } from "drizzle-orm"
import { db } from "../db"
import { userTable } from "../db/schema"

export const verifyCredentials = async (email: string, password: string) => {
    const user = await db.query.userTable.findFirst({
        where: eq(userTable.email, email)
    });
    if (!user)
        return false;
        
    const valid = await Bun.password.verify(password, user!.password);
    return valid ? { id: String(user.id), type: String(user.type)} : false;
}