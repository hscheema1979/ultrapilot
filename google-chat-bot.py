#!/usr/bin/env python3
"""
Google Chat Bot for UltraX Gateway
Uses Google Chat API (not webhooks) - works with free Gmail accounts
"""

import os
import sys
import json
import requests
import threading
import time
from datetime import datetime
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

# Configuration
OAUTH_TOKEN_PATH = Path.home() / "oauth_tokens" / "google_token.json"
ULTRA_DIR = Path.home() / ".claude" / "plugins" / "ultrapilot"
CONFIG_FILE = ULTRA_DIR / ".ultra" / "google-chat-state.json"
GATEWAY_URL = "http://localhost:3001"

class GoogleChatBot:
    def __init__(self):
        self.token_data = None
        self.access_token = None
        self.space_name = None
        self.running = False

    def load_oauth_token(self):
        """Load OAuth token"""
        if not OAUTH_TOKEN_PATH.exists():
            print(f"❌ OAuth token not found at {OAUTH_TOKEN_PATH}")
            sys.exit(1)

        with open(OAUTH_TOKEN_PATH) as f:
            self.token_data = json.load(f)
        return self.token_data

    def refresh_token_if_needed(self):
        """Refresh access token if expired"""
        import datetime

        expiry_str = self.token_data['expiry'].replace('Z', '+00:00')
        if '+' in expiry_str:
            expiry = datetime.datetime.fromisoformat(expiry_str)
        else:
            expiry = datetime.datetime.fromisoformat(expiry_str).replace(tzinfo=datetime.timezone.utc)

        now = datetime.datetime.now(datetime.timezone.utc)

        if now < expiry - datetime.timedelta(minutes=5):
            self.access_token = self.token_data['access_token']
            return self.access_token

        # Refresh the token
        print("🔄 Refreshing access token...")
        data = {
            'refresh_token': self.token_data['refresh_token'],
            'client_id': self.token_data['client_id'],
            'client_secret': self.token_data['client_secret'],
            'grant_type': 'refresh_token'
        }

        response = requests.post(self.token_data['token_uri'], data=data)
        if response.status_code != 200:
            print(f"❌ Failed to refresh token: {response.text}")
            sys.exit(1)

        new_token = response.json()
        self.token_data['access_token'] = new_token['access_token']
        self.token_data['expiry'] = (datetime.datetime.now(datetime.timezone.utc) +
                                     datetime.timedelta(seconds=new_token.get('expires_in', 3600))).isoformat()

        # Save updated token
        with open(OAUTH_TOKEN_PATH, 'w') as f:
            json.dump(self.token_data, f, indent=2)

        self.access_token = self.token_data['access_token']
        print("✅ Token refreshed")
        return self.access_token

    def list_spaces(self):
        """List all accessible spaces"""
        print("📋 Fetching your Google Chat spaces...")

        url = "https://chat.googleapis.com/v1/spaces"
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }

        params = {'pageSize': 50}

        response = requests.get(url, headers=headers, params=params)

        if response.status_code != 200:
            print(f"❌ Failed to list spaces: {response.status_code}")
            print(f"Response: {response.text}")
            return []

        spaces = response.json().get('spaces', [])
        # Filter out DMs and empty spaces
        return [s for s in spaces if s.get('displayName')]

    def send_message(self, text, card=None):
        """Send a message to the configured space"""
        if not self.space_name:
            print("❌ No space configured")
            return False

        url = f"https://chat.googleapis.com/v1/{self.space_name}/messages"
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }

        message = {'text': text}
        if card:
            message['cards'] = [card]

        response = requests.post(url, headers=headers, json=message)

        if response.status_code in [200, 201]:
            print(f"✅ Message sent to Google Chat")
            return True
        else:
            print(f"❌ Failed to send message: {response.status_code}")
            print(f"Response: {response.text}")
            return False

    def forward_to_gateway(self, message_text, sender_name):
        """Forward Google Chat message to UltraX Gateway"""
        url = f"{GATEWAY_URL}/webhook/google-chat"

        payload = {
            'message': message_text,
            'sender': sender_name,
            'source': 'google_chat',
            'timestamp': datetime.now().isoformat()
        }

        try:
            response = requests.post(url, json=payload, timeout=10)
            if response.status_code == 200:
                print(f"✅ Forwarded to Gateway: {message_text[:50]}...")
                return response.json()
            else:
                print(f"⚠️  Gateway response: {response.status_code}")
                return None
        except Exception as e:
            print(f"❌ Gateway error: {e}")
            return None

    def monitor_messages(self):
        """Monitor for new messages in the space"""
        # Google Chat API doesn't have a simple polling endpoint for messages
        # Instead, we'll rely on the Gateway to call this bot when it receives commands
        print("ℹ️  Google Chat bot ready - waiting for commands via Gateway")
        print("   Use Relay Web UI or Google Chat to send commands")

    def save_config(self):
        """Save bot configuration"""
        config = {
            'space_name': self.space_name,
            'configured_at': datetime.now().isoformat(),
            'active': True
        }

        CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config, f, indent=2)

        print(f"✅ Configuration saved to {CONFIG_FILE}")

    def load_config(self):
        """Load bot configuration"""
        if CONFIG_FILE.exists():
            with open(CONFIG_FILE) as f:
                config = json.load(f)
                self.space_name = config.get('space_name')
                return True
        return False

