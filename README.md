# FanConnect - Content Creator Platform

A modern, responsive content creator platform built with Next.js 14, TypeScript, and Tailwind CSS. Similar to OnlyFans, this platform allows creators to monetize their content through subscriptions and pay-per-view posts.

## 🚀 Features

### For Users
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🔐 Authentication (Login/Signup)
- 🏠 Personalized feed with creator content
- 💬 Real-time messaging system
- 🔖 Save and bookmark favorite posts
- 🔔 Notifications for updates
- 👤 User profiles with customization
- 💳 Subscription management

### For Creators
- 📊 Creator dashboard with analytics
- 📤 Upload content (images, videos)
- 🔒 Lock content for subscribers only
- 💰 Earnings tracking and payouts
- 👥 Subscriber management
- 💵 Pay-per-view (PPV) content pricing
- 📈 Engagement metrics

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: Zustand
- **Form Validation**: Zod + React Hook Form
- **Date Handling**: date-fns

## 📁 Project Structure
```
fanconnect-web/
├── app/
│   ├── (auth)/           # Authentication routes
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/           # Main app routes
│   │   ├── feed/
│   │   ├── explore/
│   │   ├── messages/
│   │   ├── subscriptions/
│   │   ├── settings/
│   │   ├── saved/
│   │   └── [username]/   # Dynamic user profiles
│   ├── creator/          # Creator-specific routes
│   │   ├── dashboard/
│   │   ├── upload/
│   │   ├── earnings/
│   │   └── subscribers/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   └── mobile-nav.tsx
│   ├── feed/
│   │   ├── post-card.tsx
│   │   └── create-post.tsx
│   └── ...
├── lib/
│   ├── utils.ts
│   ├── store.ts          # Zustand store
│   └── validations.ts    # Zod schemas
├── types/
│   └── index.ts
└── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd fanconnect-web
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Pages & Routes

### Public Routes
- `/` - Home (redirects to feed)
- `/login` - Login page
- `/signup` - Signup page
- `/[username]` - User profile pages

### Authenticated Routes
- `/feed` - Main content feed
- `/explore` - Discover new creators
- `/messages` - Direct messaging
- `/subscriptions` - Manage subscriptions
- `/settings` - Account settings
- `/saved` - Saved posts

### Creator Routes
- `/creator/dashboard` - Analytics & overview
- `/creator/upload` - Upload new content
- `/creator/earnings` - Revenue tracking
- `/creator/subscribers` - Subscriber management

## 🎨 Design Features

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- **Mobile Navigation**: Bottom tab bar for mobile
- **Desktop Navigation**: Sidebar + top navbar

### Dark Mode Support
- Built-in dark mode support via Tailwind CSS
- Toggleable in settings (coming soon)

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader friendly

## 🔧 Configuration

### Tailwind Config
Located in `tailwind.config.ts` - customize colors, fonts, and theme variables.

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_STRIPE_KEY=your_stripe_key
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Other Platforms
Build the production bundle:
```bash
npm run build
npm start
```

## 📝 Future Enhancements

- [ ] Real-time notifications
- [ ] Video streaming
- [ ] Live streaming
- [ ] Payment integration (Stripe)
- [ ] Advanced analytics
- [ ] Content recommendations
- [ ] Multi-tier subscriptions
- [ ] Custom subscription tiers
- [ ] Creator verification system
- [ ] Advanced search and filters
- [ ] Content moderation tools
- [ ] Mobile apps (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Built with ❤️ by Your Name

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
