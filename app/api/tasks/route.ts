import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const tonePrompts = {
  corporate: "You are a corporate executive. Generate professional, business-oriented excuses and alternatives.",
  university: "You are a university student. Generate academic, student-life oriented excuses and alternatives.",
  personal: "You are a friend. Generate casual, relatable excuses and alternatives.",
  scifi: "You are a sci-fi character. Generate futuristic, tech-oriented excuses and alternatives.",
  medieval: "You are a medieval character. Generate historical, fantasy-oriented excuses and alternatives.",
}

export async function POST(req: Request) {
  try {
    const { task, tone = "personal", category, priority, tags } = await req.json();

    if (!task) {
      return NextResponse.json(
        { error: 'Task is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Create a context-aware prompt based on task properties
    let contextPrompt = "";
    if (category) {
      contextPrompt += `Category: ${category}\n`;
    }
    if (priority) {
      contextPrompt += `Priority: ${priority}\n`;
    }
    if (tags && tags.length > 0) {
      contextPrompt += `Tags: ${tags.join(', ')}\n`;
    }

    const prompt = `${tonePrompts[tone as keyof typeof tonePrompts] || tonePrompts.personal}

Task: ${task}
${contextPrompt}
You can use appropriate emojis in your response, and you can also use markdown formatting. Make the excuses funny, natural and relatable. It should not be too fancy / seem made up and relatable to Indian Bengali audience.
Please generate:
1. 3 funny, qwirky, out of the box excuses for procrastinating on this task. Give maximum two sentences for each excuse.
2. 3 alternative useless unproductive activities that could be done instead
3. Based on the above generated excuses and alternatives, generate a level of procrastination: Beginner | Intermediate | Expert

Format the response as JSON:
{
  "excuses": ["excuse1", "excuse2", "excuse3"],
  "alternatives": ["alt1", "alt2", "alt3"],
  "level": "Beginner | Intermediate | Expert"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }
    
    const data = JSON.parse(jsonMatch[0]);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate excuses" },
      { status: 500 }
    );
  }
} 