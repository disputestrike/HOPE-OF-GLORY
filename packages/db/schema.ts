/**
 * Hope of Glory Ministry — Database Schema
 * ----------------------------------------
 * Drizzle ORM schema for PostgreSQL 16 with extensions:
 *   - uuid-ossp  (uuid_generate_v4 default for primary keys)
 *   - pgcrypto   (gen_random_bytes, digest for caller_hash verification, etc.)
 *   - pgvector   (vector(1536) embeddings)
 *
 * Conventions:
 *   - Primary keys: uuid, default uuid_generate_v4()
 *   - Temporal fields: timestamp with time zone (timestamptz), default now()
 *   - Status fields use pgEnums for type safety
 *   - Foreign keys always declare onDelete behavior explicitly
 *   - JSON columns use jsonb (never json)
 *   - Money columns use numeric(12, 2)
 *
 * Vector dimension choice: 1536 (matches OpenAI text-embedding-3-small and
 * text-embedding-ada-002). See ARCHITECTURE.md for the upgrade path to 3072.
 */

import { sql } from 'drizzle-orm';
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  integer,
  bigint,
  boolean,
  timestamp,
  jsonb,
  numeric,
  index,
  uniqueIndex,
  primaryKey,
  smallint,
  real,
} from 'drizzle-orm/pg-core';
import { vector } from 'drizzle-orm/pg-core';

/* ============================================================================
 * ENUMS
 * ========================================================================== */

export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'editor',
  'reviewer',
  'pastor',
  'volunteer',
  'viewer',
]);

export const userStatusEnum = pgEnum('user_status', [
  'active',
  'invited',
  'suspended',
  'deleted',
]);

export const subscriberStatusEnum = pgEnum('subscriber_status', [
  'pending',
  'confirmed',
  'unsubscribed',
  'bounced',
  'complained',
]);

export const contactStatusEnum = pgEnum('contact_status', [
  'new',
  'in_progress',
  'resolved',
  'spam',
]);

export const doctrineStatusEnum = pgEnum('doctrine_status', [
  'draft',
  'review',
  'approved',
  'archived',
]);

export const sourceTypeEnum = pgEnum('source_type', [
  'scripture',
  'commentary',
  'creed',
  'confession',
  'catechism',
  'sermon',
  'book',
  'article',
  'lexicon',
  'historical',
  'other',
]);

export const licenseTypeEnum = pgEnum('license_type', [
  'public_domain',
  'creative_commons',
  'fair_use',
  'licensed',
  'proprietary',
  'unknown',
]);

export const sourceStatusEnum = pgEnum('source_status', [
  'pending',
  'ingesting',
  'indexed',
  'failed',
  'retired',
]);

export const sermonStatusEnum = pgEnum('sermon_status', [
  'draft',
  'generated',
  'in_review',
  'approved',
  'scheduled',
  'published',
  'retracted',
]);

export const assetTypeEnum = pgEnum('asset_type', [
  'audio',
  'video',
  'image',
  'transcript',
  'subtitle',
  'thumbnail',
  'pdf',
]);

export const chatChannelEnum = pgEnum('chat_channel', [
  'web',
  'phone',
  'sms',
  'live',
  'embed',
  'api',
]);

export const chatRoleEnum = pgEnum('chat_role', [
  'user',
  'assistant',
  'system',
  'tool',
]);

export const riskLevelEnum = pgEnum('risk_level', [
  'none',
  'low',
  'medium',
  'high',
  'critical',
]);

export const privacyLevelEnum = pgEnum('privacy_level', [
  'public',
  'private',
  'staff_only',
  'anonymous',
]);

export const followUpStateEnum = pgEnum('follow_up_state', [
  'pending',
  'praying',
  'completed',
  'declined',
  'escalated',
]);

export const questionSourceEnum = pgEnum('question_source', [
  'web',
  'live',
  'social',
  'email',
  'phone',
  'sms',
]);

export const questionStatusEnum = pgEnum('question_status', [
  'new',
  'queued',
  'answered',
  'reviewed',
  'published',
  'rejected',
]);

export const platformEnum = pgEnum('platform', [
  'youtube',
  'facebook',
  'instagram',
  'tiktok',
  'x',
  'threads',
  'linkedin',
  'rumble',
  'twitch',
  'web',
  'email',
  'sms',
  'rss',
]);

export const callRiskLevelEnum = pgEnum('call_risk_level', [
  'none',
  'low',
  'medium',
  'high',
  'crisis',
]);

export const callSpeakerEnum = pgEnum('call_speaker', [
  'caller',
  'agent',
  'system',
  'human_operator',
]);

export const crisisSeverityEnum = pgEnum('crisis_severity', [
  'flag',
  'concern',
  'urgent',
  'imminent',
]);

export const liveStatusEnum = pgEnum('live_status', [
  'scheduled',
  'pre_live',
  'live',
  'paused',
  'ended',
  'archived',
  'cancelled',
]);

export const socialPostStatusEnum = pgEnum('social_post_status', [
  'draft',
  'scheduled',
  'queued',
  'posted',
  'failed',
  'deleted',
]);

export const emailCampaignStatusEnum = pgEnum('email_campaign_status', [
  'draft',
  'scheduled',
  'sending',
  'sent',
  'failed',
  'cancelled',
]);

