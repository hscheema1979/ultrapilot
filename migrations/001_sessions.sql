-- Migration 001: Sessions and Locks Tables
-- This migration is automatically applied by SessionStore

BEGIN;

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  workspace_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'starting',
  current_phase INTEGER,
  active_agents TEXT,
  created_at INTEGER NOT NULL,
  last_activity INTEGER NOT NULL,
  metadata TEXT,
  UNIQUE(role, workspace_path)
);

CREATE INDEX IF NOT EXISTS idx_sessions_workspace ON sessions(workspace_path);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_activity ON sessions(last_activity);

-- Locks table for multi-process coordination
CREATE TABLE IF NOT EXISTS locks (
  resource TEXT PRIMARY KEY,
  owner_session_id TEXT NOT NULL,
  acquired_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_locks_expires ON locks(expires_at);

-- Heartbeats table for monitoring
CREATE TABLE IF NOT EXISTS heartbeats (
  session_id TEXT PRIMARY KEY,
  last_heartbeat INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'alive',
  FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_heartbeats_status ON heartbeats(status);

COMMIT;
