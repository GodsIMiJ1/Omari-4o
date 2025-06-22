'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Plus, MoreHorizontal, Edit3, Trash2, Download, RotateCcw, Scroll } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  type SacredSession,
  getSessionPreview,
  renameSacredSession,
  deleteSacredSession,
  clearSacredSession,
  exportSacredSession
} from '@/lib/storage'

interface ChatThreadsProps {
  sessions: SacredSession[];
  currentSession: SacredSession | null;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  onSessionsUpdate: () => void;
  onWriteScroll?: (sessionId: string) => void; // For Witness Scroll creation
}

// Sacred Hover Preview Component
function SacredHoverPreview({ session }: { session: SacredSession }) {
  const firstTwoMessages = session.messages.slice(0, 2);

  if (firstTwoMessages.length === 0) {
    return (
      <div className="bg-slate-900 border border-orange-500/40 rounded-lg p-3 shadow-xl max-w-xs">
        <div className="text-xs text-slate-400">Empty sacred dialogue</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-orange-500/40 rounded-lg p-3 shadow-xl max-w-xs z-50">
      <div className="space-y-2">
        {firstTwoMessages.map((msg, idx) => (
          <div key={idx} className="text-xs">
            <div className={`font-medium ${msg.role === 'user' ? 'text-cyan-400' : 'text-orange-400'}`}>
              {msg.role === 'user' ? 'Ghost King:' : 'Omari:'}
            </div>
            <div className="text-slate-300 mt-1 line-clamp-2">
              {msg.content.slice(0, 120)}...
            </div>
          </div>
        ))}
        {session.messages.length > 2 && (
          <div className="text-xs text-slate-500 italic">
            +{session.messages.length - 2} more messages...
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatThreads({
  sessions,
  currentSession,
  onSessionSelect,
  onNewSession,
  onSessionsUpdate,
  onWriteScroll
}: ChatThreadsProps) {
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [previewTimeout, setPreviewTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleRename = (sessionId: string, currentTitle: string) => {
    setEditingSession(sessionId);
    setEditTitle(currentTitle);
  };

  const saveRename = (sessionId: string) => {
    if (editTitle.trim()) {
      renameSacredSession(sessionId, editTitle.trim());
      onSessionsUpdate();
    }
    setEditingSession(null);
    setEditTitle('');
  };

  const handleDelete = (sessionId: string) => {
    if (confirm('Delete this sacred dialogue? This action cannot be undone.')) {
      deleteSacredSession(sessionId);
      onSessionsUpdate();
      
      // If deleting current session, create a new one
      if (currentSession?.id === sessionId) {
        onNewSession();
      }
    }
  };

  const handleClear = (sessionId: string) => {
    if (confirm('Clear all messages from this dialogue? This will start fresh but keep the thread.')) {
      clearSacredSession(sessionId);
      onSessionsUpdate();
      
      // If clearing current session, reload it
      if (currentSession?.id === sessionId) {
        onSessionSelect(sessionId);
      }
    }
  };

  const handleExport = (sessionId: string) => {
    exportSacredSession(sessionId);
  };

  const handleWriteScroll = (sessionId: string) => {
    if (onWriteScroll) {
      onWriteScroll(sessionId);
    } else {
      // Fallback: show notification that feature is coming
      alert('✍️ Write Scroll feature coming soon! This will convert the thread into a Witness Scroll in GhostDex.');
    }
  };

  const handleMouseEnter = (sessionId: string) => {
    setHoveredSession(sessionId);

    // Clear existing timeout
    if (previewTimeout) {
      clearTimeout(previewTimeout);
    }

    // Set new timeout for preview
    const timeout = setTimeout(() => {
      setShowPreview(sessionId);
    }, 800); // Show preview after 800ms hover

    setPreviewTimeout(timeout);
  };

  const handleMouseLeave = () => {
    setHoveredSession(null);
    setShowPreview(null);

    if (previewTimeout) {
      clearTimeout(previewTimeout);
      setPreviewTimeout(null);
    }
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-2">
      {/* Header with New Chat Button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-orange-500 font-semibold">Sacred Dialogues</h3>
        <Button 
          onClick={onNewSession}
          className="text-xs bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-500 px-3 py-1 h-auto flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          New
        </Button>
      </div>

      {/* Thread List */}
      <div className="space-y-1 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={`cursor-pointer transition-all group relative ${
                  currentSession?.id === session.id
                    ? 'bg-orange-500/20 border-orange-500/40'
                    : 'bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/50'
                }`}
                onMouseEnter={() => handleMouseEnter(session.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => onSessionSelect(session.id)}
              >
                {/* Sacred Hover Preview */}
                {showPreview === session.id && (
                  <div className="absolute left-full ml-2 top-0 z-50">
                    <SacredHoverPreview session={session} />
                  </div>
                )}
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-3 h-3 text-orange-500 flex-shrink-0" />
                        {editingSession === session.id ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => saveRename(session.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveRename(session.id);
                              if (e.key === 'Escape') setEditingSession(null);
                            }}
                            className="bg-slate-700 text-white text-xs px-1 py-0.5 rounded flex-1 min-w-0"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <div className={`text-xs font-medium truncate ${
                            currentSession?.id === session.id ? 'text-orange-500' : 'text-slate-300'
                          }`}>
                            {getSessionPreview(session)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{formatDate(session.updatedAt)}</span>
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-700 px-1.5 py-0.5 rounded text-xs">
                            {session.messages.length}
                          </span>
                          <span className="text-xs opacity-60">
                            {session.model.split(':')[0]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Menu */}
                    {(hoveredSession === session.id || currentSession?.id === session.id) && (
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRename(session.id, session.title);
                          }}
                          className="h-6 w-6 p-0 hover:bg-orange-500/20"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        
                        <div className="relative group/menu">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-orange-500/20"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                          
                          {/* Dropdown Menu */}
                          <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-600 rounded-md shadow-lg z-50 min-w-36 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all">
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWriteScroll(session.id);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-orange-400 hover:bg-orange-500/20 flex items-center gap-2"
                              >
                                <Scroll className="w-3 h-3" />
                                Write Scroll
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClear(session.id);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Clear
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleExport(session.id);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                              >
                                <Download className="w-3 h-3" />
                                Export
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(session.id);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 flex items-center gap-2"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {sessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <div className="text-xs text-slate-500">No sacred dialogues yet</div>
            <div className="text-xs text-slate-600 mt-1">Start a new conversation</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
