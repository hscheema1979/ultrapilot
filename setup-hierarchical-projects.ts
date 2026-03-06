#!/usr/bin/env node
/**
 * Hierarchical Project Board Setup
 *
 * Creates interconnected project boards for:
 * 1. MyHealthTeam Platform (mega-project)
 * 2. UltraPilot Development (project)
 * 3. Mission Control (sub-project within UltraPilot)
 *
 * Hierarchy:
 * MyHealthTeam (mega-project) ← Tracks the entire platform
 *  └─ UltraPilot (project) ← Tracks UltraPilot tool development
 *      └─ Mission Control (sub-project) ← Tracks Mission Control feature
 */

import { GitHubService } from './src/services/github-service.js';
import { GitHubAppAuthManager } from './src/services/github-app-auth.js';

interface ProjectConfig {
  owner: string;
  repo: string;
  installationId: number;
  name: string;
  description: string;
  columns: Array<{ name: string; description: string }>;
}

async function setupHierarchicalProjects() {
  console.log('🚀 Setting up Hierarchical Project Boards...\n');

  try {
    // Initialize authentication for myhealthteam repo
    console.log('📝 Authenticating with GitHub...');
    const authManager = GitHubAppAuthManager.fromEnv('hscheema1979/myhealthteam');

    const projects = [
      {
        owner: 'hscheema1979',
        repo: 'myhealthteam',
        installationId: parseInt(process.env.GITHUB_INSTALLATION_ID_MYHEALTHTEAM || '0'),
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
        installationId: parseInt(process.env.GITHUB_INSTALLATION_ID_ULTRAPILOT || process.env.GITHUB_INSTALLATION_ID || '0'),
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
        installationId: parseInt(process.env.GITHUB_INSTALLATION_ID_ULTRAPILOT || process.env.GITHUB_INSTALLATION_ID || '0'),
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

      // Create GitHub service for this repo
      const github = new GitHubService({
        owner: projectConfig.owner,
        repo: projectConfig.repo,
        installationId: projectConfig.installationId,
        cacheMaxAge: 300000
      }, authManager);

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
    console.log('📚 PROJECT HIERARCHY DOCUMENTATION');
    console.log(`${'='.repeat(70)}\n`);

    console.log('Mega-Project: MyHealthTeam Platform');
    console.log('  └─ Project: UltraPilot Development');
    console.log('       └─ Sub-Project: Mission Control\n');

    console.log('Relationships:');
    console.log('  • MyHealthTeam uses UltraPilot for autonomous development');
    console.log('  • UltraPilot includes Mission Control as a feature');
    console.log('  • Mission Control dashboard tracks all projects\n');

    console.log(`${'='.repeat(70)}`);
    console.log('🎉 ALL PROJECT BOARDS CREATED SUCCESSFULLY!');
    console.log(`${'='.repeat(70)}\n`);

    console.log('Quick Access URLs:\n');

    createdProjects.forEach((project, index) => {
      const indent = '  '.repeat(index);
      console.log(`${indent}${index + 1}. ${project.name}`);
      console.log(`${indent}   ${project.description}`);
      console.log(`${indent}   📍 ${project.owner}/${project.repo}`);
      console.log(`${indent}   🔗 ${project.url}`);
      console.log(`${indent}   📋 Columns: ${project.columns.length}`);
      console.log('');
    });

    console.log(`${'='.repeat(70)}`);
    console.log('💡 USAGE TIPS');
    console.log(`${'='.repeat(70)}\n`);

    console.log('1. MyHealthTeam Platform:');
    console.log('   - Tracks the entire health team platform development');
    console.log('   - Add features with "feature-request" label');
    console.log('   - Use /ultrapilot start to trigger autonomous workflows\n');

    console.log('2. UltraPilot Development:');
    console.log('   - Tracks UltraPilot tool itself development');
    console.log('   - Issues here become features in UltraPilot');
    console.log('   - Uses UltraPilot to build UltraPilot (meta!)\n');

    console.log('3. Mission Control:');
    console.log('   - Tracks Mission Control dashboard feature');
    console.log('   - Sub-project of UltraPilot');
    console.log('   - Features here improve the dashboard itself\n');

    console.log('4. Linking Issues:');
    console.log('   - Create issue in UltraPilot repo for Mission Control feature');
    console.log('   - Add "mission-control" label');
    console.log('   - It appears in Mission Control project board');
    console.log('   - Progress tracks in both UltraPilot and Mission Control boards\n');

    console.log('5. Cross-Project References:');
    console.log('   - Use issue linking: "Related to #123"');
    console.log('   - Create parent-child relationships');
    console.log('   - Track dependencies across projects\n');

    console.log(`${'='.repeat(70)}\n`);

    await authManager.close();

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);

    if (error.message.includes('authentication')) {
      console.log('\n⚠️  Authentication failed. Make sure you have:');
      console.log('   export GITHUB_APP_ID=your_app_id');
      console.log('   export GITHUB_PRIVATE_KEY=your_private_key');
      console.log('   export GITHUB_INSTALLATION_ID_MYHEALTHTEAM=your_installation_id');
      console.log('   export GITHUB_INSTALLATION_ID_ULTRAPILOT=your_installation_id\n');
    } else if (error.message.includes('not found')) {
      console.log('\n⚠️  Repository not found. Make sure repos exist:');
      console.log('   - hscheema1979/myhealthteam');
      console.log('   - hscheema1979/ultrapilot\n');
    } else {
      console.log('\nFull error:', error);
    }

    process.exit(1);
  }
}

// Run the setup
setupHierarchicalProjects();
