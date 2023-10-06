import { InferSelectModel, SQL } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const checkTable = sqliteTable("check", {
    userId: integer('user_id').notNull().references(() => userTable.id),
    structureId: integer('structure_id').notNull().references(() => structureTable.id),
    quantity: integer('quantity').notNull(),
}, (table) => {
    return {
        pk: primaryKey(table.userId, table.structureId)
    }
})

export const userTable = sqliteTable("user", {
    id: integer('id', { mode: "number" }).primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    societyId: integer('society_id').notNull().references(() => societyTable.id),
    type: text('type', {enum: ['employee', 'structure', 'society']}).notNull()
})

export const structureTable = sqliteTable("structure", {
    id: integer('id', { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    address: text('address'),
    city: text('city'),
    postalCode: text('postalCode'),
    checkValue: integer('check_value'),
    image: text('image')
})

export const societyTable = sqliteTable("society", {
    id: integer('id', {mode: "number"}).primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
})

export type Check = InferSelectModel<typeof checkTable>;
export type Structure = InferSelectModel<typeof structureTable>;
export type Society = InferSelectModel<typeof societyTable>;
export type User = InferSelectModel<typeof userTable>;