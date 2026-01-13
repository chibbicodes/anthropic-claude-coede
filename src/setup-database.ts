import { Client } from '@notionhq/client';
import {
  config,
  validateConfig,
  DATABASE_TITLE,
  CATEGORIES,
  STATUSES,
  STATUS_COLORS,
  PRIORITIES,
  PRIORITY_COLORS,
} from './config';

async function setupDatabase() {
  console.log('🚀 Setting up All Staff Meetings Hub...\n');

  try {
    validateConfig();

    const notion = new Client({ auth: config.notionToken });

    console.log('📝 Creating database...');

    // Create the database with all properties
    const database = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: config.parentPageId,
      },
      title: [
        {
          type: 'text',
          text: {
            content: DATABASE_TITLE,
          },
        },
      ],
      description: [
        {
          type: 'text',
          text: {
            content:
              'Central hub for organizing All Staff meeting agendas, tracking discussion items, and recording decisions.',
          },
        },
      ],
      properties: {
        // Title property (required, default name is "Name")
        'Agenda Item': {
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
        // Select property for status
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
              // Assign varied colors to categories
              const colors = ['blue', 'green', 'orange', 'red', 'purple', 'pink', 'yellow', 'brown', 'gray', 'default'] as const;
              return {
                name: category,
                color: colors[index % colors.length],
              };
            }),
          },
        },
        // Person property for owner/assignee
        'Owner/Assignee': {
          people: {},
        },
        // Text property for decision/outcome
        'Decision/Outcome': {
          rich_text: {},
        },
        // URL property for AI meeting notes
        'AI Meeting Notes': {
          url: {},
        },
        // Date property for completion date
        'Completed Date': {
          date: {},
        },
        // Select property for priority
        Priority: {
          select: {
            options: Object.values(PRIORITIES).map((priority) => ({
              name: priority,
              color: PRIORITY_COLORS[priority],
            })),
          },
        },
      },
    });

    console.log('✅ Database created successfully!');
    console.log(`📊 Database ID: ${database.id}`);
    console.log(`🔗 Database URL: ${database.url}\n`);

    // Save the database ID for future use
    console.log('💾 Save this database ID to your .env file:');
    console.log(`NOTION_DATABASE_ID=${database.id}\n`);

    console.log('🎉 Setup complete! Your All Staff Meetings Hub is ready to use.');
    console.log('\n📖 Next steps:');
    console.log('   1. Visit the database in Notion');
    console.log('   2. Set up custom views (see MANUAL_SETUP.md for instructions)');
    console.log('   3. Start adding agenda items!');
    console.log('\n💡 Tip: Use npm run add-item to add items via CLI\n');

    return database;
  } catch (error: any) {
    console.error('❌ Error setting up database:', error.message);

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
  setupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { setupDatabase };