export const engagementStatusEnum = pgEnum('engagement_status', [
  'new',
  'queued',
  'replied',
  'ignored',
  'escalated',
  'auto_replied',
]);

export const sentimentEnum = pgEnum('sentiment', [
  'positive',
  'neutral',
  'negative',
  'mixed',
  'hostile',
  'spiritual_distress',
]);

export const donationStatusEnum = pgEnum('donation_status', [
  'initiated',
  'pending',
  'succeeded',
  'failed',
  'refunded',
  'disputed',
]);

export const agentRunStatusEnum = pgEnum('agent_run_status', [
  'queued',
  'running',
  'succeeded',
  'failed',
  'cancelled',
  'requires_review',
  'rejected',
]);

export const providerEnum = pgEnum('provider', [
  'cerebras',
  'openai',
  'anthropic',
  'groq',
  'google',
  'azure',
  'aws_bedrock',
  'mistral',
  'elevenlabs',
  'deepgram',
  'signalwire',
  'postiz',
  'stripe',
  'tithely',
  'givelify',
  'resend',
  'sendgrid',
  'mailgun',
  'internal',
]);

export const providerEnvEnum = pgEnum('provider_environment', [
  'development',
  'preview',
  'staging',
  'production',
]);

export const providerKeyStatusEnum = pgEnum('provider_key_status', [
  'active',
  'rotating',
  'cooldown',
  'disabled',
  'compromised',
]);

export const serviceClassEnum = pgEnum('service_class', [
  'sermons',
  'chat',
  'live',
  'phone',
  'background',
  'embeddings',
  'moderation',
  'tts',
  'stt',
  'images',
  'video',
]);

export const moderationStatusEnum = pgEnum('moderation_status', [
  'pending',
  'approved',
  'rejected',
  'auto_blocked',
  'manual_review',
  'escalated',
]);

export const correctionStatusEnum = pgEnum('correction_status', [
  'open',
  'in_progress',
  'applied',
  'rejected',
  'duplicate',
]);

export const jobStatusEnum = pgEnum('job_status', [
  'queued',
  'running',
  'succeeded',
  'failed',
  'cancelled',
  'retrying',
  'timed_out',
]);

export const handoffStatusEnum = pgEnum('handoff_status', [
  'open',
  'assigned',
  'in_progress',
  'resolved',
  'closed',
  'escalated',
]);

export const handoffSourceTypeEnum = pgEnum('handoff_source_type', [
  'chat_session',
  'call_session',
  'prayer_request',
  'contact_submission',
  'question',
  'social_engagement',
  'crisis_event',
  'live_event',
  'email',
]);

/* ============================================================================
 * USERS & AUTH
 * ========================================================================== */

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    email: varchar('email', { length: 320 }).notNull(),
    name: varchar('name', { length: 200 }),
    role: userRoleEnum('role').notNull().default('viewer'),
    status: userStatusEnum('status').notNull().default('active'),
    avatarUrl: text('avatar_url'),
    timezone: varchar('timezone', { length: 64 }),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    emailUq: uniqueIndex('users_email_uq').on(t.email),
    roleIx: index('users_role_ix').on(t.role),
    statusIx: index('users_status_ix').on(t.status),
  }),
);

export const oauthAccounts = pgTable(
  'oauth_accounts',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: providerEnum('provider').notNull(),
    providerAccountId: varchar('provider_account_id', { length: 256 }).notNull(),
    accessTokenEncrypted: text('access_token_encrypted'),
    refreshTokenEncrypted: text('refresh_token_encrypted'),
    tokenType: varchar('token_type', { length: 64 }),
    scope: text('scope'),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    providerAccountUq: uniqueIndex('oauth_accounts_provider_account_uq').on(
      t.provider,
      t.providerAccountId,
    ),
    userIx: index('oauth_accounts_user_ix').on(t.userId),
  }),
);

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    sessionTokenHash: varchar('session_token_hash', { length: 128 }).notNull(),
    ipAddress: varchar('ip_address', { length: 64 }),
    userAgent: text('user_agent'),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    tokenUq: uniqueIndex('sessions_token_hash_uq').on(t.sessionTokenHash),
    userIx: index('sessions_user_ix').on(t.userId),
    expiresIx: index('sessions_expires_ix').on(t.expiresAt),
  }),
);

export const emailSubscribers = pgTable(
  'email_subscribers',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    email: varchar('email', { length: 320 }).notNull(),
    name: varchar('name', { length: 200 }),
    phone: varchar('phone', { length: 32 }),
    status: subscriberStatusEnum('status').notNull().default('pending'),
    sourcePage: varchar('source_page', { length: 512 }),
    consentText: text('consent_text'),
    optedInAt: timestamp('opted_in_at', { withTimezone: true }),
    unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
    lastSentAt: timestamp('last_sent_at', { withTimezone: true }),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    emailUq: uniqueIndex('email_subscribers_email_uq').on(t.email),
    statusIx: index('email_subscribers_status_ix').on(t.status),
  }),
);

