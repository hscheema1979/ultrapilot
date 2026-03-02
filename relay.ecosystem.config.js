module.exports = {
  apps: [{
    name: 'relay-web-ui',
    script: './bin/cli.js',
    cwd: '/home/ubuntu/.claude-web-interfaces/claude-relay',
    interpreter: 'node',
    interpreter_args: '--dangerously-skip-permissions',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/ubuntu/.claude-web-interfaces/claude-relay/logs/pm2-error.log',
    out_file: '/home/ubuntu/.claude-web-interfaces/claude-relay/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    listen_timeout: 10000
  }]
};
