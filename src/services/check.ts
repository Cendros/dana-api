import { db } from "../db"
import { check } from "../db/schema"

export const getChecks = async () => {
    const checks = await db.select().from(check).all();
    return checks;
}