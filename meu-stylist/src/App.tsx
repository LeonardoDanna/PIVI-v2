import { useState, useMemo, useRef } from "react";
import { Sun, User, Ruler, TrendingUp, Camera, Shirt, ArrowRight, Star, LogOut, Bell, Check, Calculator, Info, Sparkles, Download, Share2, RefreshCw, Package, Plus, Heart, Save, Loader2, Upload, Layers } from 'lucide-react';

// --- CONFIGURAÇÃO DA API ---
const API_KEY = "fcca3320dfmsh03d10c1b184eb0fp19e3d8jsn2411cc31418c";
const API_HOST = "try-on-diffusion.p.rapidapi.com";
const API_URL = "https://try-on-diffusion.p.rapidapi.com/try-on-file"; 

// --- DADOS FIXOS ---
const colorPalettes = {
  very_light: { label: 'Muito Clara', hex: '#FAE7D0', season: 'Inverno Frio', description: 'Pele com subtom frio. Cores puras, gélidas e contrastantes realçam sua beleza natural.', colors: ['bg-blue-500', 'bg-pink-600', 'bg-emerald-500', 'bg-purple-700', 'bg-gray-900', 'bg-slate-200'], styles: ['Minimalista', 'Dramático', 'Alfaiataria', 'Gótico Suave', 'Moderno', 'Futurista'] },
  light: { label: 'Clara', hex: '#E3C1A0', season: 'Verão Suave', description: 'Contraste delicado. Tons pastéis, lavanda e azul bebê harmonizam perfeitamente.', colors: ['bg-sky-200', 'bg-rose-300', 'bg-indigo-300', 'bg-teal-200', 'bg-purple-300', 'bg-slate-400'], styles: ['Romântico', 'Lady Like', 'Provençal', 'Clássico', 'Vintage', 'Cottagecore'] },
  medium: { label: 'Média', hex: '#CFA880', season: 'Primavera Quente', description: 'Pele dourada e vibrante. Cores alegres como coral, turquesa e dourado são ideais.', colors: ['bg-orange-400', 'bg-lime-500', 'bg-yellow-400', 'bg-cyan-500', 'bg-red-500', 'bg-amber-300'], styles: ['Criativo', 'Tropical', 'Esportivo', 'Color Block', 'Casual Chic', 'Preppy'] },
  tan: { label: 'Bronzeada', hex: '#A67B51', season: 'Outono Profundo', description: 'Tons terrosos, mostarda e verde militar complementam seu bronzeado natural.', colors: ['bg-orange-800', 'bg-green-800', 'bg-yellow-700', 'bg-red-900', 'bg-stone-700', 'bg-amber-700'], styles: ['Boho Chic', 'Natural', 'Folk', 'Safari', 'Militar', 'Rústico'] },
  dark: { label: 'Escura', hex: '#7A4B28', season: 'Outono Escuro', description: 'Pele rica e quente. Tons de especiarias, vinhos profundos e azul marinho ficam elegantes.', colors: ['bg-rose-900', 'bg-blue-900', 'bg-emerald-900', 'bg-yellow-600', 'bg-purple-900', 'bg-orange-900'], styles: ['Sofisticado', 'Glamour', 'Urbano', 'Executivo', 'Retrô', 'Barroco'] },
  deep: { label: 'Retinta', hex: '#422618', season: 'Inverno Brilhante', description: 'Alto contraste e profundidade. Cores neon, branco puro e cores primárias vibrantes.', colors: ['bg-fuchsia-600', 'bg-blue-600', 'bg-yellow-300', 'bg-white', 'bg-red-600', 'bg-violet-600'], styles: ['Streetwear', 'High Fashion', 'Vibrante', 'Geométrico', 'Esportivo Deluxe', 'Pop Art'] }
};

const tabs = [
  { id: 'today', label: 'Visão Geral', icon: <Sun size={20} />, subtitle: 'Sua dose diária de estilo' },
  { id: 'closet', label: 'Armário Virtual', icon: <Package size={20} />, subtitle: 'Monte looks completos' },
  { id: 'matches', label: 'Combinações & Cores', icon: <User size={20} />, subtitle: 'Análise de coloração pessoal' },
  { id: 'fit', label: 'Guia de Caimento', icon: <Ruler size={20} />, subtitle: 'Ajustes para seu biotipo' },
  { id: 'improve', label: 'Stylist AI', icon: <TrendingUp size={20} />, subtitle: 'Feedback dos seus looks' },
  { id: 'tryon', label: 'Provador Virtual', icon: <Sparkles size={20} />, subtitle: 'IA Generativa' },
];

