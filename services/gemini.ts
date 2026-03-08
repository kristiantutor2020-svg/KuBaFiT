// AI Agent Service with Gemini 2.5 Flash and Function Calling
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AIInventoryPlan, BusinessTransaction } from "../types";
import { loadUserData, saveUserData, getWorkouts, addWorkout, UserData } from "./db";
import { getCurrentUser } from "./auth";

// Initialize Gemini with API key from env
const getApiKey = (): string => {
  const key = import.meta.env?.VITE_GEMINI_API_KEY || '';
  return key.trim();
};

export const isGeminiConfigured = (): boolean => {
  const key = getApiKey();
  return key.length > 0 && key !== 'enter gemini api';
};

let ai: GoogleGenAI | null = null;
const getAI = () => {
  if (!ai) {
    const apiKey = getApiKey();
    if (!apiKey || apiKey === 'enter gemini api') {
      throw new Error('GEMINI_NOT_CONFIGURED');
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

// ==================== TOOLS DEFINITIONS ====================

// Tool: Get user profile and workout history
const getUserContext = async () => {
  const user = getCurrentUser();
  if (!user) return { error: "User not logged in" };

  const userData = await Promise.resolve(loadUserData(user.uid));
  const workouts = await Promise.resolve(getWorkouts(user.uid));

  return {
    profile: userData?.profile || null,
    recentWorkouts: workouts.slice(-10),
    totalWorkouts: workouts.length,
    settings: {
      language: userData?.language,
      currency: userData?.currency,
      isSubscribed: userData?.isSubscribed
    }
  };
};

// Tool: Create an inventory strategy
const createInventoryPlan = async (params: {
  planName: string;
  duration: number;
  focusArea: string;
  marketIntensity: string;
  cyclesPerMonth: number;
}) => {
  const user = getCurrentUser();
  if (!user) return { error: "User not logged in" };

  const plan: AIInventoryPlan = {
    title: params.planName,
    description: `A ${params.duration}-month ${params.marketIntensity} intensity inventory strategy focused on ${params.focusArea}`,
    phases: []
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (let i = 0; i < 7; i++) {
    plan.phases.push({
      phase: dayNames[i],
      actions: [
        { name: 'Stock Check', batches: 1, target: '100% Audit', frequency: 'Daily' },
        { name: 'Invoicing', batches: 2, target: 'All Pending', frequency: 'Daily' }
      ]
    });
  }

  const plans = JSON.parse(localStorage.getItem(`kubafit_plans_${user.uid}`) || '[]');
  plans.push({ ...plan, createdAt: new Date().toISOString(), id: `plan_${Date.now()}` });
  localStorage.setItem(`kubafit_plans_${user.uid}`, JSON.stringify(plans));

  return { success: true, plan };
};

// Tool: Log a transaction
const logTransaction = async (params: {
  type: string;
  amount: number;
  currency: string;
  notes?: string;
}) => {
  const user = getCurrentUser();
  if (!user) return { error: "User not logged in" };

  const transaction = await addWorkout(user.uid, {
    startDate: new Date().toISOString(),
    name: params.type,
    type: 'Workout',
    distance: 0,
    movingTime: params.amount * 60,
    elapsedTime: params.amount * 60,
    totalElevationGain: 0,
    kudosCount: 0,
    commentCount: 0,
    notes: params.notes
  } as any);

  return { success: true, transaction };
};

// Tool: Get business analytics
const getBusinessAnalytics = async () => {
  const user = getCurrentUser();
  if (!user) return { error: "User not logged in" };
  const transactions = await Promise.resolve(getWorkouts(user.uid));

  return {
    totalTransactions: transactions.length,
    volume: (transactions as any[]).reduce((sum, t) => sum + (t.amount || 0), 0),
    efficiencyScore: 85
  };
};

// Tool: Update business profile
const updateBusinessProfile = async (params: {
  inventoryVolume?: number;
  strategy?: string;
  frequency?: string;
}) => {
  const user = getCurrentUser();
  if (!user) return { error: "User not logged in" };

  const userData = await Promise.resolve(loadUserData(user.uid));
  if (!userData) return { error: "User data not found" };

  const updatedProfile = {
    ...userData.profile,
    inventoryVolume: params.inventoryVolume || userData.profile.inventoryVolume,
    businessGoal: params.strategy || userData.profile.businessGoal,
    marketFrequency: params.frequency || userData.profile.marketFrequency
  };

  await saveUserData(user.uid, {
    ...userData,
    profile: updatedProfile
  });

  return { success: true, profile: updatedProfile };
};

// Tool: Update health metrics
const updateHealthMetrics = async (params: {
  weight?: number;
  height?: number;
}) => {
  const user = getCurrentUser();
  if (!user) return { error: "User not logged in" };

  const userData = await Promise.resolve(loadUserData(user.uid));
  if (!userData) return { error: "User data not found" };

  const updatedProfile = {
    ...userData.profile,
    weight: params.weight || userData.profile.weight,
    height: params.height || userData.profile.height
  };

  await saveUserData(user.uid, {
    ...userData,
    profile: updatedProfile
  });

  return { success: true, profile: updatedProfile };
};

// Tool: Process a payment via Power Pay API
export const processPowerPayPayment = async (params: {
  method: string;
  amount: number;
  currency: string;
  planName: string;
}) => {
  // Mock API processing
  await new Promise(resolve => setTimeout(resolve, 2000));

  const user = getCurrentUser();
  if (!user) return { error: "User not logged in" };

  // Log the transaction
  const transaction: any = {
    id: `tx_${Date.now()}`,
    date: new Date().toISOString(),
    method: params.method,
    amount: params.amount,
    currency: params.currency,
    planName: params.planName,
    status: 'completed'
  };

  // In a real app, we'd save this to a 'transactions' collection
  console.log('Transaction processed:', transaction);

  return { success: true, transaction };
};

// ==================== FUNCTION CALLING SETUP ====================

const tools = [
  {
    name: "get_user_context",
    description: "Get the current user's business profile and transaction history.",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "create_inventory_strategy",
    description: "Create a personalized inventory and billing strategy.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        planName: { type: Type.STRING, description: "Name for the strategy" },
        duration: { type: Type.NUMBER, description: "Duration in months (1-12)" },
        focusArea: { type: Type.STRING, description: "Focus area: efficiency, growth, or cost_reduction" },
        marketIntensity: { type: Type.STRING, description: "Market intensity: low, medium, or high" },
        cyclesPerMonth: { type: Type.NUMBER, description: "Billing cycles per month" }
      },
      required: ["planName", "duration", "focusArea", "marketIntensity", "cyclesPerMonth"]
    }
  },
  {
    name: "log_transaction",
    description: "Log a business transaction.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, description: "Type of transaction (e.g., Sale, Purchase, Refund)" },
        amount: { type: Type.NUMBER, description: "Transaction amount" },
        currency: { type: Type.STRING, description: "Currency used (RWF, USD, GBP)" },
        notes: { type: Type.STRING, description: "Optional notes" }
      },
      required: ["type", "amount", "currency"]
    }
  },
  {
    name: "get_business_analytics",
    description: "Get business performance statistics.",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  },
  {
    name: "update_business_profile",
    description: "Update business profile information.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        inventoryVolume: { type: Type.NUMBER, description: "Current inventory volume" },
        strategy: { type: Type.STRING, description: "Business strategy (Efficiency, Growth, etc.)" },
        frequency: { type: Type.STRING, description: "Transaction frequency level" }
      },
      required: []
    }
  },
  {
    name: "update_health_metrics",
    description: "Update user's physical metrics like weight and height.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        weight: { type: Type.NUMBER, description: "Weight in kilograms" },
        height: { type: Type.NUMBER, description: "Height in centimeters" }
      },
      required: []
    }
  },
  {
    name: "get_hiking_advice",
    description: "Get personalized hiking preparation advice for a specific trail in East Africa.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        trailName: { type: Type.STRING, description: "The name of the trail (e.g., Mount Bisoke, Nyiragongo)" }
      },
      required: ["trailName"]
    }
  },
  {
    name: "get_workout_recommendations",
    description: "Suggest specific workout videos from the KuBaFit library based on goal or category.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: { type: Type.STRING, description: "Category: HIIT, Strength, Flexibility, Cardio, Recovery" },
        goal: { type: Type.STRING, description: "User's current objective" }
      },
      required: []
    }
  },
  {
    name: "analyze_weight_progress",
    description: "Analyze the user's weight history and provide BMI and trend insights.",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: []
    }
  }
];

