import React from 'react';
import { ImageEditor } from './components/ImageEditor';
import { Zap } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-dark-700 bg-dark-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-banana-500 p-1.5 rounded-lg">
                <Zap className="text-dark-900 h-6 w-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Nano<span className="text-banana-500">Banana</span></span>
            </div>
            <div className="hidden md:block">
              <span className="text-xs font-mono text-gray-500 border border-dark-600 px-2 py-1 rounded bg-dark-900">
                Powered by Gemini 2.5 Flash Image
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Transform Your Photos with <span className="text-banana-500">AI</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Restore old memories, fix imperfections, age portraits, or create something entirely new using natural language prompts.
          </p>
        </div>
        
        <ImageEditor />
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-700 bg-dark-800 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Nano Banana App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;