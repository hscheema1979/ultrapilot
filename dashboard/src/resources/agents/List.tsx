/**
 * Agent List Component
 * Displays all agents with their current status
 */

import { List, Datagrid, TextField, NumberField } from 'ra-core';
import { Badge } from '@/components/ui/badge';

const statusColors = {
  active: 'default',
  idle: 'secondary',
  failed: 'destructive',
} as const;

export const AgentList = () => {
  return (
    <List>
      <Datagrid rowClick="show">
        <TextField source="id" label="Agent ID" />
        <TextField source="name" label="Name" />
        <TextField
          source="status"
          label="Status"
          render={(record) => (
            <Badge variant={statusColors[record.status as keyof typeof statusColors] || 'outline'}>
              {record.status}
            </Badge>
          )}
        />
        <TextField source="currentTask" label="Current Task" />
        <NumberField source="uptime" label="Uptime (seconds)" />
        <DateField source="lastSeen" label="Last Seen" />
      </Datagrid>
    </List>
  );
};
