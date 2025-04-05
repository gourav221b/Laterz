# Laterz App

A fun web application that helps you procrastinate on your tasks by generating creative excuses and alternative activities using AI.

## Features

- Add tasks you should be doing
- Get AI-generated excuses why you shouldn't do them right now
- Get AI-generated alternative activities you could do instead
- Regenerate excuses and alternatives with a single click
- Delete tasks when you're ready to face them

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Google Gemini AI API

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or pnpm
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Laterz.git
   cd Laterz
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Create a `.env.local` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How It Works

1. Enter a task you should be doing in the input field
2. The app will call the Gemini API to generate creative excuses and alternatives
3. View the excuses and alternatives in the task card
4. Click the refresh button to generate new excuses and alternatives
5. Click the trash button to delete the task when you're ready to face it

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This app is for entertainment purposes only
- Please don't use it as an excuse to avoid important responsibilities 