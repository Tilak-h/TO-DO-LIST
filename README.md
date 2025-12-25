# TaskFlow - Mobile To-Do List Application

## Project Info

TaskFlow is a modern, feature-rich to-do list application that helps you manage your tasks efficiently with advanced sorting, filtering, and categorization. Built with React, TypeScript, and Supabase, it features user authentication, smart task prioritization, and a beautiful, intuitive interface.

### Key Features

- **User Authentication**: Secure registration and login with username/password
- **Smart Task Management**: Create, edit, complete, and delete tasks with ease
- **Priority Levels**: Organize tasks by High, Medium, or Low priority with color-coded badges
- **Categories & Tags**: Create custom categories with colors and icons to organize your tasks
- **Advanced Sorting**: 5 sorting options including Smart Sort (urgency + priority + time)
- **Powerful Filtering**: Search, filter by priority, filter by category, and combine multiple filters
- **Task Details**: Add descriptions, date/time, deadlines, and multiple categories to your tasks
- **Urgency Indicators**: Automatic labels for overdue, due today, and due soon tasks
- **Status Tracking**: View all tasks, pending tasks, or completed tasks separately
- **Statistics Dashboard**: Real-time overview of total, completed, pending, and overdue tasks
- **Mobile-First Design**: Optimized for all devices with a clean, card-based layout
- **Real-time Updates**: Instant synchronization with Supabase backend
- **Beautiful Animations**: Smooth transitions, hover effects, and gradient designs

### Design Highlights

