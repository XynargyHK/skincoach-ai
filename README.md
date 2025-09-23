# SkinCoach - AI-Powered Skin Health Companion

Your personalized AI companion for skin health tracking, analysis, and guidance.

## 🚀 Features

- **AI-Powered Analysis**: Advanced skin photo analysis and personalized recommendations
- **Daily Tracking**: Track your skin health journey with progress monitoring
- **Smart Notifications**: Proactive push notifications for skincare routines
- **PWA Support**: Installable progressive web app
- **Modern UI**: Beautiful, responsive design with shadcn/ui components

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui + Magic UI components
- **Backend**: Supabase (Auth + Database + Storage)
- **Push Notifications**: OneSignal
- **PWA**: next-pwa
- **Deployment**: Railway

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OneSignal account

### Environment Setup

1. Copy `.env.local` and fill in your credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OneSignal Configuration
NEXT_PUBLIC_ONESIGNAL_APP_ID=your_onesignal_app_id
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🚀 Deployment

### Railway Deployment

1. Connect your GitHub repo to Railway
2. Add environment variables in Railway dashboard
3. Railway will auto-deploy using the `railway.json` configuration

### Manual Build

```bash
npm run build
npm run start
```

## 📱 PWA Installation

The app is installable as a Progressive Web App on mobile and desktop devices.

## 🔧 Configuration

### Supabase Setup
- Create a new Supabase project
- Enable authentication
- Set up RLS policies
- Add your project URL and anon key to environment variables

### OneSignal Setup
- Create a new OneSignal app
- Configure web push settings
- Add your app ID to environment variables

## 📄 License

This project is private and proprietary.
