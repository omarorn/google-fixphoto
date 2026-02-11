import React, { useState, useRef, useCallback } from 'react';
import { Upload, Wand2, Download, RefreshCw, Eraser, User, Image as ImageIcon, History, AlertCircle, X } from 'lucide-react';
import { Button } from './Button';
import { editImageWithGemini } from '../services/geminiService';
import { ImageFile, ProcessingStatus, QuickPrompt } from '../types';

const QUICK_PROMPTS: QuickPrompt[] = [
  { id: 'restore', label: 'Restore Photo', icon: <History size={16} />, text: 'Restore this old photo, fixing scratches, tears, and fading. Make it look new and high quality.' },
  { id: 'fix', label: 'Enhance Quality', icon: <Wand2 size={16} />, text: 'Enhance the quality of this image, sharpening details, correcting lighting, and removing noise.' },
  { id: 'younger', label: 'Make Younger', icon: <User size={16} />, text: 'Make the person in this photo look significantly younger, keeping their identity recognizable.' },
  { id: 'older', label: 'Make Older', icon: <User size={16} />, text: 'Make the person in this photo look significantly older, with realistic aging effects.' },
  { id: 'colorize', label: 'Colorize', icon: <ImageIcon size={16} />, text: 'Colorize this black and white photo with realistic and vibrant colors.' },
  { id: 'background', label: 'Remove BG', icon: <Eraser size={16} />, text: 'Remove the background of this image and replace it with a solid color or soft blur.' },
];

export const ImageEditor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          setOriginalImage({
            file,
            previewUrl: event.target.result as string,
            base64: event.target.result as string,
            mimeType: file.type
          });
          setGeneratedImage(null);
          setStatus(ProcessingStatus.IDLE);
          setErrorMessage(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleGenerate = async () => {
    if (!originalImage || !prompt) return;

    setStatus(ProcessingStatus.PROCESSING);
    setErrorMessage(null);

    try {
      const resultBase64 = await editImageWithGemini(
        originalImage.base64,
        originalImage.mimeType,
        prompt
      );
      setGeneratedImage(resultBase64);
      setStatus(ProcessingStatus.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setStatus(ProcessingStatus.ERROR);
      setErrorMessage(error.message || "Failed to generate image. Please try again.");
    }
  };

  const handleQuickPrompt = (text: string) => {
    setPrompt(text);
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `nano-banana-edit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setPrompt('');
    setStatus(ProcessingStatus.IDLE);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-6 max-w-7xl mx-auto">
      {/* Left Panel: Controls */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="bg-dark-800 rounded-xl p-6 shadow-xl border border-dark-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Wand2 className="text-banana-500" />
            Editor Controls
          </h2>
          
          <div className="space-y-4">
             {/* Upload Area */}
            {!originalImage ? (
              <div 
                onClick={handleUploadClick}
                className="border-2 border-dashed border-dark-600 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-banana-500 hover:bg-dark-700 transition-all group"
              >
                <Upload className="text-gray-400 group-hover:text-banana-500 mb-2 transition-colors" size={32} />
                <p className="text-gray-400 text-center font-medium group-hover:text-white transition-colors">Click to upload an image</p>
                <p className="text-gray-600 text-sm text-center mt-1">JPG, PNG supported</p>
              </div>
            ) : (
              <div className="relative group rounded-xl overflow-hidden border border-dark-600">
                <img src={originalImage.previewUrl} alt="Original" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary" onClick={handleReset}>
                    <RefreshCw size={16} /> Change Image
                  </Button>
                </div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Instructions</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how to change the image (e.g., 'Add a neon glow', 'Remove the dog')"
                className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white placeholder-gray-600 focus:ring-2 focus:ring-banana-500 focus:border-transparent outline-none resize-none h-32"
              />
            </div>

            {/* Quick Actions */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider text-xs">Quick Actions</label>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((qp) => (
                  <button
                    key={qp.id}
                    onClick={() => handleQuickPrompt(qp.text)}
                    className="flex items-center gap-2 px-3 py-2 bg-dark-700 hover:bg-dark-600 rounded-md text-sm text-gray-300 hover:text-white transition-colors text-left"
                  >
                    <span className="text-banana-500">{qp.icon}</span>
                    {qp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <Button 
              onClick={handleGenerate} 
              disabled={!originalImage || !prompt} 
              isLoading={status === ProcessingStatus.PROCESSING}
              className="w-full py-3 text-lg"
            >
              Generate Image
            </Button>

            {errorMessage && (
              <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-3 rounded-lg flex items-start gap-2 text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="w-full lg:w-2/3 bg-dark-800 rounded-xl p-6 shadow-xl border border-dark-700 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Preview</h2>
          {generatedImage && (
            <Button variant="ghost" onClick={handleDownload} className="text-banana-500 hover:text-banana-400">
              <Download size={18} /> Download
            </Button>
          )}
        </div>

        <div className="flex-1 bg-dark-900 rounded-lg border-2 border-dashed border-dark-700 relative overflow-hidden flex items-center justify-center min-h-[400px]">
          {!originalImage ? (
            <div className="text-center p-6">
              <ImageIcon className="mx-auto text-dark-700 mb-4" size={64} />
              <p className="text-gray-600">Upload an image to start editing</p>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center p-4">
               {/* Comparison View or Single View */}
               {status === ProcessingStatus.PROCESSING ? (
                 <div className="absolute inset-0 z-10 bg-dark-900/80 backdrop-blur-sm flex flex-col items-center justify-center">
                   <div className="w-16 h-16 border-4 border-banana-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                   <p className="text-banana-100 font-medium animate-pulse">Banana magic in progress...</p>
                 </div>
               ) : null}
               
               {generatedImage ? (
                 <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain rounded shadow-lg" />
               ) : (
                 <img src={originalImage.previewUrl} alt="Original" className="max-w-full max-h-full object-contain rounded opacity-50 blur-sm" />
               )}
            </div>
          )}
        </div>
        
        {generatedImage && (
          <div className="mt-4 flex justify-end gap-2">
             <Button variant="ghost" onClick={() => setGeneratedImage(null)}>
               <X size={16} /> Discard Result
             </Button>
          </div>
        )}
      </div>
    </div>
  );
};
