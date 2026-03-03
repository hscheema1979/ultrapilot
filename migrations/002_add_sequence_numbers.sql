-- Migration 002: Add Sequence Numbers for Reconnection Protocol
-- This migration adds sequence number tracking to enable WebSocket reconnection

BEGIN;

-- Add sequence_number column to existing messages table
ALTER TABLE messages ADD COLUMN sequence_number INTEGER;

-- Create index on sequence_number for reconnection queries
CREATE INDEX IF NOT EXISTS idx_messages_sequence ON messages(sequence_number);

-- Create sequence number tracker table for atomic increments
CREATE TABLE IF NOT EXISTS sequence_tracker (
  key TEXT PRIMARY KEY,
  last_value INTEGER NOT NULL
);

-- Initialize sequence counter
INSERT OR IGNORE INTO sequence_tracker (key, last_value)
VALUES ('global_sequence', 0);

COMMIT;