export const contactSubmissions = pgTable(
  'contact_submissions',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    name: varchar('name', { length: 200 }),
    email: varchar('email', { length: 320 }),
    phone: varchar('phone', { length: 32 }),
    message: text('message').notNull(),
    sourcePage: varchar('source_page', { length: 512 }),
    status: contactStatusEnum('status').notNull().default('new'),
    handledBy: uuid('handled_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    handledAt: timestamp('handled_at', { withTimezone: true }),
    ipHash: varchar('ip_hash', { length: 128 }),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    statusIx: index('contact_submissions_status_ix').on(t.status),
    createdIx: index('contact_submissions_created_ix').on(t.createdAt),
  }),
);

/* ============================================================================
 * DOCTRINE & SOURCES
 * ========================================================================== */

export const doctrineDocuments = pgTable(
  'doctrine_documents',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    slug: varchar('slug', { length: 200 }).notNull(),
    version: integer('version').notNull().default(1),
    status: doctrineStatusEnum('status').notNull().default('draft'),
    title: varchar('title', { length: 300 }).notNull(),
    summary: text('summary'),
    body: text('body').notNull(),
    checksum: varchar('checksum', { length: 128 }).notNull(),
    authorId: uuid('author_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    approvedBy: uuid('approved_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    approvedAt: timestamp('approved_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    slugVersionUq: uniqueIndex('doctrine_documents_slug_version_uq').on(
      t.slug,
      t.version,
    ),
    statusIx: index('doctrine_documents_status_ix').on(t.status),
  }),
);

export const sources = pgTable(
  'sources',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    sourceType: sourceTypeEnum('source_type').notNull(),
    title: varchar('title', { length: 500 }).notNull(),
    author: varchar('author', { length: 300 }),
    publisher: varchar('publisher', { length: 300 }),
    licenseType: licenseTypeEnum('license_type').notNull().default('unknown'),
    licenseNotes: text('license_notes'),
    canonicalRef: varchar('canonical_ref', { length: 200 }),
    version: varchar('version', { length: 64 }),
    language: varchar('language', { length: 32 }).notNull().default('en'),
    status: sourceStatusEnum('status').notNull().default('pending'),
    sourceUrl: text('source_url'),
    ingestedAt: timestamp('ingested_at', { withTimezone: true }),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    typeIx: index('sources_type_ix').on(t.sourceType),
    statusIx: index('sources_status_ix').on(t.status),
    canonicalIx: index('sources_canonical_ix').on(t.canonicalRef),
  }),
);

export const sourceChunks = pgTable(
  'source_chunks',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    sourceId: uuid('source_id')
      .notNull()
      .references(() => sources.id, { onDelete: 'cascade' }),
    chunkIndex: integer('chunk_index').notNull(),
    content: text('content').notNull(),
    tokenCount: integer('token_count'),
    book: varchar('book', { length: 64 }),
    chapter: integer('chapter'),
    verseStart: integer('verse_start'),
    verseEnd: integer('verse_end'),
    topic: varchar('topic', { length: 200 }),
    doctrineTags: text('doctrine_tags').array(),
    metadataJson: jsonb('metadata_json').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    sourceChunkUq: uniqueIndex('source_chunks_source_idx_uq').on(
      t.sourceId,
      t.chunkIndex,
    ),
    bookChapIx: index('source_chunks_book_chap_ix').on(t.book, t.chapter),
    topicIx: index('source_chunks_topic_ix').on(t.topic),
  }),
);

export const embeddings = pgTable(
  'embeddings',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    chunkId: uuid('chunk_id')
      .notNull()
      .references(() => sourceChunks.id, { onDelete: 'cascade' }),
    embeddingModel: varchar('embedding_model', { length: 128 }).notNull(),
    // 1536 dims: OpenAI text-embedding-3-small / ada-002. See ARCHITECTURE.md.
    vector: vector('vector', { dimensions: 1536 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    chunkModelUq: uniqueIndex('embeddings_chunk_model_uq').on(
      t.chunkId,
      t.embeddingModel,
    ),
    // ANN index defined in migration SQL: USING hnsw (vector vector_cosine_ops)
  }),
);

/* ============================================================================
 * CONTENT — SERMONS & SCRIPTURE
 * ========================================================================== */

export const sermonSeries = pgTable(
  'sermon_series',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    slug: varchar('slug', { length: 200 }).notNull(),
    title: varchar('title', { length: 300 }).notNull(),
    description: text('description'),
    coverImageUrl: text('cover_image_url'),
    startDate: timestamp('start_date', { withTimezone: true }),
    endDate: timestamp('end_date', { withTimezone: true }),
    status: sermonStatusEnum('status').notNull().default('draft'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    slugUq: uniqueIndex('sermon_series_slug_uq').on(t.slug),
  }),
);

