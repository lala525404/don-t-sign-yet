
import React, { useState, useRef, useCallback } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  Camera,
  ClipboardCheck,
  ChevronLeft,
  FileText,
  Sparkles,
  Zap,
  ShieldAlert,
  HelpCircle,
  Scale,
  MessageSquare,
  ArrowRight,
  Quote,
  Star,
  CheckCircle2,
  BookOpen,
  Gavel,
  Shield,
  FileWarning,
  Users,
  Award,
  Search,
  BookMarked
} from 'lucide-react';
import { AppState, AnalysisResult } from './types';
import { analyzeContract } from './services/geminiService';
import ResultCard from './components/ResultCard';
import HighlightedImage from './components/HighlightedImage';

export interface SampleHighlight {
  top: number;    
  left: number;   
  width: number;  
  height: number; 
  comment: string;
}

interface SampleContract {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  worstCase: string;
  riskLevel: '치명적' | '위험' | '매우 높음';
  riskCount: number;
  mockResult: AnalysisResult;
  highlights: SampleHighlight[];
}

const SAMPLE_CONTRACTS: SampleContract[] = [
  {
    id: 'employment',
    title: '악덕 기업 근로계약서',
    description: '교묘하게 숨겨진 무급 연장근로와 과도한 위약금 조항을 잡아냅니다.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000&auto=format&fit=crop', 
    category: 'HR / 고용',
    worstCase: '퇴사 시 교육비 500만원 배상 조항 발견',
    riskLevel: '매우 높음',
    riskCount: 4,
    mockResult: {
      summary: "이 계약서는 근로자에게 매우 불리한 위약금 조항이 포함되어 있습니다. 퇴사 자유를 제한하고 부당한 비용을 전가하고 있습니다.",
      risks: [
        { clause: "제12조 (교육비 반환): 근로자가 2년 이내 퇴사 시 회사가 지출한 교육훈련비 500만원을 전액 배상한다.", reason: "근로기준법상 위약 예정 금지 원칙에 위배될 소지가 높으며, 근로자의 강제 근로를 유발합니다." },
        { clause: "제5조 (포괄임금): 연장, 야간, 휴일 근로 수당은 월 급여에 모두 포함된 것으로 간주하며 별도 지급하지 않는다.", reason: "실제 근로시간이 포괄수당을 초과할 경우 법적 분쟁의 소지가 크며 공짜 노동을 강요할 위험이 있습니다." }
      ],
      tips: ["위약금 조항 삭제를 요청하세요.", "포괄임금제의 구체적인 수당 산정 방식을 명시해달라고 요구하세요."]
    },
    highlights: [
      { top: 32, left: 12.5, width: 75, height: 8, comment: "포괄임금제의 함정입니다. 실제 근로시간에 관계없이 연장 수당을 고정하여 추가 수당 청구를 원천 차단하려는 의도가 보입니다." },
      { top: 60, left: 12.5, width: 75, height: 10, comment: "근로기준법 위반 소지가 매우 높습니다. 실비 변상이 아닌 정액 위약금 설정은 강제 근로를 유발하며 법적으로 효력이 없을 가능성이 큽니다." }
    ]
  },
  {
    id: 'real-estate',
    title: '불공정 전세계약서',
    description: '임차인에게 수선 의무를 떠넘기거나 보증금 반환을 지연시키는 독소 조항입니다.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop',
    category: '부동산',
    worstCase: '자연 마모에 대한 원상복구 의무 전가 조항 발견',
    riskLevel: '위험',
    riskCount: 3,
    mockResult: {
      summary: "임대인의 수선 의무를 임차인에게 전가하고 있습니다. 나중에 보증금에서 수리비를 과다하게 공제할 우려가 큽니다.",
      risks: [
        { clause: "특약 제3항: 건물의 노후화에 따른 자연적인 마모 및 파손에 대한 수리비 일체는 임차인이 부담한다.", reason: "민법상 임대인의 수선의무를 전면 부정하는 조항으로 임차인에게 매우 불공정합니다." },
        { clause: "특약 제5항: 임대인은 새로운 세입자가 구해진 후에만 보증금을 반환할 의무를 진다.", reason: "보증금 반환은 계약 종료와 동시이행 관계입니다. 다음 세입자 여부와 관계없이 돌려받아야 합니다." }
      ],
      tips: ["자연 마모는 임대인 부담임을 명시하세요.", "보증금 반환일을 계약 종료일로 확정하세요."]
    },
    highlights: [
      { top: 38.5, left: 12.5, width: 75, height: 10, comment: "임대인의 법적 수선 의무를 임차인에게 전가하는 독소 조항입니다. 벽지 변색이나 자연 마모에 대해서도 수리비를 요구받을 수 있습니다." },
      { top: 66, left: 12.5, width: 75, height: 8, comment: "보증금 반환 지연의 전형적인 수법입니다. 임대차 계약 종료 즉시 보증금은 반환되어야 하며, 다음 세입자 여부와는 무관합니다." }
    ]
  },
  {
    id: 'nda',
    title: '노예 NDA',
    description: '비밀의 범위를 무한대로 넓히고, 영구적인 경업금지를 강요하는 사례입니다.',
    image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1000&auto=format&fit=crop',
    category: '비즈니스',
    worstCase: '퇴사 후 5년간 동종업계 취업 영구 금지 발견',
    riskLevel: '치명적',
    riskCount: 5,
    mockResult: {
      summary: "사용자의 헌법상 직업선택의 자유를 심각하게 침해하는 계약입니다. 비밀의 범위가 모호하여 코에 걸면 코걸이식 처벌이 가능합니다.",
      risks: [
        { clause: "제7조 (경업금지 의무): 퇴사 후 5년 동안 전 세계 어느 지역에서도 갑과 동종 또는 유사한 업종에 종사하거나 창업할 수 없다.", reason: "기간과 장소, 대상이 너무 광범위하여 법원에서 무효 판결이 날 가능성이 높지만 소송 리스크가 큽니다." },
        { clause: "제10조 (손해배상 및 위약벌): 본 계약 위반 시 실제 손해와 관계없이 2억 원을 배상한다.", reason: "실제 손해액 입증 없이 과도한 금액을 책정하여 근로자를 압박하는 전형적인 독소 조항입니다." }
      ],
      tips: ["경업금지 기간을 6개월~1년 이내로 조정하세요.", "비밀의 범위를 '영업비밀로 지정된 것'으로 한정하세요."]
    },
    highlights: [
      { top: 26.5, left: 12.5, width: 75, height: 8, comment: "경업금지 기간(5년)과 범위(전 세계)가 너무 광범위합니다. 이는 사실상 업계 퇴출을 의미하며 직업선택의 자유를 심각하게 침해합니다." },
      { top: 54, left: 12.5, width: 75, height: 10, comment: "과도한 위약벌 조항입니다. 실제 손해 입증 없이 거액의 배상금을 요구하는 것은 근로자를 심리적으로 압박하여 노예 계약을 유도하는 방식입니다." }
    ]
  }
];

