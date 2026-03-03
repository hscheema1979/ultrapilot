/**
 * Queue List Component
 * Displays all task queues with statistics
 */

import { List, Datagrid, TextField, NumberField } from 'ra-core';
import { Badge } from '@/components/ui/badge';

const statusColors = {
  active: 'default',
  empty: 'secondary',
} as const;

export const QueueList = () => {
  return (
    <List>
      <Datagrid rowClick="show">
        <TextField source="id" label="Queue Name" />
        <TextField source="name" label="Display Name" />
        <NumberField source="count" label="Task Count" />
        <TextField
          source="priority"
          label="Priority"
          render={(record) => (
            <Badge variant={record.priority === 'urgent' || record.priority === 'high' ? 'destructive' : 'secondary'}>
              {record.priority}
            </Badge>
          )}
        />
        <TextField
          source="status"
          label="Status"
          render={(record) => (
            <Badge variant={statusColors[record.status as keyof typeof statusColors] || 'outline'}>
              {record.status}
            </Badge>
          )}
        />
      </Datagrid>
    </List>
  );
};
