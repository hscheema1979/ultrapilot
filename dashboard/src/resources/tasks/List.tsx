/**
 * Task List Component
 * Displays tasks from all queues with filtering and sorting
 */

import { List, Datagrid, TextField, DateField, BooleanField } from 'ra-core';
import { Badge } from '@/components/ui/badge';

const priorityColors = {
  urgent: 'destructive',
  high: 'default',
  medium: 'secondary',
  low: 'outline',
} as const;

const statusColors = {
  completed: 'default',
  review: 'secondary',
  in_progress: 'default',
  pending: 'outline',
  failed: 'destructive',
} as const;

export const TaskList = () => {
  return (
    <List>
      <Datagrid rowClick="show">
        <TextField source="id" label="Task ID" />
        <TextField source="title" label="Title" />
        <TextField source="description" label="Description" />
        <TextField
          source="status"
          label="Status"
          render={(record) => (
            <Badge variant={statusColors[record.status as keyof typeof statusColors] || 'outline'}>
              {record.status.replace('_', ' ')}
            </Badge>
          )}
        />
        <TextField
          source="priority"
          label="Priority"
          render={(record) => (
            <Badge variant={priorityColors[record.priority as keyof typeof priorityColors] || 'outline'}>
              {record.priority}
            </Badge>
          )}
        />
        <TextField source="assignedAgent" label="Agent" />
        <DateField source="createdAt" label="Created" />
        <DateField source="updatedAt" label="Updated" />
      </Datagrid>
    </List>
  );
};
