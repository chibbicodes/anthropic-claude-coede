import { Client } from '@notionhq/client';
import inquirer from 'inquirer';
import { config, validateConfig, MEETING_STATUSES } from './config';

interface AddMeetingAnswers {
  meetingName: string;
  meetingDate: string;
  facilitatorEmail?: string;
  status: string;
  aiNotesUrl?: string;
}

async function addMeeting() {
  console.log('📅 Add New Meeting\n');

  try {
    validateConfig();

    const meetingsDatabaseId = process.env.NOTION_MEETINGS_DATABASE_ID;
    if (!meetingsDatabaseId) {
      console.error('❌ NOTION_MEETINGS_DATABASE_ID not found in .env file.');
      console.error('   Run `npm run setup` first to create the databases.\n');
      process.exit(1);
    }

    const notion = new Client({ auth: config.notionToken });

    const answers = await inquirer.prompt<AddMeetingAnswers>([
      {
        type: 'input',
        name: 'meetingName',
        message: 'Meeting name (e.g., "All Staff - Jan 20, 2026"):',
        default: () => {
          const date = new Date();
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `All Staff - ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        },
      },
      {
        type: 'input',
        name: 'meetingDate',
        message: 'Meeting date (YYYY-MM-DD):',
        validate: (input) => {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(input)) {
            return 'Please enter a valid date in YYYY-MM-DD format';
          }
          return true;
        },
        default: () => {
          const today = new Date();
          return today.toISOString().split('T')[0];
        },
      },
      {
        type: 'input',
        name: 'facilitatorEmail',
        message: 'Facilitator email (optional, press enter to skip):',
      },
      {
        type: 'list',
        name: 'status',
        message: 'Meeting status:',
        choices: Object.values(MEETING_STATUSES),
        default: MEETING_STATUSES.UPCOMING,
      },
      {
        type: 'input',
        name: 'aiNotesUrl',
        message: 'AI Meeting Notes URL (optional, press enter to skip):',
      },
    ]);

    console.log('\n⏳ Creating meeting...');

    // Build properties object
    const properties: any = {
      'Meeting Name': {
        title: [
          {
            text: {
              content: answers.meetingName,
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
    };

    // Add facilitator if provided
    if (answers.facilitatorEmail?.trim()) {
      properties.Facilitator = {
        people: [
          {
            object: 'user',
            email: answers.facilitatorEmail.trim(),
          },
        ],
      };
    }

    // Add AI notes URL if provided
    if (answers.aiNotesUrl?.trim()) {
      properties['AI Meeting Notes'] = {
        url: answers.aiNotesUrl.trim(),
      };
    }

    // Create the meeting page
    const page = await notion.pages.create({
      parent: {
        database_id: meetingsDatabaseId,
      },
      properties,
    });

    console.log('✅ Meeting created successfully!');
    if ('url' in page) {
      console.log(`🔗 Meeting URL: ${page.url}`);
    }
    console.log(`📋 Meeting ID: ${page.id}\n`);
    console.log('💡 Next: Add agenda items with npm run add-item\n');
  } catch (error: any) {
    console.error('❌ Error creating meeting:', error.message);

    if (error.code === 'unauthorized') {
      console.error('\n🔐 Authentication error. Please check your NOTION_TOKEN.\n');
    } else if (error.code === 'object_not_found') {
      console.error('\n🔍 Database not found. Run npm run setup first.\n');
    } else if (error.code === 'validation_error') {
      console.error('\n⚠️  Validation error. Please check:');
      console.error('   - Facilitator email is valid and exists in workspace');
      console.error('   - Date format is YYYY-MM-DD\n');
    }

    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  addMeeting()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { addMeeting };