const initialClosetData = {
  head: [
    { id: 'h1', name: 'Boné NY Preto', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=300&auto=format&fit=crop' },
    { id: 'h2', name: 'Beanie Cinza', image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=300&auto=format&fit=crop' },
    { id: 'h3', name: 'Bucket Hat', image: 'https://images.unsplash.com/photo-1622445272461-c6580cab8755?q=80&w=300&auto=format&fit=crop' },
    { id: 'h4', name: 'Boné Bege', image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=300&auto=format&fit=crop' },
  ],
  top: [
    { id: 't1', name: 'Camiseta Branca', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=300&auto=format&fit=crop' },
    { id: 't2', name: 'Camisa Linho', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=300&auto=format&fit=crop' },
    { id: 't3', name: 'Moletom Preto', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=300&auto=format&fit=crop' },
    { id: 't4', name: 'Jaqueta Jeans', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=300&auto=format&fit=crop' },
  ],
  bottom: [
    { id: 'b1', name: 'Calça Chino', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=300&auto=format&fit=crop' },
    { id: 'b2', name: 'Jeans Azul', image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=300&auto=format&fit=crop' },
    { id: 'b3', name: 'Shorts Preto', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=300&auto=format&fit=crop' },
    { id: 'b4', name: 'Calça Cargo', image: 'https://images.unsplash.com/photo-1517445312882-efe062fa46f2?q=80&w=300&auto=format&fit=crop' },
  ],
  feet: [
    { id: 'f1', name: 'Tênis Branco', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=300&auto=format&fit=crop' },
    { id: 'f2', name: 'Bota Chelsea', image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=300&auto=format&fit=crop' },
    { id: 'f3', name: 'Sneaker Colorido', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=300&auto=format&fit=crop' },
    { id: 'f4', name: 'Mocassim', image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=300&auto=format&fit=crop' },
  ]
};

const PersonalStylistApp = () => {
  const [activeTab, setActiveTab] = useState('tryon'); 
  const [selectedSkinTone, setSelectedSkinTone] = useState('medium');

  // ESTADOS DA CALCULADORA
  const [fitMetrics, setFitMetrics] = useState({ height: 175, weight: 75, preference: 'regular' });
  
  // --- ESTADOS E REFS PARA O PROVADOR REAL ---
  const userFileInputRef = useRef(null);
  const clothFileInputRef = useRef(null);

  const [tryOnState, setTryOnState] = useState({
    userImage: null, 
    userFile: null,  
    clothImage: null, 
    clothFile: null,
    category: 'upper_body', // NOVO: Padrão para parte de cima (evita erro de vestido)
    isGenerating: false,
    resultImage: null,
    error: null
  });

  // ESTADOS DO ARMÁRIO
  const [closetSelection, setClosetSelection] = useState({ head: 'h1', top: 't1', bottom: 'b1', feet: 'f1' });
  const [isOutfitSaved, setIsOutfitSaved] = useState(false);
  const [isSavingOutfit, setIsSavingOutfit] = useState(false);

  // Lógica Calculadora
  const calculatedSize = useMemo(() => {
    const { height, weight, preference } = fitMetrics;
    const ratio = weight / height;
    let baseSize = 'M';
    let confidence = 92;
    if (ratio < 0.35) baseSize = 'PP';
    else if (ratio < 0.40) baseSize = 'P';
    else if (ratio < 0.48) baseSize = 'M';
    else if (ratio < 0.55) baseSize = 'G';
    else baseSize = 'GG';
    if (preference === 'loose') {
       if (baseSize === 'P') baseSize = 'M';
       if (baseSize === 'M') baseSize = 'G';
       if (baseSize === 'G') baseSize = 'GG';
    }
    return { size: baseSize, confidence };
  }, [fitMetrics]);

  const currentPalette = colorPalettes[selectedSkinTone];

  const loadPreset = (type) => {
    if (type === 'small') setFitMetrics({ ...fitMetrics, height: 165, weight: 58 });
    if (type === 'medium') setFitMetrics({ ...fitMetrics, height: 178, weight: 76 });
    if (type === 'large') setFitMetrics({ ...fitMetrics, height: 185, weight: 105 });
  };

  // --- FUNÇÕES REAIS DE UPLOAD ---
  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === 'user') {
        setTryOnState(prev => ({ ...prev, userImage: previewUrl, userFile: file, error: null }));
      } else {
        setTryOnState(prev => ({ ...prev, clothImage: previewUrl, clothFile: file, error: null }));
      }
    }
  };

  const triggerUserUpload = () => userFileInputRef.current.click();
  const triggerClothUpload = () => clothFileInputRef.current.click();

  // --- FUNÇÃO DE GERAÇÃO COM A API ---
  const handleGenerate = async () => {
    if (!tryOnState.userFile || !tryOnState.clothFile) return;

    setTryOnState(prev => ({ ...prev, isGenerating: true, error: null, resultImage: null }));

    const formData = new FormData();
    formData.append('clothing_image', tryOnState.clothFile);
    formData.append('avatar_image', tryOnState.userFile);
    // ENVIA A CATEGORIA PARA A API (Melhoria Essencial)
    formData.append('category', tryOnState.category);
    formData.append('seed', -1);
    formData.append('width', 1024);
    formData.append('height', 1024);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'x-rapidapi-key': API_KEY,
                'x-rapidapi-host': API_HOST
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.indexOf("application/json") !== -1) {
             const data = await response.json();
             if(data.url) {
                 setTryOnState(prev => ({ ...prev, isGenerating: false, resultImage: data.url }));
             } else if(data.image) {
                 setTryOnState(prev => ({ ...prev, isGenerating: false, resultImage: `data:image/png;base64,${data.image}` }));
             } else {
                 setTryOnState(prev => ({ ...prev, isGenerating: false, error: "Tente novamente. A IA não retornou uma imagem válida." }));
             }
        } else {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setTryOnState(prev => ({ ...prev, isGenerating: false, resultImage: imageUrl }));
        }

    } catch (error) {
        console.error("Erro no Try-On:", error);
        setTryOnState(prev => ({ 
            ...prev, 
            isGenerating: false, 
            error: "Falha ao conectar com a IA. Verifique sua internet." 
        }));
    }
  };

  const resetTryOn = () => setTryOnState({ 
    userImage: null, userFile: null, 
    clothImage: null, clothFile: null, 
    category: 'upper_body', 
    isGenerating: false, resultImage: null, error: null 
  });

  // Função Salvar Look (Armário Virtual)
  const handleSaveOutfit = () => {
    if (isOutfitSaved) return;
    setIsSavingOutfit(true);
    setTimeout(() => {
      setIsSavingOutfit(false);
      setIsOutfitSaved(true);
      setTimeout(() => setIsOutfitSaved(false), 2000);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50 font-sans text-slate-900">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
        <div className="p-8">
          <h1 className="text-xl font-black tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg"></div>
            TodayFashion
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Menu Principal</p>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 group ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={`${activeTab === tab.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`}>
                {tab.icon}
              </span>
              <div>
                <span className="block font-bold text-sm">{tab.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition text-sm font-medium">
                <LogOut size={18}/> Sair da conta
            </button>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="flex-1 ml-72 p-8 lg:p-12">
        <header className="flex justify-between items-center mb-10">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">{tabs.find(t => t.id === activeTab)?.label}</h2>
                <p className="text-slate-500 text-sm">{tabs.find(t => t.id === activeTab)?.subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:text-slate-600 transition relative">
                    <Bell size={20}/>
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-700">Leonardo Danna</p>
                        <p className="text-xs text-slate-400">Premium Member</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                          <img src="https://placehold.co/100x100/1e293b/FFF?text=LD" alt="Leonardo Danna" className="w-full h-full object-cover"/>
                    </div>
                </div>
            </div>
        </header>

        <div className="max-w-6xl mx-auto">
            
            {/* ABA HOJE */}
            {activeTab === 'today' && (
                <div className="animate-fade-in space-y-8">
                    <div className="flex justify-between items-end border-b border-slate-200 pb-6">
                        <div>
                        <h2 className="text-3xl font-bold text-slate-900">Bom dia, Leonardo!</h2>
                        <p className="text-slate-500 mt-1">Aqui estão as recomendações para sua sexta-feira.</p>
                        </div>
                        <div className="text-right">
                        <div className="text-2xl font-bold text-slate-800">28°C</div>
                        <div className="text-sm text-slate-500 flex items-center gap-2 justify-end">
                            <Sun size={16} className="text-yellow-500"/> Campinas, SP
                        </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-4 bg-blue-50 rounded-3xl p-8 flex flex-col justify-between h-[450px]">
                        <div>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Dica do Dia</span>
                            <h3 className="text-2xl font-bold text-slate-800 mt-4 leading-tight">Dia quente e ensolarado em Campinas.</h3>
                            <p className="text-slate-600 mt-4">Aposte em tecidos naturais como linho ou algodão. Evite sintéticos para maior conforto térmico.</p>
                        </div>
                        <button className="bg-blue-600 text-white w-full py-3 rounded-xl font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200">Ver Detalhes do Clima</button>
                        </div>
                        <div className="col-span-8 grid grid-cols-2 gap-6 h-[450px]">
                            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col">
                                <div className="flex-1 rounded-2xl mb-4 overflow-hidden relative">
                                    <img src="https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=800&auto=format&fit=crop" alt="Look Casual Chic" className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"/>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                                    <div className="absolute bottom-4 left-4 text-white"><span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-xs font-bold">100% Linho</span></div>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <div><span className="font-bold text-slate-800 block text-lg">Casual Chic</span><span className="text-xs text-slate-500">Tons Terrosos & Frescor</span></div>
                                    <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all"><ArrowRight size={20}/></button>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col">
                                <div className="flex-1 rounded-2xl mb-4 overflow-hidden relative">
                                    <img src="https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=800&auto=format&fit=crop" alt="Look Trabalho Leve" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"/>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                                    <div className="absolute bottom-4 left-4 text-white"><span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-xs font-bold">Alfaiataria</span></div>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <div><span className="font-bold text-slate-800 block text-lg">Trabalho Leve</span><span className="text-xs text-slate-500">Blazer & Conforto</span></div>
                                    <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all"><ArrowRight size={20}/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ABA ARMÁRIO (CLOSET) --- */}
            {activeTab === 'closet' && (
                <div className="animate-fade-in flex gap-8">
                    <div className="flex-1 space-y-6">
                        {/* Linha 1: Cabeça */}
                        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Cabeça / Acessórios</h3>
                            <div className="flex gap-4 overflow-x-auto pb-4 snap-x px-2 custom-scrollbar">
                                <button className="w-24 h-24 rounded-2xl bg-slate-100 flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:bg-slate-200 transition">
                                    <Plus className="text-slate-400"/>
                                    <span className="text-[10px] font-bold text-slate-400 mt-1">Add</span>
                                </button>
                                {initialClosetData.head.map(item => (
                                    <div key={item.id} 
                                        onClick={() => setClosetSelection(prev => ({...prev, head: item.id}))}
                                        className={`w-24 h-24 rounded-2xl flex-shrink-0 cursor-pointer overflow-hidden border-2 transition-all relative snap-center ${closetSelection.head === item.id ? 'border-purple-600 ring-2 ring-purple-100 scale-105' : 'border-transparent'}`}
                                    >
                                        <img src={item.image} className="w-full h-full object-cover"/>
                                        {closetSelection.head === item.id && <div className="absolute top-1 right-1 bg-purple-600 w-4 h-4 rounded-full flex items-center justify-center"><Check size={10} className="text-white"/></div>}
                                    </div>
                                ))}
                            </div>
                        </div>

                         {/* Linha 2: Tronco */}
                         <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Tronco</h3>
                            <div className="flex gap-4 overflow-x-auto pb-4 snap-x px-2 custom-scrollbar">
                                <button className="w-32 h-32 rounded-2xl bg-slate-100 flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:bg-slate-200 transition">
                                    <Plus className="text-slate-400"/>
                                    <span className="text-[10px] font-bold text-slate-400 mt-1">Add</span>
                                </button>
                                {initialClosetData.top.map(item => (
                                    <div key={item.id} 
                                        onClick={() => setClosetSelection(prev => ({...prev, top: item.id}))}
                                        className={`w-32 h-32 rounded-2xl flex-shrink-0 cursor-pointer overflow-hidden border-2 transition-all relative snap-center ${closetSelection.top === item.id ? 'border-purple-600 ring-2 ring-purple-100 scale-105' : 'border-transparent'}`}
                                    >
                                        <img src={item.image} className="w-full h-full object-cover"/>
                                        {closetSelection.top === item.id && <div className="absolute top-1 right-1 bg-purple-600 w-4 h-4 rounded-full flex items-center justify-center"><Check size={10} className="text-white"/></div>}
                                    </div>
                                ))}
                            </div>
                        </div>

                         {/* Linha 3: Pernas */}
                         <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Pernas</h3>
                            <div className="flex gap-4 overflow-x-auto pb-4 snap-x px-2 custom-scrollbar">
                                <button className="w-32 h-40 rounded-2xl bg-slate-100 flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:bg-slate-200 transition">
                                    <Plus className="text-slate-400"/>
                                    <span className="text-[10px] font-bold text-slate-400 mt-1">Add</span>
                                </button>
                                {initialClosetData.bottom.map(item => (
                                    <div key={item.id} 
                                        onClick={() => setClosetSelection(prev => ({...prev, bottom: item.id}))}
                                        className={`w-32 h-40 rounded-2xl flex-shrink-0 cursor-pointer overflow-hidden border-2 transition-all relative snap-center ${closetSelection.bottom === item.id ? 'border-purple-600 ring-2 ring-purple-100 scale-105' : 'border-transparent'}`}
                                    >
                                        <img src={item.image} className="w-full h-full object-cover"/>
                                        {closetSelection.bottom === item.id && <div className="absolute top-1 right-1 bg-purple-600 w-4 h-4 rounded-full flex items-center justify-center"><Check size={10} className="text-white"/></div>}
                                    </div>
                                ))}
                            </div>
                        </div>

                         {/* Linha 4: Pés */}
                         <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Pés</h3>
                            <div className="flex gap-4 overflow-x-auto pb-4 snap-x px-2 custom-scrollbar">
                                <button className="w-24 h-24 rounded-2xl bg-slate-100 flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:bg-slate-200 transition">
                                    <Plus className="text-slate-400"/>
                                    <span className="text-[10px] font-bold text-slate-400 mt-1">Add</span>
                                </button>
                                {initialClosetData.feet.map(item => (
                                    <div key={item.id} 
                                        onClick={() => setClosetSelection(prev => ({...prev, feet: item.id}))}
                                        className={`w-24 h-24 rounded-2xl flex-shrink-0 cursor-pointer overflow-hidden border-2 transition-all relative snap-center ${closetSelection.feet === item.id ? 'border-purple-600 ring-2 ring-purple-100 scale-105' : 'border-transparent'}`}
                                    >
                                        <img src={item.image} className="w-full h-full object-cover"/>
                                        {closetSelection.feet === item.id && <div className="absolute top-1 right-1 bg-purple-600 w-4 h-4 rounded-full flex items-center justify-center"><Check size={10} className="text-white"/></div>}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Painel Direito: Preview do Look Completo */}
                    <div className="w-80 flex flex-col gap-4">
                        <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col h-[600px] sticky top-8 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg">Seu Look</h3>
                                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20"><Heart size={18}/></button>
                            </div>

                            {/* Visualização Empilhada */}
                            <div className="flex-1 flex flex-col gap-2 items-center justify-center bg-white/5 rounded-2xl p-4 border border-white/10">
                                {/* Head */}
                                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg border-2 border-white/20">
                                    <img src={initialClosetData.head.find(i => i.id === closetSelection.head)?.image} className="w-full h-full object-cover"/>
                                </div>
                                {/* Top */}
                                <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg border-2 border-white/20 z-10 -mt-2">
                                    <img src={initialClosetData.top.find(i => i.id === closetSelection.top)?.image} className="w-full h-full object-cover"/>
                                </div>
                                {/* Bottom */}
                                <div className="w-32 h-40 rounded-xl overflow-hidden shadow-lg border-2 border-white/20 z-20 -mt-4">
                                    <img src={initialClosetData.bottom.find(i => i.id === closetSelection.bottom)?.image} className="w-full h-full object-cover"/>
                                </div>
                                {/* Feet */}
                                <div className="w-32 h-20 flex justify-center gap-1 z-30 -mt-6">
                                     <div className="w-24 h-20 rounded-xl overflow-hidden shadow-lg border-2 border-white/20">
                                        <img src={initialClosetData.feet.find(i => i.id === closetSelection.feet)?.image} className="w-full h-full object-cover"/>
                                     </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleSaveOutfit}
                                disabled={isSavingOutfit || isOutfitSaved}
                                className={`mt-6 w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                                    isOutfitSaved 
                                    ? 'bg-green-500 text-white hover:bg-green-600' 
                                    : 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-900/50'
                                }`}
                            >
                                {isSavingOutfit ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} /> Salvando...
                                    </>
                                ) : isOutfitSaved ? (
                                    <>
                                        <Check size={18} /> Look Salvo!
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} /> Salvar Combinação
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            )}

            {/* ABA MATCHES */}
            {activeTab === 'matches' && (
                <div className="animate-fade-in grid grid-cols-12 gap-8 h-[calc(100vh-140px)]">
                    <div className="col-span-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col">
                    <div className="mb-8">
                        <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-4">Selecione seu tom de pele</h3>
                        <div className="flex flex-wrap gap-3">
                        {Object.keys(colorPalettes).map((key) => (
                            <button
                            key={key}
                            onClick={() => setSelectedSkinTone(key)}
                            className={`w-12 h-12 rounded-full border-4 transition-all duration-300 relative shadow-sm ${
                                selectedSkinTone === key ? 'border-slate-900 scale-110 z-10' : 'border-white hover:scale-105 hover:border-slate-200'
                            }`}
                            style={{ backgroundColor: colorPalettes[key].hex }}
                            title={colorPalettes[key].label}
                            >
                            {selectedSkinTone === key && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                <Check size={18} strokeWidth={3} className={['dark', 'deep', 'tan'].includes(key) ? 'text-white' : 'text-slate-900'} />
                                </div>
                            )}
                            </button>
                        ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-2 italic">Tom selecionado: {colorPalettes[selectedSkinTone].label}</p>
                    </div>
                    <div className="h-px bg-slate-100 w-full mb-8"></div>
                    <div>
                        <h3 className="font-bold text-xl text-slate-800 mb-1">Sua Cartela Sugerida</h3>
                        <p className="text-2xl font-black text-purple-600 mb-2">{currentPalette.season}</p>
                        <p className="text-slate-500 text-sm leading-relaxed">{currentPalette.description}</p>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-3">
                        {currentPalette.colors.map((color, i) => (
                        <div key={i} className={`h-16 rounded-xl ${color === 'bg-white' ? 'border border-slate-200 bg-white' : color} shadow-sm flex items-center justify-center text-white/20 text-xs font-bold group hover:scale-105 transition`}>
                            <span className="opacity-0 group-hover:opacity-100 mix-blend-difference">COR {i+1}</span>
                        </div>
                        ))}
                    </div>
                    </div>
                    <div className="col-span-8 space-y-6">
                    <h3 className="font-bold text-xl text-slate-800">Estilos que combinam com {currentPalette.season}</h3>
                    <div className="grid grid-cols-3 gap-6">
                        {currentPalette.styles.map((style) => (
                        <div key={style} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-900 transition cursor-pointer flex flex-col items-center justify-center gap-4 h-40 group">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition">
                                <Shirt size={20}/>
                            </div>
                            <span className="font-medium text-slate-700">{style}</span>
                        </div>
                        ))}
                    </div>
                    </div>
                </div>
            )}

            {/* ABA FIT */}
            {activeTab === 'fit' && (
                <div className="animate-fade-in grid grid-cols-12 gap-8">
                    <div className="col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-100 rounded-xl text-blue-700"><Calculator size={24}/></div>
                            <h3 className="text-xl font-bold text-slate-800">Calculadora de Medidas</h3>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-slate-700">Sua Altura</label>
                                    <span className="text-sm font-bold text-blue-600">{fitMetrics.height} cm</span>
                                </div>
                                <input type="range" min="150" max="210" value={fitMetrics.height} onChange={(e) => setFitMetrics({...fitMetrics, height: Number(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-slate-700">Seu Peso</label>
                                    <span className="text-sm font-bold text-blue-600">{fitMetrics.weight} kg</span>
                                </div>
                                <input type="range" min="40" max="150" value={fitMetrics.weight} onChange={(e) => setFitMetrics({...fitMetrics, weight: Number(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-700 mb-3 block">Preferência de Ajuste</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['tight', 'regular', 'loose'].map((pref) => (
                                        <button key={pref} onClick={() => setFitMetrics({...fitMetrics, preference: pref})} className={`py-2 rounded-lg text-sm font-medium transition ${fitMetrics.preference === pref ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                            {pref === 'tight' ? 'Justo' : pref === 'regular' ? 'Regular' : 'Largo'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-6 border-t border-slate-100">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Teste Rápido (Pré-seleção)</p>
                                <div className="flex gap-2">
                                    <button onClick={() => loadPreset('small')} className="px-3 py-1 text-xs border border-slate-200 rounded-full hover:bg-slate-50">Perfil P</button>
                                    <button onClick={() => loadPreset('medium')} className="px-3 py-1 text-xs border border-slate-200 rounded-full hover:bg-slate-50">Perfil M</button>
                                    <button onClick={() => loadPreset('large')} className="px-3 py-1 text-xs border border-slate-200 rounded-full hover:bg-slate-50">Perfil GG</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-7 flex flex-col gap-6">
                        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex-1 flex flex-col justify-center items-center text-center shadow-xl">
                            <div className="absolute top-0 right-0 p-12 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                            <div className="absolute bottom-0 left-0 p-16 bg-purple-500 rounded-full blur-3xl opacity-20 -ml-10 -mb-10"></div>
                            <div className="relative z-10">
                                <p className="text-slate-400 font-medium mb-2">Tamanho Recomendado</p>
                                <div className="text-[8rem] font-black leading-none tracking-tighter mb-4 bg-gradient-to-b from-white to-slate-400 text-transparent bg-clip-text">{calculatedSize.size}</div>
                                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                                    <Check size={16} className="text-green-400"/>
                                    <span className="text-sm font-medium">{calculatedSize.confidence}% de compatibilidade</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><Info size={20}/></div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Por que este tamanho?</h4>
                                    <p className="text-sm text-slate-500 mt-1">Baseado em seus <strong>{fitMetrics.weight}kg</strong> e altura de <strong>{fitMetrics.height}cm</strong>, o tamanho {calculatedSize.size} oferece o melhor equilíbrio para a preferência <strong> {fitMetrics.preference === 'tight' ? 'Justa' : fitMetrics.preference === 'regular' ? 'Regular' : 'Larga'}</strong>.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ABA IMPROVE */}
            {activeTab === 'improve' && (
                <div className="animate-fade-in grid grid-cols-2 gap-12 items-center h-full">
                <div className="space-y-8">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 mb-4">Stylist <span className="text-purple-600">AI</span></h2>
                        <p className="text-lg text-slate-600">Faça o upload do seu look atual. Nossa inteligência artificial analisará proporções, cores e estilo para sugerir melhorias instantâneas.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <div className="bg-green-100 p-2 rounded-lg text-green-700"><Star size={20}/></div>
                            <div><h4 className="font-bold text-slate-800">Análise de Proporção</h4><p className="text-sm text-slate-500">Regra dos terços e silhueta.</p></div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <div className="bg-purple-100 p-2 rounded-lg text-purple-700"><User size={20}/></div>
                            <div><h4 className="font-bold text-slate-800">Harmonia de Cores</h4><p className="text-sm text-slate-500">Círculo cromático e contraste.</p></div>
                        </div>
                    </div>
                    <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition flex items-center gap-2"><Camera size={20}/> Analisar Foto Agora</button>
                </div>
                <div className="bg-slate-100 rounded-[2rem] h-[500px] flex items-center justify-center border-2 border-dashed border-slate-300 text-slate-400">
                    <div className="text-center">
                        <div className="mx-auto w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4"><Camera size={32} /></div>
                        <p>Arraste sua foto ou clique para enviar</p>
                    </div>
                </div>
                </div>
            )}

            {/* ABA TRY ON - VERSÃO FINAL (CORRIGIDA E MELHORADA) */}
            {activeTab === 'tryon' && (
                <div className="animate-fade-in h-[calc(100vh-140px)]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Sparkles className="text-purple-600" size={24} /> Provador IA Generativa
                        </h3>
                        <button onClick={resetTryOn} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"><RefreshCw size={14}/> Reiniciar</button>
                    </div>

                    {/* INPUTS Ocultos para Upload */}
                    <input 
                        type="file" 
                        ref={userFileInputRef} 
                        onChange={(e) => handleFileUpload(e, 'user')} 
                        className="hidden" 
                        accept="image/*"
                    />
                    <input 
                        type="file" 
                        ref={clothFileInputRef} 
                        onChange={(e) => handleFileUpload(e, 'cloth')} 
                        className="hidden" 
                        accept="image/*"
                    />

                    <div className="grid grid-cols-12 gap-8 h-[90%]">
                        <div className="col-span-5 flex flex-col gap-6">
                            
                            {/* BOTÃO UPLOAD USUÁRIO */}
                            <div onClick={triggerUserUpload} className={`flex-1 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${tryOnState.userImage ? 'border-purple-500 bg-purple-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}`}>
                                {tryOnState.userImage ? (
                                    <>
                                        {/* CORREÇÃO 1: object-contain para não cortar cabeça */}
                                        <img src={tryOnState.userImage} className="absolute inset-0 w-full h-full object-contain p-2 opacity-90 group-hover:opacity-100 transition bg-slate-50" />
                                        <div className="absolute top-3 right-3 bg-white p-1 rounded-full shadow-sm"><Check className="text-green-600" size={16}/></div>
                                        <div className="absolute bottom-3 bg-white/80 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm shadow-sm">Trocar Foto</div>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3"><Upload className="text-slate-400" /></div>
                                        <p className="font-bold text-slate-700">1. Sua Foto</p>
                                        <p className="text-xs text-slate-400 mt-1">Clique para enviar arquivo</p>
                                    </div>
                                )}
                            </div>

                            {/* BOTÃO UPLOAD ROUPA */}
                            <div onClick={triggerClothUpload} className={`flex-1 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${tryOnState.clothImage ? 'border-purple-500 bg-purple-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}`}>
                                {tryOnState.clothImage ? (
                                    <>
                                        {/* CORREÇÃO 1: object-contain para ver roupa inteira */}
                                        <img src={tryOnState.clothImage} className="absolute inset-0 w-full h-full object-contain p-2 opacity-90 group-hover:opacity-100 transition bg-slate-50" />
                                        <div className="absolute top-3 right-3 bg-white p-1 rounded-full shadow-sm"><Check className="text-green-600" size={16}/></div>
                                        <div className="absolute bottom-3 bg-white/80 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm shadow-sm">Trocar Roupa</div>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3"><Shirt className="text-slate-400" /></div>
                                        <p className="font-bold text-slate-700">2. A Peça</p>
                                        <p className="text-xs text-slate-400 mt-1">Clique para enviar arquivo</p>
                                    </div>
                                )}
                            </div>

                            {/* CORREÇÃO 2: SELETOR DE CATEGORIA (NOVO) */}
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold text-sm">
                                    <Layers size={16} className="text-purple-600"/> O que é a peça?
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setTryOnState(prev => ({...prev, category: 'upper_body'}))}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition border ${tryOnState.category === 'upper_body' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        Cima
                                    </button>
                                    <button 
                                        onClick={() => setTryOnState(prev => ({...prev, category: 'lower_body'}))}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition border ${tryOnState.category === 'lower_body' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        Baixo
                                    </button>
                                    <button 
                                        onClick={() => setTryOnState(prev => ({...prev, category: 'dresses'}))}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition border ${tryOnState.category === 'dresses' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        Vestido
                                    </button>
                                </div>
                            </div>

                            {/* BOTÃO GERAR */}
                            <button 
                                onClick={handleGenerate} 
                                disabled={!tryOnState.userImage || !tryOnState.clothImage || tryOnState.isGenerating} 
                                className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${(!tryOnState.userImage || !tryOnState.clothImage) ? 'bg-slate-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-purple-600 shadow-lg hover:shadow-purple-200'}`}
                            >
                                {tryOnState.isGenerating ? (
                                    <><RefreshCw className="animate-spin" size={20} /> Processando IA...</>
                                ) : (
                                    <><Sparkles size={20} /> Gerar Provador</>
                                )}
                            </button>

                            {/* Feedback de Erro */}
                            {tryOnState.error && (
                                <div className="p-3 bg-red-100 text-red-700 text-sm rounded-xl text-center border border-red-200">
                                    {tryOnState.error}
                                </div>
                            )}
                        </div>

                        <div className="col-span-7 bg-slate-100 rounded-3xl relative overflow-hidden border border-slate-200 flex items-center justify-center">
                            {tryOnState.resultImage ? (
                                <div className="relative w-full h-full group">
                                    {/* CORREÇÃO 1: object-contain para ver resultado completo */}
                                    <img src={tryOnState.resultImage} className="w-full h-full object-contain animate-fade-in" alt="Resultado Try-On"/>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-4">
                                        <button className="bg-white/20 backdrop-blur text-white p-3 rounded-full hover:bg-white/40 transition"><Share2 size={20}/></button>
                                        <a href={tryOnState.resultImage} download="look-gerado.png" className="bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition flex items-center gap-2"><Download size={18}/> Baixar</a>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-8 max-w-xs">
                                    <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 animate-pulse"><Sparkles className="text-purple-300" size={32} /></div>
                                    <h4 className="font-bold text-slate-400 text-lg">Aguardando Uploads</h4>
                                    <p className="text-sm text-slate-400 mt-2">Carregue sua foto e a foto da roupa para ver a mágica acontecer.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
      </main>
    </div>
  );
};

export default PersonalStylistApp;