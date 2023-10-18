import Elysia, { t } from "elysia";
import { newAccessibility } from "../../services/accessibility";
import { AccessibilityType } from "../../types/accessibility";

export const accessibilityController = new Elysia({ prefix: '/accessibility' }) 
    .post("/new",async({ body })=>{
        await newAccessibility(body.name, body.icon, body.type as AccessibilityType)
        return { created: true }
    }, {
    body: t.Object(
        {
            name: t.String(),
            icon: t.String(),
            type: t.String()
        },
    ),
    detail: {
        summary: 'Create a new accessibility',
        tags: ['Admin']
    }
})