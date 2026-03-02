#!/usr/bin/env python3
"""
Automated Google Chat Setup for UltraX Gateway
Uses existing OAuth tokens to programmatically set up integration
"""

import os
import sys
import json
import requests
from pathlib import Path

# OAuth token path
OAUTH_TOKEN_PATH = Path.home() / "oauth_tokens" / "google_token.json"
ULTRA_DIR = Path.home() / ".claude" / "plugins" / "ultrapilot"

def load_oauth_token():
    """Load Google OAuth token"""
    if not OAUTH_TOKEN_PATH.exists():
        print(f"❌ OAuth token not found at {OAUTH_TOKEN_PATH}")
        sys.exit(1)

    with open(OAUTH_TOKEN_PATH) as f:
        return json.load(f)

def refresh_token_if_needed(token_data):
    """Refresh access token if expired"""
    # Check if token needs refresh
    import datetime
    expiry_str = token_data['expiry'].replace('Z', '+00:00')
    if '+' in expiry_str:
        expiry = datetime.datetime.fromisoformat(expiry_str)
    else:
        expiry = datetime.datetime.fromisoformat(expiry_str).replace(tzinfo=datetime.timezone.utc)

    now = datetime.datetime.now(datetime.timezone.utc)

    if now < expiry - datetime.timedelta(minutes=5):
        return token_data['access_token']

    # Refresh the token
    print("🔄 Refreshing access token...")
    data = {
        'refresh_token': token_data['refresh_token'],
        'client_id': token_data['client_id'],
        'client_secret': token_data['client_secret'],
        'grant_type': 'refresh_token'
    }

    response = requests.post(token_data['token_uri'], data=data)
    if response.status_code != 200:
        print(f"❌ Failed to refresh token: {response.text}")
        sys.exit(1)

    new_token = response.json()
    token_data['access_token'] = new_token['access_token']
    # Update expiry (typically 1 hour)
    token_data['expiry'] = (datetime.datetime.now(datetime.timezone.utc) +
                            datetime.timedelta(seconds=new_token.get('expires_in', 3600))).isoformat()

    # Save updated token
    with open(OAUTH_TOKEN_PATH, 'w') as f:
        json.dump(token_data, f, indent=2)

    print("✅ Token refreshed successfully")
    return token_data['access_token']

