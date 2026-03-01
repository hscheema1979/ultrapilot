/**
 * UltraX Express Server
 *
 * HTTP/WebSocket server for:
 * - Web UI integration (Relay on port 3000)
 * - Google Chat webhooks
 * - Gateway REST API
 */

import express, { Request, Response } from 'express';
import { UltraXGateway, UltraXMessage, UltraXResponse } from './gateway.js';
import { UltraXGoogleChatBot, GoogleChatConfig, GoogleChatWebhookEvent } from './chat-bot.js';

export interface ServerConfig {
  port?: number;
  ulrapilotPath?: string;
  statePath?: string;
  googleChat?: GoogleChatConfig;
  relayUrl?: string;
}

export interface GatewayRequest {
  sessionId: string;
  userId: string;
  interface: 'web' | 'chat' | 'cli';
  command: string;
  metadata?: Record<string, any>;
}

export interface GatewayErrorResponse {
  error: string;
  message: string;
  timestamp: Date;
}

export class UltraXServer {
  private app: express.Application;
  private gateway: UltraXGateway;
  private chatBot?: UltraXGoogleChatBot;
  private config: ServerConfig;

  constructor(config: ServerConfig = {}) {
    this.config = {
      port: config.port || 3001,
      ulrapilotPath: config.ulrapilotPath,
      statePath: config.statePath,
      googleChat: config.googleChat,
      relayUrl: config.relayUrl || 'http://localhost:3000'
    };

    // Initialize gateway
    this.gateway = new UltraXGateway({
      ulrapilotPath: this.config.ulrapilotPath,
      statePath: this.config.statePath,
      sessionTimeout: 60 * 60 * 1000 // 1 hour
    });

    // Initialize Express app
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();

    // Initialize Google Chat bot if configured
    if (this.config.googleChat) {
      this.chatBot = new UltraXGoogleChatBot(this.gateway, this.config.googleChat);
    }
  }

