# Manual Setup Guide: All Staff Meetings Database

This guide will walk you through creating your All Staff Meetings database directly in Notion without needing API access.

## 🎯 Overview

You'll create a database with:
- Meeting dates and facilitators
- Agenda items with status tracking
- Category tags
- Multiple views for different perspectives
- Space for AI-generated meeting notes

---

## 📋 Step 1: Create the Database

1. Go to your page: https://www.notion.so/All-Staff-draft-2e78dac1d83e805fb8c6f28f9b1b456f
2. Scroll to where you want the database
3. Type `/database` and select **"Database - Inline"**
4. Name it: **"All Staff Meetings Hub"**

---

## 🏗️ Step 2: Set Up Properties

Delete all default properties except "Name", then add these properties:

### 1. **Name** (Title - already exists)
   - Rename to: **"Agenda Item"**
   - This will contain the topic/issue to discuss

### 2. **Meeting Date** (Date)
   - Click "+ Add a property"
   - Select "Date"
   - Name it: **"Meeting Date"**
   - This tracks when the item will be/was discussed

### 3. **Facilitator** (Person)
   - Add property → "Person"
   - Name: **"Facilitator"**
   - This is who leads the meeting

### 4. **Status** (Select)
   - Add property → "Select"
   - Name: **"Status"**
   - Add these options (with suggested colors):
     - 🔵 **Backlog** (Gray)
     - 📝 **To Discuss** (Blue)
     - 💬 **In Discussion** (Yellow)
     - ✅ **Decided** (Green)
     - 🎯 **Action Required** (Orange)
     - ✔️ **Completed** (Purple)

### 5. **Category** (Multi-select)
   - Add property → "Multi-select"
   - Name: **"Category"**
   - Add these tags (assign colors as you prefer):
     - Internal
     - Staff Development
     - Events
     - Institute
     - OIT U
     - Digital Corps
     - Partnership Engagement
     - Revenue
     - Community
     - Volunteers

### 6. **Owner/Assignee** (Person)
   - Add property → "Person"
   - Name: **"Owner/Assignee"**
   - This tracks who is responsible for action items

### 7. **Decision/Outcome** (Text)
   - Add property → "Text"
   - Name: **"Decision/Outcome"**
   - Use this to capture what was decided or what action was taken

### 8. **AI Meeting Notes** (URL)
   - Add property → "URL"
   - Name: **"AI Meeting Notes"**
   - Link to your AI-generated notes document