export const sermons = pgTable(
  'sermons',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    slug: varchar('slug', { length: 200 }).notNull(),
    seriesId: uuid('series_id').references(() => sermonSeries.id, {
      onDelete: 'set null',
    }),
    primaryPassage: varchar('primary_passage', { length: 200 }),
    supportingPassages: text('supporting_passages').array(),
    title: varchar('title', { length: 300 }).notNull(),
    summary: text('summary'),
    outline: jsonb('outline').default(sql`'[]'::jsonb`),
    fullText: text('full_text'),
    prayer: text('prayer'),
    application: text('application'),
    callToAction: text('call_to_action'),
    originalLanguageNotes: text('original_language_notes'),
    status: sermonStatusEnum('status').notNull().default('draft'),
    scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    audioUrl: text('audio_url'),
    imageUrl: text('image_url'),
    videoUrl: text('video_url'),
    theologyScore: real('theology_score'),
    citationScore: real('citation_score'),
    riskScore: real('risk_score'),
    createdByModel: varchar('created_by_model', { length: 128 }),
    verifiedByModel: varchar('verified_by_model', { length: 128 }),
    reviewedBy: uuid('reviewed_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    slugUq: uniqueIndex('sermons_slug_uq').on(t.slug),
    seriesIx: index('sermons_series_ix').on(t.seriesId),
    statusIx: index('sermons_status_ix').on(t.status),
    publishedIx: index('sermons_published_ix').on(t.publishedAt),
    scheduledIx: index('sermons_scheduled_ix').on(t.scheduledFor),
  }),
);

export const sermonAssets = pgTable(
  'sermon_assets',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    sermonId: uuid('sermon_id')
      .notNull()
      .references(() => sermons.id, { onDelete: 'cascade' }),
    assetType: assetTypeEnum('asset_type').notNull(),
    url: text('url').notNull(),
    mimeType: varchar('mime_type', { length: 128 }),
    sizeBytes: bigint('size_bytes', { mode: 'number' }),
    durationSeconds: integer('duration_seconds'),
    width: integer('width'),
    height: integer('height'),
    language: varchar('language', { length: 32 }),
    checksum: varchar('checksum', { length: 128 }),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    sermonIx: index('sermon_assets_sermon_ix').on(t.sermonId),
    typeIx: index('sermon_assets_type_ix').on(t.assetType),
  }),
);

export const scripturePassages = pgTable(
  'scripture_passages',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    translation: varchar('translation', { length: 32 }).notNull(),
    book: varchar('book', { length: 64 }).notNull(),
    chapter: integer('chapter').notNull(),
    verseStart: integer('verse_start').notNull(),
    verseEnd: integer('verse_end').notNull(),
    canonicalRef: varchar('canonical_ref', { length: 128 }).notNull(),
    text: text('text').notNull(),
    language: varchar('language', { length: 32 }).notNull().default('en'),
    sourceId: uuid('source_id').references(() => sources.id, {
      onDelete: 'set null',
    }),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    refUq: uniqueIndex('scripture_passages_ref_uq').on(
      t.translation,
      t.book,
      t.chapter,
      t.verseStart,
      t.verseEnd,
    ),
    bookChapIx: index('scripture_passages_book_chap_ix').on(t.book, t.chapter),
    canonicalIx: index('scripture_passages_canonical_ix').on(t.canonicalRef),
  }),
);

/* ============================================================================
 * INTERACTIONS — CHAT, PRAYER, QUESTIONS
 * ========================================================================== */

export const chatSessions = pgTable(
  'chat_sessions',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    channel: chatChannelEnum('channel').notNull(),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    anonKey: varchar('anon_key', { length: 128 }),
    startedAt: timestamp('started_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    endedAt: timestamp('ended_at', { withTimezone: true }),
    riskState: riskLevelEnum('risk_state').notNull().default('none'),
    locale: varchar('locale', { length: 32 }),
    referrer: text('referrer'),
    userAgent: text('user_agent'),
    ipHash: varchar('ip_hash', { length: 128 }),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
  },
  (t) => ({
    channelIx: index('chat_sessions_channel_ix').on(t.channel),
    userIx: index('chat_sessions_user_ix').on(t.userId),
    anonIx: index('chat_sessions_anon_ix').on(t.anonKey),
    startedIx: index('chat_sessions_started_ix').on(t.startedAt),
    riskIx: index('chat_sessions_risk_ix').on(t.riskState),
  }),
);

export const chatMessages = pgTable(
  'chat_messages',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => chatSessions.id, { onDelete: 'cascade' }),
    role: chatRoleEnum('role').notNull(),
    content: text('content').notNull(),
    citationsJson: jsonb('citations_json').default(sql`'[]'::jsonb`),
    agentName: varchar('agent_name', { length: 128 }),
    provider: providerEnum('provider'),
    model: varchar('model', { length: 128 }),
    latencyMs: integer('latency_ms'),
    tokensIn: integer('tokens_in'),
    tokensOut: integer('tokens_out'),
    riskScore: real('risk_score'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    sessionIx: index('chat_messages_session_ix').on(t.sessionId),
    createdIx: index('chat_messages_created_ix').on(t.createdAt),
  }),
);

export const prayerRequests = pgTable(
  'prayer_requests',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    submittedFrom: varchar('submitted_from', { length: 64 }).notNull(),
    anonKey: varchar('anon_key', { length: 128 }),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    privacyLevel: privacyLevelEnum('privacy_level')
      .notNull()
      .default('anonymous'),
    content: text('content').notNull(),
    riskLevel: riskLevelEnum('risk_level').notNull().default('none'),
    followUpState: followUpStateEnum('follow_up_state')
      .notNull()
      .default('pending'),
    contactEmail: varchar('contact_email', { length: 320 }),
    contactPhone: varchar('contact_phone', { length: 32 }),
    prayedAt: timestamp('prayed_at', { withTimezone: true }),
    prayedBy: uuid('prayed_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    riskIx: index('prayer_requests_risk_ix').on(t.riskLevel),
    stateIx: index('prayer_requests_state_ix').on(t.followUpState),
    createdIx: index('prayer_requests_created_ix').on(t.createdAt),
  }),
);

