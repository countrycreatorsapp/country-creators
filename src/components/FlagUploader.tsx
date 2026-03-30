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
    <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
        <span>🇺🇸</span> Custom Flag Upload
      </h3>
      <p className="text-xs text-slate-400 mb-4 leading-snug">
        Establish national pride by designing and uploading your official flag. Keep it appropriate! (Max size: 2MB).
      </p>
      
      <div className="relative group">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" 
        />
        <button 
          disabled={uploading}
          className={`w-full py-3 rounded-lg font-black text-sm flex justify-center items-center transition-all ${
            uploading 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-md group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]'
          }`}
        >
          {uploading ? 'Hoisting Flag...' : 'Select File to Upload'}
        </button>
      </div>
      
      {error && <p className="text-xs text-rose-400 mt-3 font-bold animate-pulse">{error}</p>}
    </div>
  );
}