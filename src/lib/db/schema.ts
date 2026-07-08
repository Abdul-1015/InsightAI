import { pgTable, text, integer, timestamp, uuid, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  provider: text('provider').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
}));

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('sessions_user_id_idx').on(table.userId),
  tokenIdx: index('sessions_token_idx').on(table.token),
}));

export type SessionRow = typeof sessions.$inferSelect;
export type NewSessionRow = typeof sessions.$inferInsert;

export const datasets = pgTable('datasets', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  fileType: text('file_type').notNull(),
  size: integer('size').notNull(),
  rowCount: integer('row_count').notNull(),
  columns: text('columns').array().notNull(),
  filePath: text('file_path').notNull(),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
});

export type Dataset = typeof datasets.$inferSelect;
export type NewDataset = typeof datasets.$inferInsert;
