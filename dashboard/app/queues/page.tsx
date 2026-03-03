/**
 * Queues List Page
 * Displays all task queues with statistics (shadcn-admin-kit pattern)
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Queue {
  name: string;
  count: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export default function QueuesPage() {
  const [queues, setQueues] = useState<Record<string, Queue>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/queues');
        const data = await response.json();
        setQueues(data);
      } catch (error) {
        console.error('Failed to fetch queues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueues();
  }, []);

  const getPriorityColor = (priority: Queue['priority']) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  const totalTasks = Object.values(queues).reduce((sum, q) => sum + q.count, 0);
  const activeQueues = Object.values(queues).filter(q => q.count > 0).length;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Task Queues</h1>
        <p className="text-gray-600 mt-1">
          {activeQueues} active queues • {totalTasks} total tasks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(queues).map(([name, queue]) => (
          <Card key={name}>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 uppercase capitalize">{name.replace('-', ' ')}</p>
              <p className="text-4xl font-bold text-blue-600">{queue.count}</p>
              <Badge variant={getPriorityColor(queue.priority) as any} className="mt-2">
                {queue.priority}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Queue Details</CardTitle>
          <CardDescription>Detailed queue statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Queue Name</TableHead>
                <TableHead>Task Count</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(queues).map(([name, queue]) => (
                <TableRow key={name}>
                  <TableCell className="font-medium capitalize">{name.replace('-', ' ')}</TableCell>
                  <TableCell>
                    <span className="text-2xl font-bold text-blue-600">{queue.count}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(queue.priority) as any}>
                      {queue.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={queue.count > 0 ? 'default' : 'secondary'}>
                      {queue.count > 0 ? 'Active' : 'Empty'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
