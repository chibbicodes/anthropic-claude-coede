import { Client } from '@notionhq/client';
import inquirer from 'inquirer';
import { config, validateConfig, CATEGORIES, STATUSES, PRIORITIES } from './config';

interface AddItemAnswers {
  agendaItem: string;
  meetingId: string;
  status: string;
  categories: string[];
  priority: string;
  ownerEmail?: string;
  outcome?: string;
}

async function addItem() {
  console.log('📝 Add New Agenda Item\n');

  try {
    validateConfig();

    const meetingsDatabaseId = process.env.NOTION_MEETINGS_DATABASE_ID;
    const agendaItemsDatabaseId = process.env.NOTION_AGENDA_ITEMS_DATABASE_ID;

    if (!meetingsDatabaseId || !agendaItemsDatabaseId) {
      console.error('❌ Database IDs not found in .env file.');
      console.error('   Required: NOTION_MEETINGS_DATABASE_ID and NOTION_AGENDA_ITEMS_DATABASE_ID');
      console.error('   Run `npm run setup` first to create the databases.\n');
      process.exit(1);
    }

    const notion = new Client({ auth: config.notionToken });

    // Fetch recent meetings
    console.log('📋 Fetching meetings...\n');

    const meetingsResponse = await notion.databases.query({
      database_id: meetingsDatabaseId,
      page_size: 20,
      sorts: [
        {
          property: 'Meeting Date',
          direction: 'descending',
        },
      ],
    });

    if (meetingsResponse.results.length === 0) {
      console.log('⚠️  No meetings found. Create a meeting first with: npm run add-meeting\n');
      process.exit(0);
    }

    // Format meetings for selection
    const meetings = meetingsResponse.results.map((page: any) => {
      const name =
        page.properties['Meeting Name']?.title?.[0]?.text?.content || 'Untitled Meeting';
      const date = page.properties['Meeting Date']?.date?.start || 'No date';
      const status = page.properties.Status?.select?.name || 'No status';

      return {
        name: `${name} | ${date} | ${status}`,
        value: page.id,
        short: name,
      };
    });

    // Add option to create new meeting
    meetings.unshift({
      name: '➕ Create a new meeting first',
      value: 'CREATE_NEW',
      short: 'Create new',
    });

    // Interactive prompts
    const answers = await inquirer.prompt<AddItemAnswers>([
      {
        type: 'list',
        name: 'meetingId',
        message: 'Select meeting:',
        choices: meetings,
        pageSize: 15,
      },
      {
        type: 'input',
        name: 'agendaItem',
        message: 'Agenda item title:',
        validate: (input) => (input.trim() ? true : 'Title is required'),
        when: (answers) => answers.meetingId !== 'CREATE_NEW',
      },
      {
        type: 'list',
        name: 'status',
        message: 'Status:',
        choices: Object.values(STATUSES),
        default: STATUSES.TO_DISCUSS,
        when: (answers) => answers.meetingId !== 'CREATE_NEW',
      },
      {
        type: 'checkbox',
        name: 'categories',
        message: 'Categories (select with space, press enter when done):',
        choices: CATEGORIES,
        when: (answers) => answers.meetingId !== 'CREATE_NEW',
      },
      {
        type: 'list',
        name: 'priority',
        message: 'Priority:',
        choices: Object.values(PRIORITIES),
        default: PRIORITIES.MEDIUM,
        when: (answers) => answers.meetingId !== 'CREATE_NEW',
      },
      {
        type: 'input',
        name: 'ownerEmail',
        message: 'Owner/Assignee email (optional, press enter to skip):',
        when: (answers) => answers.meetingId !== 'CREATE_NEW',
      },
      {
        type: 'input',
        name: 'outcome',
        message: 'Decision/Outcome (optional, press enter to skip):',
        when: (answers) => answers.meetingId !== 'CREATE_NEW',
      },
    ]);

    // Check if user wants to create a new meeting
    if (answers.meetingId === 'CREATE_NEW') {
      console.log('\n💡 Run this command to create a meeting first:');
      console.log('   npm run add-meeting\n');
      process.exit(0);
    }

    console.log('\n⏳ Creating agenda item...');

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
      // Relation to meeting
      Meeting: {
        relation: [
          {
            id: answers.meetingId,
          },
        ],
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

    // Add owner if provided
    if (answers.ownerEmail?.trim()) {
      try {
        properties['Owner/Assignee'] = {
          people: [
            {
              object: 'user',
              email: answers.ownerEmail.trim(),
            },
          ],
        };
      } catch (err) {
        console.log('\n⚠️  Note: Could not add owner. You can add them manually in Notion.');
      }
    }

    // Create the page
    const page = await notion.pages.create({
      parent: {
        database_id: agendaItemsDatabaseId,
      },
      properties,
    });

    console.log('✅ Agenda item created successfully!');
    if ('url' in page) {
      console.log(`🔗 ${page.url}`);
    }
    console.log();
  } catch (error: any) {
    console.error('❌ Error creating agenda item:', error.message);

    if (error.code === 'unauthorized') {
      console.error('\n🔐 Authentication error. Please check your NOTION_TOKEN.\n');
    } else if (error.code === 'object_not_found') {
      console.error('\n🔍 Database not found. Run npm run setup first.\n');
    } else if (error.code === 'validation_error') {
      console.error('\n⚠️  Validation error. Please check:');
      console.error('   - Owner email is valid and exists in workspace');
      console.error('   - All field values are valid\n');
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
