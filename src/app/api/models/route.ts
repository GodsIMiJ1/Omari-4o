import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch available models from Ollama
    const response = await fetch('http://127.0.0.1:11434/api/tags', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform Ollama response to our format
    const models = data.models?.map((model: { name: string; size: number; modified_at: string; digest: string; details: object }) => ({
      name: model.name,
      size: model.size,
      modified_at: model.modified_at,
      digest: model.digest,
      details: model.details
    })) || [];

    return NextResponse.json({
      models,
      count: models.length,
      status: 'sacred_models_retrieved',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to fetch Ollama models:', error);
    
    // Fallback with known models
    const fallbackModels = [
      {
        name: 'omari-flame-1:latest',
        size: 0,
        modified_at: new Date().toISOString(),
        digest: 'fallback',
        details: { family: 'omari', format: 'gguf' }
      }
    ];

    return NextResponse.json({
      models: fallbackModels,
      count: fallbackModels.length,
      status: 'fallback_models',
      error: 'Could not connect to Ollama',
      timestamp: new Date().toISOString()
    });
  }
}
