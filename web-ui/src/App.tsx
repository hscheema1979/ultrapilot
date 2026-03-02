import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { socketService } from './services/socket';

function App() {
  const { connected, setConnected, activeAgents, setActiveAgents, addMessage } = useStore();

  useEffect(() => {
    const socket = socketService.connect();

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('message:receive', (data) => {
      addMessage({
        role: data.role,
        content: data.content,
        agent: data.agent,
        phase: data.phase,
      });
    });

    socket.on('agent:update', (data) => {
      setActiveAgents(data.activeAgents);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">UltraX Web UI</h1>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <h2 className="text-xl mb-2">Welcome to UltraX</h2>
            <p>Chat interface loading...</p>
            <p className="text-sm mt-4">Port: 3020 | Running in parallel with Relay (3000)</p>
          </div>
        </div>
      </div>

      {/* Agent Status Bar */}
      <div className="px-6 py-3 border-t border-border bg-muted/50">
        <div className="text-sm text-muted-foreground">
          {activeAgents.length > 0
            ? `${activeAgents.length} agents active: ${activeAgents.join(', ')}`
            : 'No active agents'
          }
        </div>
      </div>
    </div>
  );
}

export default App;
