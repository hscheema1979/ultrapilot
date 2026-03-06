#!/bin/bash

# Run this AFTER transferring myhealthteam2-refactor and myhealthteam-chatbot
# to the creative-adventures organization

echo "🔗 Linking transferred repos to Healthcare Platform..."
echo ""

# Get Healthcare Platform project number under creative-adventures
HEALTH_NUM=$(gh project list --owner creative-adventures | grep "Healthcare Platform" | awk '{print $1}')

echo "Healthcare Platform project number: $HEALTH_NUM"
echo ""

# Link transferred repos
echo "Linking myhealthteam2-refactor..."
gh project link $HEALTH_NUM --repo creative-adventures/myhealthteam2-refactor --owner creative-adventures
echo "✓ Linked"

echo "Linking myhealthteam-chatbot..."
gh project link $HEALTH_NUM --repo creative-adventures/myhealthteam-chatbot --owner creative-adventures
echo "✓ Linked"

echo ""
echo "✅ All myhealthteam repos linked to Healthcare Platform!"
echo ""
echo "View at: https://github.com/creative-adventures/myhealthteam/projects"
