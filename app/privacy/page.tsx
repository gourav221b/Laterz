// components/PrivacyPolicyPage.tsx
import React from "react";

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 text-zinc-800">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        Your privacy matters—and we mean that. This application is intentionally built to work without sending your data to any server, third party, or ominous corporate overlord.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Local-Only Storage</h2>
      <p className="mb-4">
        All tasks, excuses, and related data are stored <strong>only</strong> in your browser’s <strong>localStorage</strong>. That means it never leaves your device. We do not collect, store, or access any of your information.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. No Tracking</h2>
      <p className="mb-4">
        There are no trackers, analytics tools, or cookies running in the background. What you do here is your business—and we’re not in the business of spying.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. AI Excuses (Client-Side Only)</h2>
      <p className="mb-4">
        The app uses Gemini models, but the prompts you write and the tasks you enter are processed locally or via sandboxed environments that do not retain or link data to you. No task content is logged or associated with any user.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Your Control</h2>
      <p className="mb-4">
        You’re in full control of your data. Clear your browser storage, and everything vanishes—just like your motivation on a Monday morning.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. No Account, No Risk</h2>
      <p className="mb-4">
        We don’t ask for emails, names, or logins. No accounts = no identifiers = no data risk.
      </p>

      <p className="mt-6 text-zinc-600 italic">
        For any questions or if you're just feeling oddly responsible, you can reach out—but trust us, we won't chase you down with newsletters.
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