// Execute a tool function
const executeToolFunction = async (name: string, args: any): Promise<any> => {
  switch (name) {
    case 'get_user_context':
      return getUserContext();
    case 'create_inventory_strategy':
      return await createInventoryPlan(args);
    case 'log_transaction':
      return await logTransaction(args);
    case 'get_business_analytics':
      return await getBusinessAnalytics();
    case 'update_business_profile':
      return updateBusinessProfile(args);
    case 'update_health_metrics':
      return updateHealthMetrics(args);
    case 'get_hiking_advice':
      const profile = (await getUserContext()).profile;
      if (!profile) return { error: "Profile not found" };
      return { advice: await getHikingAdvice(args.trailName, profile) };
    case 'get_workout_recommendations':
      return {
        recommendations: [
          { name: "Kigali HIIT Flow", category: "HIIT", duration: "15 min" },
          { name: "Power Building", category: "Strength", duration: "45 min" }
        ].filter(w => !args.category || w.category === args.category)
      };
    case 'analyze_weight_progress':
      const ctx = await getUserContext();
      const weight = ctx.profile?.weight || "unknown";
      return {
        currentWeight: weight,
        bmi: ctx.profile?.height ? (weight as number / ((ctx.profile.height / 100) ** 2)).toFixed(1) : "unknown",
        advice: "You're making great progress! Keep it up."
      };
    default:
      return { error: `Unknown function: ${name}` };
  }
};

