
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Smartphone, Loader2, Zap, Cpu, LogOut, Check, Rocket, Settings,
  Download, Globe, Activity, Terminal, ShieldAlert, Package as PackageIcon, QrCode, 
  AlertCircle, Key, Mail, ArrowLeft, FileCode, ShoppingCart, User as UserIcon,
  ChevronRight, Github, Save, Trash2, Square, Circle, RefreshCw, Fingerprint,
  User, Lock, Eye, EyeOff, MessageSquare, Monitor, CreditCard, Upload, X, ShieldCheck,
  FileJson, Layout, Users, BarChart3, Clock, Wallet, CheckCircle2, XCircle, Search, TrendingUp,
  Plus, Edit2, Ban, ShieldX, LayoutDashboard, History, Gift, Filter, Bell, ListTodo,
  Trophy, Star, Award, Layers, Target, Code2, Sparkles, BrainCircuit, ShieldEllipsis, 
  Fingerprint as BioIcon, Camera, Laptop, Tablet, Menu, Smartphone as MobileIcon, Eye as ViewIcon
} from 'lucide-react';
import { AppMode, ChatMessage, User as UserType, GithubConfig, Package, Transaction, ActivityLog } from './types';
import { GeminiService } from './services/geminiService';
import { DatabaseService } from './services/dbService';
import { GithubService } from './services/githubService';

