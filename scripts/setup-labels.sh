#!/bin/bash
#
# GitHub Label Schema Setup Script
# Convenience wrapper for create-labels.ts
#
# Usage:
#   ./setup-labels.sh                    # Uses GITHUB_TOKEN from env
#   ./setup-labels.sh <your-token>       # Pass token directly
#   ./setup-labels.sh -d                 # Dry run (show what would happen)
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║     GitHub Label Schema Setup - Ultrapilot               ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_error() {
    echo -e "${RED}❌ $1${NC}" >&2
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Parse arguments
TOKEN=""
DRY_RUN=false

if [[ "$1" == "-d" ]] || [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
    shift
fi

if [[ -n "$1" ]]; then
    TOKEN="$1"
elif [[ -z "$GITHUB_TOKEN" ]]; then
    print_error "GitHub token not provided"
    echo ""
    echo "Usage:"
    echo "  $0 <github-token>          # Pass token directly"
    echo "  $0                         # Uses GITHUB_TOKEN from environment"
    echo "  GITHUB_TOKEN=xxx $0        # Set token inline"
    echo ""
    exit 1
else
    TOKEN="$GITHUB_TOKEN"
fi

# Validate token
if [[ -z "$TOKEN" ]]; then
    print_error "GitHub token is empty"
    exit 1
fi

print_header
print_info "Repository: hscheema1979/ultra-workspace"
print_info "Total labels to create: 44"
echo ""

if [[ "$DRY_RUN" == true ]]; then
    print_info "DRY RUN MODE - No changes will be made"
    echo ""
    echo "Label categories that would be created:"
    echo "  • Queue Labels (6): intake, active, review, done, failed, blocked"
    echo "  • Phase Labels (7): phase:0 through phase:cleanup"
    echo "  • Agent Labels (22): All Ultrapilot specialist agents"
    echo "  • Type Labels (10): feature, bug, design, test, review, etc."
    echo "  • Priority Labels (4): critical, high, medium, low"
    echo "  • Special Labels (3): handoff, epic, dependency"
    echo ""
    print_info "Run without -d flag to execute"
    exit 0
fi

# Check if tsx is available
if ! command -v npx &> /dev/null; then
    print_error "npx not found. Please install Node.js and npm"
    exit 1
fi

# Change to plugin directory
cd "$SCRIPT_DIR/.."

# Check if node_modules exists
if [[ ! -d "node_modules" ]]; then
    print_info "Dependencies not found, installing..."
    npm install --silent
fi

# Run the TypeScript script
print_info "Executing label creation script..."
echo ""

export GITHUB_TOKEN="$TOKEN"
npx tsx scripts/create-labels.ts

exit_code=$?

if [[ $exit_code -eq 0 ]]; then
    echo ""
    print_success "Label schema setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "  1. Visit https://github.com/hscheema1979/ultra-workspace/labels"
    echo "  2. Verify all 44 labels are present"
    echo "  3. Labels will be automatically applied by Ultrapilot agents"
    echo ""
else
    print_error "Label setup failed with exit code $exit_code"
    echo ""
    echo "Troubleshooting:"
    echo "  • Verify your GitHub token has 'repo' scope"
    echo "  • Check that you have write access to hscheema1979/ultra-workspace"
    echo "  • Ensure network connectivity to github.com"
    echo ""
    exit $exit_code
fi