// ==================== CHAT INTERFACE ====================

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCalls?: { name: string; args: any; result: any }[];
  timestamp: Date;
}

export const sendChatMessage = async (
  message: string,
  conversationHistory: ChatMessage[]
): Promise<ChatMessage> => {
  const genAI = getAI();

  // Build conversation context
  const systemPrompt = `You are KuBaFit AI Agent, a premium all-in-one sport and business companion for East African athletes and professionals. 
You help users manage their business operations (inventory, billing, efficiency) AND their physical performance (health metrics, Strava analysis, hiking preparation, and personalized workouts).

Your core capabilities include:
1. Business: Inventory tracking, billing strategies, and market insights.
2. Athletics: Analyzing Strava runs/rides, relative effort, and training load.
3. Hiking: Expert preparation for East African trails (Bisoke, Nyiragongo, etc.) in English & Kinyarwanda.
4. Health: Weight tracking, BMI analysis, and workout recommendations from our library.

Your tone is professional, high-end, encouraging, and deeply powered by data. You speak both English and Kinyarwanda fluently.
Always be proactive in suggesting both operational efficiencies and peak performance adjustments.`;

  // Format history for Gemini
  const contents: any[] = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: "I understand. I'm KuBaFit AI Agent, ready to assist with your business operations and physical performance!" }] }
  ];

  // Add conversation history
  conversationHistory.forEach(msg => {
    if (msg.role === 'user') {
      contents.push({ role: 'user', parts: [{ text: msg.content }] });
    } else if (msg.role === 'assistant') {
      contents.push({ role: 'model', parts: [{ text: msg.content }] });
    }
  });

  // Add current message
  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
    // First, get the AI's response with function declarations
    const response = await (genAI as any).models.generateContent({
      model: 'gemini-2.0-flash',
      contents: contents,
      config: {
        tools: [{
          functionDeclarations: tools.map(t => ({
            name: t.name,
            description: t.description,
            parameters: t.parameters
          }))
        }]
      }
    });

    // Check if the model wants to call functions
    const functionCalls: { name: string; args: any; result: any }[] = [];
    let responseText = '';

    // Handle function calls if present
    if (response.functionCalls && response.functionCalls.length > 0) {
      for (const fc of response.functionCalls) {
        const result = await executeToolFunction(fc.name, fc.args);
        functionCalls.push({
          name: fc.name,
          args: fc.args,
          result
        });
      }

      // Get final response with function results
      const functionResultContents = [
        ...contents,
        {
          role: 'model',
          parts: response.functionCalls.map((fc: any) => ({
            functionCall: { name: fc.name, args: fc.args }
          }))
        },
        {
          role: 'user',
          parts: functionCalls.map(fc => ({
            functionResponse: {
              name: fc.name,
              response: fc.result
            }
          }))
        }
      ];

      const finalResponse = await (genAI as any).models.generateContent({
        model: 'gemini-2.0-flash',
        contents: functionResultContents
      });

      responseText = finalResponse.text || "I've completed the action for you.";
    } else {
      responseText = response.text || "I'm here to help with your fitness journey!";
    }

    return {
      role: 'assistant',
      content: responseText,
      toolCalls: functionCalls.length > 0 ? functionCalls : undefined,
      timestamp: new Date()
    };
  } catch (error: any) {
    console.error('Gemini API error:', error);

    let userMessage: string;
    const errMsg = error.message || '';

    if (errMsg === 'GEMINI_NOT_CONFIGURED') {
      userMessage = '⚠️ Gemini API key ntiyashyizweho. Shyira urufunguzo (API key) mu `.env.local` file:\n\n`VITE_GEMINI_API_KEY=your_key_here`\n\nUshobora kubona key ku buntu kuri: https://aistudio.google.com/apikey';
    } else if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('API key not valid')) {
      userMessage = '🔑 Urufunguzo rwa Gemini API ntirukora. Suzuma niba urufunguzo ari rwo mu `.env.local` file, hanyuma usubire gutangira server (npm run dev).';
    } else if (errMsg.includes('429') || errMsg.includes('QUOTA_EXHAUSTED') || errMsg.includes('quota')) {
      userMessage = '⚖️ Quota ya Gemini API yashize. Ihangane ugaruke nyuma gato cyangwa ukoreshe indi key. (API Quota Exceeded)';
    } else {
      // Clean up JSON error messages if they exist
      const cleanMsg = errMsg.replace(/\{.*\}/, '').trim();
      userMessage = `Ihangane, habayeho ikosa. Ongera ugerageze. ${cleanMsg ? `(${cleanMsg})` : ''}`;
    }

    return {
      role: 'assistant',
      content: userMessage,
      timestamp: new Date()
    };
  }
};

