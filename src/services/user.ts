import { eq } from "drizzle-orm";
import { db } from "../db"
import { userTable } from "../db/schema"

export const getUsers = async () => {
    const users = await db.select().from(userTable).all();
    return users;
}

export const getUserById = async (id: number) => {
    const user = await db.select().from(userTable).where(eq(userTable.id, id));
    return user;
}

export const registerUser = async (email: string, password: string, societyId: number, type: 'employee' | 'structure' | 'society') => {
    await db.insert(userTable).values({
        email: email,
        password: password,
        societyId: societyId,
        type: type
    });
}

export const deleteUser = async (id: number) => {
    const deleted = await db.delete(userTable).where(eq(userTable.id, id)).returning({ deletedId: userTable.id });
    return !!deleted.length;
}