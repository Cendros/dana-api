import { eq } from "drizzle-orm";
import { db } from "../db"
import { employeeUserTable } from "../db/schema";

export const getUsers = async () => {
    const users = await db.select().from(employeeUserTable).all();
    return users;
}

export const getUserById = async (id: number) => {
    const user = await db.query.employeeUserTable.findFirst({
        where: eq(employeeUserTable.id, id)
    });
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
    const deleted = await db.delete(employeeUserTable).where(eq(employeeUserTable.id, id));
    return !!deleted.rowsAffected;
}

export const refill = async (societyId: number, balance: number) => {
    const edit = await db.update(employeeUserTable).set({ balance: balance }).where(eq(employeeUserTable.societyId, societyId));
    return !!edit.rowsAffected;
}

export const getBalance = async (id: number) => {
    const user = await db.query.employeeUserTable.findFirst({
        columns: {
            balance: true
        },
        where: eq(employeeUserTable.id, id)
    })
    return user?.balance;
}

export const getProfile = async (id: number) => {
    const profile = await db.query.employeeUserTable.findFirst({
        columns: {
            firstname: true,
            lastname: true,
            email: true
        },
        where: eq(employeeUserTable.id, id)
    })
    return profile;
}

export const modifyInfos = async (userId: number, firstname: string | null | undefined, lastname: string | null | undefined, password: string | null | undefined) => {
    const edit = await db.update(employeeUserTable)
        .set({
            ...firstname && { firstname },
            ...lastname && { lastname },
            ...password && { password },
        })
        .where(eq(employeeUserTable.id, userId));
    return !!edit.rowsAffected;
}