const FAQS = [
  { q: "AI 분석 결과가 법적인 효력을 갖나요?", a: "아니요. 본 서비스는 AI를 활용한 보조적 분석 도구입니다. 법적 효력은 없으며, 실제 계약 시에는 반드시 변호사의 자문을 구해야 합니다." },
  { q: "업로드한 계약서 이미지는 안전하게 관리되나요?", a: "분석을 위한 일시적인 프로세스 후 즉시 파기되며, 어떠한 서버에도 저장되거나 학습에 이용되지 않습니다. 보안이 최우선입니다." },
  { q: "수기로 작성된 계약서도 분석이 가능한가요?", a: "네, Gemini AI의 강력한 OCR 기능을 통해 수기 텍스트도 판독이 가능합니다. 다만 글씨체에 따라 정확도가 차이 날 수 있습니다." },
  { q: "분석 가능한 파일 형식은 무엇인가요?", a: "현재 PNG, JPG, JPEG 이미지 형식을 지원합니다. PDF 파일의 경우 이미지를 캡처하여 업로드해 주세요." }
];

const LEGAL_KNOWLEDGE_BASE = [
  {
    tag: "지식백과",
    title: "포괄임금제의 법적 함정",
    desc: "포괄임금제는 연장·야간근로 등 수당을 미리 급여에 포함하는 방식입니다. 하지만 대법원 판례에 따르면 근로시간 산정이 어려운 경우에만 예외적으로 인정되며, 실제 근로시간에 따른 수당보다 적을 경우 차액 지급 의무가 있습니다.",
    icon: <BookMarked className="w-5 h-5" />
  },
  {
    tag: "판례해석",
    title: "경업금지 약정의 유효 범위",
    desc: "퇴사 후 동종업계 취업을 금지하는 NDA 조항은 근로자의 직업선택 자유를 침해할 수 있습니다. 법원은 '보호할 가치 있는 이익', '금지 기간(보통 1년 이내)', '보상 유무' 등을 따져 무효로 판결하는 경우가 많습니다.",
    icon: <Gavel className="w-5 h-5" />
  },
  {
    tag: "실무팁",
    title: "부동산 특약사항 '을'의 방어",
    desc: "임대차 계약 시 '현 시설 상태의 계약임'이라는 문구만으로는 부족합니다. 주요 시설물의 노후 상태를 사진으로 남기고, 자연 마모에 따른 수선 의무는 임대인에게 있음을 명시하는 것이 분쟁 예방의 핵심입니다.",
    icon: <Shield className="w-5 h-5" />
  }
];

