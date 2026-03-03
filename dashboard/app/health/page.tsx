/**
 * System Health Page
 * Displays system health indicators (shadcn-admin-kit pattern)
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HealthIndicator {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  details: Record<string, any>;
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthIndicator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/health');
        const data = await response.json();
        setHealth(data);
      } catch (error) {
        console.error('Failed to fetch health:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  const getStatusColor = (status: HealthIndicator['status']) => {
    switch (status) {
      case 'healthy': return 'default';
      case 'warning': return 'secondary';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusBgColor = (status: HealthIndicator['status']) => {
    switch (status) {
      case 'healthy': return 'bg-green-50 border-green-500';
      case 'warning': return 'bg-yellow-50 border-yellow-500';
      case 'critical': return 'bg-red-50 border-red-500';
      default: return 'bg-gray-50 border-gray-500';
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  const healthyCount = health.filter(h => h.status === 'healthy').length;
  const warningCount = health.filter(h => h.status === 'warning').length;
  const criticalCount = health.filter(h => h.status === 'critical').length;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
        <p className="text-gray-600 mt-1">
          {health.length} systems • {healthyCount} healthy • {warningCount} warnings • {criticalCount} critical
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 uppercase">Healthy</p>
            <p className="text-4xl font-bold text-green-600">{healthyCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 uppercase">Warnings</p>
            <p className="text-4xl font-bold text-yellow-600">{warningCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 uppercase">Critical</p>
            <p className="text-4xl font-bold text-red-600">{criticalCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {health.map((item, idx) => (
          <Card key={idx} className={`border-l-4 ${getStatusBgColor(item.status)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <Badge variant={getStatusColor(item.status) as any}>
                  {item.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded overflow-auto">
                {JSON.stringify(item.details, null, 2)}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
