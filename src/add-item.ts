import { Client } from '@notionhq/client';
import inquirer from 'inquirer';
import { config, validateConfig, CATEGORIES, STATUSES, PRIORITIES } from './config';

interface AddItemAnswers {
  agendaItem: string;
  meetingDate: string;
  status: string;
  categories: string[];
  priority: string;
  facilitator?: string;
  outcome?: string;
}

async function addItem() {
  console.log('📝 Add New Agenda Item\n');

  try {
    validateConfig();

    // Check for database ID
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
      console.error('❌ NOTION_DATABASE_ID not found in .env file.');
      console.error('   Run `npm run setup` first to create the database.\n');
      process.exit(1);
    }

    const notion = new Client({ auth: config.notionToken });

    // Interactive prompts
    const answers = await inquirer.prompt<AddItemAnswers>([
      {
        type: 'input',
        name: 'agendaItem',
        message: 'Agenda item title:',
        validate: (input) => (input.trim() ? true : 'Title is required'),
      },
      {
        type: 'input',
        name: 'meetingDate',
        message: 'Meeting date (YYYY-MM-DD):',
        validate: (input) => {
          if (!input.trim()) return 'Date is required';
          const date = new Date(input);
          return isNaN(date.getTime()) ? 'Invalid date format. Use YYYY-MM-DD' : true;
        },
      },
      {
        type: 'list',
        name: 'status',
        message: 'Status:',
        choices: Object.values(STATUSES),
        default: STATUSES.TO_DISCUSS,
      },
      {
        type: 'checkbox',
        name: 'categories',
        message: 'Categories (select with space, press enter when done):',
        choices: CATEGORIES,
      },
      {
        type: 'list',
        name: 'priority',
        message: 'Priority:',
        choices: Object.values(PRIORITIES),
        default: PRIORITIES.MEDIUM,
      },
      {
        type: 'input',
        name: 'facilitator',
        message: 'Facilitator email (optional, press enter to skip):',
      },
      {
        type: 'input',
        name: 'outcome',
        message: 'Decision/Outcome (optional, press enter to skip):',
      },
    ]);

    console.log('\n⏳ Creating item...');

    // Build properties object
    const properties: any = {
      'Agenda Item': {
        title: [
          {
            text: {
              content: answers.agendaItem,
            },
          },
        ],
      },
      'Meeting Date': {
        date: {
          start: answers.meetingDate,
        },
      },
      Status: {
        select: {
          name: answers.status,
        },
      },
      Priority: {
        select: {
          name: answers.priority,
        },
      },
    };

    // Add categories if selected
    if (answers.categories.length > 0) {
      properties.Category = {
        multi_select: answers.categories.map((cat) => ({ name: cat })),
      };
    }

    // Add outcome if provided
    if (answers.outcome?.trim()) {
      properties['Decision/Outcome'] = {
        rich_text: [
          {
            text: {
              content: answers.outcome,
            },
          },
        ],
      };
    }

    // Note: Facilitator would need to be looked up by user ID in a real implementation
    // For now, we'll skip it if provided
    if (answers.facilitator?.trim()) {
      console.log(
        '\n⚠️  Note: Facilitator email provided, but automatic user lookup is not yet implemented.'
      );
      console.log('   You can manually add the facilitator in Notion.');
    }

    // Create the page
    const page = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties,
    });

    console.log('✅ Item created successfully!');
    console.log(`🔗 ${page.url}\n`);
  } catch (error: any) {
    console.error('❌ Error creating item:', error.message);

    if (error.code === 'unauthorized') {
      console.error('\n🔐 Authentication error. Please check your NOTION_TOKEN.\n');
    } else if (error.code === 'object_not_found') {
      console.error('\n🔍 Database not found. Please check your NOTION_DATABASE_ID.\n');
    }

    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  addItem()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { addItem };
