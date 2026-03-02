module.exports = {
  apps: [{
    name: 'ultrapilot-gateway',
    script: 'src/server.ts',
    cwd: '/home/ubuntu/.claude/plugins/ultrapilot',
    interpreter: 'node',
    interpreter_args: '--require /home/ubuntu/.npm/_npx/tsx/dist/preflight.cjs --import tsx/dist/loader.mjs',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/home/ubuntu/.claude/plugins/ultrapilot/.ultra/state/gateway-error.log',
    out_file: '/home/ubuntu/.claude/plugins/ultrapilot/.ultra/state/gateway-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    kill_timeout: 5000,
    autostart: true
  }]
};
