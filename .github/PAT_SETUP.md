# Quick Setup - GitHub Token Authentication

**For Development & Testing**

Use your existing GitHub token instead of setting up GitHub App.

## Setup (2 Steps)

### 1. Get Your GitHub Token

If you already have a token, skip to step 2.

**Create new token:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Classic"
3. Name: `UltraPilot Development`
4. Expiration: 90 days (or no expiration)
5. Scopes: Check `repo` (gives full repository access)
6. Click "Generate token"
7. **Copy the token immediately** (you won't see it again)

### 2. Set Environment Variable

```bash
# Add to ~/.bashrc or ~/.zshrc
export GITHUB_TOKEN=github_pat_xxxxxxxxxxxxxxxxxxxxxxxx

# Then source
source ~/.bashrc
```

**Or set for current session:**
```bash
export GITHUB_TOKEN=github_pat_xxxxxxxxxxxxxxxxxxxxxxxx
```

## Test Configuration

```bash
# Test that token works
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user

# Should show your GitHub user info
```

## Run Backend Validation

```bash
cd ~/.claude/plugins/ultrapilot
npx tsx scripts/validate-backend.ts
```

## Run Migration

```bash
# Dry run (preview)
npx tsx src/services/run-migration.ts --dry-run

# Actual migration
npx tsx src/services/run-migration.ts
```

## Security Notes

⚠️ **Never commit your token to git!**

The token should be:
- ✅ In environment variables
- ✅ In `.env` file (add `.env` to `.gitignore`)
- ❌ NOT in code
- ❌ NOT in config files committed to repo

## Token vs GitHub App

| Aspect | PAT (Development) | GitHub App (Production) |
|--------|------------------|-------------------------|
| Setup | 2 minutes ✅ | 15 minutes ⏸️ |
| Security | Personal token | Auto-rotating tokens |
| Rate limits | 5000/hour | 5000/hour |
| Recommended | Development ✅ | Production |

**Recommendation:** Start with PAT for testing. Can upgrade to GitHub App later.

## Troubleshooting

**"Bad credentials"**
→ Token is invalid or expired. Generate new token.

**"Resource not accessible"**
→ Token doesn't have `repo` scope. Regenerate with correct scope.

**"GITHUB_TOKEN not set"**
→ Run `export GITHUB_TOKEN=your_token_here` first.

---

**Status:** ✅ Ready to use with your GitHub token
**Next:** Run `npx tsx scripts/validate-backend.ts` to verify setup
