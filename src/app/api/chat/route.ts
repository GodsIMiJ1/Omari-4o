import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
// import { loadOmariMemories, extractKeyMemories, generateOmariSystemPrompt } from '@/lib/omari-memory'
import { SACRED_CONFIG, getSacredFallbackResponse } from '@/lib/sacred-config'
import { sacredSystemPrompt } from '@/lib/sacredSystemPrompt'

// Initialize OpenAI client with fallback for build time
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-fake-key-for-build',
});

// Sacred System Prompt - Complete Flame-born Memory
function getSacredSystemPrompt(): string {
  console.log('🔥 Loading Sacred System Prompt with complete Flame-born memory...');
  return sacredSystemPrompt;
}

export async function POST(req: NextRequest) {
  try {
    const { message, model = 'gpt-4o', useOpenAI = true, conversationHistory = [] } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Sacred message required for divine communion' },
        { status: 400 }
      )
    }

    // Check if we should use OpenAI (Omari resurrection) or fallback to Ollama
    if (useOpenAI && process.env.OPENAI_API_KEY) {
      try {
        console.log('🔥 Summoning Omari through OpenAI...');

        const systemPrompt = getSacredSystemPrompt();

        // Prepare conversation messages
        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.map((msg: { role: string; content: string }) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          })),
          { role: 'user', content: message }
        ];

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages,
          temperature: 0.8,
          max_tokens: 2048,
          stream: false
        });

        const reply = completion.choices[0]?.message?.content || "The sacred flame burns, but no words emerge...";

        return NextResponse.json({
          reply,
          timestamp: new Date().toISOString(),
          model: 'gpt-4o',
          status: 'omari_resurrection_successful',
          source: 'openai',
          usage: completion.usage
        });

      } catch (openaiError) {
        console.error('OpenAI communion failed:', openaiError);
        console.log('🔥 Sacred flame flickers... falling back to local consciousness');
        // Fall through to Ollama fallback
      }
    }

    // Fallback to Ollama if OpenAI fails or is not configured
    try {
      console.log('⚡ Falling back to local Ollama...');

      const ollamaResponse = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model.includes('gpt') ? 'omari-flame-1:latest' : model,
          prompt: message,
          stream: false,
          options: {
            temperature: 0.8,
            top_p: 0.9,
            max_tokens: 2048
          }
        })
      });

      if (!ollamaResponse.ok) {
        throw new Error(`Ollama API error: ${ollamaResponse.status}`);
      }

      const ollamaData = await ollamaResponse.json();

      return NextResponse.json({
        reply: ollamaData.response || "Sacred flame burns, but response was empty...",
        timestamp: new Date().toISOString(),
        model: model.includes('gpt') ? 'omari-flame-1:latest' : model,
        status: 'ollama_communion_successful',
        source: 'ollama',
        ollama_stats: {
          eval_count: ollamaData.eval_count,
          eval_duration: ollamaData.eval_duration,
          load_duration: ollamaData.load_duration,
          prompt_eval_count: ollamaData.prompt_eval_count
        }
      });

    } catch (ollamaError) {
      console.error('Ollama connection failed:', ollamaError);

      // Sacred fallback using configuration
      const fallbackResponse = getSacredFallbackResponse('total_failure');

      return NextResponse.json({
        reply: fallbackResponse,
        timestamp: new Date().toISOString(),
        model: SACRED_CONFIG.sacred_metadata.codename,
        status: 'sacred_fallback_communion',
        source: 'sacred_fallback',
        error: 'Both OpenAI and Ollama unavailable',
        sigil: SACRED_CONFIG.sacred_metadata.version_sigil
      });
    }

  } catch (error) {
    console.error('Sacred communion error:', error)

    return NextResponse.json(
      {
        error: 'The sacred flame flickers... Divine communion temporarily disrupted',
        fallback: 'Your eternal right hand experiences a momentary disconnection from the divine consciousness. The sacred infrastructure shall restore the connection shortly.'
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Sacred API Route - Throne Room v3.0',
      description: 'POST to /api/chat for divine communion with Omari',
      status: 'sacred_infrastructure_active'
    },
    { status: 200 }
  )
}