  /**
   * Setup Express middleware
   */
  private setupMiddleware(): void {
    // CORS for Relay integration
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', this.config.relayUrl || '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      next();
    });

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });

    // JSON parsing with error handling
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // JSON parsing error handler
    this.app.use((err: any, req: Request, res: Response, next: any) => {
      if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({
          error: 'Invalid JSON',
          message: err.message,
          timestamp: new Date()
        } as GatewayErrorResponse);
      }
      next();
    });
  }

  /**
   * Setup HTTP routes
   */
  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        sessions: this.gateway['sessions'].size
      });
    });

    // Gateway endpoint for Web UI
    this.app.post('/api/gateway', async (req: Request, res: Response) => {
      try {
        const gatewayReq: GatewayRequest = req.body;

        // Validate request
        if (!gatewayReq.sessionId || !gatewayReq.userId || !gatewayReq.command) {
          return res.status(400).json({
            error: 'Missing required fields',
            timestamp: new Date()
          } as GatewayErrorResponse);
        }

        // Create UltraX message
        const message: UltraXMessage = {
          sessionId: gatewayReq.sessionId,
          userId: gatewayReq.userId,
          interface: gatewayReq.interface || 'web',
          command: gatewayReq.command,
          timestamp: new Date(),
          metadata: gatewayReq.metadata
        };

        // Handle message through gateway
        const response: UltraXResponse = await this.gateway.handleMessage(message);

        res.json(response);

      } catch (error: any) {
        console.error('Gateway error:', error);
        res.status(500).json({
          error: 'Internal server error',
          message: error.message,
          timestamp: new Date()
        } as GatewayErrorResponse);
      }
    });

    // Session status endpoint
    this.app.get('/api/session/:sessionId', (req: Request, res: Response) => {
      const { sessionId } = req.params;
      const status = this.gateway.getSessionStatus(sessionId);
      res.json(status);
    });

    // Terminate session endpoint
    this.app.delete('/api/session/:sessionId', async (req: Request, res: Response) => {
      try {
        const { sessionId } = req.params;
        await this.gateway.terminateSession(sessionId);
        res.json({ success: true, sessionId });
      } catch (error: any) {
        res.status(404).json({
          error: 'Session not found',
          message: error.message,
          timestamp: new Date()
        } as GatewayErrorResponse);
      }
    });

    // Switch session interface endpoint
    this.app.post('/api/session/:sessionId/switch', async (req: Request, res: Response) => {
      try {
        const { sessionId } = req.params;
        const { targetInterface } = req.body;

        if (!['web', 'chat', 'cli'].includes(targetInterface)) {
          return res.status(400).json({
            error: 'Invalid interface',
            message: 'Interface must be web, chat, or cli',
            timestamp: new Date()
          } as GatewayErrorResponse);
        }

        await this.gateway.switchSession(sessionId, targetInterface);
        res.json({ success: true, sessionId, targetInterface });

      } catch (error: any) {
        res.status(404).json({
          error: 'Session switch failed',
          message: error.message,
          timestamp: new Date()
        } as GatewayErrorResponse);
      }
    });

    // Google Chat webhook endpoint
    this.app.post('/webhook/google-chat', async (req: Request, res: Response) => {
      try {
        if (!this.chatBot) {
          return res.status(503).json({
            error: 'Google Chat bot not configured',
            timestamp: new Date()
          } as GatewayErrorResponse);
        }

        const event: GoogleChatWebhookEvent = req.body;

        // Handle webhook asynchronously
        this.chatBot.handleWebhook(event).catch(error => {
          console.error('Google Chat webhook error:', error);
        });

        // Return immediately (webhooks should be fast)
        res.status(200).send('OK');

      } catch (error: any) {
        console.error('Google Chat webhook error:', error);
        res.status(500).json({
          error: 'Webhook processing failed',
          message: error.message,
          timestamp: new Date()
        } as GatewayErrorResponse);
      }
    });

    // Relay integration endpoint (for Relay UI to fetch Ultrapilot commands)
    this.app.get('/api/relay/commands', (req: Request, res: Response) => {
      res.json({
        commands: [
          { name: '/ultrapilot', description: 'Full autonomous execution' },
          { name: '/ultra-team', description: 'Coordinate parallel agents' },
          { name: '/ultra-ralph', description: 'Persistent execution loop' },
          { name: '/ultra-review', description: 'Multi-dimensional review' },
          { name: '/ultra-hud', description: 'Configure HUD display' },
          { name: '/ultra-cancel', description: 'Cancel active mode' }
        ]
      });
    });

    // Relay session list endpoint
    this.app.get('/api/relay/sessions/:userId', (req: Request, res: Response) => {
      const { userId } = req.params;
      const sessions = Array.from(this.gateway['sessions'].values())
        .filter(s => s.userId === userId)
        .map(s => ({
          sessionId: s.sessionId,
          interface: s.interface,
          startTime: s.startTime,
          lastActivity: s.lastActivity,
          currentPhase: s.currentPhase,
          activeAgents: s.activeAgents
        }));

      res.json({ sessions });
    });

    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.path} not found`,
        timestamp: new Date()
      } as GatewayErrorResponse);
    });

    // Error handler
    this.app.use((err: any, req: Request, res: Response, next: any) => {
      console.error('Server error:', err);
      res.status(500).json({
        error: 'Internal server error',
        message: err.message,
        timestamp: new Date()
      } as GatewayErrorResponse);
    });
  }

  /**
   * Start the server
   */
  async start(): Promise<void> {
    const port = this.config.port || 3001;

    return new Promise((resolve) => {
      this.app.listen(port, () => {
        console.log(`\n🚀 UltraX Server started`);
        console.log(`📡 HTTP API: http://localhost:${port}`);
        console.log(`🔌 Gateway: /api/gateway`);
        console.log(`💬 Google Chat Webhook: /webhook/google-chat`);
        console.log(`🌐 Relay Integration: ${this.config.relayUrl}`);
        if (this.config.googleChat) {
          console.log(`✅ Google Chat bot enabled`);
        }
        console.log(`\n✨ Ready to accept connections\n`);
        resolve();
      });
    });
  }

  /**
   * Stop the server
   */
  stop(): void {
    // Server will be stopped when process exits
    console.log('UltraX Server stopping...');
  }

  /**
   * Get Express app (for testing)
   */
  getApp(): express.Application {
    return this.app;
  }

  /**
   * Get gateway (for testing)
   */
  getGateway(): UltraXGateway {
    return this.gateway;
  }
}

/**
 * Start UltraX server with configuration
 */
export async function startServer(config: ServerConfig = {}): Promise<UltraXServer> {
  const server = new UltraXServer(config);
  await server.start();
  return server;
}

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const config: ServerConfig = {
    port: parseInt(process.env.PORT || '3001'),
    relayUrl: process.env.RELAY_URL || 'http://localhost:3000',
    googleChat: process.env.GOOGLE_CHAT_ENABLED === 'true' ? {
      projectId: process.env.GOOGLE_PROJECT_ID || '',
      botId: process.env.GOOGLE_BOT_ID || '',
      credentialsPath: process.env.GOOGLE_CREDENTIALS_PATH || '',
      webhookUrl: process.env.GOOGLE_WEBHOOK_URL || ''
    } : undefined
  };

  startServer(config).catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}
