#!/usr/bin/env node

/**
 * GitHub App Setup Script for Ultra-Team
 *
 * This script helps set up the GitHub App required for ultra-team coordination.
 * It guides you through creating the GitHub App and configuring environment variables.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function exec(command, silent = false) {
  try {
    const output = execSync(command, { encoding: 'utf-8', shell: '/bin/bash' });
    if (!silent) console.log(output);
    return output.trim();
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    throw error;
  }
}

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                 Ultra-Team GitHub App Setup                        ║
╚══════════════════════════════════════════════════════════════════════╝

This script will help you set up a GitHub App for ultra-team coordination.

The GitHub App provides:
  - Task queue (GitHub issues)
  - State management (GitHub projects)
  - Communication (issue comments)
  - Visibility (public/private GitHub repository)

Required permissions:
  - Issues: Read & Write
  - Pull Requests: Read & Write
  - Projects: Read & Write
  - Contents: Read & Write

Let's get started!
`);

  // Step 1: Check if gh CLI is installed
  console.log('📋 Step 1: Checking prerequisites...');
  try {
    exec('gh --version', true);
    console.log('✅ GitHub CLI (gh) is installed');
  } catch {
    console.error('❌ GitHub CLI (gh) is not installed');
    console.log('Install it from: https://cli.github.com/');
    process.exit(1);
  }

  // Check authentication
  try {
    const authStatus = exec('gh auth status', true);
    if (authStatus.includes('Logged in')) {
      console.log('✅ GitHub CLI is authenticated');
    } else {
      throw new Error('Not authenticated');
    }
  } catch {
    console.log('🔐 Please authenticate with GitHub CLI:');
    console.log('  gh auth login');
    console.log('Then run this script again.');
    process.exit(1);
  }

  // Step 2: Get repository information
  console.log('\n📋 Step 2: Repository information');
  const repo = await question('Enter repository (e.g., username/repo): ');
  const [owner, repoName] = repo.split('/');

  if (!owner || !repoName) {
    console.error('❌ Invalid repository format. Use: username/repo');
    process.exit(1);
  }

  console.log(`✅ Repository: ${owner}/${repoName}`);

  // Step 3: GitHub App creation instructions
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║  Step 3: Create GitHub App (Manual Step)                            ║
╚══════════════════════════════════════════════════════════════════════╝

1. Open this URL in your browser:
   https://github.com/settings/apps/new

2. Fill in the form:
   - GitHub App name: ultra-team-coordinator
   - Homepage URL: https://github.com
   - Callback URL: (leave empty)
   - Webhook: (disable for now - uncheck "Active")

3. Under "Repository permissions":
   ✅ Issues: Read & Write
   ✅ Pull Requests: Read & Write
   ✅ Projects: Read & Write
   ✅ Contents: Read & Write
   ✅ Checks: Read Only
   ✅ Actions: Read Only

4. Under "Events":
   ✅ Issues
   ✅ Pull Request
   ✅ Pull Request Review
   ✅ Project Card

5. Create the App

6. On the app page, scroll to "Private keys" and click "Generate a private key"
   - This will download a .pem file

7. Scroll to "Installation" and click "Install App"
   - Select your account or organization
   - Select the repository: ${owner}/${repoName}
   - Click Install

8. Copy the following information from the app page:
   - App ID (top of page, next to app name)
   - Installation ID (from URL when viewing installation, or from API)
`);

  const appId = await question('Enter GitHub App ID: ');
  const installationId = await question('Enter GitHub Installation ID: ');

  // Step 4: Private key
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║  Step 4: Private Key                                                ║
╚══════════════════════════════════════════════════════════════════════╝

Enter the path to the downloaded .pem file:
`);

  const keyPath = await question('Private key .pem file path: ');

  try {
    exec(`test -f "${keyPath}"`);
    console.log('✅ Private key file found');
  } catch {
    console.error('❌ Private key file not found');
    process.exit(1);
  }

  // Read and encode private key
  const privateKey = readFileSync(keyPath, 'utf-8');
  const privateKeyBase64 = Buffer.from(privateKey).toString('base64');

  // Step 5: Create .env file
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║  Step 5: Configuration                                               ║
╚══════════════════════════════════════════════════════════════════════╝
`);

  const envContent = `
# Ultra-Team GitHub App Configuration
# Generated by setup-github-app.mjs on ${new Date().toISOString()}

GITHUB_APP_ID=${appId}
GITHUB_APP_PRIVATE_KEY_BASE64=${privateKeyBase64}
GITHUB_INSTALLATION_ID=${installationId}
GITHUB_REPO_OWNER=${owner}
GITHUB_REPO_NAME=${repoName}
GITHUB_REPO=${owner}/${repoName}
`;

  const envPath = join(process.env.HOME, '.github-ultra-team.env');
  writeFileSync(envPath, envContent.trim() + '\n');

  console.log(`✅ Configuration written to: ${envPath}`);

  // Step 6: Add to shell profile
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║  Step 6: Shell Configuration                                         ║
╚══════════════════════════════════════════════════════════════════════╝

To make these variables available in your shell, add this to your profile:

  source ~/.github-ultra-team.env

Auto-add to ~/.bashrc? (y/n)
`);

  const addToProfile = await question('> ');

  if (addToProfile.toLowerCase() === 'y') {
    const bashrcPath = join(process.env.HOME, '.bashrc');
    const sourceLine = '\n# Ultra-Team GitHub App\nsource ~/.github-ultra-team.env\n';

    try {
      const bashrc = readFileSync(bashrcPath, 'utf-8');
      if (!bashrc.includes('.github-ultra-team.env')) {
        exec(`echo '${sourceLine}' >> ${bashrcPath}`);
        console.log('✅ Added to ~/.bashrc');
        console.log('Run: source ~/.bashrc');
      } else {
        console.log('ℹ️  Already in ~/.bashrc');
      }
    } catch {
      console.log('⚠️  Could not auto-add to ~/.bashrc');
      console.log('Add this manually:');
      console.log(sourceLine);
    }
  }

  // Step 7: Verify setup
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║  Step 7: Verification                                                ║
╚══════════════════════════════════════════════════════════════════════╝

Testing GitHub App installation...
`);

  // Export variables for this session
  process.env.GITHUB_APP_ID = appId;
  process.env.GITHUB_APP_PRIVATE_KEY_BASE64 = privateKeyBase64;
  process.env.GITHUB_INSTALLATION_ID = installationId;
  process.env.GITHUB_REPO_OWNER = owner;
  process.env.GITHUB_REPO_NAME = repoName;
  process.env.GITHUB_REPO = `${owner}/${repoName}`;

  try {
    // Test with gh CLI
    const repoInfo = exec(`gh repo view ${repo} --json name,owner`, true);
    console.log('✅ Repository access verified');
    console.log(`   ${repoInfo}`);
  } catch (error) {
    console.log('⚠️  Could not verify repository access');
    console.log('   Make sure the GitHub App is installed on the repository');
  }

  // Complete
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║  ✅ Setup Complete!                                                 ║
╚══════════════════════════════════════════════════════════════════════╝

Your GitHub App is ready for ultra-team coordination!

Configuration file: ~/.github-ultra-team.env

To use in your current shell:
  source ~/.github-ultra-team.env

To start a new ultra-team:
  /ultra-team N=3 "Build authentication system"

The team will:
  - Create GitHub issues for tasks
  - Use GitHub projects for coordination
  - Communicate via issue comments
  - Create PRs for review
  - Track progress in GitHub

Next steps:
  1. Source the config: source ~/.github-ultra-team.env
  2. Run ultra-team: /ultra-team N=3 "your task"
  3. Monitor progress in GitHub!

For troubleshooting, see:
  ~/.claude/skills/ultra-team/SKILL.md

Happy coordinating! 🚀
`);

  rl.close();
}

main().catch(error => {
  console.error('❌ Setup failed:', error.message);
  rl.close();
  process.exit(1);
});
