import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const now = (name: string) =>
  integer(name, { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`);

const optionalTime = (name: string) => integer(name, { mode: "timestamp_ms" });

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: now("created_at"),
  updatedAt: now("updated_at"),
});

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: now("created_at"),
    updatedAt: now("updated_at"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: optionalTime("access_token_expires_at"),
    refreshTokenExpiresAt: optionalTime("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: now("created_at"),
    updatedAt: now("updated_at"),
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    uniqueIndex("account_provider_account_idx").on(table.providerId, table.accountId),
  ],
);

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: now("created_at"),
    updatedAt: now("updated_at"),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const rateLimit = sqliteTable(
  "rateLimit",
  {
    id: text("id").primaryKey(),
    key: text("key").notNull().unique(),
    count: integer("count").notNull(),
    lastRequest: integer("last_request").notNull(),
  },
  (table) => [index("rate_limit_last_request_idx").on(table.lastRequest)],
);

export const networkApplications = sqliteTable(
  "network_applications",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    firstName: text("first_name").notNull(),
    displayName: text("display_name").notNull(),
    location: text("location").notNull(),
    requestedCategory: text("requested_category").notNull(),
    bio: text("bio").notNull(),
    websiteUrl: text("website_url"),
    instagramUrl: text("instagram_url"),
    profileImageKey: text("profile_image_key"),
    status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
    submittedAt: now("submitted_at"),
    reviewedAt: optionalTime("reviewed_at"),
  },
  (table) => [index("applications_status_idx").on(table.status)],
);

export const members = sqliteTable(
  "members",
  {
    id: text("id").primaryKey(),
    firstName: text("first_name").notNull().default(""),
    email: text("email").notNull(),
    emailNormalized: text("email_normalized").notNull(),
    authUserId: text("auth_user_id").unique(),
    accountStatus: text("account_status", { enum: ["unclaimed", "invited", "active", "disabled"] })
      .notNull()
      .default("invited"),
    approvalStatus: text("approval_status", { enum: ["pending", "approved", "rejected"] })
      .notNull()
      .default("approved"),
    role: text("role", { enum: ["member", "admin"] }).notNull().default("member"),
    joinedAt: now("joined_at"),
    invitedAt: optionalTime("invited_at"),
    lastLoginAt: optionalTime("last_login_at"),
    createdAt: now("created_at"),
    updatedAt: now("updated_at"),
  },
  (table) => [
    index("members_status_idx").on(table.accountStatus, table.approvalStatus),
    index("members_email_normalized_idx").on(table.emailNormalized),
  ],
);

export const memberProfiles = sqliteTable(
  "member_profiles",
  {
    memberId: text("member_id")
      .primaryKey()
      .references(() => members.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    location: text("location").notNull(),
    primaryGroup: text("primary_group").notNull(),
    speciality: text("speciality").notNull(),
    bio: text("bio").notNull(),
    about: text("about").notNull().default(""),
    websiteUrl: text("website_url"),
    instagramUrl: text("instagram_url"),
    facebookUrl: text("facebook_url"),
    linkedinUrl: text("linkedin_url"),
    tiktokUrl: text("tiktok_url"),
    youtubeUrl: text("youtube_url"),
    profileImageKey: text("profile_image_key"),
    published: integer("published", { mode: "boolean" }).notNull().default(true),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    lastFeaturedAt: optionalTime("last_featured_at"),
    updatedAt: now("updated_at"),
  },
  (table) => [index("profiles_group_idx").on(table.primaryGroup, table.published)],
);

export const profileImages = sqliteTable(
  "profile_images",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    r2Key: text("r2_key").notNull().unique(),
    position: integer("position").notNull(),
    altText: text("alt_text").notNull(),
    title: text("title").notNull().default(""),
    description: text("description").notNull().default(""),
    linkUrl: text("link_url"),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    contentType: text("content_type").notNull(),
    status: text("status", { enum: ["uploading", "ready", "replaced"] }).notNull().default("uploading"),
    createdAt: now("created_at"),
    updatedAt: now("updated_at"),
  },
  (table) => [
    uniqueIndex("profile_images_member_position_idx").on(table.memberId, table.position),
    index("profile_images_member_idx").on(table.memberId),
  ],
);

export const memberInvites = sqliteTable(
  "member_invites",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    redeemedAt: optionalTime("redeemed_at"),
    revokedAt: optionalTime("revoked_at"),
    createdAt: now("created_at"),
  },
  (table) => [index("member_invites_member_idx").on(table.memberId)],
);

export const profileAuditLog = sqliteTable(
  "profile_audit_log",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id").notNull(),
    actorUserId: text("actor_user_id").notNull(),
    changedFields: text("changed_fields", { mode: "json" }).$type<string[]>().notNull(),
    beforeJson: text("before_json", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
    afterJson: text("after_json", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
    createdAt: now("created_at"),
  },
  (table) => [index("profile_audit_member_idx").on(table.memberId, table.createdAt)],
);

export const sheetSyncJobs = sqliteTable(
  "sheet_sync_jobs",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id").notNull(),
    status: text("status", { enum: ["pending", "processing", "complete", "failed"] })
      .notNull()
      .default("pending"),
    attempts: integer("attempts").notNull().default(0),
    nextAttemptAt: now("next_attempt_at"),
    lastError: text("last_error"),
    completedAt: optionalTime("completed_at"),
    createdAt: now("created_at"),
    updatedAt: now("updated_at"),
  },
  (table) => [index("sheet_sync_pending_idx").on(table.status, table.nextAttemptAt)],
);

export const mailchimpSyncJobs = sqliteTable(
  "mailchimp_sync_jobs",
  {
    id: text("id").primaryKey(),
    applicationId: text("application_id")
      .notNull()
      .references(() => networkApplications.id, { onDelete: "cascade" }),
    status: text("status", { enum: ["pending", "processing", "complete", "failed"] })
      .notNull()
      .default("pending"),
    attempts: integer("attempts").notNull().default(0),
    nextAttemptAt: now("next_attempt_at"),
    lastError: text("last_error"),
    audienceSyncedAt: optionalTime("audience_synced_at"),
    welcomeTriggeredAt: optionalTime("welcome_triggered_at"),
    completedAt: optionalTime("completed_at"),
    createdAt: now("created_at"),
    updatedAt: now("updated_at"),
  },
  (table) => [
    uniqueIndex("mailchimp_sync_application_idx").on(table.applicationId),
    index("mailchimp_sync_pending_idx").on(table.status, table.nextAttemptAt),
  ],
);

export const emailJobs = sqliteTable(
  "email_jobs",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id"),
    recipient: text("recipient").notNull(),
    template: text("template").notNull(),
    payload: text("payload", { mode: "json" }).$type<Record<string, string>>().notNull(),
    status: text("status", { enum: ["pending", "processing", "sent", "failed"] })
      .notNull()
      .default("pending"),
    attempts: integer("attempts").notNull().default(0),
    nextAttemptAt: now("next_attempt_at"),
    lastError: text("last_error"),
    sentAt: optionalTime("sent_at"),
    createdAt: now("created_at"),
    updatedAt: now("updated_at"),
  },
  (table) => [index("email_jobs_pending_idx").on(table.status, table.nextAttemptAt)],
);

export const systemState = sqliteTable("system_state", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: now("updated_at"),
});

export const supportTickets = sqliteTable(
  "support_tickets",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id").references(() => members.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject").notNull(),
    description: text("description").notNull(),
    pageUrl: text("page_url"),
    status: text("status", { enum: ["open", "in_progress", "resolved"] }).notNull().default("open"),
    priority: text("priority", { enum: ["normal", "urgent"] }).notNull().default("normal"),
    createdAt: now("created_at"),
    updatedAt: now("updated_at"),
    resolvedAt: optionalTime("resolved_at"),
  },
  (table) => [
    index("support_tickets_status_idx").on(table.status, table.createdAt),
    index("support_tickets_member_idx").on(table.memberId, table.createdAt),
  ],
);

export const networkEvents = sqliteTable(
  "network_events",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    venue: text("venue").notNull(),
    location: text("location").notNull(),
    startsAt: integer("starts_at", { mode: "timestamp_ms" }).notNull(),
    endsAt: optionalTime("ends_at"),
    bookingUrl: text("booking_url"),
    status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
    submittedAt: now("submitted_at"),
    reviewedAt: optionalTime("reviewed_at"),
    publishedAt: optionalTime("published_at"),
    updatedAt: now("updated_at"),
  },
  (table) => [
    index("network_events_status_idx").on(table.status, table.startsAt),
    index("network_events_member_idx").on(table.memberId, table.submittedAt),
  ],
);

export const ownerAlertJobs = sqliteTable(
  "owner_alert_jobs",
  {
    id: text("id").primaryKey(),
    kind: text("kind", { enum: ["application", "ticket", "event"] }).notNull(),
    recordId: text("record_id").notNull(),
    recipient: text("recipient").notNull(),
    subject: text("subject").notNull(),
    heading: text("heading").notNull(),
    body: text("body").notNull(),
    actionUrl: text("action_url").notNull(),
    status: text("status", { enum: ["pending", "processing", "sent", "failed"] })
      .notNull()
      .default("pending"),
    attempts: integer("attempts").notNull().default(0),
    nextAttemptAt: now("next_attempt_at"),
    lastError: text("last_error"),
    sentAt: optionalTime("sent_at"),
    createdAt: now("created_at"),
    updatedAt: now("updated_at"),
  },
  (table) => [
    index("owner_alert_jobs_pending_idx").on(table.status, table.nextAttemptAt),
    index("owner_alert_jobs_record_idx").on(table.kind, table.recordId),
  ],
);

export const directorySearchEvents = sqliteTable(
  "directory_search_events",
  {
    id: text("id").primaryKey(),
    eventType: text("event_type", { enum: ["search", "result_clicked"] }).notNull(),
    anonymousSessionId: text("anonymous_session_id").notNull(),
    searchQuery: text("search_query").notNull().default(""),
    categoryFilter: text("category_filter").notNull().default("All categories"),
    locationFilter: text("location_filter").notNull().default("All areas"),
    resultCount: integer("result_count").notNull().default(0),
    selectedMemberId: text("selected_member_id"),
    sourcePath: text("source_path").notNull().default("/network/directory"),
    dedupeKey: text("dedupe_key").notNull().unique(),
    createdAt: now("created_at"),
  },
  (table) => [
    index("directory_search_events_created_idx").on(table.createdAt),
    index("directory_search_events_query_idx").on(table.searchQuery, table.createdAt),
    index("directory_search_events_type_idx").on(table.eventType, table.createdAt),
  ],
);