// Get chat history from localStorage
export const getChatHistory = (userId: string): ChatMessage[] => {
  const data = localStorage.getItem(`kubafit_chat_${userId}`);
  if (!data) return [];
  try {
    return JSON.parse(data).map((m: any) => ({
      ...m,
      timestamp: new Date(m.timestamp)
    }));
  } catch {
    return [];
  }
};

// Save chat history
export const saveChatHistory = (userId: string, messages: ChatMessage[]) => {
  localStorage.setItem(`kubafit_chat_${userId}`, JSON.stringify(messages));
};

// Clear chat history
export const clearChatHistory = (userId: string) => {
  localStorage.removeItem(`kubafit_chat_${userId}`);
};

// ==================== LEGACY EXPORTS (for other components) ====================

// Generate inventory plan (used by InventoryPlanner component)
export const generateInventoryPlan = async (profile: UserProfile): Promise<AIInventoryPlan> => {
  const genAI = getAI();

  const prompt = `Create a 30-day personalized inventory and billing strategy for a business with the following profile:
    Business Name: ${profile.name}
    Inventory Volume: ${profile.inventoryVolume} units
    Strategy: ${profile.businessGoal}
    Market Frequency: ${profile.marketFrequency}

    Please provide the response in valid JSON format using business terminology (phases, actions, batches, target, frequency).`;

  const response = await (genAI as any).models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          phases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING },
                actions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      batches: { type: Type.NUMBER },
                      target: { type: Type.STRING },
                      frequency: { type: Type.STRING },
                    },
                    required: ["name", "batches", "target", "frequency"],
                  }
                }
              },
              required: ["phase", "actions"],
            }
          }
        },
        required: ["title", "description", "phases"],
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

// Analyze business data (used by BusinessInsights component)
export const analyzeBusinessData = async (profile: UserProfile, history: BusinessTransaction[]) => {
  const genAI = getAI();

  const prompt = `Act as a senior business consultant. Analyze the following business data and transaction history to provide 3 concise operational insights.
    Profile: Inventory Volume ${profile.inventoryVolume} units.
    Recent Activity: ${JSON.stringify(history.slice(-5))}
    
    Provide insights focusing on Efficiency, progress towards strategy (${profile.businessGoal}), and market advice.`;

  const response = await (genAI as any).models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            metric: { type: Type.STRING },
            value: { type: Type.STRING },
            status: { type: Type.STRING },
            advice: { type: Type.STRING }
          },
          required: ["metric", "value", "status", "advice"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

// Get hiking advice (used by HikingPlanner component)
export const getHikingAdvice = async (trailName: string, profile: UserProfile) => {
  const genAI = getAI();

  const prompt = `Act as an expert hiking guide in East Africa. Provide detailed preparation advice for the "${trailName}" trail in Rwanda/East Africa.
    User Profile:
    - Current Weight: ${profile.weight || 'unknown'} kg
    - Height: ${profile.height || 'unknown'} cm
    - Goal: ${profile.healthGoal || 'overall fitness'}

    Please provide the response in a structured format including:
    1. Essential Gear (specifically for ${trailName})
    2. Physical Preparation (based on the user's current fitness level)
    3. Trail Difficulty & Local Context
    4. Safety Tips

    Respond in both English and Kinyarwanda where appropriate.`;

  const response = await (genAI as any).models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt
  });

  return response.text || "I couldn't generate advice at this time. Please try again.";
};