### 9. **Completed Date** (Date)
   - Add property → "Date"
   - Name: **"Completed Date"**
   - Automatically track when items are marked as Completed (you'll update this manually)

### 10. **Priority** (Select) - Optional but recommended
   - Add property → "Select"
   - Name: **"Priority"**
   - Options:
     - 🔴 High (Red)
     - 🟡 Medium (Yellow)
     - 🟢 Low (Green)

---

## 👁️ Step 3: Create Views

Your database will have multiple views. Here's how to set them up:

### View 1: **"Active Agenda"** (Default - Table)

This is your main working view.

1. This should be your default table view
2. Click the "..." menu on the view → **"Filter"**
3. Add these filter rules:
   - **Rule 1**: Status → Is not → Completed
   - **Rule 2**: Status → Is not → Decided
   - OR
   - **Rule 3**: Completed Date → Is within → Past 30 days

4. **Sort by**:
   - First: Meeting Date → Ascending
   - Second: Status → Ascending

5. **Properties shown** (toggle these on):
   - Agenda Item
   - Meeting Date
   - Status
   - Category
   - Owner/Assignee
   - Facilitator
   - Priority

### View 2: **"Upcoming Meetings"** (Timeline or Table)

Shows what's coming up.

1. Click "+ Add a view"
2. Select "Table" (or "Timeline" if you prefer visual)
3. Name: **"Upcoming Meetings"**
4. **Filter**:
   - Meeting Date → Is on or after → Today
5. **Sort**:
   - Meeting Date → Ascending
6. **Group by**: Meeting Date

### View 3: **"This Week"** (Board)

Kanban-style view of current items.

1. Add view → "Board"
2. Name: **"This Week"**
3. **Group by**: Status
4. **Filter**:
   - Meeting Date → Is within → This week
5. This gives you a visual board of items moving through stages

### View 4: **"Archive"** (Table)

For completed items.

1. Add view → "Table"
2. Name: **"Archive"**
3. **Filter**:
   - Status → Is → Completed
   - OR
   - Status → Is → Decided
4. **Sort**:
   - Completed Date → Descending
5. **Collapse** this view by default to keep the page clean

### View 5: **"By Category"** (Table)

Organize by topic area.

1. Add view → "Table"
2. Name: **"By Category"**
3. **Group by**: Category
4. **Filter**:
   - Status → Is not → Completed (optional - only show active items)
5. **Sort**: Priority → Descending

---

## 🎨 Step 4: Customize Display

### Make it Readable:

1. **Hide archived view by default**:
   - Click the "Archive" view → "..." → Toggle it closed
   - It will show "# items" and users can click to expand

2. **Add view descriptions**:
   - For each view, click "..." → "Edit view"
   - Add a description like:
     - Active Agenda: "Current and upcoming items for discussion"
     - Archive: "Completed and decided items from past meetings"

3. **Adjust column widths**:
   - Drag column borders to make text readable
   - Make "Agenda Item" wider (300-400px)
   - Keep "Status" narrow (100px)

4. **Add database description**:
   - Click the database title → Add description
   - Example: "Central hub for organizing All Staff meeting agendas, tracking discussion items, and recording decisions."

---

## 📝 Step 5: Using the Database

### For Upcoming Meetings:

1. **Create new items**:
   - Click "+ New" in the database
   - Fill in:
     - Agenda Item: Topic name
     - Meeting Date: When it will be discussed
     - Status: "To Discuss"
     - Category: Relevant tags
     - Facilitator: Who's leading the meeting

2. **Prepare agenda**:
   - Use "Upcoming Meetings" view
   - Items are grouped by meeting date
   - Reorder items by dragging

### During Meetings:

1. **Switch to "This Week" board view**
2. **Move items** through statuses:
   - Start: To Discuss → In Discussion
   - End: In Discussion → Decided or Action Required

3. **Capture outcomes**:
   - Fill in "Decision/Outcome" field
   - Assign "Owner/Assignee" for action items
   - Add link to "AI Meeting Notes"

### After Meetings:

1. **Mark completed items**:
   - Change Status to "Completed"
   - Fill in "Completed Date" with today's date
   - Items automatically move to Archive (after 30 days)

2. **Follow up on actions**:
   - Check items with Status = "Action Required"
   - Update status as work progresses

---

## 💡 Best Practices

### Keep It Clean:
- Move old completed items to "Completed" status so they filter out
- Use the Archive view to review past decisions
- Delete spam/duplicate items

### Use Categories Consistently:
- Tag items with all relevant categories
- This helps with filtering and finding related items

### Meeting Prep:
- Add items to "Backlog" status throughout the week
- Move to "To Discuss" when planning the agenda
- Prioritize high-priority items

### Archive Management:
- Items older than 30 days + Completed automatically hide from main view
- You can still search and find them in Archive
- Consider reviewing quarterly: keep important decisions, delete redundant items

---

## 🚀 Quick Reference

### Status Workflow:
```
Backlog → To Discuss → In Discussion → Decided/Action Required → Completed
```

### When to Use Each Status:
- **Backlog**: Items submitted but not yet scheduled
- **To Discuss**: On the agenda for upcoming meeting
- **In Discussion**: Actively being discussed in the current meeting
- **Decided**: Discussion complete, decision made, no further action
- **Action Required**: Decision made, someone needs to do something
- **Completed**: Action finished or item fully resolved

---

## 🎯 You're Done!

Your All Staff Meetings Hub is ready to use. Start by:
1. Adding your next meeting date and facilitator
2. Creating a few agenda items
3. Tagging them with categories
4. Trying out different views

The database will grow and become more valuable over time as it builds up a history of discussions and decisions.

---

## ❓ Need Help?

If you want to automate this with the API integration:
1. Create a Notion integration at https://www.notion.so/my-integrations
2. Share your database with the integration
3. Run the automated setup script (see README.md)

