
import React, { useState, useEffect, useCallback } from 'react';
import { generateImageFromPrompt } from './services/geminiService';
import Spinner from './components/Spinner';
import ImageIcon from './components/icons/ImageIcon';

const DEBOUNCE_DELAY = 1000; // 1 second

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async (currentPrompt: string) => {
    if (!currentPrompt.trim()) {
        setGeneratedImage(null);
        setError(null);
        return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const imageUrl = await generateImageFromPrompt(currentPrompt);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setGeneratedImage(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (prompt) {
        handleGenerateImage(prompt);
      } else {
        // Clear everything if prompt is empty
        setGeneratedImage(null);
        setError(null);
        setIsLoading(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [prompt, handleGenerateImage]);


  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            AI Image Generator
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Describe an image, and watch it come to life automatically.
          </p>
        </header>

        <main className="flex flex-col md:flex-row gap-8">
          {/* Input Section */}
          <div className="w-full md:w-1/3 flex flex-col">
            <label htmlFor="prompt-input" className="text-lg font-semibold mb-2 text-gray-300">
              Your Prompt
            </label>
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic cityscape at sunset, with flying cars and neon lights..."
              className="w-full h-48 p-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white placeholder-gray-500 resize-none"
            />
          </div>

          {/* Image Display Section */}
          <div className="w-full md:w-2/3">
            <div className="aspect-square bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-10">
                  <Spinner />
                  <p className="mt-4 text-lg font-semibold animate-pulse">Generating your masterpiece...</p>
                </div>
              )}
              {error && !isLoading && (
                <div className="text-center p-4">
                  <p className="text-red-400 font-semibold">Error</p>
                  <p className="text-gray-400 mt-2">{error}</p>
                </div>
              )}
              {!isLoading && !error && generatedImage && (
                <img
                  src={generatedImage}
                  alt={prompt}
                  className="w-full h-full object-contain transition-opacity duration-500 ease-in-out opacity-100"
                />
              )}
              {!isLoading && !error && !generatedImage && (
                <div className="text-center text-gray-500">
                  <ImageIcon className="w-24 h-24 mx-auto mb-4" />
                  <p className="text-xl font-medium">Your generated image will appear here</p>
                  <p className="text-sm">Start typing a prompt to begin</p>
                </div>
              )}
            </div>
          </div>
        </main>
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
