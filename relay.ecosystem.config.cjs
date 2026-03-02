module.exports = {
  apps: [{
    name: 'ultrapilot-relay-ui',
    script: './ultrapilot-relay-wrapper.sh',
    cwd: '/home/ubuntu/.claude/plugins/ultrapilot/relay',
    interpreter: 'bash',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    min_uptime: '10s',        // Consider stable after 10 seconds
    max_restarts: 10,         // Max restarts within 1 minute window
    restart_delay: 4000,      // Wait 4 seconds between restarts
    env: {
      NODE_ENV: 'production',
      DAEMON_PORT: 3002
    },
    error_file: '/home/ubuntu/.claude/plugins/ultrapilot/relay/logs/pm2-error.log',
    out_file: '/home/ubuntu/.claude/plugins/ultrapilot/relay/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    listen_timeout: 10000,
    kill_timeout: 5000,       // Graceful shutdown timeout
    wait_ready: true,         // Wait for app to be ready
    autostart: true
  }]
};
