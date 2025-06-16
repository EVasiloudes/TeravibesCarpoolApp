# Teravibes Carpool App 🚗🎵

A modern, full-stack carpool application built specifically for Teravibes Festival attendees in Cyprus. Connect with fellow festival-goers, share rides, and make new friends on your way to the ultimate music experience!

## 🎯 Overview

The Teravibes Carpool App is a complete ride-sharing platform that allows festival attendees to create and join carpools to Teravibes Festival. Built with modern web technologies, it features real-time messaging, smart notifications, and a mobile-first design optimized for the Cyprus festival experience.

## ✨ Features

### 🚙 For Drivers
- **Create Trip Listings**: Set departure location, time, available seats, and trip details
- **Manage Passengers**: Accept/decline booking requests and manage seat availability
- **Real-time Communication**: Chat with passengers about pickup details and coordination
- **Trip Status Control**: Update trip status (active, full, cancelled, completed)

### 🎫 For Passengers
- **Smart Trip Search**: Find rides by location and departure date
- **One-click Booking**: Instantly join available trips with automatic seat management
- **Trip Communication**: Message drivers and fellow passengers
- **Personal Dashboard**: Track your created and joined trips

### 🌟 For Everyone
- **Mobile-First Design**: Fully responsive interface optimized for smartphones
- **Real-time Notifications**: Get instant updates about bookings, messages, and trip changes
- **Cyprus Integration**: Pre-configured with Cyprus cities and Teravibes Festival details
- **Secure Authentication**: Passwordless login with Magic SDK
- **Modern UX**: Clean, intuitive interface with festival branding

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Magic SDK
- **State Management**: React Context API

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Validation**: Server-side validation with comprehensive error handling

### Deployment
- **Platform**: Vercel
- **Database**: PostgreSQL (configurable)
- **Environment**: Production-ready configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Magic SDK account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TeravibesCarpoolApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/teravibes_carpool"
   
   # Magic SDK
   MAGIC_SECRET_KEY="your_magic_secret_key"
   NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY="your_magic_publishable_key"
   
   # JWT
   JWT_SECRET="your_jwt_secret_key"
   
   # App URL
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the app in action!

## 📱 Usage

### Creating a Trip
1. Log in with your email (Magic link authentication)
2. Click "Create Trip" on the homepage
3. Fill in departure details:
   - Origin city (Cyprus locations pre-loaded)
   - Departure date and time
   - Available seats
   - Trip description and requirements
4. Submit to make your trip available for booking

### Joining a Trip
1. Use "Find Trip" to search available rides
2. Filter by location and date
3. View trip details and driver information
4. Click "Join Trip" to instantly book your seat
5. Start chatting with your driver and fellow passengers

### Managing Your Trips
- Access your dashboard to see all created and joined trips
- View trip status, passenger lists, and messages
- Update trip details or cancel if needed
- Mark trips as completed after the festival

## 🗂️ Project Structure

```
TeravibesCarpoolApp/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── trips/          # Trip-related pages
│   │   └── dashboard/      # User dashboard
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components
│   │   └── forms/         # Form components
│   ├── contexts/          # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript type definitions
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── generated/             # Auto-generated files
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Magic link authentication
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/me` - Current user information

### Trips
- `GET /api/trips` - Search and list trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/[id]` - Get trip details
- `PUT /api/trips/[id]` - Update trip
- `DELETE /api/trips/[id]` - Delete trip
- `POST /api/trips/[id]/join` - Join trip

### Communication
- `GET /api/trips/[id]/messages` - Get trip messages
- `POST /api/trips/[id]/messages` - Send message
- `GET /api/notifications` - Get user notifications

### User Management
- `GET /api/users/trips` - Get user's trips (created + joined)

## 🎨 Customization

### Festival Configuration
The app is pre-configured for Teravibes Festival but can be easily customized:

- **Festival Details**: Update in `src/lib/constants.ts`
- **Cyprus Locations**: Modify in `src/lib/locations.ts`
- **Branding**: Update colors and styling in `tailwind.config.js`
- **Festival Date**: Change default date in trip creation forms

### Adding New Features
The modular architecture makes it easy to extend:

- **New Pages**: Add to `src/app/` directory
- **UI Components**: Create in `src/components/`
- **API Endpoints**: Add to `src/app/api/`
- **Database Changes**: Update `prisma/schema.prisma`

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Database Management
- `npx prisma migrate dev` - Create and apply new migration
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Regenerate Prisma client

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Run migrations: `npx prisma migrate deploy`
4. Start the server: `npm run start`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write responsive, mobile-first CSS
- Add proper error handling
- Include type definitions
- Test API endpoints thoroughly

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 🎵 About Teravibes Festival

Teravibes is Cyprus's premier electronic music festival, bringing together world-class DJs and music lovers in the beautiful setting of Fasli, Cyprus. This carpool app helps festival-goers connect, share rides, and start the party on the way to the festival!

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. For urgent matters, contact the development team

---

**Ready to ride to Teravibes? Let's carpool! 🎵🚗**