# All Staff Meetings Hub 🗓️

A comprehensive Notion database system for managing All Staff meetings, agenda items, discussions, and decisions.

## 🎯 Features

- **Meeting Management**: Track meeting dates and facilitators
- **Agenda Items**: Organize topics with clear status tracking
- **Status Workflow**: Move items through Backlog → To Discuss → In Discussion → Decided/Action Required → Completed
- **Category Tags**: Organize by Internal, Staff Development, Events, Institute, OIT U, Digital Corps, Partnership Engagement, Revenue, Community, Volunteers
- **Smart Views**: Multiple perspectives (Active Agenda, Upcoming, Archive, etc.)
- **AI Notes Integration**: Link to AI-generated meeting summaries
- **Archive System**: Auto-hide completed items older than 30 days

## 🚀 Quick Start

You have **two options** for setting up your database:

### Option 1: Manual Setup (No API Required) ⚡

**Best for**: Getting started immediately without API permissions

1. Open [`MANUAL_SETUP.md`](./MANUAL_SETUP.md)
2. Follow the step-by-step instructions
3. Build the database directly in Notion

**Time**: ~15-20 minutes

### Option 2: Automated Setup (API Integration) 🤖

**Best for**: Automation, CLI management, and ongoing maintenance

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create a Notion Integration**:
   - Go to https://www.notion.so/my-integrations
   - Click "New integration"
   - Name: "All Staff Meetings Manager"
   - Select workspace: "Out in Tech"
   - Permissions: ✅ Read, Update, Insert content
   - Copy the "Internal Integration Token"

3. **Share your page with the integration**:
   - Go to: https://www.notion.so/All-Staff-draft-2e78dac1d83e805fb8c6f28f9b1b456f
   - Click "..." → "Connections" → Add your integration

4. **Configure environment**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your token:
   ```env
   NOTION_TOKEN=secret_your_actual_token_here
   ```

5. **Run setup script**:
   ```bash
   npm run setup
   ```

6. **Save database ID**:
   - Copy the database ID from the output
   - Add it to your `.env` file:
   ```env
   NOTION_DATABASE_ID=your_database_id_here
   ```

**Time**: ~5 minutes (after getting API permissions)

---

## 📖 Usage

### Managing Items via CLI

#### Add a New Agenda Item

```bash
npm run add-item
```

Interactive prompts will ask for:
- Agenda item title
- Meeting date
- Status
- Categories
- Priority
- Facilitator (optional)
- Decision/Outcome (optional)

**Example**:
```
📝 Add New Agenda Item

? Agenda item title: Review Q2 Budget Allocation
? Meeting date (YYYY-MM-DD): 2026-01-20
? Status: To Discuss
? Categories: Revenue, Internal
? Priority: High
? Facilitator email (optional):
? Decision/Outcome (optional):

✅ Item created successfully!
```

#### Update Item Status

```bash
npm run update-status
```

- Select an item from recent items
- Choose new status
- Optionally set completed date
- Add decision/outcome notes

**Example Use Cases**:
- Move item from "To Discuss" → "In Discussion" during meeting
- Mark item as "Decided" with outcome notes
- Set "Action Required" and assign owner
- Complete items and auto-archive

### Using the Database in Notion

#### Before Meetings:

1. **Add agenda items**:
   - Use CLI: `npm run add-item`
   - Or manually in Notion: Click "+ New" in database

2. **Organize agenda**:
   - Open "Upcoming Meetings" view
   - Items are grouped by date
   - Drag to reorder priority

3. **Review priorities**:
   - Check "By Category" view for topic distribution
   - Filter by Priority for high-importance items

#### During Meetings:

1. **Switch to "This Week" board view**
2. **Move items through statuses**:
   - Drag cards: To Discuss → In Discussion → Decided
3. **Capture decisions**:
   - Fill "Decision/Outcome" field
   - Assign "Owner/Assignee" for actions
   - Link "AI Meeting Notes"

#### After Meetings:

1. **Mark completed**:
   - Use CLI: `npm run update-status`
   - Or in Notion: Change status + add completed date
2. **Follow up**:
   - Review items in "Action Required" status
   - Check "Active Agenda" for open items

---

## 🗂️ Database Structure

### Properties

| Property | Type | Description |
|----------|------|-------------|
| **Agenda Item** | Title | The topic/issue to discuss |
| **Meeting Date** | Date | When item will be/was discussed |
| **Facilitator** | Person | Meeting leader |
| **Status** | Select | Current state (Backlog → Completed) |
| **Category** | Multi-select | Topic tags (Internal, Events, etc.) |
| **Owner/Assignee** | Person | Responsible for action items |
| **Decision/Outcome** | Text | What was decided or accomplished |
| **AI Meeting Notes** | URL | Link to AI-generated summary |
| **Completed Date** | Date | When item was finished |
| **Priority** | Select | High/Medium/Low |

