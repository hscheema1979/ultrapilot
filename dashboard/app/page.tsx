'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DashboardMetrics {
  timestamp: number;
  tasks: {
    total: number;
    intake: number;
    inProgress: number;
    review: number;
    completed: number;
    failed: number;
  };
  agents: {
    total: number;
    active: number;
    idle: number;
    failed: number;
  };
  performance: {
    avgTaskDuration: number;
    queueDepth: number;
    throughput: number;
  };
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [queues, setQueues] = useState<Record<string, any>>({});
  const [agents, setAgents] = useState<any[]>([]);
  const [health, setHealth] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMetrics(data.metrics);
      setQueues(data.queues);
      setAgents(data.agents);
      setHealth(data.health);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Mission Control</h1>
            <Badge variant={connected ? "default" : "destructive"}>
              {connected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard title="Total Tasks" value={metrics?.tasks.total || 0} subtitle="All queues" />
          <MetricCard title="Active Agents" value={metrics?.agents.active || 0} subtitle="Running" />
          <MetricCard title="Avg Duration" value={`${metrics?.performance.avgTaskDuration?.toFixed(1) || 0}m`} subtitle="Per task" />
          <MetricCard title="Throughput" value={metrics?.performance.throughput?.toFixed(1) || 0} subtitle="Tasks/hour" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Task Queues</CardTitle></CardHeader>
            <CardContent>
              {Object.entries(queues).map(([name, queue]: [string, any]) => (
                <div key={name} className="flex justify-between p-3 bg-gray-50 rounded mb-2">
                  <span className="capitalize">{name.replace('-', ' ')}</span>
                  <span className="font-bold">{queue.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Agent Status</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>{agent.id}</TableCell>
                      <TableCell><Badge>{agent.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader><CardTitle>System Health</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {health.map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold">{item.name}</h3>
                  <Badge>{item.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function MetricCard({ title, value, subtitle }: { title: string; value: number | string; subtitle: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-gray-600 uppercase">{title}</p>
        <p className="text-4xl font-bold text-blue-600">{value}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
