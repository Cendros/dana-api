import { eq } from "drizzle-orm"
import { db } from "../db"
import { employeeUserTable, societyUserTable, structureUserTable } from "../db/schema";
import { UserTypes } from "../consts/userTypes";

export const logEmployee = async (email: string, password: string) => {
    const user = await db.query.employeeUserTable.findFirst({
        where: eq(employeeUserTable.email, email)
    });
    if (!user)
        return false;
        
    const valid = await Bun.password.verify(password, user!.password);
    return valid ? {
        id: String(user.id),
        societyId: String(user.societyId),
        role: UserTypes.Employee.toString()
    } : false;
}

export const logSociety = async (email: string, password: string) => {
    const user = await db.query.societyUserTable.findFirst({
        where: eq(societyUserTable.email, email)
    });
    if (!user)
        return false;
        
    const valid = await Bun.password.verify(password, user!.password);
    return valid ? {
        id: String(user.id),
        societyId: String(user.societyId),
        role: UserTypes.Society.toString()
    } : false;
}

export const logStructure = async (email: string, password: string) => {
    const user = await db.query.structureUserTable.findFirst({
        where: eq(structureUserTable.email, email)
    });
    if (!user)
        return false;
        
    const valid = await Bun.password.verify(password, user!.password);
    return valid ? {
        id: String(user.id),
        structureId: String(user.structureId),
        role: UserTypes.Structure.toString()
    } : false;
}

export const registerEmployee = async (email: string, password: string, societyId: number) => {
    await db.insert(employeeUserTable).values({
        email: email,
        password: password,
        societyId: societyId,
    });
}

export const registerSociety = async (email: string, password: string, societyId: number) => {
    await db.insert(societyUserTable).values({
        email: email,
        password: password,
        societyId: societyId,
    });
}

export const registerStructure = async (email: string, password: string, structureId: number) => {
    await db.insert(structureUserTable).values({
        email: email,
        password: password,
        structureId: structureId,
    });
}