### Status Workflow

```
Backlog
   ↓
To Discuss (on upcoming agenda)
   ↓
In Discussion (active in current meeting)
   ↓
├─→ Decided (complete, no action needed)
└─→ Action Required (needs follow-up)
      ↓
   Completed
```

### Views

#### 1. **Active Agenda** (Default)
- **Shows**: Current and upcoming items, recently completed (< 30 days)
- **Filters**: Excludes old completed items
- **Sort**: By meeting date
- **Use**: Main working view

#### 2. **Upcoming Meetings**
- **Shows**: Future meeting items
- **Group by**: Meeting date
- **Use**: Planning and prep

#### 3. **This Week** (Board)
- **Shows**: Items for current week
- **Group by**: Status
- **Use**: During meetings (Kanban style)

#### 4. **Archive**
- **Shows**: All completed/decided items
- **Sort**: By completed date (newest first)
- **Use**: Historical reference

#### 5. **By Category**
- **Shows**: Active items grouped by topic
- **Group by**: Category
- **Use**: Topic-based organization

---

## 🛠️ Project Structure

```
notion-staff-meetings-hub/
├── src/
│   ├── config.ts              # Configuration and constants
│   ├── setup-database.ts      # Initial database creation
│   ├── add-item.ts            # CLI tool to add agenda items
│   └── update-status.ts       # CLI tool to update item status
├── MANUAL_SETUP.md            # Step-by-step manual instructions
├── README.md                  # This file
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── .env.example               # Environment template
└── .gitignore                 # Git ignore rules
```

---

## 📋 Categories

Your organization uses these categories:

- **Internal** - Internal operations and processes
- **Staff Development** - Team growth and training
- **Events** - Organizational events
- **Institute** - Institute-related matters
- **OIT U** - OIT University program
- **Digital Corps** - Digital Corps initiative
- **Partnership Engagement** - Partner relationships
- **Revenue** - Financial and revenue matters
- **Community** - Community engagement
- **Volunteers** - Volunteer coordination

---

## 💡 Best Practices

### Keep It Organized:
- ✅ Add items to "Backlog" throughout the week
- ✅ Move to "To Discuss" when scheduling
- ✅ Update status during meetings
- ✅ Fill in outcomes immediately
- ✅ Set completed date for archiving

### Effective Tagging:
- 🏷️ Use multiple categories when relevant
- 🏷️ Consistent category usage helps filtering
- 🏷️ Priority should reflect urgency, not importance

### Archive Management:
- 📦 Items auto-hide after 30 days + Completed status
- 📦 Use Archive view to reference past decisions
- 📦 Quarterly review: delete redundant items

### Meeting Efficiency:
- ⏰ Review "Upcoming Meetings" view before each meeting
- ⏰ Update status in real-time during meetings
- ⏰ Link AI notes immediately after meetings

---

## 🔧 Development

### Build

```bash
npm run build
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run setup` | Create the Notion database |
| `npm run add-item` | Add new agenda item (interactive) |
| `npm run update-status` | Update item status (interactive) |

### Environment Variables

Required in `.env`:

```env
NOTION_TOKEN=secret_...              # Integration token
NOTION_PARENT_PAGE_ID=...            # Page where database lives
NOTION_WORKSPACE_ID=...              # Workspace ID
NOTION_DATABASE_ID=...               # Database ID (after setup)
```

---

## ❓ Troubleshooting

### "Authentication error"
- ✓ Check `NOTION_TOKEN` in `.env`
- ✓ Verify integration has correct permissions
- ✓ Ensure page is shared with integration

### "Page not found"
- ✓ Check `NOTION_PARENT_PAGE_ID` is correct
- ✓ Ensure you have access to the page
- ✓ Share page with integration

### "Database not found"
- ✓ Run `npm run setup` first
- ✓ Add `NOTION_DATABASE_ID` to `.env`
- ✓ Verify database exists in Notion

### Can't create integration
- 👉 See [`MANUAL_SETUP.md`](./MANUAL_SETUP.md) for manual setup
- 👉 Contact your Notion workspace admin
- 👉 Request integration creation permissions

---

## 📚 Resources

- [Notion API Documentation](https://developers.notion.com/)
- [Create Integrations](https://www.notion.so/my-integrations)
- [Notion SDK for JavaScript](https://github.com/makenotion/notion-sdk-js)

---

## 📄 License

MIT

---

## 🎉 You're Ready!

Choose your path:
- **Manual Setup**: Open `MANUAL_SETUP.md` and follow instructions
- **Automated Setup**: Run `npm install` → `npm run setup`

Questions? Check the troubleshooting section or review the manual setup guide for detailed explanations.

**Happy organizing!** 🚀
