import { systemPrompt } from "../utils/generateTasksSystemPrompt";

export type Task = {
  category: string;
  tasks: string[];
};

export type TaskResponse = {
  tasks: Task[];
};

const API_KEY = "AIzaSyAPKrAIASBMWDkw3lcB2mOSze4DXikOGv8";
const MODEL_ID = "gemini-pro";

export const useGenerateTaskQuery = () => {
  const generateTasks = async (userPrompt: string): Promise<TaskResponse> => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL_ID}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: systemPrompt }, { text: userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    const rawJsonText = data.candidates[0].content.parts[0].text;
    const sanitizedJsonText = rawJsonText
      .replace(/```[jJ][sS][oO][nN]/, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(sanitizedJsonText) as TaskResponse;
  };

  return { generateTasks };
};
