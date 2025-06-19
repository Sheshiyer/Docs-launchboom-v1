# Vibrasonix - Premium Relaxation Music App

A React Native music streaming app built with Expo, featuring scientifically-crafted frequencies for relaxation, focus, and sleep.

## Features

### 🎵 Music Streaming
- High-quality audio streaming
- Binaural beats and healing frequencies
- Curated albums with scientific backing
- Offline downloads for premium users

### 👤 User Management
- Secure authentication with Supabase
- User profiles and preferences
- Listening history and analytics
- Favorites and custom playlists

### 💎 Premium Subscriptions
- RevenueCat integration for subscriptions
- Premium content access
- Advanced features for subscribers
- Cross-platform purchase restoration

### 📱 Modern UI/UX
- Beautiful, Apple-inspired design
- Smooth animations and transitions
- Dark theme optimized for relaxation
- Responsive design for all devices

## Tech Stack

- **Frontend**: React Native with Expo
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: RevenueCat
- **Audio**: Expo AV
- **Navigation**: Expo Router
- **Styling**: React Native StyleSheet

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- Supabase account
- RevenueCat account (for payments)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vibrasonix-music-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your Supabase and RevenueCat credentials in `.env`.

### Database Setup

1. Create a new Supabase project
2. Run the migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_sample_data.sql`

### RevenueCat Setup

1. Create a RevenueCat account
2. Set up your app in the RevenueCat dashboard
3. Configure subscription products
4. Add your API key to the environment variables

**Note**: RevenueCat requires native code and will not function in the web preview. To test payments:

1. Create a development build:
```bash
npx expo install expo-dev-client
npx expo run:ios # or expo run:android
```

2. Install RevenueCat SDK:
```bash
npm install react-native-purchases
```

### Running the App

For development:
```bash
npm run dev
```

For web build:
```bash
npm run build:web
```

## Project Structure

```
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation
│   ├── album/             # Album detail screens
│   ├── player.tsx         # Music player screen
│   └── onboarding.tsx     # Onboarding flow
├── contexts/              # React contexts
│   ├── AuthContext.tsx    # Authentication state
│   └── MusicContext.tsx   # Music player state
├── lib/                   # Utilities and services
│   ├── supabase.ts        # Database service
│   └── payments.ts        # Payment service
├── supabase/              # Database migrations
│   └── migrations/        # SQL migration files
└── components/            # Reusable components
```

## Database Schema

### Core Tables
- `users` - User profiles and subscription status
- `albums` - Music albums with metadata
- `tracks` - Individual tracks with frequency data
- `user_favorites` - User's favorite tracks/albums
- `user_playlists` - Custom user playlists
- `playlist_tracks` - Tracks within playlists
- `user_listening_history` - Analytics and history
- `user_downloads` - Downloaded tracks for offline use

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Public read access for albums and tracks
- Premium content restrictions based on subscription

## Payment Integration

The app uses RevenueCat for subscription management:

### Subscription Tiers
- **Free**: Limited access to basic content
- **Premium Monthly**: Full access to all content
- **Premium Yearly**: Full access with discount

### Features by Tier
- **Free Users**: Basic albums, limited downloads
- **Premium Users**: All content, unlimited downloads, exclusive frequencies

### Implementation Notes
- RevenueCat handles cross-platform subscriptions
- Subscription status synced with Supabase
- Graceful fallback for web/development environments

## Development Notes

### Web Compatibility
- Audio playback mocked for web development
- RevenueCat mocked for web preview
- Full functionality requires native build

### Testing Payments
1. Use RevenueCat's sandbox environment
2. Create test users in App Store Connect/Google Play Console
3. Test subscription flows on physical devices

### Database Migrations
- Always create new migration files for schema changes
- Never modify existing migrations
- Use descriptive names and include documentation

## Deployment

### Web Deployment
```bash
npm run build:web
```

### Mobile App Stores
1. Create production builds with EAS Build
2. Configure app store metadata
3. Submit for review following platform guidelines

### Environment Configuration
- Development: Local Supabase + RevenueCat sandbox
- Staging: Staging Supabase + RevenueCat sandbox  
- Production: Production Supabase + RevenueCat live

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.