# React Native Simple Login/Register with Supabase

A simple React Native application with login and registration functionality using Supabase authentication. This app can be run in a web browser without requiring an emulator.

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Supabase account

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure Supabase:
   - Create a Supabase project at https://supabase.com
   - Get your Supabase URL and anon key from the project settings
   - Open `lib/supabase.js` and replace the placeholder values with your actual Supabase URL and anon key:
     ```js
     const supabaseUrl = "YOUR_SUPABASE_URL";
     const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";
     ```

## Running the app

To run the app in a web browser:

```
npm run web
```

## Features

- User registration with email and password
- User login with email and password
- Authentication state persistence
- Simple navigation between screens

## Project Structure

- `App.js` - Main application entry point
- `lib/supabase.js` - Supabase client configuration
- `app/navigation/AppNavigator.js` - Navigation configuration
- `app/screens/` - Screen components
  - `LoginScreen.js` - Login screen
  - `RegisterScreen.js` - Registration screen
  - `HomeScreen.js` - Home screen (after login)
# react-native-supabase
