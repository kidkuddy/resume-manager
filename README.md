# Resume & Skills Manager

A modern, dark-themed web application for managing all components of your professional resume. Built with Next.js, TypeScript, and shadcn/ui components.

## ✨ Features

### Core Functionality
- **CRUD Operations** for all resume components:
  - 📝 Work Experiences
  - 🚀 Projects  
  - 🏆 Certifications
  - 🎯 Activities (volunteering, speaking, etc.)
  - 💡 Skills (categorized and taggable)
  - 🎓 Education
  - 📄 LaTeX Resume Templates

### Data Management
- **Local JSON Storage** - All data stored locally as JSON files
- **Import/Export** - Full data backup and restore functionality
- **Search & Filter** - Find items by tags, keywords, and categories
- **Tag System** - Organize content with custom tags

### User Experience
- **Dark Theme** - Modern, minimal design
- **Responsive Layout** - Works on desktop and mobile
- **Dashboard Overview** - Quick stats and navigation
- **Sidebar Navigation** - Easy access to all sections

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Dashboard homepage
│   ├── experiences/       # Work experience management
│   ├── projects/          # Project portfolio
│   ├── certifications/    # Professional certifications
│   ├── activities/        # Community involvement
│   ├── skills/           # Technical & soft skills
│   ├── education/        # Academic background
│   └── templates/        # LaTeX resume templates
├── components/
│   ├── ui/               # shadcn/ui components
│   └── dashboard-layout.tsx # Main layout component
├── lib/
│   ├── utils.ts          # Utility functions
│   └── data-manager.ts   # Data management logic
├── types/
│   └── index.ts          # TypeScript type definitions
└── data/
    └── resume.json       # Initial data structure
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Storage**: Local JSON files + localStorage

## 📝 Usage

### Adding Data
1. Navigate to any section using the sidebar
2. Click "Add New" to create entries
3. Fill in the form with your information
4. Use tags to organize and categorize content

### Managing Templates
- Store multiple LaTeX resume templates
- Include variable placeholders for dynamic content
- Export templates alongside your data

### Import/Export
- **Export**: Download all your data as a JSON file
- **Import**: Upload a previously exported JSON file to restore data
- Perfect for backups or transferring between devices

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
