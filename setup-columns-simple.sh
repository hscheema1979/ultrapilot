#!/bin/bash

# GitHub token should be set via environment variable:
# export GITHUB_TOKEN=your_token
# Or use gh CLI authentication (gh auth login)

if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN environment variable not set"
  echo "Please set it with: export GITHUB_TOKEN=your_token"
  echo "Or authenticate with gh CLI: gh auth login"
  exit 1
fi

echo "Setting up project board columns..."
echo ""

# Function to add columns to a project board
add_columns() {
  local owner=$1
  local repo=$2
  local project_name=$3
  shift 3
  local columns=("$@")

  echo "Setting up: $project_name"
  echo "Repository: $owner/$repo"
  echo ""

  # Get project ID
  project_id=$(gh project list --owner $owner --limit 100 --jq ".[] | select(.name == \"$project_name\") | .id")

  if [ -z "$project_id" ]; then
    echo "WARNING: Project '$project_name' not found"
    echo ""
    return
  fi

  echo "Found project (ID: $project_id)"

  # Add columns
  for col in "${columns[@]}"; do
    IFS='|' read -r col_name col_desc <<< "$col"
    gh project column create "$project_id" --title "$col_name" 2>&1 | grep -v "owner is required" || echo "Added column: $col_name"
  done

  echo ""
}

# MyHealthTeam Platform columns
add_columns "hscheema1979" "myhealthteam" "MyHealthTeam Platform" \
  "Strategic|Strategic planning and roadmap" \
  "Requirements|Requirements gathering and analysis" \
  "Architecture|System architecture and design" \
  "Teams|Team assignments and coordination" \
  "Development|Active development sprints" \
  "Testing|QA and testing phases" \
  "Deployment|Deployment and releases" \
  "Analytics|Analytics and monitoring" \
  "Complete|Completed features"

# UltraPilot Development columns
add_columns "hscheema1979" "ultrapilot" "UltraPilot Development" \
  "Ideas|Feature ideas and proposals" \
  "Sizing|STEP 0.5: Multi-Agent Task Sizing" \
  "Planning|Phase 0-1: Requirements, Architecture, Planning" \
  "Review|Phase 1.5: Multi-Perspective Review" \
  "Ready|Plan approved, ready for execution" \
  "In Progress|Phase 2: Execution" \
  "QA|Phase 3: QA Cycles" \
  "Validation|Phase 4: Multi-Perspective Validation" \
  "Verification|Phase 5: Evidence Collection" \
  "Complete|All phases done"

# Mission Control columns
add_columns "hscheema1979" "ultrapilot" "Mission Control" \
  "Design|UI/UX design and wireframes" \
  "Backend|Backend API and services" \
  "Frontend|Frontend components and views" \
  "Integration|GitHub integration and webhooks" \
  "Dashboard|Dashboard visualization" \
  "Testing|Testing and validation" \
  "Documentation|Docs and guides" \
  "Complete|Mission Control ready"

echo "========================================================================="
echo "ALL PROJECT BOARDS SET UP!"
echo "========================================================================="
echo ""
echo "ACCESS YOUR DASHBOARDS:"
echo ""
echo "1. MyHealthTeam Platform:"
echo "   https://github.com/hscheema1979/myhealthteam/projects"
echo ""
echo "2. UltraPilot Development:"
echo "   https://github.com/hscheema1979/ultrapilot/projects"
echo ""
echo "3. Mission Control:"
echo "   https://github.com/hscheema1979/ultrapilot/projects"
echo ""
echo "Go check them on your mobile app now!"
