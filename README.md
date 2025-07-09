# 📝 Pastplied

A modern job application tracking system that automatically extracts job details from URLs and helps you manage your job search efficiently.

## ✨ Features

- **🔗 Smart Job Import**: Paste a job listing URL and automatically extract job title, company, and location using AI
- **📊 Application Tracking**: Keep track of all your job applications in one centralized dashboard
- **📅 Date Management**: Track when you applied to each position
- **🔄 Real-time Updates**: Edit and update application details on the fly
- **🗑️ Easy Management**: Delete applications you no longer need to track
- **🔐 Secure Authentication**: User authentication powered by Clerk
- **🌙 Dark Mode**: Toggle between light and dark themes
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework for production
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn UI](https://ui.shadcn.com/)** - Accessible UI components
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

### Backend & Database
- **[Convex](https://convex.dev/)** - Real-time backend with database and serverless functions
- **[Clerk](https://clerk.com/)** - Authentication and user management

### AI & Data Processing
- **[Google Generative AI](https://ai.google.dev/)** - AI-powered job data extraction
- **[Cheerio](https://cheerio.js.org/)** - Server-side HTML parsing

### Form & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Pastplied.git
   cd Pastplied
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Convex**
   ```bash
   npx convex dev
   ```
   Follow the prompts to create a new Convex project or link to an existing one.

4. **Set up Clerk Authentication**
   - Create a Clerk account at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy your publishable key and secret key
   - Follow the [Convex Clerk integration guide](https://docs.convex.dev/auth/clerk) to set up JWT templates
   - Add your Clerk JWT issuer domain to your Convex environment variables

5. **Set up Google AI (for job data extraction)**
   - Get an API key from [Google AI Studio](https://aistudio.google.com/)
   - Add it to your environment variables

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Google AI
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Convex (automatically set when running convex dev)
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

## 📁 Project Structure

```
Pastplied/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── convex/               # Convex backend
│   ├── jobApplications.ts # Database queries/mutations
│   ├── schema.ts         # Database schema
│   └── auth.config.ts    # Authentication config
├── lib/                  # Utility functions
├── schemas/              # Zod validation schemas
└── public/               # Static assets
```

## 🎯 How It Works

1. **Authentication**: Users sign in securely through Clerk
2. **Add Job**: Paste a job listing URL into the form
3. **AI Extraction**: The app fetches the job page and uses Google's Generative AI to extract:
   - Job title
   - Company name
   - Location
4. **Storage**: Application data is stored in Convex's real-time database
5. **Management**: View, edit, and delete applications from your dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live Demo**: [https://pastplied.vercel.app](https://pastplied.vercel.app)
- **Portfolio**: [https://www.marinactonci.com/](https://www.marinactonci.com/)
- **LinkedIn**: [https://www.linkedin.com/in/marinactonci/](https://www.linkedin.com/in/marinactonci/)