export const questions = pgTable(
  'questions',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    source: questionSourceEnum('source').notNull(),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    anonKey: varchar('anon_key', { length: 128 }),
    questionText: text('question_text').notNull(),
    answerText: text('answer_text'),
    agentName: varchar('agent_name', { length: 128 }),
    status: questionStatusEnum('status').notNull().default('new'),
    published: boolean('published').notNull().default(false),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    citationsJson: jsonb('citations_json').default(sql`'[]'::jsonb`),
    reviewedBy: uuid('reviewed_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    statusIx: index('questions_status_ix').on(t.status),
    publishedIx: index('questions_published_ix').on(t.published),
    sourceIx: index('questions_source_ix').on(t.source),
  }),
);

/* ============================================================================
 * VOICE / PHONE
 * ========================================================================== */

export const callSessions = pgTable(
  'call_sessions',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    signalwireCallId: varchar('signalwire_call_id', { length: 128 }).notNull(),
    // SHA-256 of E.164 phone + pepper. Never store raw phone. 64 hex chars.
    callerHash: varchar('caller_hash', { length: 64 }).notNull(),
    startedAt: timestamp('started_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    endedAt: timestamp('ended_at', { withTimezone: true }),
    durationSeconds: integer('duration_seconds'),
    riskLevel: callRiskLevelEnum('risk_level').notNull().default('none'),
    escalatedTo: uuid('escalated_to').references(() => users.id, {
      onDelete: 'set null',
    }),
    escalationAt: timestamp('escalation_at', { withTimezone: true }),
    recordingUrl: text('recording_url'),
    recordingDeletedAt: timestamp('recording_deleted_at', {
      withTimezone: true,
    }),
    agentName: varchar('agent_name', { length: 128 }),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
  },
  (t) => ({
    swCallIdUq: uniqueIndex('call_sessions_sw_call_uq').on(t.signalwireCallId),
    callerHashIx: index('call_sessions_caller_hash_ix').on(t.callerHash),
    startedIx: index('call_sessions_started_ix').on(t.startedAt),
    riskIx: index('call_sessions_risk_ix').on(t.riskLevel),
  }),
);

export const callTurns = pgTable(
  'call_turns',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    callSessionId: uuid('call_session_id')
      .notNull()
      .references(() => callSessions.id, { onDelete: 'cascade' }),
    turnIndex: integer('turn_index').notNull(),
    speaker: callSpeakerEnum('speaker').notNull(),
    text: text('text').notNull(),
    sttConfidence: real('stt_confidence'),
    latencyMs: integer('latency_ms'),
    audioUrl: text('audio_url'),
    audioDeletedAt: timestamp('audio_deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    sessionTurnUq: uniqueIndex('call_turns_session_turn_uq').on(
      t.callSessionId,
      t.turnIndex,
    ),
    sessionIx: index('call_turns_session_ix').on(t.callSessionId),
  }),
);

export const crisisEvents = pgTable(
  'crisis_events',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    callSessionId: uuid('call_session_id').references(() => callSessions.id, {
      onDelete: 'set null',
    }),
    chatSessionId: uuid('chat_session_id').references(() => chatSessions.id, {
      onDelete: 'set null',
    }),
    triggerPhrase: text('trigger_phrase').notNull(),
    severity: crisisSeverityEnum('severity').notNull(),
    actionTaken: text('action_taken').notNull(),
    escalatedTo: uuid('escalated_to').references(() => users.id, {
      onDelete: 'set null',
    }),
    reviewedBy: uuid('reviewed_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    notes: text('notes'),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    severityIx: index('crisis_events_severity_ix').on(t.severity),
    callIx: index('crisis_events_call_ix').on(t.callSessionId),
    chatIx: index('crisis_events_chat_ix').on(t.chatSessionId),
    createdIx: index('crisis_events_created_ix').on(t.createdAt),
  }),
);

/* ============================================================================
 * LIVE
 * ========================================================================== */

export const liveEvents = pgTable(
  'live_events',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    platform: platformEnum('platform').notNull(),
    broadcastId: varchar('broadcast_id', { length: 256 }),
    streamId: varchar('stream_id', { length: 256 }),
    title: varchar('title', { length: 300 }),
    theme: varchar('theme', { length: 200 }),
    agentHost: varchar('agent_host', { length: 128 }),
    scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
    startedAt: timestamp('started_at', { withTimezone: true }),
    endedAt: timestamp('ended_at', { withTimezone: true }),
    status: liveStatusEnum('status').notNull().default('scheduled'),
    coverImageUrl: text('cover_image_url'),
    playbackUrl: text('playback_url'),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    platformBroadcastIx: index('live_events_platform_broadcast_ix').on(
      t.platform,
      t.broadcastId,
    ),
    statusIx: index('live_events_status_ix').on(t.status),
    scheduledIx: index('live_events_scheduled_ix').on(t.scheduledFor),
  }),
);

