import { db } from "../db";
import { accessibilityTable } from "../db/schema";
import { AccessibilityType } from "../types/accessibility";

export const newAccessibility = async (name: string, icon:string,type:AccessibilityType) => {
    await db.insert(accessibilityTable).values({
        name: name,
        icon: icon,
        type: type
    });
}