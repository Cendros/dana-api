import { eq } from "drizzle-orm";
import { db } from "../db"
import { userTable } from "../db/schema"
import { UserTypes } from "../types/user";
import { LibsqlError } from "@libsql/client";

export const getUsers = async () => {
    const users = await db.select().from(userTable).all();
    return users;
}

export const getUserById = async (id: number) => {
    const user = await db.select().from(userTable).where(eq(userTable.id, id));
    return user;
}

export const getSocietyIdById = async (id: number) => {
    const user = await db.query.userTable.findFirst({
        columns: {
            societyId: true
        },
        where: eq(userTable.id, id)
    })
    return user?.societyId;
}

export const getCode128 = async (id: number) => {
    const code = await db.query.userTable.findFirst({
        columns: {
            code128: true
        },
        where: eq(userTable.id, id)
    })
    return code?.code128;
}

export const generateNewCode128 = async (id: number) => {    
    for (let i = 0; i < 10; i++) {
        try {
            const code = Math.random().toString().slice(2, 10);
            await db.update(userTable)
                .set({ code128: code })
                .where(eq(userTable.id, id));

            return code;
        } catch (err) {
            if (!(err instanceof LibsqlError))
                throw new Error();
        }
    }
    throw new Error('Unable to generate code');
}

export const deleteUser = async (id: number) => {
    const deleted = await db.delete(userTable).where(eq(userTable.id, id)).returning({ deletedId: userTable.id });
    return !!deleted.length;
}