- **Color Scheme**: Deep blue primary color with priority-based color coding
  - High Priority: Orange (#F59E0B)
  - Medium Priority: Yellow (#FCD34D)
  - Low Priority: Blue (#60A5FA)
  - Completed: Green (#10B981)
- **Modern UI**: 12px border radius for cards and buttons, subtle shadows, gradient effects
- **Animations**: Slide-up animations, hover lift effects, and smooth transitions
- **Responsive**: Works seamlessly on all screen sizes from mobile to desktop

## Getting Started

### First Time Setup

1. **Register an Account**
   - Open the application
   - Click "Sign up" on the login page
   - Enter a username (letters, digits, and underscores only)
   - Create a password (minimum 6 characters)
   - Click "Sign Up" to create your account

2. **Login**
   - Enter your username and password
   - Click "Sign In"
   - You'll be redirected to your task dashboard

### Using TaskFlow

#### Adding a Task
1. Click the "Add Task" button (blue floating button with plus icon)
2. Fill in the task details:
   - **Title** (required): Brief description of the task
   - **Description** (optional): Additional details
   - **Priority**: Choose High, Medium, or Low
   - **Categories**: Select one or more categories (or create new ones)
   - **Date & Time** (optional): When you plan to work on it
   - **Deadline** (optional): When it needs to be completed
3. Click "Add Task" to save

#### Managing Tasks
- **Complete a Task**: Click the checkbox next to the task title
- **Edit a Task**: Click the "Edit" button to modify any task details
- **Delete a Task**: Click the "Delete" button and confirm
- **View by Status**: Use the tabs to filter:
  - All: See all your tasks
  - Pending: Only incomplete tasks
  - Completed: Only finished tasks

#### Sorting Tasks
Click the "Sort" button to choose from 5 sorting options:
- **🎯 Smart Sort**: Combines urgency, priority, and creation time (recommended)
- **📅 Deadline**: Earliest deadline first
- **⚡ Priority**: High to low priority
- **🕐 Created**: Newest tasks first
- **🔤 A-Z**: Alphabetical order by title

#### Filtering Tasks
1. Use the **search bar** to find tasks by title or description
2. Click the **"Filters"** button to open advanced filters:
   - Filter by priority (High/Medium/Low)
   - Filter by category
   - Combine multiple filters
3. Active filters are shown as badges below the toolbar
4. Click "Clear all" to remove all filters

#### Categories
1. Click the **Settings icon** (⚙️) to manage categories
2. Create new categories with:
   - Custom name
   - Color picker (8 presets + custom color)
   - Icon selector (12 preset emojis)
3. Assign multiple categories to any task
4. Filter tasks by category using the Filters panel

#### Task Information
Each task card displays:
- Title and description
- Priority badge (color-coded)
- Urgency label (Overdue, Due Today, Due Soon)
- Categories with custom colors and icons
- Date/time and deadline (if set)
- Completion status
- Edit and delete buttons

#### Statistics Dashboard
View real-time statistics at the top of your task list:
- **Total Tasks**: All tasks in your list
- **Completed**: Number and percentage of completed tasks
- **Pending**: Tasks still to be done
- **Overdue**: Tasks past their deadline

### User Account
- View your username in the top-right corner
- Click the user icon to access:
  - Your email address
  - Sign out option

## Advanced Features

### Smart Sorting Algorithm
The Smart Sort option uses an intelligent algorithm that:
1. Prioritizes overdue tasks (highest urgency)
2. Calculates urgency based on deadline proximity
3. Weights tasks by priority level (High=3, Medium=2, Low=1)
4. Considers creation time as a tiebreaker
5. Always keeps completed tasks at the bottom

### Category System
- Create unlimited custom categories
- Each category has a unique color and icon
- Tasks can have multiple categories
- Categories are user-specific and private
- Default categories provided: Work, Personal, Shopping, Health

### Filter Combinations
You can combine multiple filters simultaneously:
- Search + Priority filter
- Category + Priority filter
- Search + Category + Priority filter
- All filters work together seamlessly

The application automatically updates the task count and displays active filters as removable badges.

## Tips for Productivity

1. **Use Smart Sort**: Let the algorithm prioritize your most urgent and important tasks
2. **Set Deadlines**: Tasks with deadlines get urgency labels and higher priority in Smart Sort
3. **Categorize Everything**: Use categories to organize tasks by project, context, or area of life
4. **Check Statistics**: Monitor your completion rate to stay motivated
5. **Filter Strategically**: Use filters to focus on specific priorities or categories
6. **Edit Freely**: Update task details as priorities and deadlines change

The application automatically saves all your tasks to a secure database, so your data is always safe and accessible whenever you log in.

## Project Directory

```
├── README.md # Documentation
├── components.json # Component library configuration
├── index.html # Entry file
├── package.json # Package management
├── postcss.config.js # PostCSS configuration
├── public # Static resources directory
│   ├── favicon.png # Icon
│   └── images # Image resources
├── src # Source code directory
│   ├── App.tsx # Entry file
│   ├── components # Components directory
│   ├── context # Context directory
│   ├── db # Database configuration directory
│   ├── hooks # Common hooks directory
│   ├── index.css # Global styles
│   ├── layout # Layout directory
│   ├── lib # Utility library directory
│   ├── main.tsx # Entry file
│   ├── routes.tsx # Routing configuration
│   ├── pages # Pages directory
│   ├── services # Database interaction directory
│   ├── types # Type definitions directory
├── tsconfig.app.json # TypeScript frontend configuration file
├── tsconfig.json # TypeScript configuration file
├── tsconfig.node.json # TypeScript Node.js configuration file
└── vite.config.ts # Vite configuration file
```

## Tech Stack

Vite, TypeScript, React, Supabase

## Development Guidelines

### How to edit code locally?

You can choose [VSCode](https://code.visualstudio.com/Download) or any IDE you prefer. The only requirement is to have Node.js and npm installed.

### Environment Requirements

```
# Node.js ≥ 20
# npm ≥ 10
Example:
# node -v   # v20.18.3
# npm -v    # 10.8.2
```

### Installing Node.js on Windows

```
# Step 1: Visit the Node.js official website: https://nodejs.org/, click download. The website will automatically suggest a suitable version (32-bit or 64-bit) for your system.
# Step 2: Run the installer: Double-click the downloaded installer to run it.
# Step 3: Complete the installation: Follow the installation wizard to complete the process.
# Step 4: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### Installing Node.js on macOS

```
# Step 1: Using Homebrew (Recommended method): Open Terminal. Type the command `brew install node` and press Enter. If Homebrew is not installed, you need to install it first by running the following command in Terminal:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
Alternatively, use the official installer: Visit the Node.js official website. Download the macOS .pkg installer. Open the downloaded .pkg file and follow the prompts to complete the installation.
# Step 2: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### After installation, follow these steps:

```
# Step 1: Download the code package
# Step 2: Extract the code package
# Step 3: Open the code package with your IDE and navigate into the code directory
# Step 4: In the IDE terminal, run the command to install dependencies: npm i
# Step 5: In the IDE terminal, run the command to start the development server: npm run dev -- --host 127.0.0.1
# Step 6: if step 5 failed, try this command to start the development server: npx vite --host 127.0.0.1
```

### How to develop backend services?

Configure environment variables and install relevant dependencies.If you need to use a database, please use the official version of Supabase.

## Learn More

You can also check the help documentation: Download and Building the app（ [https://intl.cloud.baidu.com/en/doc/MIAODA/s/download-and-building-the-app-en](https://intl.cloud.baidu.com/en/doc/MIAODA/s/download-and-building-the-app-en)）to learn more detailed content.
