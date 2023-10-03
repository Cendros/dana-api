import { InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const check = sqliteTable("check", {
    userId: integer('userId').notNull().references(() => user.id),
    structureId: integer('userId').notNull().references(() => structure.id),
    quantity: integer('quantity').notNull()
})

export const user = sqliteTable("user", {
    id: integer('id', {mode: "number"}).primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    societyId: integer('societyId').notNull().references(() => society.id),
    type: text('type', {enum: ['employee', 'structure', 'society']}).notNull()
})

export const structure = sqliteTable("structure", {
    id: integer('id', {mode: "number"}).primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    address: text('address'),
    city: text('city'),
    postalCode: text('postalCode'),
})

export const society = sqliteTable("society", {
    id: integer('id', {mode: "number"}).primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
})

export type Check = InferSelectModel<typeof check>;
export type Structure = InferSelectModel<typeof structure>;
export type Society = InferSelectModel<typeof society>;
export type User = InferSelectModel<typeof user>;