const LEGAL_GUIDE_SECTIONS = [
  {
    title: "표준 근로계약서 필수 5원칙",
    icon: <Scale className="w-6 h-6" />,
    items: [
      "임금 구성항목(기본급, 수당) 상세 구분 확인",
      "주휴수당 및 연차유급휴가 미발생 시 구제책",
      "근로계약서 미교부 시 벌금 500만원 규정 활용",
      "해고 예고 및 부당해고 구제신청 가능 여부",
      "휴게시간(4시간당 30분)의 실질적 보장"
    ]
  },
  {
    title: "부동산 임대차 보안 체크리스트",
    icon: <ShieldCheck className="w-6 h-6" />,
    items: [
      "전세권 설정 등기 또는 확정일자 즉시 확보",
      "국세·지방세 완납 증명서 요구 (임대인 체납 확인)",
      "전세보증금 반환보증 보험 가입 확약 특약",
      "근저당권 말소 조건부 계약 시 이행 확인 방법",
      "도배 장판 등 사소한 파손에 대한 면책 규정"
    ]
  },
  {
    title: "스타트업 NDA/계약 필살기",
    icon: <FileWarning className="w-6 h-6" />,
    items: [
      "비밀정보의 유효기간 설정 (영구적 금지는 위법)",
      "위약벌(Penalty)과 손해배상의 중첩 적용 여부",
      "IP(지식재산권)의 귀속 주체 명확화",
      "일방적 해지권 유보 조항의 상호주의 적용",
      "관할 법원을 본인에게 유리한 곳으로 조정"
    ]
  }
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('IDLE');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeHighlights, setActiveHighlights] = useState<SampleHighlight[]>([]);
  const [activeSampleTitle, setActiveSampleTitle] = useState<string | undefined>();
  const [isSampleView, setIsSampleView] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setActiveHighlights([]);
        setIsSampleView(false);
        processAnalysis(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleClick = (sample: SampleContract) => {
    setImagePreview(sample.image);
    setResult(sample.mockResult);
    setActiveHighlights(sample.highlights);
    setActiveSampleTitle(sample.title);
    setIsSampleView(true);
    setState('RESULT');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const processAnalysis = async (base64: string) => {
    try {
      setState('LOADING');
      setErrorMessage(null);
      const data = await analyzeContract(base64);
      setResult(data);
      setState('RESULT');
    } catch (error) {
      console.error(error);
      setState('ERROR');
      setErrorMessage('분석 중 오류 발생');
    }
  };

  const reset = () => {
    setState('IDLE');
    setResult(null);
    setImagePreview(null);
    setErrorMessage(null);
    setActiveHighlights([]);
    setIsSampleView(false);
  };

  const copyAll = useCallback(() => {
    if (!result) return;
    const allText = `[Don't Sign Yet 분석 결과]\n\n[핵심 요약]\n${result.summary}\n\n[⚠️ 주의 조항]\n${result.risks.map(r => `- 조항: ${r.clause}\n  이유: ${r.reason}`).join('\n')}\n\n[✅ 가이드]\n${result.tips.map(t => `- ${t}`).join('\n')}\n\n*본 분석은 AI 소견으로 법적 효력이 없습니다.`;
    navigator.clipboard.writeText(allText).then(() => alert('클립보드에 복사되었습니다.'));
  }, [result]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop" 
          alt="Legal Background" 
          className="w-full h-full object-cover opacity-[0.15] filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/95 to-slate-950"></div>
      </div>

      {/* Modern Navigation */}
      <nav className="relative z-50 w-full bg-slate-900/80 backdrop-blur-2xl border-b border-white/10 sticky top-0 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={reset}>
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter italic group-hover:text-blue-400 transition-colors">Don't Sign Yet</h1>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em]">AI Legal Auditor</span>
                 <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                 <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">v4.5 Enterprise</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
             <a href="#knowledge" className="text-sm font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">지식 베이스</a>
             <a href="#cases" className="text-sm font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">탐지 사례</a>
             <a href="#faq" className="text-sm font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">FAQ</a>
          </div>
          {state === 'RESULT' && (
            <button onClick={copyAll} className="flex items-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-2xl font-black shadow-2xl hover:bg-blue-50 transition-all active:scale-95">
              <ClipboardCheck className="w-5 h-5" />
              <span>전체 결과 복사</span>
            </button>
          )}
        </div>
      </nav>

      <main className={`relative z-10 flex-1 w-full mx-auto p-6 transition-all duration-700 ${state === 'RESULT' ? 'max-w-7xl' : 'max-w-6xl'}`}>
        
        {state === 'IDLE' && (
          <div className="flex flex-col items-center py-16 space-y-32">
            {/* Hero Section */}
            <div className="text-center space-y-12 animate-fade-in max-w-5xl w-full flex flex-col items-center px-4">
              <div className="space-y-6 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 px-6 py-2.5 rounded-full border border-red-500/30 text-xs font-black uppercase tracking-[0.3em] mb-4 shadow-xl">
                  <ShieldAlert className="w-4 h-4 animate-pulse" />
                  Warning: Signature Risks Detected
                </div>
                <h2 className="text-5xl sm:text-[5.5rem] font-black tracking-tighter leading-[1.3] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center">
                  무심코 찍은 도장,<br /> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse inline-block">인생을 파탄냅니다.</span>
                </h2>
              </div>
              <p className="text-slate-400 text-xl sm:text-2xl leading-relaxed font-bold tracking-tight max-w-3xl mx-auto">
                서명 전 딱 10초, <span className="text-white underline decoration-red-600 decoration-4 underline-offset-8">인생을 망칠 독소 조항</span>을 <br className="hidden sm:block" />
                AI가 1초 만에 적출하여 당신의 권리와 자산을 사수합니다.
              </p>
              
              {/* Perfectly Centered Main Button Container */}
              <div className="pt-12 w-full flex flex-col items-center justify-center space-y-8">
                <div className="relative group flex justify-center">
                  {/* Glowing background effect for the button */}
                  <div className="absolute -inset-4 bg-blue-600/30 blur-2xl rounded-[4rem] group-hover:bg-blue-500/40 transition-all"></div>
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative flex items-center justify-center gap-8 bg-white text-slate-950 px-16 py-10 rounded-[4rem] font-black text-3xl sm:text-4xl hover:bg-blue-50 transition-all active:scale-[0.96] shadow-[0_30px_80px_rgba(255,255,255,0.15)] border-b-[10px] border-slate-200 mx-auto"
                  >
                    <Camera className="w-14 h-14 text-blue-600 group-hover:scale-125 transition-transform duration-500" />
                    계약서 정밀 스캔
                  </button>
                </div>
                
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                
                <div className="flex items-center justify-center gap-12 pt-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                   <div className="flex items-center gap-3 font-black text-sm uppercase tracking-widest"><Users className="w-5 h-5" /> 58,402 Signers Protected</div>
                   <div className="flex items-center gap-3 font-black text-sm uppercase tracking-widest"><Award className="w-5 h-5" /> Best Legal Tech 2025</div>
                </div>
              </div>
            </div>

            {/* Showcase Grid */}
            <div id="cases" className="w-full space-y-16 scroll-mt-24">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/10 pb-10">
                <div className="space-y-3 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-400">
                    <Sparkles className="w-5 h-5 fill-current" />
                    <span className="text-sm font-black uppercase tracking-[0.2em]">Industry Showcase</span>
                  </div>
                  <h3 className="text-4xl font-black tracking-tight italic text-white">AI가 탐지한 실전 독소 조항</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 px-2">
                {SAMPLE_CONTRACTS.map((sample) => (
                  <div 
                    key={sample.id}
                    onClick={() => handleSampleClick(sample)}
                    className="group cursor-pointer flex flex-col bg-slate-800/20 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 hover:border-blue-500/40 transition-all shadow-3xl overflow-visible pt-20"
                  >
                    {/* Floating Document */}
                    <div className="relative h-40 flex items-center justify-center -mt-32">
                      <div className="relative z-10 w-36 h-48 bg-white rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-5 rotate-3 group-hover:rotate-0 transition-all duration-500 group-hover:scale-105">
                        <div className="h-2 w-1/3 bg-slate-100 mb-3 rounded-full" />
                        <div className="space-y-2">
                          {[...Array(6)].map((_, i) => <div key={i} className={`h-1 bg-slate-50 rounded-full ${i % 2 === 0 ? 'w-full' : 'w-2/3'}`} />)}
                        </div>
                        <div className="mt-8 border-t-2 border-red-50 pt-3">
                          <div className="h-1 bg-red-400/20 w-full mb-1.5 rounded-full" />
                          <div className="h-1 bg-red-400/40 w-3/4 rounded-full" />
                        </div>
                      </div>
                      {/* Risk Label - Premium No-Border Style */}
                      <div className="absolute bottom-[-20px] z-20">
                        <div className="bg-red-600 text-white px-7 py-3 rounded-full text-[12px] font-black uppercase tracking-widest shadow-[0_15px_30px_rgba(220,38,38,0.5)] transform -translate-y-2 group-hover:translate-y-0 transition-transform">
                          RISK: {sample.riskLevel}
                        </div>
                      </div>
                    </div>

                    <div className="p-10 pt-16 flex flex-col flex-1">
                      <h4 className="font-black text-2xl mb-4 text-white group-hover:text-blue-400 transition-colors tracking-tighter leading-tight">{sample.title}</h4>
                      <p className="text-slate-500 text-[15px] leading-relaxed mb-10 font-bold">{sample.description}</p>
                      
                      <div className="mt-auto bg-gradient-to-br from-red-500/5 to-red-500/10 p-7 rounded-[2.5rem] border border-red-500/10 group-hover:border-red-500/30 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                          <ShieldAlert className="w-5 h-5 text-red-500" />
                          <span className="text-[11px] font-black text-red-400 uppercase tracking-widest leading-none">Critical Point Detected</span>
                        </div>
                        <p className="text-[16px] text-red-100 font-black leading-snug tracking-tight">{sample.worstCase}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deep Legal Knowledge Base (SEO/AdSense Packed) */}
            <div id="knowledge" className="w-full space-y-20 pt-32 border-t border-white/5 scroll-mt-24">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest mb-2">
                  <BookOpen className="w-4 h-4" /> Legal Education Center
                </div>
                <h3 className="text-5xl font-black tracking-tighter leading-tight italic text-white">
                  계약 리터러시를 위한 <br /> <span className="text-blue-500 underline decoration-blue-500/20 underline-offset-[12px]">실전 법률 지식</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {LEGAL_KNOWLEDGE_BASE.map((item, idx) => (
                  <div key={idx} className="bg-slate-800/30 p-10 rounded-[3rem] border border-white/10 space-y-6 hover:bg-white/5 transition-all group shadow-2xl">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10 group-hover:border-blue-500/50 transition-all">
                      {item.icon}
                    </div>
                    <div className="space-y-3">
                       <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{item.tag}</span>
                       <h4 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">{item.title}</h4>
                    </div>
                    <p className="text-slate-400 font-bold leading-relaxed text-[15px]">{item.desc}</p>
                    <button className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest pt-4 group-hover:translate-x-2 transition-transform">
                      상세 보기 <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Deep Checklists Section */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 pt-16">
               {LEGAL_GUIDE_SECTIONS.map((section, idx) => (
                 <div key={idx} className="bg-gradient-to-br from-slate-900 to-slate-950 p-12 rounded-[3.5rem] border border-white/10 shadow-3xl space-y-10 group">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                       <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">{section.icon}</div>
                       <h4 className="text-xl font-black text-white leading-tight">{section.title}</h4>
                    </div>
                    <ul className="space-y-5">
                       {section.items.map((item, i) => (
                         <li key={i} className="flex gap-4 text-slate-400 font-bold text-sm leading-relaxed">
                           <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                           <span>{item}</span>
                         </li>
                       ))}
                    </ul>
                 </div>
               ))}
            </div>

            {/* FAQ Section */}
            <div id="faq" className="w-full space-y-16 pt-32 border-t border-white/5 scroll-mt-24">
              <div className="text-center space-y-4">
                <h3 className="text-4xl font-black tracking-tight italic text-white">자주 묻는 질문</h3>
                <p className="text-slate-500 text-sm font-black uppercase tracking-[0.3em]">Reliable Support & Trust</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {FAQS.map((faq, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 space-y-6 hover:bg-white/10 transition-all shadow-2xl">
                    <div className="flex items-center gap-4 text-blue-400">
                      <HelpCircle className="w-8 h-8" />
                      <h4 className="font-black text-xl tracking-tight leading-tight">{faq.q}</h4>
                    </div>
                    <p className="text-slate-400 font-bold leading-relaxed text-lg">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {state === 'LOADING' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-16">
            <div className="relative">
              <div className="w-56 h-56 rounded-full border-[12px] border-white/5 border-t-blue-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="w-24 h-24 text-blue-500 animate-pulse" />
              </div>
            </div>
            <div className="space-y-8 max-w-2xl animate-pulse">
              <h3 className="text-5xl font-black italic uppercase tracking-tighter">AI 변호사 접견 중...</h3>
              <div className="space-y-4">
                 <p className="text-slate-400 text-xl font-bold">계약서의 모든 조항을 대조 분석하고 있습니다.</p>
                 <div className="flex justify-center gap-2">
                    {[...Array(3)].map((_, i) => <div key={i} className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: `${i*0.2}s`}} />)}
                 </div>
              </div>
            </div>
          </div>
        )}

        {state === 'RESULT' && result && (
          <div className="animate-fade-in">
            {/* Upper Section: Image and Summary Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-16">
              <div className="lg:col-span-5 space-y-10">
                <div className="bg-slate-800/80 backdrop-blur-3xl p-6 rounded-[4rem] shadow-4xl border border-white/10 group overflow-hidden">
                  {imagePreview && (
                    <HighlightedImage 
                      src={imagePreview} 
                      highlights={activeHighlights} 
                      isSample={isSampleView}
                      title={activeSampleTitle}
                    />
                  )}
                </div>
              </div>

              <div className="lg:col-span-7">
                <ResultCard title="핵심 요약 리포트" icon={Info} variant="info" rawText={result.summary}>
                  <div className="space-y-6">
                    {result.summary.split('.').filter(s => s.trim()).map((sentence, idx) => (
                      <div key={idx} className="flex gap-8 items-start bg-blue-500/5 p-10 rounded-[3rem] border border-blue-500/10 hover:bg-blue-500/10 transition-all group">
                        <span className="flex-shrink-0 w-14 h-14 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center text-2xl font-black shadow-2xl group-hover:scale-110 transition-transform">{idx + 1}</span>
                        <span className="text-white leading-relaxed font-bold text-2xl tracking-tight">{sentence.trim()}.</span>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              </div>
            </div>

            {/* Lower Section: Full Width Detailed Risks and Guides */}
            <div className="space-y-16 pb-32">
              <ResultCard title="⚠️ 위험 조항 적출" icon={AlertTriangle} variant="danger" rawText={result.risks.map(r => r.clause).join('\n')}>
                <div className="space-y-10">
                  {result.risks.map((risk, idx) => (
                    <div key={idx} className="bg-slate-800/60 backdrop-blur-xl rounded-[3.5rem] border border-red-500/20 shadow-4xl overflow-hidden group hover:border-red-500/50 transition-all">
                      <div className="bg-red-500/10 px-10 py-5 border-b border-red-500/10 flex justify-between items-center">
                        <span className="text-red-400 font-black text-xs uppercase tracking-[0.3em]">Critical Risk Factor {idx + 1}</span>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]"></div>
                      </div>
                      <div className="p-12 space-y-10">
                        <h4 className="text-4xl font-black tracking-tighter leading-tight text-white italic group-hover:text-red-400 transition-colors">{risk.clause}</h4>
                        <div className="flex gap-8 bg-red-600/10 p-10 rounded-[2.5rem] border border-red-600/20">
                          <Zap className="w-10 h-10 text-red-500 shrink-0 fill-current" />
                          <div className="space-y-3">
                             <p className="text-xs font-black text-red-400 uppercase tracking-[0.3em]">AI Expert Contextual Analysis</p>
                             <p className="text-2xl text-red-50 font-bold leading-relaxed tracking-tight">{risk.reason}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ResultCard>

              <ResultCard title="안전 가이드 및 대응 전략" icon={ShieldCheck} variant="success" rawText={result.tips.join('\n')}>
                <div className="grid grid-cols-1 gap-8">
                  {result.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-center gap-8 bg-emerald-500/5 p-10 rounded-[3rem] border border-emerald-500/10 hover:bg-emerald-500/10 transition-all group">
                      <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                      </div>
                      <span className="text-white font-black text-2xl leading-snug tracking-tight">{tip}</span>
                    </div>
                  ))}
                </div>
              </ResultCard>

              <div className="flex flex-col sm:flex-row gap-8">
                <button onClick={reset} className="flex-[2] bg-white text-slate-900 py-10 rounded-[3.5rem] font-black text-3xl hover:bg-blue-50 shadow-[0_40px_80px_rgba(255,255,255,0.1)] active:scale-95 transition-all">다시 분석하기</button>
                <button onClick={() => window.print()} className="flex-1 px-10 py-10 rounded-[3.5rem] border-2 border-white/20 text-white font-black text-xl hover:bg-white/10">리포트 출력</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="relative z-10 w-full bg-slate-950/95 py-40 px-6 mt-64 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-24">
          <div className="space-y-10 lg:col-span-2">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-600/20">
                <ShieldAlert className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-black italic tracking-tighter">Don't Sign Yet</span>
            </div>
            <p className="text-slate-500 font-bold text-lg leading-relaxed max-w-xl">전 세계 최초의 이미지 기반 AI 계약 정밀 감사 솔루션. 전문 변호사의 뇌를 이식한 AI가 당신의 권리를 빈틈없이 수호합니다.</p>
            <div className="flex gap-6 pt-4">
               {[...Array(4)].map((_, i) => <div key={i} className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 hover:bg-blue-600 transition-all cursor-pointer" />)}
            </div>
          </div>
          <div className="space-y-10">
            <h4 className="text-sm font-black uppercase tracking-[0.4em] text-white">Resources</h4>
            <ul className="space-y-6 text-slate-500 font-black text-sm uppercase tracking-widest">
               <li><a href="#" className="hover:text-blue-400 transition-colors">이용약관</a></li>
               <li><a href="#" className="hover:text-blue-400 transition-colors">개인정보처리방침</a></li>
               <li><a href="#" className="hover:text-blue-400 transition-colors">API Docs</a></li>
               <li><a href="#" className="hover:text-blue-400 transition-colors">Enterprise</a></li>
            </ul>
          </div>
          <div className="space-y-10">
            <h4 className="text-sm font-black uppercase tracking-[0.4em] text-white">Trust & Safety</h4>
            <div className="flex flex-wrap gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10"><Scale className="w-7 h-7 text-slate-400" /></div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10"><ShieldCheck className="w-7 h-7 text-slate-400" /></div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10"><Award className="w-7 h-7 text-slate-400" /></div>
            </div>
            <div className="space-y-2">
               <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">Certified by AI Ethics Board</p>
               <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.3em]">Secured by SSL Enterprise</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-24 mt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-700">
            &copy; 2025 AI LEGAL LABS INC. GLOBAL SERVICE.
          </span>
          <div className="flex gap-12">
             <span className="text-[10px] font-black text-slate-600 tracking-widest uppercase">Privacy Focused</span>
             <span className="text-[10px] font-black text-slate-600 tracking-widest uppercase">No-Save Policy</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        html { scroll-behavior: smooth; }
        @media print {
          .no-print, nav, footer, button { display: none !important; }
          body { background: white !important; color: black !important; }
          .fixed, .absolute { position: relative !important; }
          main { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
          .shadow-3xl, .shadow-4xl, .backdrop-blur-3xl { box-shadow: none !important; backdrop-filter: none !important; border-color: #eee !important; }
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
