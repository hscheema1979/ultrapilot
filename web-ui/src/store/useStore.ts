import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agent?: string;
  phase?: string;
  status?: 'pending' | 'approved' | 'denied';
}

export interface Session {
  sessionId: string;
  userId: string;
  status: 'active' | 'paused' | 'terminated';
  startTime: Date;
  lastActivity: Date;
  activeAgents: string[];
  currentPhase?: string;
}

interface UltraXStore {
  // Messages
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;

  // Session
  session: Session | null;
  setSession: (session: Session | null) => void;
  updateSessionStatus: (status: Session['status']) => void;

  // Connection
  connected: boolean;
  setConnected: (connected: boolean) => void;

  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Agent Status
  activeAgents: string[];
  setActiveAgents: (agents: string[]) => void;
}

export const useStore = create<UltraXStore>((set) => ({
  // Messages
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),

  // Session
  session: null,
  setSession: (session) => set({ session }),
  updateSessionStatus: (status) =>
    set((state) => ({
      session: state.session ? { ...state.session, status } : null,
    })),

  // Connection
  connected: false,
  setConnected: (connected) => set({ connected }),

  // UI State
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Agent Status
  activeAgents: [],
  setActiveAgents: (agents) => set({ activeAgents: agents }),
}));