export const liveQuestions = pgTable(
  'live_questions',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    liveEventId: uuid('live_event_id')
      .notNull()
      .references(() => liveEvents.id, { onDelete: 'cascade' }),
    authorHandle: varchar('author_handle', { length: 200 }),
    authorPlatform: platformEnum('author_platform'),
    questionText: text('question_text').notNull(),
    answerText: text('answer_text'),
    answeredAt: timestamp('answered_at', { withTimezone: true }),
    status: questionStatusEnum('status').notNull().default('new'),
    riskLevel: riskLevelEnum('risk_level').notNull().default('none'),
    upvotes: integer('upvotes').notNull().default(0),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    eventIx: index('live_questions_event_ix').on(t.liveEventId),
    statusIx: index('live_questions_status_ix').on(t.status),
  }),
);

export const liveTranscripts = pgTable(
  'live_transcripts',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    liveEventId: uuid('live_event_id')
      .notNull()
      .references(() => liveEvents.id, { onDelete: 'cascade' }),
    segmentIndex: integer('segment_index').notNull(),
    speaker: varchar('speaker', { length: 128 }),
    text: text('text').notNull(),
    startMs: integer('start_ms'),
    endMs: integer('end_ms'),
    sttConfidence: real('stt_confidence'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    eventSegmentUq: uniqueIndex('live_transcripts_event_seg_uq').on(
      t.liveEventId,
      t.segmentIndex,
    ),
    eventIx: index('live_transcripts_event_ix').on(t.liveEventId),
  }),
);

/* ============================================================================
 * DISTRIBUTION — SOCIAL, EMAIL
 * ========================================================================== */

export const socialPosts = pgTable(
  'social_posts',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    platform: platformEnum('platform').notNull(),
    caption: text('caption'),
    mediaJson: jsonb('media_json').default(sql`'[]'::jsonb`),
    scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
    postizId: varchar('postiz_id', { length: 128 }),
    status: socialPostStatusEnum('status').notNull().default('draft'),
    postedAt: timestamp('posted_at', { withTimezone: true }),
    postUrl: text('post_url'),
    engagementJson: jsonb('engagement_json').default(sql`'{}'::jsonb`),
    sermonId: uuid('sermon_id').references(() => sermons.id, {
      onDelete: 'set null',
    }),
    liveEventId: uuid('live_event_id').references(() => liveEvents.id, {
      onDelete: 'set null',
    }),
    createdBy: uuid('created_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    platformIx: index('social_posts_platform_ix').on(t.platform),
    statusIx: index('social_posts_status_ix').on(t.status),
    scheduledIx: index('social_posts_scheduled_ix').on(t.scheduledFor),
    postizIx: index('social_posts_postiz_ix').on(t.postizId),
  }),
);

export const emailCampaigns = pgTable(
  'email_campaigns',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    slug: varchar('slug', { length: 200 }).notNull(),
    subject: varchar('subject', { length: 300 }).notNull(),
    preheader: varchar('preheader', { length: 300 }),
    bodyHtml: text('body_html'),
    bodyText: text('body_text'),
    fromName: varchar('from_name', { length: 200 }),
    fromEmail: varchar('from_email', { length: 320 }),
    audienceFilter: jsonb('audience_filter').default(sql`'{}'::jsonb`),
    scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    status: emailCampaignStatusEnum('status').notNull().default('draft'),
    recipientCount: integer('recipient_count').notNull().default(0),
    openCount: integer('open_count').notNull().default(0),
    clickCount: integer('click_count').notNull().default(0),
    bounceCount: integer('bounce_count').notNull().default(0),
    unsubscribeCount: integer('unsubscribe_count').notNull().default(0),
    provider: providerEnum('provider'),
    providerCampaignId: varchar('provider_campaign_id', { length: 128 }),
    createdBy: uuid('created_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    slugUq: uniqueIndex('email_campaigns_slug_uq').on(t.slug),
    statusIx: index('email_campaigns_status_ix').on(t.status),
    scheduledIx: index('email_campaigns_scheduled_ix').on(t.scheduledFor),
  }),
);

export const socialEngagements = pgTable(
  'social_engagements',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    platform: platformEnum('platform').notNull(),
    postId: uuid('post_id').references(() => socialPosts.id, {
      onDelete: 'set null',
    }),
    externalPostId: varchar('external_post_id', { length: 256 }),
    externalEngagementId: varchar('external_engagement_id', { length: 256 }),
    authorHandle: varchar('author_handle', { length: 200 }),
    authorPlatformId: varchar('author_platform_id', { length: 200 }),
    content: text('content').notNull(),
    sentiment: sentimentEnum('sentiment'),
    suggestedReply: text('suggested_reply'),
    status: engagementStatusEnum('status').notNull().default('new'),
    repliedAt: timestamp('replied_at', { withTimezone: true }),
    replyText: text('reply_text'),
    repliedBy: uuid('replied_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    platformIx: index('social_engagements_platform_ix').on(t.platform),
    statusIx: index('social_engagements_status_ix').on(t.status),
    sentimentIx: index('social_engagements_sentiment_ix').on(t.sentiment),
    externalUq: uniqueIndex('social_engagements_external_uq').on(
      t.platform,
      t.externalEngagementId,
    ),
  }),
);

