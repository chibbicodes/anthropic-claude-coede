import { Client } from '@notionhq/client';
import inquirer from 'inquirer';
import { config, validateConfig, STATUSES } from './config';

interface UpdateStatusAnswers {
  pageId: string;
  newStatus: string;
  addCompletedDate: boolean;
  outcome?: string;
}

async function updateStatus() {
  console.log('🔄 Update Item Status\n');

  try {
    validateConfig();

    const agendaItemsDatabaseId = process.env.NOTION_AGENDA_ITEMS_DATABASE_ID;
    if (!agendaItemsDatabaseId) {
      console.error('❌ NOTION_AGENDA_ITEMS_DATABASE_ID not found in .env file.');
      console.error('   Run `npm run setup` first to create the databases.\n');
      process.exit(1);
    }

    const notion = new Client({ auth: config.notionToken });

    // First, fetch recent items from the database
    console.log('📋 Fetching recent agenda items...\n');

    const response = await notion.databases.query({
      database_id: agendaItemsDatabaseId,
      page_size: 20,
      sorts: [
        {
          property: 'Status',
          direction: 'ascending',
        },
      ],
    });

    if (response.results.length === 0) {
      console.log('No items found in the database. Add some items first!\n');
      process.exit(0);
    }

    // Format items for selection
    const items = response.results.map((page: any) => {
      const title =
        page.properties['Agenda Item']?.title?.[0]?.text?.content || 'Untitled';
      const status = page.properties.Status?.select?.name || 'No status';
      const priority = page.properties.Priority?.select?.name || '';
      const priorityEmoji = priority === 'High' ? '🔴' : priority === 'Medium' ? '🟡' : priority === 'Low' ? '🟢' : '';

      return {
        name: `${priorityEmoji} ${title} | ${status}`,
        value: page.id,
        short: title,
      };
    });

    const answers = await inquirer.prompt<UpdateStatusAnswers>([
      {
        type: 'list',
        name: 'pageId',
        message: 'Select item to update:',
        choices: items,
        pageSize: 15,
      },
      {
        type: 'list',
        name: 'newStatus',
        message: 'New status:',
        choices: Object.values(STATUSES),
      },
      {
        type: 'confirm',
        name: 'addCompletedDate',
        message: 'Set completed date to today?',
        default: false,
        when: (answers) =>
          answers.newStatus === STATUSES.COMPLETED || answers.newStatus === STATUSES.DECIDED,
      },
      {
        type: 'input',
        name: 'outcome',
        message: 'Add/update decision or outcome (optional, press enter to skip):',
      },
    ]);

    console.log('\n⏳ Updating item...');

    // Build update properties
    const properties: any = {
      Status: {
        select: {
          name: answers.newStatus,
        },
      },
    };

    // Add completed date if requested
    if (answers.addCompletedDate) {
      properties['Completed Date'] = {
        date: {
          start: new Date().toISOString().split('T')[0],
        },
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

    // Update the page
    await notion.pages.update({
      page_id: answers.pageId,
      properties,
    });

    console.log('✅ Status updated successfully!\n');
  } catch (error: any) {
    console.error('❌ Error updating status:', error.message);

    if (error.code === 'unauthorized') {
      console.error('\n🔐 Authentication error. Please check your NOTION_TOKEN.\n');
    } else if (error.code === 'object_not_found') {
      console.error('\n🔍 Item or database not found.\n');
    }

    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  updateStatus()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { updateStatus };
