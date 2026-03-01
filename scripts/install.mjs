#!/usr/bin/env node
/**
 * Ultrapilot Installation Script
 *
 * Sets up the Ultrapilot plugin:
 * 1. Copies skills to ~/.claude/skills/
 * 2. Sets up HUD CLI
 * 3. Configures settings.json
 */

import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_DIR = join(__dirname, '..');
const HOME = homedir();
const CLAUDE_DIR = process.env.CLAUDE_CONFIG_DIR || join(HOME, '.claude');
const SKILLS_DIR = join(CLAUDE_DIR, 'skills');
const HUD_CLI = join(PLUGIN_DIR, 'cli', 'hud.mjs');

console.log('🚀 Installing Ultrapilot plugin...\n');

// Skills to install
const SKILLS = [
  'autopilot',
  'ultra-hud',
  'ultra-cancel',
  'ultra-review',
  'ralph',
  'cancel',
  // Add more ultra-* skills as needed
];

// Step 1: Ensure skills directory exists
console.log('📁 Setting up skills directory...');
if (!existsSync(SKILLS_DIR)) {
  mkdirSync(SKILLS_DIR, { recursive: true });
}

// Step 2: Copy skills
console.log('📋 Installing skills...');
for (const skill of SKILLS) {
  const skillDir = join(SKILLS_DIR, skill);
  if (!existsSync(skillDir)) {
    mkdirSync(skillDir, { recursive: true });
  }

  const skillFile = join(PLUGIN_DIR, 'skills', `${skill}.md`);
  if (existsSync(skillFile)) {
    copyFileSync(skillFile, join(skillDir, 'SKILL.md'));
    console.log(`  ✓ ${skill}`);
  } else {
    console.log(`  ⚠ ${skill} (not found, skipping)`);
  }
}

// Step 3: Set up HUD CLI
console.log('\n🎨 Setting up HUD CLI...');
const hudTargetPath = join(CLAUDE_DIR, 'hud', 'ultra-hud.mjs');
const hudDir = join(CLAUDE_DIR, 'hud');
if (!existsSync(hudDir)) {
  mkdirSync(hudDir, { recursive: true });
}
copyFileSync(HUD_CLI, hudTargetPath);
console.log(`  ✓ HUD CLI installed to ${hudTargetPath}`);

// Step 4: Configure settings.json
console.log('\n⚙️  Configuring settings.json...');
const settingsPath = join(CLAUDE_DIR, 'settings.json');
let settings = {};

if (existsSync(settingsPath)) {
  try {
    settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
  } catch (e) {
    console.warn('  ⚠ Could not read existing settings.json, creating new');
  }
}

// Add statusLine configuration
settings.statusLine = {
  type: 'command',
  command: hudTargetPath
};

// Add HUD config
settings.ultraHudConfig = {
  preset: 'focused',
  elements: {
    ultraLabel: true,
    phase: true,
    ralph: true,
    qa: true,
    status: true,
    context: true,
    tasks: true,
    agents: true,
    background: true,
    maxOutputLines: 4
  }
};

writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
console.log(`  ✓ settings.json configured`);

// Step 5: Create .ultra directory structure
console.log('\n📂 Creating .ultra directory structure...');
const currentDir = process.cwd();
const ultraStateDir = join(currentDir, '.ultra', 'state');
if (!existsSync(ultraStateDir)) {
  mkdirSync(ultraStateDir, { recursive: true });
}
console.log(`  ✓ .ultra/state/ created`);

// Done!
console.log('\n✅ Ultrapilot installation complete!\n');
console.log('Next steps:');
console.log('1. Restart Claude Code');
console.log('2. Run: /ultrapilot <your task>');
console.log('3. Check the HUD in your statusline\n');
console.log('Example:');
console.log('  /ultrapilot Build me a REST API for task management\n');
