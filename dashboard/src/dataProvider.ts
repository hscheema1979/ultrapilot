/**
 * Data Provider for UltraPilot Mission Control
 * Reads from .ultra/state/*.json files and provides Ra-Core compatible API
 */

import {
  DataProvider,
  GetListParams,
  GetOneParams,
  GetManyParams,
  GetManyReferenceParams,
  UpdateParams,
  UpdateManyParams,
  CreateParams,
  DeleteParams,
  DeleteManyParams,
} from 'ra-core';

interface TaskQueueItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedAgent: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AgentStatus {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'failed';
  currentTask: string | null;
  uptime: number;
  lastSeen: string;
}

/**
 * UltraPilot Data Provider
 * Bridges .ultra/state files with Ra-Core admin interface
 */
export const ultrapilotDataProvider: DataProvider = {
  getList: async (resource: string, params: GetListParams) => {
    const { pagination, sort, filter } = params;

    switch (resource) {
      case 'tasks': {
        // Read from .ultra/state/queues/*.json
        const response = await fetch('http://localhost:3001/api/queues');
        const queues = await response.json();

        // Transform queue data to flat list
        const tasks: TaskQueueItem[] = [];
        Object.entries(queues).forEach(([queueName, queueData]: [string, any]) => {
          (queueData.items || []).forEach((task: any) => {
            tasks.push({
              id: task.id,
              title: task.title,
              description: task.description,
              status: queueName.replace('-', '_') as TaskQueueItem['status'],
              priority: task.priority,
              assignedAgent: task.assignedAgent || null,
              createdAt: task.createdAt || new Date().toISOString(),
              updatedAt: task.updatedAt || new Date().toISOString(),
            });
          });
        });

        // Apply pagination
        const { page, perPage } = pagination;
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const paginatedTasks = tasks.slice(start, end);

        return {
          data: paginatedTasks,
          total: tasks.length,
        };
      }

      case 'agents': {
        // Read from .ultra/state/agent-status.json
        const response = await fetch('http://localhost:3001/api/agents');
        const agents: AgentStatus[] = await response.json();

        // Apply pagination
        const { page, perPage } = pagination;
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const paginatedAgents = agents.slice(start, end);

        return {
          data: paginatedAgents,
          total: agents.length,
        };
      }

      case 'queues': {
        // Read queue statistics
        const response = await fetch('http://localhost:3001/api/queues');
        const queues = await response.json();

        const queueList = Object.entries(queues).map(([name, data]: [string, any]) => ({
          id: name,
          name: name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          count: data.count,
          priority: data.priority,
          status: data.count > 0 ? 'active' : 'empty',
        }));

        return {
          data: queueList,
          total: queueList.length,
        };
      }

      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  },

  getOne: async (resource: string, params: GetOneParams) => {
    const { id } = params;

    switch (resource) {
      case 'tasks': {
        const response = await fetch('http://localhost:3001/api/queues');
        const queues = await response.json();

        // Find task across all queues
        for (const [queueName, queueData] of Object.entries(queues)) {
          const task = (queueData as any).items?.find((t: any) => t.id === id);
          if (task) {
            return {
              data: {
                id: task.id,
                title: task.title,
                description: task.description,
                status: queueName,
                priority: task.priority,
                assignedAgent: task.assignedAgent,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
              },
            };
          }
        }

        throw new Error(`Task not found: ${id}`);
      }

      case 'agents': {
        const response = await fetch('http://localhost:3001/api/agents');
        const agents = await response.json();
        const agent = agents.find((a: any) => a.id === id);

        if (!agent) {
          throw new Error(`Agent not found: ${id}`);
        }

        return { data: agent };
      }

      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  },

  getMany: async (resource: string, params: GetManyParams) => {
    const { ids } = params;

    switch (resource) {
      case 'tasks': {
        const response = await fetch('http://localhost:3001/api/queues');
        const queues = await response.json();

        const tasks: any[] = [];
        for (const [queueName, queueData] of Object.entries(queues)) {
          (queueData as any).items?.forEach((task: any) => {
            if (ids.includes(task.id)) {
              tasks.push({
                id: task.id,
                title: task.title,
                description: task.description,
                status: queueName,
                priority: task.priority,
                assignedAgent: task.assignedAgent,
              });
            }
          });
        }

        return { data: tasks };
      }

      case 'agents': {
        const response = await fetch('http://localhost:3001/api/agents');
        const agents = await response.json();
        const filteredAgents = agents.filter((a: any) => ids.includes(a.id));

        return { data: filteredAgents };
      }

      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  },

  getManyReference: async (resource: string, params: GetManyReferenceParams) => {
    // For example: get all tasks for a specific agent
    const { target, id } = params;

    if (resource === 'tasks' && target === 'agentId') {
      const response = await fetch('http://localhost:3001/api/queues');
      const queues = await response.json();

      const tasks: any[] = [];
      Object.entries(queues).forEach(([queueName, queueData]: [string, any]) => {
        (queueData.items || []).forEach((task: any) => {
          if (task.assignedAgent === id) {
            tasks.push({
              id: task.id,
              title: task.title,
              status: queueName,
              priority: task.priority,
            });
          }
        });
      });

      return { data: tasks, total: tasks.length };
    }

    throw new Error(`Unknown reference: ${resource}.${target}`);
  },

  update: async (resource: string, params: UpdateParams) => {
    // UltraPilot is read-only for dashboard
    throw new Error(`Update not supported for ${resource}`);
  },

  updateMany: async (resource: string, params: UpdateManyParams) => {
    throw new Error(`UpdateMany not supported for ${resource}`);
  },

  create: async (resource: string, params: CreateParams) => {
    throw new Error(`Create not supported for ${resource}`);
  },

  delete: async (resource: string, params: DeleteParams) => {
    throw new Error(`Delete not supported for ${resource}`);
  },

  deleteMany: async (resource: string, params: DeleteManyParams) => {
    throw new Error(`DeleteMany not supported for ${resource}`);
  },
};
