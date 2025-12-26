import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
}

export const isAIConfigured = () => !!model;

export async function suggestPriority(text: string): Promise<'low' | 'medium' | 'high'> {
    if (!model) return 'medium';

    try {
        const prompt = `You are a task management assistant. Analyze the following task description and suggest a priority level (low, medium, high). Strictly return only one word: "low", "medium", or "high".
    
    Task: ${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const priority = response.text().toLowerCase().trim();

        if (priority === 'high' || priority === 'medium' || priority === 'low') {
            return priority;
        }
        return 'medium';
    } catch (error) {
        console.error('Error suggesting priority:', error);
        return 'medium';
    }
}

export async function suggestDeadline(text: string): Promise<string | null> {
    if (!model) return null;

    try {
        const prompt = `Analyze the following task description and extract an implied deadline if present. Return the date in YYYY-MM-DD format. If no deadline is implied, strictly return the string "null".
    
    Current Date: ${new Date().toISOString().split('T')[0]}
    Task: ${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const deadline = response.text().trim();

        if (deadline && deadline !== 'null' && /^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
            return deadline;
        }
        return null;
    } catch (error) {
        console.error('Error suggesting deadline:', error);
        return null;
    }
}

export async function generateSubtasks(text: string): Promise<string[]> {
    if (!model) return [];

    try {
        const prompt = `Break down the following task into 3-5 actionable subtasks. Return them as a valid JSON array of strings. Do not include markdown formatting like \`\`\`json.
    
    Task: ${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let content = response.text().trim();

        // Clean up markdown code blocks if present
        content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');

        if (content) {
            try {
                const parsed = JSON.parse(content);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {
                // Fallback: split by newlines if JSON parsing fails
                return content.split('\n').map((line: string) => line.replace(/^-\s*/, '').trim()).filter(Boolean);
            }
        }
        return [];
    } catch (error) {
        console.error('Error generating subtasks:', error);
        return [];
    }
}

export async function generateDailySummary(tasks: any[]): Promise<string> {
    if (!model) return '';

    try {
        const taskList = tasks.map((t: any) => `- ${t.title} (Priority: ${t.priority}, Due: ${t.deadline || 'None'})`).join('\n');
        const prompt = `You are a helpful assistant. Provide a encouraging daily summary for the user based on their tasks. Highlight high priority items and immediate deadlines. Keep it brief (2-3 sentences).
    
    Tasks:
    ${taskList}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error('Error generating summary:', error);
        return '';
    }
}
