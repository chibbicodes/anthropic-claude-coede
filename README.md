# Dual Budget Tracker

A comprehensive web application for managing both personal (household) and business budgets in one place. Built with React, TypeScript, and Tailwind CSS.

## Features

### Core Functionality

- **Dual Budget Support**: Manage household and business finances separately or view them combined
- **Account Management**: Track checking, savings, credit cards, loans, investments, and more
- **Transaction Tracking**: Record and categorize all income and expenses
- **Budget Categories**: Organize spending with customizable categories and buckets
- **Income Tracking**: Monitor recurring and one-time income sources
- **Due Dates Calendar**: Track bill payment due dates and avoid late fees
- **Budget Analysis**: Get smart suggestions and insights on your spending
- **Business Reports**: Generate Profit & Loss statements and export reports
- **Settings & Preferences**: Customize currency, default views, and manage your data

### Household Budget Features

**50/30/20 Budget Framework**:
- **Needs (50%)**: Essential expenses like rent, utilities, groceries
- **Wants (30%)**: Non-essential spending like entertainment, dining out
- **Savings (20%)**: Emergency fund, investments, debt payoff

- Fixed vs. variable expense tracking
- Credit card utilization monitoring
- Net worth calculations
- Monthly budget tracking and analysis

### Business Budget Features

**Business Budget Categories**:
- **Operating Expenses**: Day-to-day business costs
- **Growth & Marketing**: Investment in business expansion
- **Compensation**: Salaries, contractor payments
- **Tax Reserve**: Set aside money for taxes
- **Business Savings**: Emergency fund and reserves

- Tax-deductible expense tracking
- Client/revenue tracking
- Profit & Loss statements
- Export reports for accountant/tax filing
- Business expense categorization

### Data Management

- **Import/Export**: Backup and restore your data as JSON
- **Separate Exports**: Export household and business data separately
- **Clear Data**: Remove specific budget data or clear everything
- **Data Statistics**: View counts of accounts, transactions, categories, income sources
- **Local Storage**: All data stored locally in your browser

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **Storage**: Browser LocalStorage

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd anthropic-claude-coede
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Application Structure

```
src/
├── components/           # Reusable UI components
│   ├── BudgetBadge.tsx  # Budget type indicator
│   ├── Layout.tsx       # App layout and navigation
│   ├── Modal.tsx        # Modal dialog component
│   └── SummaryCard.tsx  # Dashboard summary cards
├── contexts/
│   └── BudgetContext.tsx # Global state management
├── data/
│   └── defaultCategories.ts # Default budget categories
├── pages/               # Main application pages
│   ├── Accounts.tsx     # Account management
│   ├── Budget.tsx       # Budget categories and planning
│   ├── BudgetAnalysis.tsx # Smart budget insights
│   ├── BusinessReports.tsx # P&L and business reports
│   ├── Dashboard.tsx    # Overview and summary
│   ├── DueDates.tsx     # Bill due dates calendar
│   ├── Income.tsx       # Income tracking
│   ├── Settings.tsx     # App settings and data management
│   ├── Transactions.tsx # Transaction list and management
│   └── Welcome.tsx      # First-time user setup
├── services/
│   └── storage.ts       # LocalStorage data persistence
├── types/
│   └── index.ts         # TypeScript type definitions
├── App.tsx              # Root application component
└── main.tsx             # Application entry point
```

## Usage Guide

### First-Time Setup

1. **Welcome Screen**: Choose which budgets to track (Household, Business, or Both)
2. **Add Accounts**: Set up your bank accounts, credit cards, etc.
3. **Configure Categories**: Review and customize budget categories
4. **Set Income Sources**: Add your income streams
5. **Start Tracking**: Begin recording transactions

### Dashboard

View at-a-glance summary of:
- Net worth (assets minus liabilities)
- Total accounts and balances
- Budget categories count
- Recent transactions
- Monthly spending trends

### Managing Accounts

- Add checking, savings, credit cards, loans, investments
- Track balances and interest rates
- Monitor credit utilization
- Set payment due dates
- Add website URLs for bill pay

### Recording Transactions

- Quick entry with date, description, amount, category
- Auto-assign to household or business based on account
- Mark tax-deductible expenses
- Add notes for reference
- Filter and search transactions

### Budget Planning

- Set monthly budgets for each category
- Track spending against budget
- View spending by bucket (Needs/Wants/Savings or Business categories)
- Identify fixed vs. variable expenses
- Get overspending alerts

### Budget Analysis

Get smart suggestions based on your spending:
- High-spend categories to review
- Credit utilization warnings
- Savings rate recommendations
- Budget rebalancing suggestions
- Spending trend insights

### Income Tracking

- Add recurring income sources (salary, freelance, etc.)
- Track one-time income
- Monitor expected vs. actual income
- Separate household and business income

### Due Dates Calendar

- View upcoming bill due dates
- See bills by account
- Track minimum payments
- Quick links to bill pay websites

### Business Reports

- Generate Profit & Loss statements
- View expense breakdown by category
- Track tax-deductible expenses
- Export reports as JSON or formatted text
- Monthly and quarterly views

### Settings

**Data Management**:
- Export all data or by budget type
- Import previously exported data
- Clear specific budget data
- View data statistics

**Preferences**:
- Choose default budget view (Household/Business/Combined)
- Select currency symbol (USD $, EUR €, GBP £, JPY ¥, CNY ¥)
- Settings persist across sessions

## Data Structure

### Account Types
- Checking
- Savings
- Credit Card
- Loan
- Investment
- Other

### Transaction Types
- Income (positive amounts)
- Expenses (negative amounts)

### Household Buckets
- Needs (50% target)
- Wants (30% target)
- Savings (20% target)

### Business Buckets
- Operating Expenses
- Growth & Marketing
- Compensation
- Tax Reserve
- Business Savings

## Data Storage

All data is stored locally in your browser's LocalStorage:
- No server required
- No account registration
- Complete privacy
- Data persists between sessions
- Export for backup/transfer

**Important**: Clear browser data will delete your budget data. Always export regularly for backup!

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- Functional React components with hooks
- Context API for state management
- Tailwind CSS for styling
- ESLint for code quality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Privacy & Security

- All data stored locally in your browser
- No data sent to external servers
- No tracking or analytics
- No account required
- Export your data anytime

## Future Enhancements

Potential features for future versions:
- CSV import for transactions
- Recurring transaction templates
- Multi-currency support
- Budget sharing/collaboration
- Mobile responsive improvements
- Dark mode
- Data encryption
- Cloud backup options

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

## Acknowledgments

Built with modern web technologies:
- React team for the amazing framework
- Tailwind Labs for Tailwind CSS
- Recharts for beautiful charts
- Lucide for clean icons
- The open-source community

---

**Happy budgeting!** Take control of your household and business finances with Dual Budget Tracker.
