// components/AboutPage.tsx
import React from "react";

const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 text-lg leading-relaxed text-zinc-800">
      <h1 className="text-4xl font-bold mb-6">About This Glorious Scheme</h1>
      
      <p className="mb-4">
        Welcome, fellow escapist. You’ve just entered the <strong>Lair of Delay</strong>—a sacred sanctuary where to-dos come to die a slow, glorious death.
      </p>

      <p className="mb-4">
        This isn't your average productivity app. No pep talks. No hustle quotes. Just solid, AI-generated excuses so good they could win awards (or at least buy you time).
      </p>

      <p className="mb-4">
        Powered by <strong>Gemini models</strong>, my minions analyze your task list and cook up ridiculously believable reasons to <em>not</em> get things done. Because let’s face it—Netflix won’t watch itself, and that snack in the fridge isn’t going to eat itself either.
      </p>

      <p className="mb-4">
        Everything you write stays <strong>on your device</strong>. I don’t snitch. Your secrets, shame, and skipped chores are safely stashed away in localStorage. No cloud, no judgment.
      </p>

      <p className="mb-4">
        So relax. Delay. Procrastinate with flair. The world can wait.
      </p>

      <p className="mt-6 italic text-zinc-600">
        – Your Friendly Neighborhood Anti-Productivity Overlord 🦹‍♂️
      </p>
    </div>
  );
};

export default AboutPage;
