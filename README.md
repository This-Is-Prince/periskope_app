# Periskope Chat Application

A modern WhatsApp-style chat application built with Next.js, TypeScript, Tailwind CSS, and Supabase. This application features real-time messaging, phone authentication, and a responsive UI.

## Features

- 📱 Phone number authentication with OTP
- 💬 Real-time messaging with Supabase Realtime
- 👥 Group and individual chats
- 🏷️ Chat tags and labels
- 📱 Responsive design
- 🔐 Row Level Security (RLS) for data protection
- ⚡ Real-time updates across all connected clients

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with phone OTP
- **Real-time**: Supabase Realtime
- **Icons**: React Icons

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd periskope_app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up Database Schema

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql` and run it
4. This will create all necessary tables, policies, and test data

### 5. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Enable Phone authentication
3. Configure your phone auth provider (you may need to set up Twilio or another SMS provider)

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Users

The application comes with pre-configured test users. You can use these phone numbers for testing:

- `18005550123` - Test User 1
- `18005550124` - Test User 2  
- `18005550125` - Test User 3
- `18005550126` - Test User 4
- `18005550127` - Test User 5
- `18005550128` - Swapnika
- `18005550129` - Prakash
- `18005550130` - El Centro
- `18005550131` - Aditya
- `18005550132` - Vaibhav

Use proper OTP verification through Supabase authentication.

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── login/             # Authentication pages
│   ├── page.tsx           # Main chat page (root)
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ChatListPanel/     # Chat list sidebar
│   ├── ChatWindow/        # Main chat interface
│   └── Sidebar/           # Navigation sidebar
├── lib/                   # Utility functions
│   ├── auth.tsx          # Authentication context
│   ├── database.ts       # Database service functions
│   └── supabase.ts       # Supabase client
└── types.ts              # TypeScript type definitions
```

## Key Features Implementation

### Real-time Messaging
- Uses Supabase Realtime for instant message delivery
- Messages appear immediately for all participants
- Automatic scroll to bottom on new messages

### Authentication
- Phone number-based authentication with OTP
- Secure session management
- Protected routes with automatic redirects

### Database Design
- Normalized schema with proper relationships
- Row Level Security for data protection
- Efficient queries with proper indexing

### UI/UX
- WhatsApp-inspired design
- Responsive layout for all screen sizes
- Loading states and error handling
- Smooth animations and transitions

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Configure environment variables

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

The application uses the following main tables:

- `users` - User profiles and authentication data
- `chats` - Chat rooms (individual and group)
- `chat_participants` - Many-to-many relationship between users and chats
- `messages` - Chat messages with sender information
- `chat_tags` - Tags/labels for organizing chats

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is built for the Periskope recruitment process.

## Support

For any issues or questions, please contact the development team.

---

Built with ❤️ for Periskope
