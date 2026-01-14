import { Client } from '@notionhq/client';
import {
  config,
  validateConfig,
  MEETINGS_DATABASE_TITLE,
  AGENDA_ITEMS_DATABASE_TITLE,
  CATEGORIES,
  STATUSES,
  STATUS_COLORS,
  MEETING_STATUSES,
  MEETING_STATUS_COLORS,
  PRIORITIES,
  PRIORITY_COLORS,
} from './config';

async function setupDatabases() {
  console.log('🚀 Setting up All Staff Meetings Hub (Two-Database Structure)...\n');

  try {
    validateConfig();

    const notion = new Client({ auth: config.notionToken });

    // ========================================
    // STEP 1: Create Meetings Database
    // ========================================
    console.log('📅 Creating Meetings database...');

    const meetingsDatabase = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: config.parentPageId,
      },
      title: [
        {
          type: 'text',
          text: {
            content: MEETINGS_DATABASE_TITLE,
          },
        },
      ],
      description: [
        {
          type: 'text',
          text: {
            content:
              'All Staff meeting schedule with dates, facilitators, and linked agenda items.',
          },
        },
      ],
      properties: {
        // Title property
        'Meeting Name': {
          title: {},
        },
        // Date property for meeting date
        'Meeting Date': {
          date: {},
        },
        // Person property for facilitator
        Facilitator: {
          people: {},
        },
        // Meeting status
        Status: {
          select: {
            options: Object.values(MEETING_STATUSES).map((status) => ({
              name: status,
              color: MEETING_STATUS_COLORS[status],
            })),
          },
        },
        // URL for AI meeting notes
        'AI Meeting Notes': {
          url: {},
        },
        // This will be populated as a relation from Agenda Items
        // Note: We'll add the relation from the Agenda Items side
      },
    });

    console.log('✅ Meetings database created!');
    console.log(`   Database ID: ${meetingsDatabase.id}`);
    console.log(`   URL: ${meetingsDatabase.url}\n`);

    // ========================================
    // STEP 2: Create Agenda Items Database
    // ========================================
    console.log('📝 Creating Agenda Items database...');

    const agendaItemsDatabase = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: config.parentPageId,
      },
      title: [
        {
          type: 'text',
          text: {
            content: AGENDA_ITEMS_DATABASE_TITLE,
          },
        },
      ],
      description: [
        {
          type: 'text',
          text: {
            content:
              'Individual agenda items with status tracking, categories, and outcomes.',
          },
        },
      ],
      properties: {
        // Title property
        'Agenda Item': {
          title: {},
        },
        // Relation to Meetings database
        Meeting: {
          relation: {
            database_id: meetingsDatabase.id,
            type: 'dual_property',
            dual_property: {
              synced_property_name: 'Agenda Items',
            },
          },
        },
        // Status select
        Status: {
          select: {
            options: Object.values(STATUSES).map((status) => ({
              name: status,
              color: STATUS_COLORS[status],
            })),
          },
        },
        // Multi-select for categories
        Category: {
          multi_select: {
            options: CATEGORIES.map((category, index) => {
              const colors = ['blue', 'green', 'orange', 'red', 'purple', 'pink', 'yellow', 'brown', 'gray', 'default'] as const;
              return {
                name: category,
                color: colors[index % colors.length],
              };
            }),
          },
        },
        // Priority
        Priority: {
          select: {
            options: Object.values(PRIORITIES).map((priority) => ({
              name: priority,
              color: PRIORITY_COLORS[priority],
            })),
          },
        },
        // Person property for owner/assignee
        'Owner/Assignee': {
          people: {},
        },
        // Text for decision/outcome
        'Decision/Outcome': {
          rich_text: {},
        },
        // Completed date
        'Completed Date': {
          date: {},
        },
      },
    });

    console.log('✅ Agenda Items database created!');
    console.log(`   Database ID: ${agendaItemsDatabase.id}`);
    console.log(`   URL: ${agendaItemsDatabase.url}\n`);

    // ========================================
    // STEP 3: Add Rollups to Meetings Database
    // ========================================
    console.log('🔗 Adding rollup properties to Meetings database...');

    await notion.databases.update({
      database_id: meetingsDatabase.id,
      properties: {
        // Count of total agenda items
        '# Items': {
          rollup: {
            relation_property_name: 'Agenda Items',
            rollup_property_name: 'Agenda Item',
            function: 'count',
          },
        },
        // Count of completed items
        '# Completed': {
          rollup: {
            relation_property_name: 'Agenda Items',
            rollup_property_name: 'Status',
            function: 'count_values',
          },
        },
      },
    });

    console.log('✅ Rollup properties added!\n');

    // ========================================
    // Summary
    // ========================================
    console.log('🎉 Setup complete!\n');
    console.log('📋 Database Summary:');
    console.log('┌─────────────────────────────────────────────────────────');
    console.log('│ Meetings Database');
    console.log('│   ID:', meetingsDatabase.id);
    console.log('│   Properties: Meeting Name, Meeting Date, Facilitator,');
    console.log('│               Status, AI Meeting Notes, Agenda Items (relation)');
    console.log('│');
    console.log('│ Agenda Items Database');
    console.log('│   ID:', agendaItemsDatabase.id);
    console.log('│   Properties: Agenda Item, Meeting (relation), Status,');
    console.log('│               Category, Priority, Owner/Assignee,');
    console.log('│               Decision/Outcome, Completed Date');
    console.log('└─────────────────────────────────────────────────────────\n');

    console.log('💾 Add these to your .env file:\n');
    console.log(`NOTION_MEETINGS_DATABASE_ID=${meetingsDatabase.id}`);
    console.log(`NOTION_AGENDA_ITEMS_DATABASE_ID=${agendaItemsDatabase.id}\n`);

    console.log('📖 Next steps:');
    console.log('   1. Update your .env file with the database IDs above');
    console.log('   2. Create your first meeting: npm run add-meeting');
    console.log('   3. Add agenda items: npm run add-item');
    console.log('   4. Set up custom views in Notion (see MANUAL_SETUP.md)\n');

    return {
      meetingsDatabase,
      agendaItemsDatabase,
    };
  } catch (error: any) {
    console.error('❌ Error setting up databases:', error.message);

    if (error.code === 'unauthorized') {
      console.error('\n🔐 Authentication error. Please check:');
      console.error('   1. Your NOTION_TOKEN is correct in .env file');
      console.error('   2. You have shared the parent page with your integration');
      console.error('   3. Your integration has the correct permissions\n');
    } else if (error.code === 'object_not_found') {
      console.error('\n🔍 Page not found. Please check:');
      console.error('   1. Your NOTION_PARENT_PAGE_ID is correct in .env file');
      console.error('   2. The page exists and you have access to it');
      console.error('   3. You have shared the page with your integration\n');
    }

    throw error;
  }
}

// Run the setup
if (require.main === module) {
  setupDatabases()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { setupDatabases };