def list_chat_spaces(access_token):
    """List available Google Chat spaces"""
    print("📋 Fetching your Google Chat spaces...")

    url = "https://chat.googleapis.com/v1/spaces"
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    params = {
        'pageSize': 50
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code != 200:
        print(f"❌ Failed to list spaces: {response.status_code}")
        print(f"Response: {response.text}")
        return []

    spaces = response.json().get('spaces', [])
    return [s for s in spaces if s.get('displayName') and not s.get('singleUserBot')]  # Filter out DMs

def create_webhook(space_name, access_token):
    """Create a webhook in the specified space"""
    print(f"🔗 Creating webhook for space: {space_name}")

    # First, we need to find the space
    spaces = list_chat_spaces(access_token)
    target_space = None

    for space in spaces:
        if space['displayName'] == space_name:
            target_space = space
            break

    if not target_space:
        print(f"❌ Space '{space_name}' not found")
        print("\nAvailable spaces:")
        for i, space in enumerate(spaces, 1):
            print(f"  {i}. {space['displayName']} ({space['name']})")
        return None

    # Create webhook using Google Chat API
    url = f"https://chat.googleapis.com/v1/{target_space['name']}/webhooks"
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    webhook_config = {
        'name': 'UltraX Bot',
        'description': 'Ultrapilot autonomous development agent',
        'avatar': 'https://github.com/hscheema1979.png'
    }

    response = requests.post(url, headers=headers, json=webhook_config)

    if response.status_code not in [200, 201]:
        print(f"❌ Failed to create webhook: {response.status_code}")
        print(f"Response: {response.text}")

        # Fallback: Try legacy webhook creation
        print("💡 Trying legacy webhook method...")
        return create_legacy_webhook(target_space, access_token)

    webhook = response.json()
    print(f"✅ Webhook created successfully!")
    return webhook.get('webhookUrl') or webhook.get('webhook', {}).get('url')

def create_legacy_webhook(space, access_token):
    """Create webhook using legacy method (if API doesn't support it)"""
    # Unfortunately, the Google Chat API doesn't support creating webhooks programmatically
    # Webhooks must be created manually in the UI
    print("\n⚠️  Google Chat API doesn't support webhook creation via API")
    print("📋 Manual setup required:")
    print(f"   1. Open Google Chat")
    print(f"   2. Go to space: {space['displayName']}")
    print(f"   3. Click ↓ next to space name → Configure webhooks")
    print(f"   4. Add webhook named 'UltraX Bot'")
    print(f"   5. Paste the webhook URL here when done\n")

    webhook_url = input("Enter webhook URL (or press Enter to skip): ").strip()

    if webhook_url and webhook_url.startswith('https://chat.googleapis.com'):
        return webhook_url

    return None

def test_webhook(webhook_url):
    """Send a test message to the webhook"""
    print("📨 Sending test message...")

    message = {
        "text": "✅ *UltraX Bot Connected!*\n\nUltrapilot is now integrated with Google Chat.\n\nTry these commands:\n• `/ultrapilot <task>` - Start autonomous development\n• `/status` - Check system status\n• `/help` - Show all commands\n\n_Connected to UltraX Gateway (port 3001)_",
        "cards": [
            {
                "header": {
                    "title": "🤖 UltraX Bot",
                    "subtitle": "Ultrapilot Integration",
                    "imageUrl": "https://github.com/hscheema1979.png"
                },
                "sections": [
                    {
                        "widgets": [
                            {
                                "textParagraph": {
                                    "text": "✅ <b>Connection successful!</b><br><br>You can now interact with Ultrapilot directly from Google Chat."
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }

    response = requests.post(webhook_url, json=message)

    if response.status_code in [200, 204]:
        print("✅ Test message sent successfully!")
        return True
    else:
        print(f"❌ Failed to send test: {response.status_code}")
        print(f"Response: {response.text}")
        return False

def save_config(webhook_url):
    """Save webhook configuration"""
    config_dir = ULTRA_DIR / ".ultra"
    config_dir.mkdir(parents=True, exist_ok=True)

    config_file = config_dir / "google-chat-config.sh"

    with open(config_file, 'w') as f:
        f.write(f"""# Google Chat Configuration for UltraX Gateway
# Generated by setup-google-chat-auto.py

export GOOGLE_CHAT_WEBHOOK_URL="{webhook_url}"
export GOOGLE_CHAT_ENABLED="true"
""")

    print(f"✅ Configuration saved to {config_file}")

def update_systemd_service():
    """Update systemd service to use webhook config"""
    service_file = Path("/etc/systemd/system/ultrax-server.service")

    if not service_file.exists():
        print("⚠️  systemd service not found, skipping update")
        return

    print("📝 Updating systemd service...")

    # Read current service file
    with open(service_file) as f:
        content = f.read()

    # Add environment file if not present
    if 'EnvironmentFile' not in content:
        config_path = ULTRA_DIR / ".ultra" / "google-chat-config.sh"
        content = content.replace(
            '[Service]',
            f'[Service]\nEnvironmentFile={config_path}'
        )

        # Write back (requires sudo)
        print("⚠️  Requires sudo to update systemd service")
        print(f"   Run: sudo nano {service_file}")
        print(f"   Add: EnvironmentFile={config_path}")
        print(f"   Then: sudo systemctl daemon-reload && sudo systemctl restart ultrax-server")

def main():
    print("╔═══════════════════════════════════════════════════════════════╗")
    print("║   📱 AUTOMATED GOOGLE CHAT SETUP FOR ULTRAX GATEWAY          ║")
    print("╚═══════════════════════════════════════════════════════════════╝")
    print()

    # Load OAuth token
    token_data = load_oauth_token()
    print(f"✅ OAuth token loaded for: {token_data['meta']['account']}")
    print(f"   Scopes: {len(token_data['scopes'])} APIs available")

    # Check for Chat scopes
    chat_scopes = [s for s in token_data['scopes'] if 'chat' in s]
    if not chat_scopes:
        print("❌ No Google Chat scopes found in OAuth token")
        print("   Required scopes: chat.spaces, chat.messages")
        sys.exit(1)

    print(f"✅ Chat API scopes found: {len(chat_scopes)}")
    print()

    # Refresh token if needed
    access_token = refresh_token_if_needed(token_data)

    # List available spaces
    spaces = list_chat_spaces(access_token)

    if not spaces:
        print("❌ No Chat spaces found. Create a space first in Google Chat.")
        sys.exit(1)

    print(f"✅ Found {len(spaces)} spaces:")
    for i, space in enumerate(spaces, 1):
        print(f"   {i}. {space['displayName']}")
    print()

    # Select space
    if len(spaces) == 1:
        selected_space = spaces[0]
        print(f"Auto-selecting: {selected_space['displayName']}")
    else:
        try:
            choice = int(input("Select space number: ").strip())
            selected_space = spaces[choice - 1]
        except (ValueError, IndexError):
            print("❌ Invalid selection")
            sys.exit(1)

    print(f"Selected space: {selected_space['displayName']}")
    print()

    # Try to create webhook programmatically
    webhook_url = create_webhook(selected_space['displayName'], access_token)

    if not webhook_url:
        print("\n❌ Webhook setup failed")
        sys.exit(1)

    # Test webhook
    if not test_webhook(webhook_url):
        print("\n❌ Webhook test failed")
        sys.exit(1)

    # Save configuration
    save_config(webhook_url)

    # Update systemd
    update_systemd_service()

    print()
    print("╔═══════════════════════════════════════════════════════════════╗")
    print("║   ✅ GOOGLE CHAT SETUP COMPLETE!                             ║")
    print("╚═══════════════════════════════════════════════════════════════╝")
    print()
    print("📋 Next Steps:")
    print("   1. Check Google Chat for test message")
    print("   2. Try: /ultrapilot hello world")
    print("   3. Restart Gateway: ./stop.sh && ./start.sh")
    print()

if __name__ == '__main__':
    main()
