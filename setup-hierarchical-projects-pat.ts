#!/usr/bin/env node
/**
 * Hierarchical Project Board Setup (using PAT)
 * Uses existing GITHUB_TOKEN from .env file
 */

import path from 'path';
import * as fs from 'fs';
import { GitHubService } from './src/services/github-service.js';
import { GitHubAuthManager } from './src/services/github-auth.js';

// Load .env file manually from ultrapilot plugin directory
const envPath = '/home/ubuntu/.claude/plugins/ultrapilot/.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const GITHUB_TOKEN = envContent
  .split('\n')
  .find(line => line.startsWith('GITHUB_TOKEN='))
  ?.split('=')[1]
  ?.trim();

if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN not found in .env file');
  process.exit(1);
}

interface ProjectConfig {
  owner: string;
  repo: string;
  name: string;
  description: string;
  columns: Array<{ name: string; description: string }>;
}

async function setupHierarchicalProjects() {
  console.log('🚀 Setting up Hierarchical Project Boards...\n');
  console.log('📝 Using GITHUB_TOKEN from .env file\n');

  try {
    // Set GITHUB_TOKEN as environment variable for GitHubAuthManager
    process.env.GITHUB_TOKEN = GITHUB_TOKEN;

    // Initialize authentication with PAT
    const authManager = GitHubAuthManager.fromEnv('hscheema1979/myhealthteam');

    const projects = [
      {
        owner: 'hscheema1979',
        repo: 'myhealthteam',
        name: 'MyHealthTeam Platform',
        description: 'Mega-project: Complete health team management platform',
        columns: [
          { name: '🎯 Strategic', description: 'Strategic planning and roadmap' },
          { name: '📋 Requirements', description: 'Requirements gathering and analysis' },
          { name: '🏗️ Architecture', description: 'System architecture and design' },
          { name: '👥 Teams', description: 'Team assignments and coordination' },
          { name: '⚙️ Development', description: 'Active development sprints' },
          { name: '🧪 Testing', description: 'QA and testing phases' },
          { name: '🚀 Deployment', description: 'Deployment and releases' },
          { name: '📊 Analytics', description: 'Analytics and monitoring' },
          { name: '🎉 Complete', description: 'Completed features' }
        ]
      },
      {
        owner: 'hscheema1979',
        repo: 'ultrapilot',
        name: 'UltraPilot Development',
        description: 'Project: UltraPilot autonomous development tool',
        columns: [
          { name: '💡 Ideas', description: 'Feature ideas and proposals' },
          { name: '📏 Sizing', description: 'STEP 0.5: Multi-Agent Task Sizing' },
          { name: '📋 Planning', description: 'Phase 0-1: Requirements, Architecture, Planning' },
          { name: '🔍 Review', description: 'Phase 1.5: Multi-Perspective Review' },
          { name: '✅ Ready', description: 'Plan approved, ready for execution' },
          { name: '⚙️ In Progress', description: 'Phase 2: Execution' },
          { name: '🧪 QA', description: 'Phase 3: QA Cycles' },
          { name: '✔️ Validation', description: 'Phase 4: Multi-Perspective Validation' },
          { name: '🔎 Verification', description: 'Phase 5: Evidence Collection' },
          { name: '🎉 Complete', description: 'All phases done' }
        ]
      },
      {
        owner: 'hscheema1979',
        repo: 'ultrapilot',
        name: 'Mission Control',
        description: 'Sub-project: Mission Control dashboard and automation',
        columns: [
          { name: '🎨 Design', description: 'UI/UX design and wireframes' },
          { name: '🔧 Backend', description: 'Backend API and services' },
          { name: '🖥️ Frontend', description: 'Frontend components and views' },
          { name: '🔌 Integration', description: 'GitHub integration and webhooks' },
          { name: '📊 Dashboard', description: 'Dashboard visualization' },
          { name: '🧪 Testing', description: 'Testing and validation' },
          { name: '📚 Documentation', description: 'Docs and guides' },
          { name: '🎉 Complete', description: 'Mission Control ready' }
        ]
      }
    ];

    const createdProjects = [];

    for (const projectConfig of projects) {
      console.log(`\n${'='.repeat(70)}`);
      console.log(`📊 Creating project board: ${projectConfig.name}`);
      console.log(`📍 Repository: ${projectConfig.owner}/${projectConfig.repo}`);
      console.log(`${'='.repeat(70)}\n`);

      // Create GitHub service for this repo using PAT
      const github = new GitHubService({
        owner: projectConfig.owner,
        repo: projectConfig.repo,
        token: GITHUB_TOKEN
      });

      await github.initializeOctokit();
      console.log('✅ Authenticated successfully\n');

      // Create project board
      console.log(`📋 Creating "${projectConfig.name}" project...`);
      const project = await github.createProjectBoard(projectConfig.name);
      console.log(`✅ Created project (ID: ${project.id})\n`);

      // Create columns
      console.log('📁 Creating workflow columns:');
      const columnIds = [];

      for (const column of projectConfig.columns) {
        const col = await github.createProjectColumn(project.id, column.name);
        columnIds.push({ name: column.name, id: col.id, description: column.description });
        console.log(`   ✓ ${column.name}: ${column.description}`);
      }

      console.log('\n');

      // Get existing issues and add to appropriate columns
      try {
        console.log('🔍 Finding existing issues...');
        const issues = await github.getTasksByLabel('feature-request');

        if (issues.length > 0) {
          console.log(`Found ${issues.length} feature requests\n`);

          // Add to first column (backlog/ideas)
          const firstColumn = columnIds[0];

          for (const issue of issues) {
            try {
              await github.addProjectCard(firstColumn.id, issue.id);
              console.log(`   ✓ Added #${issue.number}: ${issue.title}`);
            } catch (error) {
              console.log(`   ⊘ Skipping #${issue.number}: ${issue.title} (already added?)`);
            }
          }
        } else {
          console.log('   No existing feature requests found\n');
        }
      } catch (error: any) {
        console.log(`   ⊘ Could not fetch issues: ${error.message}`);
      }

      // Store project info
      createdProjects.push({
        name: projectConfig.name,
        description: projectConfig.description,
        owner: projectConfig.owner,
        repo: projectConfig.repo,
        projectId: project.id,
        columns: columnIds,
        url: `https://github.com/${projectConfig.owner}/${projectConfig.repo}/projects`
      });

      console.log(`\n✅ Project "${projectConfig.name}" ready!`);
      console.log(`🔗 View at: https://github.com/${projectConfig.owner}/${projectConfig.repo}/projects\n`);
    }

    // Create hierarchy documentation
    console.log(`${'='.repeat(70)}`);
    console.log('📚 PROJECT HIERARCHY');
    console.log(`${'='.repeat(70)}\n`);

    console.log('Mega-Project: MyHealthTeam Platform');
    console.log('  └─ Project: UltraPilot Development');
    console.log('       └─ Sub-Project: Mission Control\n');

    console.log(`${'='.repeat(70)}`);
    console.log('🎉 ALL PROJECT BOARDS CREATED SUCCESSFULLY!');
    console.log(`${'='.repeat(70)}\n`);

    console.log('📍 ACCESS YOUR DASHBOARDS:\n');

    createdProjects.forEach((project, index) => {
      const indent = '  '.repeat(index);
      console.log(`${indent}${index + 1}. ${project.name}`);
      console.log(`${indent}   ${project.description}`);
      console.log(`${indent}   📍 ${project.owner}/${project.repo}`);
      console.log(`${indent}   🔗 ${project.url}`);
      console.log(`${indent}   📋 Columns: ${project.columns.length}`);
      console.log('');
    });

    console.log(`${'='.repeat(70)}\n`);

    await authManager.close();

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Run the setup
setupHierarchicalProjects();
