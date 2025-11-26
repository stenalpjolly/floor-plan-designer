'use client';

import React, { useState } from 'react';

interface PromptModalProps {
  isOpen: boolean;
  onGenerate: (prompt: string) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

const SAMPLE_PROMPTS = [
  "A 2-bedroom apartment with an open kitchen and large balcony",
  "A small studio apartment with a separate bathroom",
  "A spacious 3-bedroom house with a master suite and study room",
  "A cozy 1-bedroom flat with a dining area"
];

const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onGenerate, onClose, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Design Your Floor Plan</h2>
          <p className="text-gray-500 text-lg">Describe your dream layout and let AI generate it for you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A modern 2-bedroom apartment with a large living room connecting to an open kitchen..."
              className="w-full h-40 p-5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none text-gray-700 text-lg shadow-sm transition-all duration-200 ease-in-out placeholder:text-gray-400"
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg backdrop-blur-[1px]">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-2"></div>
                  <span className="text-sm font-medium text-blue-700">Generating layout...</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md text-lg"
            >
              {isLoading ? 'Generating...' : 'Generate Plan'}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">Try these examples:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SAMPLE_PROMPTS.map((sample, index) => (
              <button
                key={index}
                onClick={() => setPrompt(sample)}
                disabled={isLoading}
                className="text-left px-4 py-3 text-sm text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors border border-transparent hover:border-blue-100 disabled:opacity-50"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;