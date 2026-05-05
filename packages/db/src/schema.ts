import { pgTable, text, integer, boolean, timestamp, jsonb, bigint, serial, uuid } from "drizzle-orm/pg-core";

export const menusTable = pgTable("menus", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  long_description: text("long_description"),
  tag: text("tag"),
  target_audience: text("target_audience"),
  price_per_person: integer("price_per_person").notNull().default(0),
  image_url: text("image_url"),
  banner_url: text("banner_url"),
  category: text("category").notNull().default("office"),
  is_active: boolean("is_active").notNull().default(true),
  is_featured: boolean("is_featured").notNull().default(false),
  dishes: jsonb("dishes").$type<Array<{ name: string; description?: string }>>().default([]),
  nutrition_calories: integer("nutrition_calories"),
  nutrition_protein: integer("nutrition_protein"),
  nutrition_fat: integer("nutrition_fat"),
  nutrition_carbs: integer("nutrition_carbs"),
  min_guests: integer("min_guests").default(10),
  seo_metadata: jsonb("seo_metadata").$type<Record<string, string>>(),
  faqs: jsonb("faqs").$type<Array<{ q: string; a: string }>>().default([]),
  view_count: integer("view_count").notNull().default(0),
  lead_count: integer("lead_count").notNull().default(0),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const ordersTable = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  customer_name: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  company_name: text("company_name"),
  event_date: text("event_date"),
  service_type: text("service_type"),
  menu_name: text("menu_name"),
  menu_id: uuid("menu_id"),
  guest_count: integer("guest_count"),
  price_per_person: integer("price_per_person"),
  subtotal: integer("subtotal").default(0),
  service_fee: integer("service_fee").default(0),
  total_amount: integer("total_amount").default(0),
  address: text("address"),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  ai_score: text("ai_score"),
  ai_score_reason: text("ai_score_reason"),
  source_page: text("source_page"),
  utm_source: text("utm_source"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const leadsTable = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  menu_name: text("menu_name"),
  menu_price: integer("menu_price"),
  guest_count: integer("guest_count"),
  service_type: text("service_type"),
  customer_name: text("customer_name"),
  phone: text("phone"),
  email: text("email"),
  source_page: text("source_page"),
  utm_source: text("utm_source"),
  ai_score: text("ai_score"),
  ai_score_reason: text("ai_score_reason"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const customersTable = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  company_name: text("company_name"),
  total_orders: integer("total_orders").notNull().default(0),
  total_spent: integer("total_spent").notNull().default(0),
  loyalty_points: integer("loyalty_points").notNull().default(0),
  referral_code: text("referral_code").unique(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const blogPostsTable = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull().default(""),
  excerpt: text("excerpt"),
  category: text("category"),
  featured_image: text("featured_image"),
  author: text("author"),
  is_published: boolean("is_published").notNull().default(false),
  published_at: timestamp("published_at"),
  reading_time: integer("reading_time"),
  tags: jsonb("tags").$type<string[]>().default([]),
  view_count: integer("view_count").notNull().default(0),
  meta_title: text("meta_title"),
  meta_description: text("meta_description"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value"),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const abTestsTable = pgTable("ab_tests", {
  id: serial("id").primaryKey(),
  test_name: text("test_name").notNull(),
  variant: text("variant").notNull(),
  impressions: integer("impressions").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const chatSessionsTable = pgTable("chat_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  session_id: text("session_id").notNull().unique(),
  messages: jsonb("messages").$type<Array<{ role: string; content: string }>>().default([]),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
