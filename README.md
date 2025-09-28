# AI Weekly Planner

An intelligent productivity application that uses AI to create optimal weekly schedules based on your tasks, deadlines, and priorities. Built with Next.js, TypeScript, and powered by OpenAI GPT-4o-mini for smart task scheduling.

## 🚀 Features

### Core Functionality

- **🤖 AI-Powered Planning**: Generate intelligent weekly schedules using OpenAI GPT-4o-mini
- **📅 Deadline Management**: Set specific deadlines with date and time precision
- **⏰ Smart Time Input**: Hours and minutes input with auto-conversion (60+ min → hours)
- **🎯 Priority-Based Scheduling**: High/Medium/Low priority task organization
- **📊 Visual Urgency Indicators**: Color-coded task cards (overdue/urgent/soon/normal)
- **📋 Task CRUD Operations**: Create, read, update, and delete tasks seamlessly

### AI Intelligence

- **Deadline-Aware Scheduling**: Tasks with deadlines are scheduled before their due dates
- **Urgency Detection**: Overdue and urgent tasks (24h) get immediate priority
- **Workload Balancing**: Distributes tasks evenly across days (max 6 hours/day)
- **Smart Distribution**: Considers priority, duration, and deadline constraints

### User Experience

- **🎨 Modern UI**: Clean, responsive design with Tailwind CSS and Shadcn components
- **📱 Mobile-First**: Responsive design that works on all devices
- **⚡ Real-Time Updates**: Instant task list updates and plan generation
- **🔍 Visual Feedback**: Clear deadline displays and time formatting

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.5.4 with Pages Router
- **Language**: TypeScript (full type safety)
- **Styling**: Tailwind CSS v4 with custom color palette
- **UI Components**: Shadcn UI components (Button, Input, Select, Badge)
- **Icons**: Lucide React icons

### Backend & Database

- **API**: Next.js API Routes (RESTful)
- **Database**: SQLite with Prisma ORM
- **AI Integration**: OpenAI GPT-4o-mini for intelligent planning
- **Data Validation**: Built-in form validation and error handling

### Development Tools

- **Linting**: ESLint with Next.js config
- **Type Safety**: Full TypeScript coverage
- **Package Manager**: npm with lock file
- **Build Tool**: Next.js built-in Webpack configuration

## 📦 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- OpenAI API key (for AI planning features)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd ai-weekly-planner
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```bash
   # Database
   DATABASE_URL="file:./dev.db"

   # OpenAI API (get your key from https://platform.openai.com/api-keys)
   OPENAI_API_KEY="your-openai-api-key-here"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push schema to database
   npx prisma db push
   ```

5. **Start the development server**

```bash
npm run dev
```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues

## 🗄️ Database Schema

### Task Model

```prisma
model Task {
  id               Int      @id @default(autoincrement())
  title            String   // Task title
  description      String?  // Optional description
  priority         String   @default("medium") // low/medium/high
  estimatedMinutes Int      @default(30) // Time estimation
  deadline         DateTime? // Optional deadline
  createdAt        DateTime @default(now())
}
```

### Plan Model

```prisma
model Plan {
  id        Int      @id @default(autoincrement())
  weekJson  Json     // AI-generated weekly schedule
  createdAt DateTime @default(now())
}
```

## 🏗️ Project Structure