/* ============================================================================
 * OPERATIONS
 * ========================================================================== */

export const donations = pgTable(
  'donations',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    provider: providerEnum('provider').notNull(),
    providerTxnId: varchar('provider_txn_id', { length: 256 }).notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 3 }).notNull().default('USD'),
    donorEmail: varchar('donor_email', { length: 320 }),
    donorName: varchar('donor_name', { length: 200 }),
    isRecurring: boolean('is_recurring').notNull().default(false),
    status: donationStatusEnum('status').notNull().default('initiated'),
    message: text('message'),
    designation: varchar('designation', { length: 200 }),
    webhookReceivedAt: timestamp('webhook_received_at', { withTimezone: true }),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    providerTxnUq: uniqueIndex('donations_provider_txn_uq').on(
      t.provider,
      t.providerTxnId,
    ),
    statusIx: index('donations_status_ix').on(t.status),
    createdIx: index('donations_created_ix').on(t.createdAt),
  }),
);

export const agentRuns = pgTable(
  'agent_runs',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    agentName: varchar('agent_name', { length: 128 }).notNull(),
    inputHash: varchar('input_hash', { length: 128 }).notNull(),
    promptVersion: varchar('prompt_version', { length: 64 }).notNull(),
    provider: providerEnum('provider').notNull(),
    model: varchar('model', { length: 128 }).notNull(),
    inputText: text('input_text'),
    outputText: text('output_text'),
    riskScore: real('risk_score'),
    theologyScore: real('theology_score'),
    citationScore: real('citation_score'),
    tokensIn: integer('tokens_in'),
    tokensOut: integer('tokens_out'),
    latencyMs: integer('latency_ms'),
    costEstimate: numeric('cost_estimate', { precision: 12, scale: 6 }),
    status: agentRunStatusEnum('status').notNull().default('queued'),
    errorMessage: text('error_message'),
    requiresReview: boolean('requires_review').notNull().default(false),
    reviewedBy: uuid('reviewed_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    parentRunId: uuid('parent_run_id'),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    agentIx: index('agent_runs_agent_ix').on(t.agentName),
    statusIx: index('agent_runs_status_ix').on(t.status),
    createdIx: index('agent_runs_created_ix').on(t.createdAt),
    reviewIx: index('agent_runs_review_ix').on(t.requiresReview),
    inputHashIx: index('agent_runs_input_hash_ix').on(t.inputHash),
  }),
);

export const providerKeys = pgTable(
  'provider_keys',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    provider: providerEnum('provider').notNull(),
    keyLabel: varchar('key_label', { length: 128 }).notNull(),
    environment: providerEnvEnum('environment').notNull().default('production'),
    serviceClass: serviceClassEnum('service_class').notNull(),
    // The actual secret lives in the secret manager. We store a fingerprint
    // (e.g. last4 + sha256) for audit/identification only.
    keyFingerprint: varchar('key_fingerprint', { length: 128 }),
    keyRef: varchar('key_ref', { length: 256 }),
    status: providerKeyStatusEnum('status').notNull().default('active'),
    lastRotatedAt: timestamp('last_rotated_at', { withTimezone: true }),
    cooldownUntil: timestamp('cooldown_until', { withTimezone: true }),
    rateLimitRpm: integer('rate_limit_rpm'),
    rateLimitTpm: integer('rate_limit_tpm'),
    monthlyBudgetCents: bigint('monthly_budget_cents', { mode: 'number' }),
    notes: text('notes'),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    labelEnvUq: uniqueIndex('provider_keys_label_env_uq').on(
      t.keyLabel,
      t.environment,
    ),
    providerIx: index('provider_keys_provider_ix').on(t.provider),
    statusIx: index('provider_keys_status_ix').on(t.status),
    serviceIx: index('provider_keys_service_ix').on(t.serviceClass),
  }),
);

export const providerUsage = pgTable(
  'provider_usage',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    providerKeyId: uuid('provider_key_id')
      .notNull()
      .references(() => providerKeys.id, { onDelete: 'cascade' }),
    bucketStart: timestamp('bucket_start', { withTimezone: true }).notNull(),
    bucketGranularity: varchar('bucket_granularity', { length: 16 })
      .notNull()
      .default('hour'),
    requests: bigint('requests', { mode: 'number' }).notNull().default(0),
    tokensIn: bigint('tokens_in', { mode: 'number' }).notNull().default(0),
    tokensOut: bigint('tokens_out', { mode: 'number' }).notNull().default(0),
    errors: bigint('errors', { mode: 'number' }).notNull().default(0),
    costEstimate: numeric('cost_estimate', { precision: 14, scale: 6 })
      .notNull()
      .default('0'),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    keyBucketUq: uniqueIndex('provider_usage_key_bucket_uq').on(
      t.providerKeyId,
      t.bucketStart,
      t.bucketGranularity,
    ),
    bucketIx: index('provider_usage_bucket_ix').on(t.bucketStart),
  }),
);

