import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  notionToken: process.env.NOTION_TOKEN || '',
  parentPageId: process.env.NOTION_PARENT_PAGE_ID || '2e78dac1d83e805fb8c6f28f9b1b456f',
  workspaceId: process.env.NOTION_WORKSPACE_ID || '244adf27-37fa-4f63-b90f-ab12e4c643bb',
};

// Database titles
export const MEETINGS_DATABASE_TITLE = 'All Staff Meetings';
export const AGENDA_ITEMS_DATABASE_TITLE = 'Agenda Items';

// Categories for agenda items
export const CATEGORIES = [
  'Internal',
  'Staff Development',
  'Events',
  'Institute',
  'OIT U',
  'Digital Corps',
  'Partnership Engagement',
  'Revenue',
  'Community',
  'Volunteers',
];

// Meeting statuses
export const MEETING_STATUSES = {
  UPCOMING: 'Upcoming',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export const MEETING_STATUS_COLORS = {
  [MEETING_STATUSES.UPCOMING]: 'blue' as const,
  [MEETING_STATUSES.IN_PROGRESS]: 'yellow' as const,
  [MEETING_STATUSES.COMPLETED]: 'green' as const,
};

// Agenda item statuses
export const STATUSES = {
  BACKLOG: 'Backlog',
  TO_DISCUSS: 'To Discuss',
  IN_DISCUSSION: 'In Discussion',
  DECIDED: 'Decided',
  ACTION_REQUIRED: 'Action Required',
  COMPLETED: 'Completed',
};

export const STATUS_COLORS = {
  [STATUSES.BACKLOG]: 'gray' as const,
  [STATUSES.TO_DISCUSS]: 'blue' as const,
  [STATUSES.IN_DISCUSSION]: 'yellow' as const,
  [STATUSES.DECIDED]: 'green' as const,
  [STATUSES.ACTION_REQUIRED]: 'orange' as const,
  [STATUSES.COMPLETED]: 'purple' as const,
};

export const PRIORITIES = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export const PRIORITY_COLORS = {
  [PRIORITIES.HIGH]: 'red' as const,
  [PRIORITIES.MEDIUM]: 'yellow' as const,
  [PRIORITIES.LOW]: 'green' as const,
};

export function validateConfig(): void {
  if (!config.notionToken) {
    throw new Error('NOTION_TOKEN is required. Please set it in your .env file.');
  }
  if (!config.parentPageId) {
    throw new Error('NOTION_PARENT_PAGE_ID is required. Please set it in your .env file.');
  }
}