```
ai-weekly-planner/
├── app/                    # App Router files
│   ├── generated/         # Prisma generated client
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── ui/                # Shadcn UI components
│   │   ├── button.tsx     # Button component
│   │   ├── input.tsx      # Input component
│   │   ├── select.tsx     # Select component
│   │   └── badge.tsx      # Badge component
│   ├── Header.tsx         # Navigation header
│   ├── Layout.tsx         # Main layout wrapper
│   ├── TaskForm.tsx       # Task creation form
│   ├── TaskList.tsx       # Task display list
│   ├── GeneratePlan.tsx   # AI plan generation
│   └── PlanDisplay.tsx    # Weekly plan visualization
├── lib/                   # Utility libraries
│   ├── prisma.ts         # Prisma client configuration
│   ├── openai.ts         # OpenAI client setup
│   └── utils.ts          # Utility functions
├── pages/                 # Pages Router structure
│   ├── api/              # API routes
│   │   ├── tasks/        # Task CRUD endpoints
│   │   └── generate-plan.ts # AI planning endpoint
│   ├── _app.tsx          # App component wrapper
│   └── index.tsx         # Home page
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema definition
├── public/               # Static assets
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## 🎨 Styling & UI

This project uses **Tailwind CSS v4** with **Shadcn UI components**:

- **Primary Colors**: Custom blue-based color palette with urgency indicators
- **Responsive Design**: Mobile-first approach with grid layouts
- **Component Library**: Shadcn UI for consistent, accessible components
- **Visual Feedback**: Color-coded urgency (red=overdue, orange=urgent, yellow=soon)
- **Time Formatting**: Smart display (30 min, 1h, 1h 30m)
- **Form Validation**: Real-time validation with error states

## 🚀 API Endpoints

### Tasks API

- `GET /api/tasks` - Fetch all tasks (ordered by deadline, priority, creation date)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Fetch a specific task
- `PUT /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

### Planning API

- `POST /api/generate-plan` - Generate AI-powered weekly plan

## 🤖 AI Planning Features

The AI planning system uses OpenAI GPT-4o-mini with intelligent prompts:

- **Deadline Priority**: Tasks with deadlines are scheduled before their due dates
- **Urgency Detection**: Overdue tasks get immediate priority
- **Workload Balancing**: Maximum 6 hours of tasks per day
- **Smart Distribution**: Considers priority, duration, and deadline constraints
- **JSON Output**: Structured weekly plan with day-by-day task distribution

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` (for production database)
   - `OPENAI_API_KEY` (your OpenAI API key)
4. Deploy with zero configuration

### Other Platforms

```bash
# Build the application
npm run build

# Start production server
npm run start
```

**Note**: For production deployment, consider upgrading from SQLite to PostgreSQL or MySQL for better performance and scalability.

## 🔮 Future Roadmap

### Phase 1 - Authentication & User Management

- [ ] Google OAuth integration
- [ ] Email/password authentication
- [ ] User-specific task isolation

### Phase 2 - Enhanced UI/UX

- [ ] Task detail modals
- [ ] Framer Motion animations
- [ ] Landing page with hero section
- [ ] Mobile app optimization

### Phase 3 - Productivity Features

- [ ] Task categories and tags
- [ ] Search and filter functionality
- [ ] Task attachments and URLs
- [ ] Recurring tasks

### Phase 4 - Notifications & Analytics

- [ ] Push notifications for deadlines
- [ ] Email reminders
- [ ] Productivity analytics dashboard
- [ ] Time tracking insights

### Phase 5 - SaaS Features

- [ ] Multi-user collaboration
- [ ] Subscription model (Stripe)
- [ ] Cloud integrations (Google Drive, OneDrive)
- [ ] Advanced AI personalization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/ai-weekly-planner/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 📊 Current Status

✅ **Fully Functional MVP** - The application is ready for single-user task management with AI-powered weekly planning.

### What Works Now:

- ✅ Task creation with deadlines and time estimation
- ✅ AI-powered weekly plan generation
- ✅ Visual urgency indicators and deadline management
- ✅ Responsive UI with modern design
- ✅ Full CRUD operations for tasks
- ✅ Smart time input with hours/minutes

### Ready for Next Phase:

- 🔄 Authentication and user management
- 🔄 Multi-user support and data isolation
- 🔄 Enhanced UI/UX with animations
- 🔄 SaaS features and subscription model

---

**Happy Planning! 🎯**

_Built with ❤️ using Next.js, TypeScript, and OpenAI GPT-4o-mini_
