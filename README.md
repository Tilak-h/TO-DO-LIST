# TaskFlow - Mobile To-Do List Application

## Project Info

TaskFlow is a modern, mobile-first to-do list application that helps you manage your tasks efficiently. Built with React, TypeScript, and Supabase, it features user authentication, task prioritization, and a beautiful, intuitive interface.

### Key Features

- **User Authentication**: Secure registration and login with username/password
- **Task Management**: Create, complete, and delete tasks with ease
- **Priority Levels**: Organize tasks by High, Medium, or Low priority
- **Task Details**: Add descriptions, date/time, and deadlines to your tasks
- **Status Tracking**: View all tasks, pending tasks, or completed tasks separately
- **Mobile-First Design**: Optimized for mobile devices with a clean, card-based layout
- **Real-time Updates**: Instant synchronization with Supabase backend

### Design Highlights

- **Color Scheme**: Deep blue primary color with priority-based color coding
  - High Priority: Orange
  - Medium Priority: Yellow
  - Low Priority: Blue
  - Completed: Green
- **Modern UI**: 12px border radius for cards and buttons, subtle shadows, and smooth animations
- **Responsive**: Works seamlessly on all screen sizes

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
   - You'll be redirected to your task list

### Using TaskFlow

#### Adding a Task
1. Click the "Add Task" button (blue button with plus icon)
2. Fill in the task details:
   - **Title** (required): Brief description of the task
   - **Description** (optional): Additional details
   - **Priority**: Choose High, Medium, or Low
   - **Date & Time** (optional): When you plan to work on it
   - **Deadline** (optional): When it needs to be completed
3. Click "Add Task" to save

#### Managing Tasks
- **Complete a Task**: Click the checkbox next to the task title
- **Delete a Task**: Click the "Delete" button and confirm
- **View by Status**: Use the tabs to filter:
  - All: See all your tasks
  - Pending: Only incomplete tasks
  - Completed: Only finished tasks

#### Task Information
Each task card displays:
- Title and description
- Priority badge (color-coded)
- Date/time and deadline (if set)
- Completion status
- Overdue indicator (if past deadline)

### User Account
- View your username in the top-right corner
- Click the user icon to access:
  - Your email address
  - Sign out option

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
