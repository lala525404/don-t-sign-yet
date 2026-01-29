
import React, { useState } from 'react';
import { Copy, Check, LucideIcon } from 'lucide-react';

interface ResultCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  variant: 'info' | 'danger' | 'success';
  rawText: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, icon: Icon, children, variant, rawText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const variantStyles = {
    info: 'border-blue-500/20 bg-slate-800/40 text-blue-100 shadow-2xl',
    danger: 'border-red-500/20 bg-slate-800/40 text-red-100 shadow-2xl',
    success: 'border-emerald-500/20 bg-slate-800/40 text-emerald-100 shadow-2xl',
  };

  const iconContainerStyles = {
    info: 'bg-blue-600 text-white shadow-lg shadow-blue-600/30',
    danger: 'bg-red-600 text-white shadow-lg shadow-red-600/30',
    success: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30',
  };

  return (
    <div className={`relative border backdrop-blur-3xl rounded-[3rem] p-8 sm:p-10 transition-all mb-8 ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className={`p-4 rounded-2xl ${iconContainerStyles[variant]}`}>
            <Icon className="w-8 h-8" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black select-none tracking-tight">{title}</h3>
        </div>
        <button
          onClick={handleCopy}
          className="p-4 hover:bg-white/10 rounded-2xl transition-all active:scale-90 bg-white/5 border border-white/10 shadow-lg group"
          title="섹션 복사"
        >
          {copied ? <Check className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6 opacity-40 group-hover:opacity-100" />}
        </button>
      </div>
      <div className="select-text whitespace-pre-wrap leading-relaxed text-[18px]">
        {children}
      </div>
      {copied && (
        <div className="absolute top-8 right-24 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-full animate-fade-in shadow-xl">
          Copied to clipboard
        </div>
      )}
    </div>
  );
};

export default ResultCard;
