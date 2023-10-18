import { and, desc, eq, gt, isNotNull, sql } from "drizzle-orm";
import { db } from "../db"
import { structureTable, employeeUserTable, checkSocietyTable } from "../db/schema"

export const getCheckFromUser = async (userId: number) => {
    // const checks = await db
    //     .select({
    //         structureId: checkTable.structureId,
    //         structureName: structureTable.name,
    //         image: structureTable.image,
    //         quantity: checkTable.quantity,
    //         value: structureTable.checkValue
    //     })
    //     .from(checkTable)
    //     .where(and(eq(checkTable.userId, userId), isNotNull(structureTable.checkValue)))
    //     .leftJoin(structureTable, eq(checkTable. structureId, structureTable.id))
    //     .orderBy(desc(checkTable.quantity));
    // return checks;
}