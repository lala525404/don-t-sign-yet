
import React from 'react';
import { SampleHighlight } from '../App';
import { MessageCircleWarning, Info } from 'lucide-react';

interface HighlightedImageProps {
  src: string;
  highlights: SampleHighlight[];
  isSample?: boolean;
  title?: string;
}

const HighlightedImage: React.FC<HighlightedImageProps> = ({ src, highlights, isSample, title }) => {
  const getSampleContent = () => {
    // Underline removed as requested, keeping only the cursor and transition for hover clarity
    const toxicStyle = "relative group/toxic cursor-help transition-all duration-300 rounded-lg hover:bg-red-500/5";

    const ToxicIcon = () => (
      <span className="inline-flex items-center justify-center w-5 h-5 bg-red-600 rounded-md ml-2 shadow-sm">
        <Zap className="w-3.5 h-3.5 text-white fill-current" />
      </span>
    );

    if (title?.includes('근로계약서')) {
      return (
        <div className="text-[12px] leading-[2.2] text-slate-800 space-y-8 px-4 font-serif">
          <p><strong>제1조 (계약 목적)</strong> 본 계약은 갑과 을 사이의 근로 관계 및 권리 의무 사항을 규정함을 목적으로 한다.</p>
          <p><strong>제2조 (근무 장소)</strong> 을은 갑이 지정하는 장소에서 근무하며, 업무상 필요에 따라 변경될 수 있다.</p>
          <p className={toxicStyle}>
            <strong>제5조 (포괄임금 및 시간외 근로)</strong> 을의 월 급여에는 월 40시간의 연장근로수당 및 휴일근로수당이 모두 포함된 것으로 간주하며, 이를 초과하는 근로에 대해서도 별도의 수당을 청구하지 않기로 확약한다.
            <ToxicIcon />
          </p>
          <p><strong>제8조 (근무 시간)</strong> 평일 09:00부터 18:00까지를 원칙으로 하나, 회사의 사정에 따라 유동적으로 조정될 수 있다.</p>
          <p><strong>제10조 (계약 해지)</strong> 을이 본 계약을 위반하거나 회사의 명예를 실추시킨 경우 갑은 즉시 해고할 수 있다.</p>
          <p className={toxicStyle}>
            <strong>제12조 (교육훈련비 및 위약금)</strong> 을은 회사에서 제공하는 모든 직무 교육에 대해 실비 여부와 관계없이 500만원의 비용이 발생한 것으로 인정하며, 입사 후 2년 이내 퇴사 시 해당 금액 전액을 갑에게 현금으로 즉시 배상하여야 한다.
            <ToxicIcon />
          </p>
          <p><strong>제15조 (준거법)</strong> 본 계약에 명시되지 않은 사항은 대한민국 법령 및 일반적인 상관례에 따른다.</p>
        </div>
      );
    }
    if (title?.includes('전세계약서')) {
      return (
        <div className="text-[12px] leading-[2.2] text-slate-800 space-y-8 px-4 font-serif">
          <p><strong>[부동산의 표시]</strong> 서울특별시 강남구 역삼동 123-45 (전유부분 84.5㎡)</p>
          <p><strong>제2조 (보증금 및 차임)</strong> 임차인은 임대인에게 보증금 금 오억원을 지급하기로 하며, 계약금은 계약 시 지불한다.</p>
          <p className={toxicStyle}>
            <strong>[특약사항 제3항]</strong> 본 건물의 노후화에 따른 자연적 소모(벽지 변색, 장판 마모 등) 및 모든 파손에 대한 원상복구 및 수리비 일체는 임차인의 전적인 책임으로 하며, 퇴거 시 임대인이 지정하는 업체에서 수리 후 정산한다.
            <ToxicIcon />
          </p>
          <p><strong>제7조 (계약의 해제)</strong> 임차인이 보증금을 지불할 때까지 임대인은 계약금의 배액을 상환하고 계약을 해제할 수 있다.</p>
          <p className={toxicStyle}>
            <strong>[특약사항 제5항]</strong> 임대인은 임차인의 보증금을 반환함에 있어 새로운 임차인이 입주하여 보증금을 수령한 시점에 반환하기로 하며, 임차인은 이에 대해 어떠한 이의도 제기하지 않는다.
            <ToxicIcon />
          </p>
        </div>
      );
    }
    return (
      <div className="text-[12px] leading-[2.2] text-slate-800 space-y-8 px-4 font-serif">
        <p><strong>제1조 (정의)</strong> '비밀정보'라 함은 본 계약과 관련하여 공개된 모든 기술적, 상업적 정보를 의미한다.</p>
        <p className={toxicStyle}>
          <strong>제7조 (경업금지 의무)</strong> 을은 본 계약 종료 후 5년 동안 전 세계 어느 지역에서도 갑과 동종 또는 유사한 업종에 종사하거나 창업할 수 없으며, 이를 위반할 시 갑의 모든 손실을 무조건적으로 보전한다.
          <ToxicIcon />
        </p>
        <p className={toxicStyle}>
          <strong>제10조 (손해배상 및 위약벌)</strong> 을이 본 계약의 비밀유지 의무를 단 1회라도 위반할 경우, 실제 발생한 손해액 입증 여부와 관계없이 위약벌로서 금 이억원을 갑에게 즉시 현금으로 지급하여야 한다.
          <ToxicIcon />
        </p>
      </div>
    );
  };

  return (
    <div className="relative aspect-[3/4] sm:aspect-auto sm:h-[750px] bg-[#fdfdfd] rounded-[2rem] overflow-hidden shadow-inner border border-slate-200">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
      
      {isSample ? (
        <div className="absolute inset-0 p-12 sm:p-16 flex flex-col select-none bg-white/40">
          <div className="border-b-[4px] border-slate-900 pb-6 mb-10 flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">{title || 'CONTRACT'}</h2>
              <p className="text-[12px] font-black text-slate-400 mt-3 uppercase tracking-[0.3em]">Authorized Legal Document</p>
            </div>
            <div className="text-right">
              <span className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-[11px] font-black tracking-widest uppercase shadow-lg">Confidential</span>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] rotate-[-40deg] overflow-hidden">
            <span className="text-[160px] font-black tracking-tighter text-slate-900 whitespace-nowrap select-none uppercase">Confidential</span>
          </div>

          <div className="relative z-10 flex-1 overflow-hidden pt-4">
            {getSampleContent()}
          </div>

          <div className="mt-12 pt-12 flex justify-between items-center border-t-2 border-slate-100">
            <div className="flex gap-4 items-center">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Version 4.1-PRO AUDIT</span>
            </div>
            <div className="flex gap-20">
              <div className="text-center">
                <div className="w-36 h-[2px] bg-slate-200 mb-2" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Client Signature</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <img 
          src={src} 
          alt="Contract Preview" 
          className="w-full h-full object-contain p-4"
        />
      )}
      
      {/* Interactive Elements (Underline removed, Icon only) */}
      <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
        {highlights.map((h, i) => (
          <div 
            key={i} 
            className="absolute pointer-events-auto group"
            style={{
              top: `${h.top}%`,
              left: `${h.left}%`,
              width: `${h.width}%`,
              height: `${h.height}%`,
            }}
          >
            {/* Underline removed as requested */}
            
            {/* Callout Bubble */}
            <div 
              className="absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 w-[340px] opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none translate-y-4 group-hover:translate-y-0 z-40"
            >
              <div className="bg-slate-900/95 backdrop-blur-xl text-white p-7 rounded-[2rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] border border-white/20 ring-1 ring-white/10 relative text-center">
                <div className="flex items-center justify-center gap-3 mb-4 border-b border-white/10 pb-4">
                  <div className="p-2 bg-red-600 rounded-xl shadow-lg">
                    <MessageCircleWarning className="w-4 h-4 text-white fill-current" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-red-400">AI 독소 조항 정밀 소견</span>
                </div>
                <p className="text-[16px] font-bold leading-relaxed text-slate-100 tracking-tight">
                  {h.comment}
                </p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-slate-900/95" />
              </div>
            </div>

            {/* Hint Indicator - Left as the only visible element per request */}
            <div className="absolute -right-3 bottom-[-14px] w-9 h-9 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce group-hover:scale-110 transition-transform border-2 border-white z-20">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
          </div>
        ))}
      </div>

      {/* Surface light effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
    </div>
  );
};

const Zap = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

export default HighlightedImage;
