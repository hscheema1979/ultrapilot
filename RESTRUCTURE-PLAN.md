# Ultrapilot Repository Restructure Plan

## Current Structure (WRONG)
```
ultrapilot/
├── src/              # Plugin code
├── dist/             # Compiled
├── web-ui/           # Partial Web UI
└── start.sh          # References external Relay ❌
```

## New Structure (CORRECT)
```
ultrapilot/
├── README.md                    # Main documentation
├── package.json                 # Root package.json
├── packages/
│   ├── plugin/                  # Ultrapilot Plugin
│   │   ├── src/
│   │   ├── skills/
│   │   └── package.json
│   ├── relay/                   # Relay Web UI (full copy)
│   │   ├── src/
│   │   ├── bin/
│   │   └── package.json
│   ├── gateway/                 # UltraX Gateway API
│   │   ├── src/
│   │   ├── dist/
│   │   └── package.json
│   └── google-chat/             # Google Chat integration
│       ├── src/
│       └── package.json
├── scripts/
│   ├── install.sh               # Unified installer
│   ├── start-all.sh             # Start everything
│   ├── status.sh                # Check all services
│   └── sync-github.sh           # GitHub sync for VPS fleet
├── .github/
│   └── workflows/
│       ├── test.yml             # Test all packages
│       ├── build.yml            # Build all packages
│       └── release.yml          # Release all packages
└── monorepo.json                # Monorepo config
```

## Migration Steps

1. Create monorepo structure
2. Move existing code to packages/
3. Copy Relay into packages/relay/
4. Update all import paths
5. Create unified scripts
6. Set up GitHub CI/CD
7. Test complete integration