def main():
    print("╔═══════════════════════════════════════════════════════════════╗")
    print("║   📱 GOOGLE CHAT BOT SETUP (Using Chat API)                  ║")
    print("╚═══════════════════════════════════════════════════════════════╝")
    print()

    bot = GoogleChatBot()

    # Load OAuth token
    bot.load_oauth_token()
    print(f"✅ OAuth token loaded: {bot.token_data['meta']['account']}")
    print()

    # Refresh if needed
    bot.refresh_token_if_needed()
    print()

    # Check if already configured
    if bot.load_config():
        print(f"⚠️  Already configured for space: {bot.space_name}")
        response = input("Reconfigure? (y/N): ").strip().lower()
        if response != 'y':
            print("✅ Keeping existing configuration")
            print()
            print("📋 Bot is ready! Send commands via:")
            print("   • Relay Web UI: http://localhost:3000")
            print("   • Google Chat (if configured)")
            return

    # List spaces
    spaces = bot.list_spaces()

    if not spaces:
        print("❌ No Google Chat spaces found.")
        print("   Create a space first in Google Chat")
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

    bot.space_name = selected_space['name']
    print(f"✅ Selected space: {selected_space['displayName']}")
    print()

    # Send test message
    print("📨 Sending test message...")
    test_message = "✅ *UltraX Bot Connected!*\n\nThe bot is now active in this space.\n\nCommands will be forwarded to UltraX Gateway and results broadcast to both Relay Web UI and Google Chat.\n\n_Status: Ready_"

    if bot.send_message(test_message):
        print("✅ Test message sent successfully!")
        print()

        # Save configuration
        bot.save_config()

        print()
        print("╔═══════════════════════════════════════════════════════════════╗")
        print("║   ✅ GOOGLE CHAT BOT SETUP COMPLETE                         ║")
        print("╚═══════════════════════════════════════════════════════════════╝")
        print()
        print("📋 How It Works:")
        print("   1. Send commands in Google Chat or Relay Web UI")
        print("   2. UltraX Gateway processes them")
        print("   3. Responses appear in BOTH places")
        print()
        print("🚀 Ready to use!")
        print("   • Relay Web UI: http://localhost:3000")
        print(f"   • Google Chat: {selected_space['displayName']}")
        print()
    else:
        print("❌ Failed to send test message")
        sys.exit(1)

if __name__ == '__main__':
    main()
