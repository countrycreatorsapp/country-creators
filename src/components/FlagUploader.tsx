import React, { useState } from 'react';
import { uploadNationFlag } from '../lib/supabase';

export default function FlagUploader({ passcode, currentFlag, onFlagUpdate }: { passcode: string, currentFlag?: string, onFlagUpdate: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Quick validation
    if (file.size > 2 * 1024 * 1024) {
      setError('File too big. Keep it under 2MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Only image files (PNG, JPG) are allowed.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const updatedNation = await uploadNationFlag(passcode, file);
      onFlagUpdate(updatedNation.flag_url);
    } catch (err: any) {
      console.error(err);
      setError('Upload failed. Try again.');
    }
    
    setUploading(false);
  };

  return (
    <div className="flex items-center space-x-6 bg-slate-900/60 p-4 rounded-xl border border-slate-800 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      {/* Flag Display */}
      <div className="w-24 h-16 rounded-md overflow-hidden bg-slate-800 border-2 border-slate-700 flex items-center justify-center shrink-0">
        {currentFlag ? (
          <img src={currentFlag} alt="Nation Flag" className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl opacity-50">🏴</span>
        )}
      </div>

      {/* Uploader Controls */}
      <div className="flex-1">
        <h3 className="text-sm font-bold text-white mb-1">National Flag</h3>
        <p className="text-xs text-slate-400 mb-3">
          Upload your custom flag to build national pride. Keep it appropriate!
        </p>
        
        <div className="relative">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
          />
          <button 
            disabled={uploading}
            className="bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 py-2 px-4 rounded-lg border border-slate-600 transition-colors"
          >
            {uploading ? 'Hoisting Flag...' : 'Upload Image (Max 2MB)'}
          </button>
        </div>
        
        {error && <p className="text-xs text-rose-400 mt-2 font-bold animate-pulse">{error}</p>}
      </div>
    </div>
  );
}