# AI Personal Finance Fixer (Micro-Expense Detective) 🔍💰

A smart mobile application that automatically detects wasteful spending, identifies subscription leaks, and suggests money-saving alternatives.

## 🎯 Features

- **Smart Leak Detection**: Automatically identifies wasteful spending patterns
- **Subscription Tracker**: Monitor all your subscriptions and detect price increases
- **Transaction Analysis**: View and analyze all your transactions with smart categorization
- **Actionable Insights**: Get personalized suggestions to save money
- **Beautiful UI**: Modern, premium dark mode design with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Clone the repository:
```bash
cd "AI Personal Finance/mobile-app"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📱 App Structure

```
mobile-app/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   └── LeakBadge.js
│   ├── navigation/       # Navigation setup
│   │   └── AppNavigator.js
│   ├── screens/          # Main app screens
│   │   ├── HomeScreen.js
│   │   ├── InsightsScreen.js
│   │   ├── TransactionsScreen.js
│   │   └── SubscriptionsScreen.js
│   ├── services/         # Data services
│   │   └── mockData.js
│   ├── theme/            # Design system
│   │   ├── colors.js
│   │   ├── typography.js
│   │   ├── spacing.js
│   │   └── index.js
│   └── utils/            # Helper functions
│       └── helpers.js
└── App.js               # Root component
```

## 🎨 Design System

The app uses a comprehensive design system with:
- **Dark Mode**: Premium dark theme with vibrant accents
- **Color Palette**: Carefully selected colors for different leak severities
- **Typography**: Consistent font sizes and weights
- **Spacing**: Standardized spacing scale
- **Components**: Reusable, themeable components

## 🔮 Upcoming Features

- [ ] SMS Reading (Android)
- [ ] Screenshot OCR (iOS)
- [ ] Backend Integration
- [ ] AI-powered leak detection
- [ ] Push notifications
- [ ] Budget planning
- [ ] Savings goals

## 📊 Current Status

✅ **Completed:**
- Premium UI/UX design
- Navigation setup
- Home screen with balance overview
- Insights screen with leak analysis
- Transactions screen with search/filter
- Subscriptions screen
- Mock data integration
- Theme system

🚧 **In Progress:**
- Backend API development
- Real SMS parsing
- Database integration

## 🛠️ Tech Stack

- **Framework**: React Native (Expo)
- **Navigation**: React Navigation
- **UI**: Custom components with Expo Linear Gradient
- **Icons**: Expo Vector Icons (Ionicons)
- **State**: React Hooks

## 📝 License

This project is private and proprietary.

## 👨‍💻 Developer

Milton Raj

---

**Note**: This app currently uses mock data for demonstration. Backend integration and real SMS parsing will be implemented in the next phase.
