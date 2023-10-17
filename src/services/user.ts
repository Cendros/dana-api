import { eq } from "drizzle-orm";
import { db } from "../db"
import { LibsqlError } from "@libsql/client";
import { employeeUserTable } from "../db/schema";

export const getUsers = async () => {
    const users = await db.select().from(employeeUserTable).all();
    return users;
}

export const getUserById = async (id: number) => {
    const user = await db.select().from(employeeUserTable).where(eq(employeeUserTable.id, id));
    return user;
}

export const getSocietyIdById = async (id: number) => {
    const user = await db.query.employeeUserTable.findFirst({
        columns: {
            societyId: true
        },
        where: eq(employeeUserTable.id, id)
    })
    return user?.societyId;
}

export const deleteUser = async (id: number) => {
    const deleted = await db.delete(employeeUserTable).where(eq(employeeUserTable.id, id)).returning({ deletedId: employeeUserTable.id });
    return !!deleted.length;
}