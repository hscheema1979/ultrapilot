#!/usr/bin/env node
/**
 * Quick Setup: GitHub Project Board for UltraPilot Mission Control
 *
 * This script creates a project board with workflow stages.
 * Run it with: npx tsx setup-project-board.ts
 */

import { GitHubService } from './src/services/github-service.js';
import { GitHubAppAuthManager } from './src/services/github-app-auth.js';

async function setupProjectBoard() {
  console.log('🚀 Setting up UltraPilot Mission Control...\n');

  try {
    // Initialize authentication
    console.log('📝 Authenticating with GitHub...');
    const authManager = GitHubAppAuthManager.fromEnv('hscheema1979/ultra-workspace');

    // Initialize GitHub service
    const github = new GitHubService({
      owner: 'hscheema1979',
      repo: 'ultra-workspace',
      installationId: parseInt(process.env.GITHUB_INSTALLATION_ID || '0'),
      cacheMaxAge: 300000
    }, authManager);

    await github.initializeOctokit();
    console.log('✅ Authenticated successfully\n');

    // Create project board
    console.log('📊 Creating project board...');
    const project = await github.createProjectBoard('UltraPilot Mission Control');
    console.log(`✅ Created project board (ID: ${project.id})\n`);

    // Create columns with emoji icons
    console.log('📋 Creating workflow columns...');
    const columns = [
      { name: '📥 Backlog', description: 'New feature requests and ideas' },
      { name: '📏 Sizing', description: 'STEP 0.5: Multi-Agent Task Sizing' },
      { name: '📋 Planning', description: 'Phase 0-1: Requirements, Architecture, Planning' },
      { name: '🔍 Review', description: 'Phase 1.5: Multi-Perspective Review' },
      { name: '✅ Ready', description: 'Plan approved, ready for execution' },
      { name: '⚙️ In Progress', description: 'Phase 2: Execution' },
      { name: '🧪 QA', description: 'Phase 3: QA Cycles' },
      { name: '✔️ Validation', description: 'Phase 4: Multi-Perspective Validation' },
      { name: '🔎 Verification', description: 'Phase 5: Evidence Collection' },
      { name: '🎉 Complete', description: 'All phases done' }
    ];

    const columnIds = [];

    for (const column of columns) {
      const col = await github.createProjectColumn(project.id, column.name);
      columnIds.push({ name: column.name, id: col.id });
      console.log(`   ✓ ${column.name}: ${column.description}`);
    }

    console.log('\n');

    // Get existing issues
    console.log('🔍 Finding existing feature requests...');
    try {
      const issues = await github.getTasksByLabel('feature-request');

      if (issues.length > 0) {
        console.log(`Found ${issues.length} feature requests\n`);

        // Add to backlog column
        const backlogColumn = columnIds.find(c => c.name === '📥 Backlog');

        if (backlogColumn) {
          for (const issue of issues) {
            try {
              await github.addProjectCard(backlogColumn.id, issue.id);
              console.log(`   ✓ Added #${issue.number}: ${issue.title}`);
            } catch (error) {
              console.log(`   ⊘ Skipping #${issue.number}: ${issue.title} (already added?)`);
            }
          }
        }
      } else {
        console.log('   No existing feature requests found\n');
        console.log('   💡 Tip: Create an issue with label "feature-request" to get started');
      }
    } catch (error) {
      console.log('   ⊘ Could not fetch existing issues');
    }

    console.log('\n');
    console.log('🎉 Setup complete!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📍 Your Mission Control Dashboard is ready!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n🔗 View your dashboard:');
    console.log(`   https://github.com/hscheema1979/ultra-workspace/projects\n`);
    console.log('📖 How to use:');
    console.log('   1. Create a new issue with the label "feature-request"');
    console.log('   2. Add it to the project (Projects → UltraPilot Mission Control)');
    console.log('   3. Drag cards between columns as they progress');
    console.log('   4. Click any card to see details, comments, and progress\n');
    console.log('🎯 Workflow stages:');
    console.log('   📥 Backlog → 📏 Sizing → 📋 Planning → 🔍 Review');
    console.log('   → ✅ Ready → ⚙️ In Progress → 🧪 QA → ✔️ Validation');
    console.log('   → 🔎 Verification → 🎉 Complete\n');
    console.log('💡 Pro tip: Use /ultrapilot commands in issue comments to trigger workflows!\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    await authManager.close();

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);

    if (error.message.includes('authentication')) {
      console.log('\n⚠️  Authentication failed. Make sure you have:');
      console.log('   export GITHUB_APP_ID=your_app_id');
      console.log('   export GITHUB_PRIVATE_KEY=your_private_key');
      console.log('   export GITHUB_INSTALLATION_ID=your_installation_id\n');
    } else if (error.message.includes('not found')) {
      console.log('\n⚠️  Repository not found. Make sure hscheema1979/ultra-workspace exists\n');
    } else {
      console.log('\nFull error:', error);
    }

    process.exit(1);
  }
}

// Run the setup
setupProjectBoard();
