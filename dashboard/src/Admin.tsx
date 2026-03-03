/**
 * Mission Control Admin
 * Main admin interface built on Ra-Core pattern
 */

'use client';

import { Admin as RaAdmin, Resource, CustomRoutes } from 'ra-core';
import { Route } from 'react-router';
import { dataProvider } from '@/src/dataProvider';
import { TaskList } from '@/src/resources/tasks/List';
import { AgentList } from '@/src/resources/agents/List';
import { QueueList } from '@/src/resources/queues/List';
import { Dashboard } from '@/src/Dashboard';

export function Admin() {
  return (
    <RaAdmin dataProvider={dataProvider} dashboard={Dashboard}>
      <Resource name="tasks" list={TaskList} />
      <Resource name="agents" list={AgentList} />
      <Resource name="queues" list={QueueList} />

      <CustomRoutes>
        <Route path="/settings" element={<div>Settings</div>} />
        <Route path="/logs" element={<div>Logs</div>} />
      </CustomRoutes>
    </RaAdmin>
  );
}
