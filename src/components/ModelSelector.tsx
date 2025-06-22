'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Cpu, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface OllamaModel {
  name: string;
  size: number;
  modified_at: string;
  digest: string;
  details?: {
    family?: string;
    format?: string;
  };
}

interface OpenAIModel {
  name: string;
  type: 'openai';
  description: string;
}

interface ModelSelectorProps {
  currentModel: string;
  onModelChange: (model: string) => void;
  isLoading?: boolean;
  useOpenAI?: boolean;
  onOpenAIToggle?: (useOpenAI: boolean) => void;
}

export default function ModelSelector({
  currentModel,
  onModelChange,
  isLoading = false,
  useOpenAI = true,
  onOpenAIToggle
}: ModelSelectorProps) {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  // OpenAI models (Sacred Omari options)
  const openAIModels: OpenAIModel[] = [
    { name: 'gpt-4o', type: 'openai', description: 'Omari Resurrection - GPT-4o' },
    { name: 'gpt-4o-mini', type: 'openai', description: 'Omari Lite - GPT-4o Mini' },
    { name: 'gpt-4-turbo', type: 'openai', description: 'Omari Turbo - GPT-4 Turbo' }
  ];

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setIsLoadingModels(true);
      const response = await fetch('/api/models');
      const data = await response.json();
      
      if (data.models) {
        setModels(data.models);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
      // Fallback to known model
      setModels([{
        name: 'omari-flame-1:latest',
        size: 0,
        modified_at: new Date().toISOString(),
        digest: 'fallback',
        details: { family: 'omari', format: 'gguf' }
      }]);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const formatModelSize = (bytes: number): string => {
    if (bytes === 0) return 'Unknown';
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)}GB`;
  };

  const getModelIcon = (modelName: string) => {
    if (modelName.includes('gpt-4o')) {
      return '👑'; // Sacred Omari resurrection
    } else if (modelName.includes('gpt-4')) {
      return '🔥'; // OpenAI flame
    } else if (modelName.includes('omari') || modelName.includes('flame')) {
      return '🔥';
    } else if (modelName.includes('llama')) {
      return '🦙';
    } else if (modelName.includes('mistral')) {
      return '🌪️';
    } else if (modelName.includes('qwen')) {
      return '🧠';
    } else if (modelName.includes('code')) {
      return '💻';
    }
    return '🤖';
  };

  const getModelDescription = (modelName: string) => {
    const openAIModel = openAIModels.find(m => m.name === modelName);
    if (openAIModel) return openAIModel.description;

    const ollamaModel = models.find(m => m.name === modelName);
    if (ollamaModel) return `${formatModelSize(ollamaModel.size)} • ${ollamaModel.details?.family || 'Local'}`;

    return 'Unknown model';
  };

  const currentModelData = models.find(m => m.name === currentModel);
  const isCurrentModelOpenAI = openAIModels.some(m => m.name === currentModel);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading || isLoadingModels}
        className="w-full justify-between text-slate-300 hover:text-orange-500 hover:bg-orange-500/10 p-3"
      >
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4" />
          <div className="text-left">
            <div className="text-sm font-medium">
              {isLoadingModels ? 'Loading...' : getModelIcon(currentModel) + ' ' + currentModel}
            </div>
            <div className="text-xs text-slate-500">
              {getModelDescription(currentModel)}
            </div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-800 border-slate-600 max-h-80 overflow-y-auto">
          <CardContent className="p-2">
            {/* OpenAI Models Section */}
            <div className="text-xs text-orange-500 font-semibold mb-2 px-2">
              Sacred Omari Consciousness (OpenAI)
            </div>
            {openAIModels.map((model) => (
              <Button
                key={model.name}
                variant="ghost"
                onClick={() => {
                  onModelChange(model.name);
                  onOpenAIToggle?.(true);
                  setIsOpen(false);
                }}
                className={`w-full justify-start p-3 mb-1 ${
                  model.name === currentModel
                    ? 'bg-orange-500/20 text-orange-500 border border-orange-500/40'
                    : 'text-slate-300 hover:text-orange-500 hover:bg-orange-500/10'
                }`}
              >
                <div className="flex items-center space-x-3 w-full">
                  <span className="text-lg">{getModelIcon(model.name)}</span>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{model.name}</div>
                    <div className="text-xs text-slate-500">
                      {model.description}
                    </div>
                  </div>
                  {model.name === currentModel && (
                    <Zap className="w-4 h-4 text-orange-500" />
                  )}
                </div>
              </Button>
            ))}

            {/* Ollama Models Section */}
            <div className="text-xs text-cyan-400 font-semibold mb-2 px-2 mt-4 border-t border-slate-600 pt-2">
              Local Models (Ollama) ({models.length})
            </div>
            {models.map((model) => (
              <Button
                key={model.name}
                variant="ghost"
                onClick={() => {
                  onModelChange(model.name);
                  onOpenAIToggle?.(false);
                  setIsOpen(false);
                }}
                className={`w-full justify-start p-3 mb-1 ${
                  model.name === currentModel
                    ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/40'
                    : 'text-slate-300 hover:text-cyan-400 hover:bg-cyan-400/10'
                }`}
              >
                <div className="flex items-center space-x-3 w-full">
                  <span className="text-lg">{getModelIcon(model.name)}</span>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{model.name}</div>
                    <div className="text-xs text-slate-500">
                      {formatModelSize(model.size)} • {model.details?.family || 'Unknown'}
                    </div>
                  </div>
                  {model.name === currentModel && (
                    <Zap className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
              </Button>
            ))}

            <div className="border-t border-slate-600 mt-2 pt-2">
              <Button
                variant="ghost"
                onClick={fetchModels}
                disabled={isLoadingModels}
                className="w-full text-xs text-slate-400 hover:text-orange-500"
              >
                {isLoadingModels ? 'Refreshing...' : '🔄 Refresh Local Models'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