export const moderationFlags = pgTable(
  'moderation_flags',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    sourceType: handoffSourceTypeEnum('source_type').notNull(),
    sourceId: uuid('source_id').notNull(),
    flagType: varchar('flag_type', { length: 64 }).notNull(),
    riskLevel: riskLevelEnum('risk_level').notNull().default('low'),
    status: moderationStatusEnum('status').notNull().default('pending'),
    reason: text('reason'),
    automatedScore: real('automated_score'),
    reviewedBy: uuid('reviewed_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    resolution: text('resolution'),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    sourceIx: index('moderation_flags_source_ix').on(t.sourceType, t.sourceId),
    statusIx: index('moderation_flags_status_ix').on(t.status),
    riskIx: index('moderation_flags_risk_ix').on(t.riskLevel),
  }),
);

export const corrections = pgTable(
  'corrections',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    sourceType: handoffSourceTypeEnum('source_type').notNull(),
    sourceId: uuid('source_id').notNull(),
    submittedBy: uuid('submitted_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    submittedEmail: varchar('submitted_email', { length: 320 }),
    originalText: text('original_text'),
    correctedText: text('corrected_text').notNull(),
    rationale: text('rationale'),
    citationsJson: jsonb('citations_json').default(sql`'[]'::jsonb`),
    status: correctionStatusEnum('status').notNull().default('open'),
    appliedBy: uuid('applied_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    appliedAt: timestamp('applied_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    sourceIx: index('corrections_source_ix').on(t.sourceType, t.sourceId),
    statusIx: index('corrections_status_ix').on(t.status),
  }),
);

export const jobRuns = pgTable(
  'job_runs',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    jobName: varchar('job_name', { length: 128 }).notNull(),
    queue: varchar('queue', { length: 64 }),
    status: jobStatusEnum('status').notNull().default('queued'),
    attempt: integer('attempt').notNull().default(1),
    maxAttempts: integer('max_attempts').notNull().default(3),
    scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
    startedAt: timestamp('started_at', { withTimezone: true }),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
    durationMs: integer('duration_ms'),
    payload: jsonb('payload').default(sql`'{}'::jsonb`),
    result: jsonb('result').default(sql`'{}'::jsonb`),
    errorMessage: text('error_message'),
    errorStack: text('error_stack'),
    correlationId: varchar('correlation_id', { length: 128 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    nameIx: index('job_runs_name_ix').on(t.jobName),
    statusIx: index('job_runs_status_ix').on(t.status),
    scheduledIx: index('job_runs_scheduled_ix').on(t.scheduledFor),
    correlationIx: index('job_runs_correlation_ix').on(t.correlationId),
  }),
);

export const humanHandoff = pgTable(
  'human_handoff',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    sourceType: handoffSourceTypeEnum('source_type').notNull(),
    sourceId: uuid('source_id').notNull(),
    userEmail: varchar('user_email', { length: 320 }),
    userPhone: varchar('user_phone', { length: 32 }),
    reason: text('reason').notNull(),
    status: handoffStatusEnum('status').notNull().default('open'),
    priority: smallint('priority').notNull().default(3),
    assignedTo: uuid('assigned_to').references(() => users.id, {
      onDelete: 'set null',
    }),
    assignedAt: timestamp('assigned_at', { withTimezone: true }),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    notes: text('notes'),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    sourceIx: index('human_handoff_source_ix').on(t.sourceType, t.sourceId),
    statusIx: index('human_handoff_status_ix').on(t.status),
    assignedIx: index('human_handoff_assigned_ix').on(t.assignedTo),
    priorityIx: index('human_handoff_priority_ix').on(t.priority),
  }),
);

export const adminActions = pgTable(
  'admin_actions',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    actorId: uuid('actor_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    action: varchar('action', { length: 128 }).notNull(),
    targetType: varchar('target_type', { length: 64 }),
    targetId: uuid('target_id'),
    diffJson: jsonb('diff_json').default(sql`'{}'::jsonb`),
    ipHash: varchar('ip_hash', { length: 128 }),
    userAgent: text('user_agent'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    actorIx: index('admin_actions_actor_ix').on(t.actorId),
    actionIx: index('admin_actions_action_ix').on(t.action),
    targetIx: index('admin_actions_target_ix').on(t.targetType, t.targetId),
    createdIx: index('admin_actions_created_ix').on(t.createdAt),
  }),
);

/* ============================================================================
 * EXPORTS — type helpers
 * ========================================================================== */

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Sermon = typeof sermons.$inferSelect;
export type NewSermon = typeof sermons.$inferInsert;
export type ChatSession = typeof chatSessions.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type CallSession = typeof callSessions.$inferSelect;
export type CallTurn = typeof callTurns.$inferSelect;
export type CrisisEvent = typeof crisisEvents.$inferSelect;
export type PrayerRequest = typeof prayerRequests.$inferSelect;
export type Donation = typeof donations.$inferSelect;
export type AgentRun = typeof agentRuns.$inferSelect;
export type ProviderKey = typeof providerKeys.$inferSelect;
export type DoctrineDocument = typeof doctrineDocuments.$inferSelect;
export type Source = typeof sources.$inferSelect;
export type SourceChunk = typeof sourceChunks.$inferSelect;
export type Embedding = typeof embeddings.$inferSelect;
export type LiveEvent = typeof liveEvents.$inferSelect;
export type SocialPost = typeof socialPosts.$inferSelect;
export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type HumanHandoff = typeof humanHandoff.$inferSelect;