// --- (Auth & Other Components are kept as is) ---
const AdminLoginPage: React.FC<{ onLoginSuccess: (user: UserType) => void }> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const db = DatabaseService.getInstance();

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await db.signIn(formData.email, formData.password);
      if (res.error) throw res.error;
      const userData = await db.getUser(formData.email, res.data.user?.id);
      if (userData && userData.isAdmin) {
        onLoginSuccess(userData);
      } else {
        throw new Error("Access Denied: Not an admin account.");
      }
    } catch (error: any) {
      alert(error.message || "Admin access failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-[#020617] text-white p-4">
      <div className="glass-tech p-10 rounded-[3rem] w-full max-w-md border-cyan-500/20 shadow-2xl animate-in zoom-in-95">
        <div className="text-center mb-10">
          <ShieldAlert size={48} className="mx-auto text-cyan-500 mb-4" />
          <h2 className="text-3xl font-black tracking-tight">Admin <span className="text-cyan-400">Terminal</span></h2>
          <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Master Control Access Only</p>
        </div>
        <form onSubmit={handleAdminAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Admin ID</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-cyan-500/50 transition-all text-sm" placeholder="admin@oneclick.studio" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Master Token</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-cyan-500/50 transition-all text-sm" placeholder="••••••••" />
          </div>
          <button disabled={isLoading} className="w-full py-4 bg-cyan-600 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-cyan-500 transition-all active:scale-95 flex items-center justify-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" /> : 'Authorize Terminal'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ScanPage: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [isScanning, setIsScanning] = useState(false);
  const handleStartAuth = () => {
    setIsScanning(true);
    setTimeout(() => onFinish(), 2000);
  };
  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-start pt-6 md:justify-center md:pt-0 bg-[#020617] text-white relative overflow-hidden font-sans p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent opacity-50"></div>
      <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
        <div className="mb-6 md:mb-12 space-y-1 md:space-y-2 animate-in fade-in slide-in-from-top-8 duration-1000">
          <h1 className="text-3xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-cyan-400 to-blue-600 drop-shadow-[0_0_20px_rgba(6,182,212,0.3)] px-4">
            Welcome to OneClick Studio
          </h1>
          <p className="text-[8px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-500 opacity-60">
            Uplink initiated • AI Developer Interface
          </p>
        </div>
        <div onClick={!isScanning ? handleStartAuth : undefined} className={`relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center cursor-pointer transition-transform active:scale-95 group mb-6 md:mb-12`}>
          <div className={`absolute inset-0 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all ${!isScanning ? 'animate-pulse' : ''}`}></div>
          <Fingerprint size={isScanning ? 80 : 70} className={`${isScanning ? 'text-cyan-400 scale-110' : 'text-cyan-600'} transition-all duration-500 relative z-10 drop-shadow-[0_0_25px_rgba(6,182,212,0.6)] ${!isScanning ? 'animate-[float_3s_ease-in-out_infinite]' : 'animate-pulse'}`} />
          {isScanning && <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_25px_#22d3ee] rounded-full animate-[scanning_1.5s_infinite] z-20"></div>}
        </div>
        <h2 className={`text-xs md:text-xl font-bold tracking-widest uppercase transition-colors duration-500 ${isScanning ? 'text-cyan-400' : 'text-slate-400'}`}>
          {isScanning ? 'Identity Scanning...' : 'Touch sensor to access system'}
        </h2>
      </div>
      <style>{`
        @keyframes scanning { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(3deg); } }
      `}</style>
    </div>
  );
};

const AuthPage: React.FC<{ onLoginSuccess: (user: UserType) => void, initialUpdateMode?: boolean }> = ({ onLoginSuccess, initialUpdateMode = false }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const db = DatabaseService.getInstance();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = isRegister ? await db.signUp(formData.email, formData.password, formData.name) : await db.signIn(formData.email, formData.password);
      if (res.error) throw res.error;
      if (isRegister) {
        alert("রেজিস্ট্রেশন সফল হয়েছে! ইমেইল চেক করুন।");
        setIsRegister(false);
        return;
      }
      const userData = await db.getUser(formData.email, res.data.user?.id);
      if (userData) {
        if (userData.is_banned) throw new Error("আপনার অ্যাকাউন্টটি সিস্টেম থেকে ব্যান করা হয়েছে।");
        onLoginSuccess(userData);
      }
    } catch (error: any) { alert(error.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-start pt-6 md:justify-center md:pt-0 bg-[#020617] text-white relative overflow-hidden font-sans p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent opacity-50"></div>
      <div className="relative w-full max-w-[400px] h-[520px] md:h-[580px] [perspective:1200px] animate-in fade-in zoom-in-95 duration-500 mt-2 md:mt-0">
        <div className={`relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] ${isRegister ? '[transform:rotateY(-90deg)]' : ''}`}>
          <div className="absolute inset-0 [backface-visibility:hidden] glass-tech rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col justify-center shadow-2xl [transform:translateZ(150px)] md:[transform:translateZ(200px)]">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-8">System <span className="text-cyan-400">Login</span></h2>
            <form onSubmit={handleAuth} className="space-y-4">
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm" placeholder="dev@oneclick.studio" />
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm" placeholder="••••••••" />
              <button disabled={isLoading} className="w-full py-4 bg-cyan-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95">{isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Execute Login'}</button>
            </form>
            <button onClick={() => setIsRegister(true)} className="mt-4 text-xs text-cyan-400 font-bold hover:underline">No account? Create system entry</button>
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] bg-cyan-600/10 backdrop-blur-xl border border-cyan-500/20 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col justify-center shadow-2xl [transform:rotateY(90deg)_translateZ(150px)] md:[transform:rotateY(90deg)_translateZ(200px)]">
            <h2 className="text-2xl md:text-3xl font-black mb-8 tracking-tight text-cyan-400">New <span className="text-white">Registry</span></h2>
            <form onSubmit={handleAuth} className="space-y-4">
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm" placeholder="Full Name" />
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm" placeholder="Email" />
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm" placeholder="••••••••" />
              <button disabled={isLoading} className="w-full py-4 bg-cyan-500 text-black font-black uppercase text-sm shadow-xl active:scale-95">{isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Register Now'}</button>
            </form>
            <button onClick={() => setIsRegister(false)} className="mt-6 text-xs text-slate-400 font-bold hover:text-white">Already registered? Login instead</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [path, setPath] = useState(window.location.pathname);
  const [mode, setMode] = useState<AppMode>(AppMode.PREVIEW);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectFiles, setProjectFiles] = useState<Record<string, string>>({
    'index.html': '<h1 style="color:cyan; text-align:center; padding:50px;">OneClick Studio Ready</h1>'
  });
  const [logoClicks, setLogoClicks] = useState(0);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isPurchasing, setIsPurchasing] = useState<Package | null>(null);
  
  // Mobile specific state
  const [mobileTab, setMobileTab] = useState<'chat' | 'preview'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const gemini = useRef(new GeminiService());
  const db = DatabaseService.getInstance();

  useEffect(() => {
    db.getCurrentSession().then(async session => {
      if (session?.user) {
        const userData = await db.getUser(session.user.email || '', session.user.id);
        if (userData) { setUser(userData); if (path === '/') navigate('/dashboard'); }
      }
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (logoClicks >= 3) { setMode(AppMode.SETTINGS); setLogoClicks(0); }
  }, [logoClicks]);

  useEffect(() => {
    if (mode === AppMode.SHOP) {
      db.getPackages().then(setPackages);
    }
  }, [mode]);

  const navigate = (to: string) => {
    try { window.history.pushState({}, '', to); } catch (e) {}
    setPath(to);
  };

  const handleLogout = async () => {
    await db.signOut();
    setUser(null);
    navigate('/login');
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    const text = input;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() }]);
    setInput('');
    setIsGenerating(true);
    if (window.innerWidth < 768) setMobileTab('preview');
    try {
      const res = await gemini.current.generateWebsite(text, projectFiles, messages);
      if (res.files) setProjectFiles(prev => ({ ...prev, ...res.files }));
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: res.answer, timestamp: Date.now(), ...res }]);
      if (user) { const updated = await db.useToken(user.id, user.email); if (updated) setUser(updated); }
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result as string;
        await db.updateUserAvatar(user.id, base64);
        setUser({ ...user, avatar_url: base64 });
      } catch (err: any) { alert(err.message); }
    };
    reader.readAsDataURL(file);
  };

  if (authLoading) return <div className="h-screen w-full flex items-center justify-center bg-[#020617] text-cyan-500"><Loader2 className="animate-spin" size={40}/></div>;
  if (!user) return path === '/admin' ? <AdminLoginPage onLoginSuccess={setUser} /> : (path === '/login' ? <AuthPage onLoginSuccess={setUser} /> : <ScanPage onFinish={() => navigate('/login')} />);

  return (
    <div className="h-[100dvh] flex flex-col font-['Hind_Siliguri'] text-slate-100 bg-[#020617] overflow-hidden">
      {/* --- HEADER --- */}
      <header className="h-16 md:h-20 border-b border-cyan-500/10 glass-tech flex items-center justify-between px-4 md:px-8 z-50 relative cyber-border">
        <div onClick={() => setLogoClicks(c => c + 1)} className="flex items-center gap-2 md:gap-3 cursor-pointer select-none group">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-cyan-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:rotate-12 transition-transform"><Cpu size={18} className="text-black"/></div>
          <span className="font-black text-xs md:text-sm uppercase tracking-tighter hidden sm:block">OneClick <span className="text-cyan-400">Studio</span></span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex bg-black/40 rounded-xl p-1 border border-white/5 neo-shadow">
          {[AppMode.PREVIEW, AppMode.EDIT, AppMode.SHOP, AppMode.PROFILE].map(m => (
            <button key={m} onClick={() => setMode(m)} className={`px-5 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${mode === m ? 'active-nav' : 'text-slate-400 hover:text-white'}`}>{m}</button>
          ))}
        </nav>

        {/* Mobile View Toggles */}
        {mode === AppMode.PREVIEW && (
          <div className="lg:hidden flex bg-black/40 rounded-lg p-1 border border-white/5">
            <button onClick={() => setMobileTab('chat')} className={`p-2 rounded-md ${mobileTab === 'chat' ? 'bg-cyan-500 text-black' : 'text-slate-400'}`}><MessageSquare size={16}/></button>
            <button onClick={() => setMobileTab('preview')} className={`p-2 rounded-md ${mobileTab === 'preview' ? 'bg-cyan-500 text-black' : 'text-slate-400'}`}><ViewIcon size={16}/></button>
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex px-3 py-1.5 md:px-4 md:py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] md:text-xs font-bold text-cyan-400">{user.tokens} Tokens</div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-300"><Menu size={20}/></button>
          <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors hidden sm:block"><LogOut size={18}/></button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-64 glass-tech border-l border-cyan-500/10 p-6 flex flex-col gap-4 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-cyan-400">System Menu</span>
              <button onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
            </div>
            {[AppMode.PREVIEW, AppMode.EDIT, AppMode.SHOP, AppMode.PROFILE].map(m => (
              <button key={m} onClick={() => {setMode(m); setIsSidebarOpen(false);}} className={`w-full text-left p-4 rounded-xl text-xs font-black uppercase tracking-widest ${mode === m ? 'bg-cyan-500 text-black' : 'bg-white/5 text-slate-400'}`}>{m}</button>
            ))}
            <div className="mt-auto border-t border-white/5 pt-6">
               <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 text-red-400 font-bold text-xs uppercase"><LogOut size={18}/> Logout Session</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex overflow-hidden relative">
        {mode === AppMode.PREVIEW ? (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
            {/* CHAT SECTION */}
            <section className={`w-full lg:w-[420px] xl:w-[480px] border-r border-cyan-500/10 flex flex-col bg-[#01040f]/80 backdrop-blur-md h-full transition-all ${mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
              <div className="flex-1 p-4 md:p-6 overflow-y-auto code-scroll space-y-6 pb-40">
                {messages.length > 0 ? messages.map(m => (
                  <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[90%] p-4 rounded-2xl md:rounded-[1.5rem] shadow-xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-cyan-600/90 text-white rounded-tr-none' : 'bg-slate-900/60 border border-white/5 text-slate-100 rounded-tl-none neo-shadow'}`}>
                      {m.content}
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-20">
                     <BrainCircuit size={64} className="mb-6 text-cyan-400 animate-pulse"/>
                     <p className="text-xs font-black uppercase tracking-[0.3em]">AI Core Standby...</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 md:p-6 absolute bottom-0 w-full lg:w-inherit bg-gradient-to-t from-[#01040f] to-transparent z-10">
                <div className="relative group">
                  <textarea 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} 
                    placeholder="Describe your next feature..." 
                    className="w-full bg-slate-900/80 border border-cyan-500/20 rounded-[1.5rem] p-4 pr-16 text-xs h-24 outline-none text-white focus:border-cyan-500/50 transition-all resize-none shadow-2xl glass-tech"
                  />
                  <button onClick={handleSend} disabled={isGenerating} className="absolute bottom-4 right-4 p-3 bg-cyan-600 rounded-xl text-white shadow-lg hover:bg-cyan-500 transition-all disabled:opacity-50 active:scale-90">
                    {isGenerating ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>}
                  </button>
                </div>
              </div>
            </section>

            {/* PREVIEW SECTION */}
            <section className={`flex-1 flex flex-col bg-[#020617] h-full items-center justify-center p-4 md:p-10 relative overflow-hidden ${mobileTab === 'chat' ? 'hidden lg:flex' : 'flex'}`}>
               <div className="absolute top-0 left-0 w-full h-full bg-grid pointer-events-none z-0 opacity-40"></div>
               
               {/* Controls Bar */}
               <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 glass-tech p-1.5 rounded-full z-20 border-white/5 neo-shadow sm:flex hidden">
                 <button className="p-2 rounded-full text-cyan-400 bg-cyan-500/10"><Smartphone size={16}/></button>
                 <button className="p-2 rounded-full text-slate-400 hover:text-white"><Tablet size={16}/></button>
                 <button className="p-2 rounded-full text-slate-400 hover:text-white"><Laptop size={16}/></button>
               </div>

               {/* Scalable Phone Container */}
               <div className="relative z-10 w-full h-full flex items-center justify-center">
                 <div className="bg-slate-900 rounded-[3rem] md:rounded-[4rem] h-[680px] w-[320px] md:h-[750px] md:w-[360px] border-[10px] border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden group phone-frame-scale relative">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-800 rounded-b-2xl z-30"></div>
                   <iframe key={Object.keys(projectFiles).join('')} srcDoc={projectFiles['index.html'] || ''} title="preview" className="w-full h-full border-none bg-white" />
                 </div>
               </div>
               
               {/* Decorative elements */}
               <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/5 blur-[100px] rounded-full"></div>
               <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/5 blur-[100px] rounded-full"></div>
            </section>
          </div>
        ) : mode === AppMode.SHOP ? (
          <div className="flex-1 p-4 md:p-16 overflow-y-auto custom-scroll animate-in fade-in duration-500">
             <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tighter">Token <span className="text-cyan-400">Vault</span></h1>
                  <p className="text-slate-400 text-sm md:text-base font-medium">Upgrade your system capabilities</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-20">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="glass-tech p-8 md:p-10 rounded-[3rem] border-white/5 relative transition-all hover:scale-[1.02] group shadow-2xl hover:border-cyan-500/30 overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity"><ShoppingCart size={120}/></div>
                      <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-black transition-all"><ShoppingCart size={24}/></div>
                      <h3 className="text-2xl font-black mb-1 tracking-tight">{pkg.name}</h3>
                      <div className="text-5xl font-black text-white mb-8 mt-6 tracking-tighter">{pkg.tokens} <span className="text-xs opacity-30 ml-1 font-black uppercase tracking-widest">Units</span></div>
                      <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-lg hover:bg-cyan-500 hover:text-black transition-all shadow-xl active:scale-95">৳ {pkg.price}</button>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        ) : mode === AppMode.PROFILE ? (
          <div className="flex-1 overflow-y-auto custom-scroll p-4 md:p-10 animate-in fade-in duration-700">
            <div className="max-w-5xl mx-auto space-y-8 pb-20">
               <div className="glass-tech p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border-cyan-500/10 shadow-2xl flex flex-col md:flex-row items-center gap-10 group relative overflow-hidden">
                  <div className="shimmer-bg absolute inset-0 opacity-10 pointer-events-none"></div>
                  <div className="relative shrink-0">
                     <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-[3rem] border-4 border-cyan-500/20 p-1.5 bg-slate-900/50 shadow-2xl group-hover:scale-105 transition-all duration-700 backdrop-blur-md overflow-hidden">
                        <img src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} className="w-full h-full object-cover rounded-[2.5rem]" alt="Profile"/>
                        <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center gap-2">
                           <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                           <Camera className="text-cyan-400" size={28}/>
                           <span className="text-[10px] font-black uppercase text-white tracking-widest">Update</span>
                        </label>
                     </div>
                     <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center border-4 border-[#020617] shadow-xl">
                        <Sparkles className="text-black" size={18}/>
                     </div>
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-6">
                     <div>
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">{user.name}</h2>
                          {user.is_verified && <ShieldCheck className="text-cyan-400" size={24}/>}
                        </div>
                        <p className="text-cyan-400/50 font-black uppercase tracking-[0.4em] text-[10px]">{user.email}</p>
                     </div>
                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <div className="px-6 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center gap-4 shadow-xl">
                           <Wallet className="text-cyan-400" size={20}/>
                           <span className="text-xl font-black text-white">{user.tokens} <span className="text-[10px] opacity-30 uppercase">Tokens</span></span>
                        </div>
                        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                           <Clock size={16}/> Joined: {new Date(user.joinedAt).toLocaleDateString()}
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { label: 'Total Builds', value: '12', icon: Layers, color: 'text-blue-400' },
                    { label: 'Latency', value: '45ms', icon: Activity, color: 'text-green-400' },
                    { label: 'Uptime', value: '99%', icon: Target, color: 'text-cyan-400' },
                    { label: 'Efficiency', value: 'High', icon: Zap, color: 'text-yellow-400' }
                  ].map((stat, i) => (
                    <div key={i} className="glass-tech p-6 md:p-8 rounded-[2.5rem] border-white/5 hover:border-cyan-500/20 transition-all group">
                       <stat.icon className={`mb-4 ${stat.color} group-hover:scale-110 transition-transform`} size={24}/>
                       <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                       <h4 className="text-2xl font-black text-white tracking-tighter">{stat.value}</h4>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default App;
