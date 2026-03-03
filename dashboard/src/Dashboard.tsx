/**
 * Mission Control Dashboard
 * Real-time metrics and system health overview
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

export function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMetrics(data.metrics);
    };

    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Mission Control Dashboard
        </h1>
        <Badge variant={connected ? 'default' : 'destructive'}>
          {connected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <MetricCard
          title="Total Tasks"
          value={metrics?.tasks.total || 0}
          subtitle="All queues"
        />
        <MetricCard
          title="Active Agents"
          value={metrics?.agents.active || 0}
          subtitle="Currently running"
        />
        <MetricCard
          title="Avg Duration"
          value={`${metrics?.performance.avgTaskDuration?.toFixed(1) || 0}m`}
          subtitle="Per task"
        />
        <MetricCard
          title="Throughput"
          value={metrics?.performance.throughput?.toFixed(1) || 0}
          subtitle="Tasks/hour"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <CardHeader>
            <CardTitle>Task Breakdown</CardTitle>
            <CardDescription>Tasks by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <MetricRow label="Intake" value={metrics?.tasks.intake || 0} />
              <MetricRow label="In Progress" value={metrics?.tasks.inProgress || 0} />
              <MetricRow label="Review" value={metrics?.tasks.review || 0} />
              <MetricRow label="Completed" value={metrics?.tasks.completed || 0} />
              <MetricRow label="Failed" value={metrics?.tasks.failed || 0} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent Status</CardTitle>
            <CardDescription>Agent availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <MetricRow label="Active" value={metrics?.agents.active || 0} />
              <MetricRow label="Idle" value={metrics?.agents.idle || 0} />
              <MetricRow label="Failed" value={metrics?.agents.failed || 0} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle }: {
  title: string;
  value: number | string;
  subtitle: string;
}) {
  return (
    <Card>
      <CardContent style={{ padding: '1.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          {title}
        </p>
        <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#2563eb' }}>
          {value}
        </p>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
}

function MetricRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
      <span style={{ fontWeight: 500 }}>{label}</span>
      <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{value}</span>
    </div>
  );
}
