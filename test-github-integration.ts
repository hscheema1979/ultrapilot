#!/usr/bin/env node
/**
 * Test GitHub Integration with PAT
 */

import { GitHubAuthManager } from './src/services/github-auth.js';

async function testGitHubIntegration() {
  console.log('🔑 Testing GitHub Authentication...\n');

  try {
    // Use PAT from environment
    const auth = GitHubAuthManager.fromEnv('hscheema1979/ultra-workspace');

    console.log(`Auth type: ${auth.getAuthType()}`);
    console.log(`Repository: ${auth.getRepository()}\n`);

    // Test connection
    console.log('Testing connection...');
    const isConnected = await auth.testConnection();

    if (!isConnected) {
      console.log('❌ Connection test failed');
      return;
    }

    console.log('✅ Connection successful!\n');

    // Test Octokit
    console.log('Testing Octokit...');
    const octokit = await auth.getOctokit();
    console.log('✅ Octokit created\n');

    // Test getting user info
    console.log('Testing user API...');
    const { data: user } = await octokit.rest.users.getAuthenticated();
    console.log(`✅ Authenticated as: ${user.login}`);
    console.log(`   Name: ${user.name || 'N/A'}`);
    console.log(`   Email: ${user.email || 'N/A'}\n`);

    // Test getting repo info
    console.log('Testing repository API...');
    const { data: repo } = await octokit.rest.repos.get({
      owner: 'hscheema1979',
      repo: 'ultra-workspace'
    });
    console.log(`✅ Repository: ${repo.full_name}`);
    console.log(`   Description: ${repo.description || 'No description'}`);
    console.log(`   Stars: ${repo.stargazers_count}`);
    console.log(`   Open issues: ${repo.open_issues_count}\n`);

    // Test listing issues
    console.log('Testing issues API...');
    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner: 'hscheema1979',
      repo: 'ultra-workspace',
      state: 'open',
      per_page: 5
    });
    console.log(`✅ Found ${issues.length} open issues (showing first 5):`);
    issues.forEach((issue, i) => {
      console.log(`   ${i + 1}. #${issue.number}: ${issue.title}`);
    });

    console.log('\n✅ All GitHub integration tests passed!');
    console.log('\n📝 Backend is ready for migration.');

    await auth.close();
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);

    if (error.status === 401) {
      console.log('\n⚠️  Token authentication failed');
      console.log('Please check your GITHUB_TOKEN is valid');
    } else if (error.status === 404) {
      console.log('\n⚠️  Repository or resource not found');
      console.log('Make sure hscheema1979/ultra-workspace exists');
    } else {
      console.log('\nFull error:', error);
    }
  }
}

testGitHubIntegration();
