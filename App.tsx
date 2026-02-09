
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
  Fingerprint as BioIcon, Camera, Laptop, Tablet, Menu, Smartphone as MobileIcon, Eye as ViewIcon, ExternalLink, Calendar
} from 'lucide-react';
import { AppMode, ChatMessage, User as UserType, GithubConfig, Package, Transaction, ActivityLog } from './types';
import { GeminiService } from './services/geminiService';
import { DatabaseService } from './services/dbService';
import { GithubService } from './services/githubService';

// --- BIOMETRIC SCAN PAGE ---
const ScanPage: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [isScanning, setIsScanning] = useState(false);
  const handleStartAuth = () => {
    setIsScanning(true);
    setTimeout(() => onFinish(), 2000);
  };
  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-[#0a0110] text-white relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,45,117,0.15)_0%,_transparent_70%)] opacity-50"></div>
      <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
        <div className="mb-12 space-y-2">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-pink-400 to-pink-600 drop-shadow-[0_0_20px_rgba(255,45,117,0.4)]">
            OneClick Studio
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500/60">
            Secure Uplink System • AI Core
          </p>
        </div>
        <div onClick={!isScanning ? handleStartAuth : undefined} className={`relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center cursor-pointer transition-transform active:scale-95 group mb-12`}>
          <div className={`absolute inset-0 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all ${!isScanning ? 'animate-pulse' : ''}`}></div>
          <Fingerprint size={isScanning ? 80 : 70} className={`${isScanning ? 'text-pink-400 scale-110' : 'text-pink-600'} transition-all duration-500 relative z-10 drop-shadow-[0_0_25px_rgba(255,45,117,0.6)] ${!isScanning ? 'animate-[float_3s_ease-in-out_infinite]' : 'animate-pulse'}`} />
          {isScanning && <div className="absolute top-0 left-0 w-full h-1 bg-pink-400 shadow-[0_0_25px_#ff2d75] rounded-full animate-[scanning_1.5s_infinite] z-20"></div>}
        </div>
        <h2 className={`text-sm md:text-xl font-bold tracking-widest uppercase transition-colors duration-500 ${isScanning ? 'text-pink-400' : 'text-slate-500'}`}>
          {isScanning ? 'Identity Scanning...' : 'Touch sensor to initiate login'}
        </h2>
      </div>
      <style>{`
        @keyframes scanning { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
      `}</style>
    </div>
  );
};

// --- AUTH PAGE (LOGIN/REGISTER) ---
const AuthPage: React.FC<{ onLoginSuccess: (user: UserType) => void }> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const db = DatabaseService.getInstance();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = isRegister ? await db.signUp(formData.email, formData.password, formData.name) : await db.signIn(formData.email, formData.password);
      if (res.error) throw res.error;
      if (isRegister) {
        alert("Registration Successful! Please check your email.");
        setIsRegister(false);
        return;
      }
      const userData = await db.getUser(formData.email, res.data.user?.id);
      if (userData) {
        if (userData.is_banned) throw new Error("Account has been terminated by system.");
        onLoginSuccess(userData);
      }
    } catch (error: any) { alert(error.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-[#0a0110] text-white p-4">
      <div className="relative w-full max-w-[420px] h-[550px] [perspective:1200px]">
        <div className={`relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] ${isRegister ? '[transform:rotateY(-180deg)]' : ''}`}>
          {/* Login Front */}
          <div className="absolute inset-0 [backface-visibility:hidden] glass-tech rounded-[3rem] p-10 flex flex-col justify-center border-pink-500/20 shadow-2xl">
            <h2 className="text-3xl font-black mb-8">System <span className="text-pink-500">Login</span></h2>
            <form onSubmit={handleAuth} className="space-y-5">
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="developer@studio" />
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="••••••••" />
              <button disabled={isLoading} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all">
                {isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Execute Login'}
              </button>
            </form>
            <button onClick={() => setIsRegister(true)} className="mt-6 text-xs text-pink-400 font-bold hover:underline">New developer? Registry here</button>
          </div>
          {/* Register Back */}
          <div className="absolute inset-0 [backface-visibility:hidden] glass-tech rounded-[3rem] p-10 flex flex-col justify-center border-pink-500/20 shadow-2xl [transform:rotateY(180deg)]">
            <h2 className="text-3xl font-black mb-8">New <span className="text-pink-500">Registry</span></h2>
            <form onSubmit={handleAuth} className="space-y-5">
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="Full Name" />
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="Email" />
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="••••••••" />
              <button disabled={isLoading} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all">
                {isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Join Studio'}
              </button>
            </form>
            <button onClick={() => setIsRegister(false)} className="mt-6 text-xs text-pink-400 font-bold hover:underline">Already registered? Access terminal</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ADMIN LOGIN PAGE ---
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
        throw new Error("Access Denied: Non-admin terminal access attempt.");
      }
    } catch (error: any) { alert(error.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0a0110] text-white p-4">
      <div className="glass-tech p-10 rounded-[3rem] w-full max-w-md border-pink-500/20 shadow-2xl">
        <div className="text-center mb-10">
          <ShieldAlert size={48} className="mx-auto text-pink-500 mb-4" />
          <h2 className="text-3xl font-black tracking-tight">Admin <span className="text-pink-500">Terminal</span></h2>
        </div>
        <form onSubmit={handleAdminAuth} className="space-y-6">
          <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm" placeholder="Admin ID" />
          <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm" placeholder="Master Key" />
          <button disabled={isLoading} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95">
            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Authorize Access'}
          </button>
        </form>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isScanned, setIsScanned] = useState(false);
  const [path, setPath] = useState(window.location.pathname);
  const [mode, setMode] = useState<AppMode>(AppMode.PREVIEW);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [projectFiles, setProjectFiles] = useState<Record<string, string>>({
    'index.html': '<div style="background:#0a0110; height:100vh; display:flex; align-items:center; justify-content:center; font-family:sans-serif; color:#ff2d75; text-align:center;"><h1>OneClick Studio</h1></div>'
  });
  const [selectedFile, setSelectedFile] = useState('index.html');
  
  const [githubConfig, setGithubConfig] = useState<GithubConfig>({ token: '', repo: '', owner: '' });
  const [buildStatus, setBuildStatus] = useState<{ status: 'idle' | 'pushing' | 'building' | 'success' | 'error', message: string, apkUrl?: string, webUrl?: string }>({ status: 'idle', message: '' });
  const [mobileTab, setMobileTab] = useState<'chat' | 'preview'>('preview');
  const [logoClicks, setLogoClicks] = useState(0);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const gemini = useRef(new GeminiService());
  const db = DatabaseService.getInstance();
  const github = useRef(new GithubService());

  useEffect(() => {
    db.getCurrentSession().then(async session => {
      if (session?.user) {
        const userData = await db.getUser(session.user.email || '', session.user.id);
        if (userData) {
          setUser(userData);
          setIsScanned(true);
        }
      }
      setAuthLoading(false);
    });
    
    db.getPackages().then(pkgs => {
      if (pkgs && pkgs.length > 0) setPackages(pkgs);
    });

    const savedGit = localStorage.getItem('github_config');
    if (savedGit) setGithubConfig(JSON.parse(savedGit));
  }, []);

  useEffect(() => {
    if (logoClicks >= 3) { setMode(AppMode.SETTINGS); setLogoClicks(0); }
  }, [logoClicks]);

  const handleLogout = async () => {
    await db.signOut();
    setUser(null);
    setIsScanned(false);
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
      if (res.files) {
        setProjectFiles(prev => ({ ...prev, ...res.files }));
        // Show project created toast
        setShowCompletion(true);
        setTimeout(() => setShowCompletion(false), 4000);
      }
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: res.answer, timestamp: Date.now(), ...res }]);
      if (user) { const updated = await db.useToken(user.id, user.email); if (updated) setUser(updated); }
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const handleBuildAPK = async () => {
    if (!githubConfig.token || !githubConfig.repo) {
      alert("Please configure GitHub settings first!");
      setMode(AppMode.SETTINGS);
      return;
    }
    setBuildStatus({ status: 'pushing', message: 'Uplinking code to GitHub...' });
    try {
      await github.current.pushToGithub(githubConfig, projectFiles);
      setBuildStatus({ status: 'building', message: 'Cloud Build sequence initiated. Please wait 3-5 mins...' });
      
      const checkInterval = setInterval(async () => {
        const details = await github.current.getLatestApk(githubConfig);
        if (details) {
          clearInterval(checkInterval);
          setBuildStatus({ status: 'success', message: 'APK Synthesized Successfully!', apkUrl: details.downloadUrl, webUrl: details.webUrl });
          setTimeout(() => {
            const qrContainer = document.getElementById('qrcode');
            if (qrContainer) {
              qrContainer.innerHTML = '';
              new (window as any).QRCode(qrContainer, { text: details.webUrl, width: 180, height: 180, colorDark: "#ff2d75", colorLight: "#ffffff" });
            }
          }, 500);
        }
      }, 15000);
    } catch (e: any) {
      setBuildStatus({ status: 'error', message: e.message || 'Build system failure.' });
    }
  };

  const handleSecureDownload = async () => {
    if (!buildStatus.apkUrl) return;
    setIsDownloading(true);
    try {
      const blob = await github.current.downloadArtifact(githubConfig, buildStatus.apkUrl);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${githubConfig.repo}-build.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      alert("Download failed: " + e.message);
    } finally {
      setIsDownloading(false);
    }
  };

  if (authLoading) return <div className="h-screen w-full flex items-center justify-center bg-[#0a0110] text-[#ff2d75]"><Loader2 className="animate-spin" size={40}/></div>;
  
  if (!user) {
    if (path === '/admin') return <AdminLoginPage onLoginSuccess={setUser} />;
    if (!isScanned) return <ScanPage onFinish={() => setIsScanned(true)} />;
    return <AuthPage onLoginSuccess={setUser} />;
  }

  return (
    <div className="h-[100dvh] flex flex-col text-slate-100 bg-[#0a0110] overflow-hidden">
      {/* Toast Notification */}
      {showCompletion && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-500">
           <div className="bg-pink-600 text-white px-8 py-4 rounded-full shadow-[0_0_40px_rgba(255,45,117,0.6)] flex items-center gap-4 border border-white/20">
              <div className="bg-white/20 p-2 rounded-full"><Sparkles className="animate-pulse" size={20}/></div>
              <div className="text-sm font-black uppercase tracking-widest">Project Synced Successfully!</div>
           </div>
        </div>
      )}

      <header className="h-16 md:h-20 border-b border-pink-500/10 glass-tech flex items-center justify-between px-4 md:px-8 z-50 relative cyber-border-pink">
        <div onClick={() => setLogoClicks(c => c + 1)} className="flex items-center gap-3 cursor-pointer select-none group">
          <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,45,117,0.5)] group-hover:scale-110 transition-transform"><Cpu size={20} className="text-white"/></div>
          <span className="font-black text-sm uppercase tracking-tighter">OneClick <span className="text-pink-400">Studio</span></span>
        </div>
        <nav className="hidden lg:flex bg-black/40 rounded-xl p-1 border border-white/5 shadow-2xl">
          {[AppMode.PREVIEW, AppMode.EDIT, AppMode.SHOP, AppMode.PROFILE].map(m => (
            <button key={m} onClick={() => setMode(m)} className={`px-6 py-2.5 text-[10px] font-black uppercase rounded-lg transition-all ${mode === m ? 'active-nav-pink' : 'text-slate-400 hover:text-white'}`}>{m}</button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-xs font-bold text-pink-400">{user.tokens} Tokens</div>
          <button onClick={() => setMode(AppMode.SETTINGS)} className={`p-2 rounded-lg transition-all ${mode === AppMode.SETTINGS ? 'bg-pink-500 text-white' : 'text-slate-400 hover:bg-white/5'} hidden md:flex`}><Settings size={20}/></button>
          <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg hidden sm:block"><LogOut size={20}/></button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative pb-20 md:pb-0">
        {mode === AppMode.PREVIEW ? (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
            <section className={`w-full lg:w-[450px] border-r border-pink-500/10 flex flex-col bg-[#01040f]/50 backdrop-blur-xl h-full ${mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
              <div className="flex-1 p-6 overflow-y-auto code-scroll space-y-6 pb-32">
                {messages.length > 0 ? messages.map(m => (
                  <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
                    {m.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 ml-2">
                        <div className="w-5 h-5 bg-pink-600 rounded-lg flex items-center justify-center shadow-lg"><Sparkles size={10} className="text-white"/></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">Neural Assistant</span>
                      </div>
                    )}
                    <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(255,45,117,0.3)]' : 'bg-slate-900/90 border border-pink-500/20 text-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden group'}`}>
                      {m.role === 'assistant' && <div className="absolute inset-0 shimmer-pink opacity-5 group-hover:opacity-10 pointer-events-none"></div>}
                      {m.content}
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
                     <BrainCircuit size={64} className="mb-6 text-pink-400 animate-pulse"/>
                     <p className="text-xs font-black uppercase tracking-[0.4em]">Neural Core Online</p>
                  </div>
                )}
                {isGenerating && (
                  <div className="flex items-center gap-4 text-pink-400 p-4 animate-pulse">
                     <Loader2 className="animate-spin" size={16}/>
                     <span className="text-[10px] font-black uppercase tracking-widest">Synthesizing Core Data...</span>
                  </div>
                )}
              </div>
              <div className="p-6 absolute bottom-0 w-full lg:w-[450px] bg-gradient-to-t from-[#0a0110] to-transparent">
                <div className="relative glass-tech rounded-[2rem] p-2 flex items-center gap-2 border-white/10">
                   <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder="Describe your dream app..." className="flex-1 bg-transparent p-4 text-xs h-16 outline-none text-white resize-none" />
                   <button onClick={handleSend} disabled={isGenerating} className="p-4 bg-pink-600 rounded-2xl text-white shadow-lg active:scale-90 transition-transform"><Send size={18}/></button>
                </div>
              </div>
            </section>
            
            <section className={`flex-1 flex flex-col items-center justify-start md:justify-center p-4 md:p-4 relative overflow-y-auto md:overflow-hidden ${mobileTab === 'chat' ? 'hidden lg:flex' : 'flex'}`}>
              <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none"></div>
              
              <div className="relative z-10 w-full max-w-[310px] md:max-w-[360px] aspect-[9/18.5] md:h-[720px] bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] border-[6px] md:border-[8px] border-slate-800 shadow-[0_0_60px_-15px_rgba(255,45,117,0.3)] overflow-hidden flex flex-col mt-4 md:mt-0 transition-transform duration-500">
                 <div className="h-6 md:h-8 w-full flex items-center justify-center"><div className="w-16 md:w-20 h-4 md:h-5 bg-slate-800 rounded-b-xl"></div></div>
                 <iframe srcDoc={projectFiles['index.html']} className="flex-1 w-full bg-white" title="preview" />
                 <div className="h-8 md:h-10 w-full flex items-center justify-center gap-6 md:gap-8 bg-slate-800/20 backdrop-blur-md">
                    <button className="text-slate-500"><Circle size={12}/></button>
                    <button className="text-slate-500"><Square size={12}/></button>
                 </div>
              </div>
              
              <button onClick={() => { setMode(AppMode.EDIT); handleBuildAPK(); }} className="absolute bottom-10 right-10 flex items-center gap-3 px-8 py-4 bg-pink-600 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(255,45,117,0.5)] active:scale-95 transition-all z-30 hidden lg:flex">
                <Rocket size={18}/> Build Android APK
              </button>
            </section>

            {/* Mobile Chat/Preview Toggle - Outside sections to be visible everywhere */}
            <div className="lg:hidden fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 flex gap-1 z-[120] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
               <button onClick={() => setMobileTab('chat')} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${mobileTab === 'chat' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>Chat</button>
               <button onClick={() => setMobileTab('preview')} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${mobileTab === 'preview' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>Visual</button>
            </div>
          </div>
        ) : mode === AppMode.EDIT ? (
          <div className="flex-1 flex overflow-hidden">
            {buildStatus.status === 'idle' ? (
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-500">
                <aside className="w-full md:w-64 border-r border-pink-500/10 bg-black/20 p-4 space-y-2 overflow-y-auto">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500 mb-4 px-2">Project Files</h3>
                   {Object.keys(projectFiles).map(file => (
                     <button key={file} onClick={() => setSelectedFile(file)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${selectedFile === file ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20 shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}>
                        <FileCode size={16} /> {file}
                     </button>
                   ))}
                </aside>
                <main className="flex-1 bg-[#050108] p-4 overflow-hidden flex flex-col">
                   <div className="flex items-center justify-between mb-4 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                        <span className="text-xs font-mono text-pink-400">{selectedFile}</span>
                      </div>
                      <button onClick={handleBuildAPK} className="px-6 py-2 bg-pink-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2">
                        <Rocket size={14}/> Run Build
                      </button>
                   </div>
                   <textarea 
                      value={projectFiles[selectedFile]} 
                      onChange={e => setProjectFiles(prev => ({...prev, [selectedFile]: e.target.value}))}
                      className="flex-1 w-full bg-black/40 border border-white/5 rounded-2xl p-6 font-mono text-xs text-slate-300 outline-none focus:border-pink-500/20 resize-none code-scroll"
                   />
                </main>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-10 animate-in fade-in">
                 <div className="glass-tech w-full max-w-2xl p-10 md:p-16 rounded-[3rem] border-pink-500/20 text-center relative overflow-hidden">
                    <div className="shimmer-pink absolute inset-0 pointer-events-none opacity-20"></div>
                    {buildStatus.status === 'success' ? (
                      <div className="space-y-8 animate-in zoom-in duration-500">
                         <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-bounce"><CheckCircle2 size={48}/></div>
                         <h2 className="text-3xl md:text-4xl font-black text-white">APK Ready for Install</h2>
                         
                         <div className="p-6 bg-white rounded-3xl inline-block shadow-2xl relative">
                            <div id="qrcode" className="min-w-[180px] min-h-[180px]"></div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-pink-600 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest text-white shadow-xl">Scan to View Page</div>
                         </div>

                         <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                              onClick={handleSecureDownload}
                              disabled={isDownloading}
                              className="flex items-center justify-center gap-3 px-10 py-5 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all disabled:opacity-50"
                            >
                              {isDownloading ? <Loader2 className="animate-spin" size={20}/> : <Download size={20}/>} 
                              {isDownloading ? "Downloading..." : "Secure Download"}
                            </button>
                            <button onClick={() => setBuildStatus({status: 'idle', message: ''})} className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-sm hover:bg-white/10 transition-all">Back to Editor</button>
                         </div>
                         <p className="text-[10px] text-pink-400/50 uppercase tracking-widest italic">Scanning the code takes you to the GitHub build page for secure download.</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="flex justify-center mb-8">
                           <div className="relative">
                              <Terminal size={80} className="text-pink-500 animate-pulse"/>
                              <Loader2 size={32} className="absolute -top-2 -right-2 text-white animate-spin"/>
                           </div>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-white uppercase">{buildStatus.status === 'pushing' ? 'Syncing Repository' : 'Compiling Native Binaries'}</h2>
                        <p className="text-pink-400/70 font-mono text-sm h-12">{buildStatus.message}</p>
                        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-white/5">
                           <div className="h-full bg-gradient-to-r from-pink-600 to-purple-600 w-3/4 animate-[progress_5s_infinite] shadow-[0_0_15px_#ff2d75]"></div>
                        </div>
                        <button onClick={() => setBuildStatus({status: 'idle', message: ''})} className="text-xs text-slate-500 hover:text-white transition-colors">Cancel Build</button>
                      </div>
                    )}
                 </div>
              </div>
            )}
          </div>
        ) : mode === AppMode.SETTINGS ? (
          <div className="flex-1 p-6 md:p-20 overflow-y-auto">
             <div className="max-w-2xl mx-auto glass-tech p-10 md:p-16 rounded-[3rem] border-pink-500/20 shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center"><Github size={24} className="text-white"/></div>
                   <h2 className="text-3xl font-black tracking-tight text-white">GitHub <span className="text-pink-400">Uplink</span></h2>
                </div>
                <div className="space-y-6">
                   <input type="password" value={githubConfig.token} onChange={e => setGithubConfig({...githubConfig, token: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-pink-400 outline-none" placeholder="Personal Access Token" />
                   <div className="grid grid-cols-2 gap-4">
                      <input type="text" value={githubConfig.owner} onChange={e => setGithubConfig({...githubConfig, owner: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white" placeholder="Username" />
                      <input type="text" value={githubConfig.repo} onChange={e => setGithubConfig({...githubConfig, repo: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white" placeholder="Repo Name" />
                   </div>
                   <button onClick={() => { localStorage.setItem('github_config', JSON.stringify(githubConfig)); alert("Saved!"); setMode(AppMode.PREVIEW); }} className="w-full py-5 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl flex items-center justify-center gap-3"><Save size={20}/> Save Config</button>
                </div>
             </div>
          </div>
        ) : mode === AppMode.SHOP ? (
          <div className="flex-1 p-6 md:p-20 overflow-y-auto">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {(packages.length > 0 ? packages : [{ name: 'Starter', tokens: 50, price: 500 }, { name: 'Pro', tokens: 250, price: 1500 }, { name: 'Elite', tokens: 1000, price: 5000 }]).map((p, i) => (
                  <div key={i} className="glass-tech p-10 rounded-[3rem] text-center group hover:border-pink-500/50 transition-all border-white/5">
                     <PackageIcon size={48} className="mx-auto text-pink-500 mb-6 group-hover:scale-125 transition-transform"/>
                     <h3 className="text-2xl font-black mb-2">{p.name}</h3>
                     <div className="text-5xl font-black text-white my-6 tracking-tighter">{p.tokens} <span className="text-[10px] opacity-30 uppercase tracking-[0.3em]">Units</span></div>
                     <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black hover:bg-pink-600 transition-all shadow-xl">৳ {p.price}</button>
                  </div>
                ))}
             </div>
          </div>
        ) : mode === AppMode.PROFILE ? (
          <div className="flex-1 p-6 md:p-10 overflow-y-auto scroll-smooth">
             <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="glass-tech p-8 md:p-12 rounded-[3rem] border-pink-500/10 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8">
                      {user.is_verified && <div className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-[10px] font-black uppercase text-pink-400 tracking-widest"><ShieldCheck size={14}/> Verified Pro</div>}
                   </div>
                   <div className="relative group">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-4 border-pink-500/20 p-1.5 shadow-2xl transition-transform group-hover:scale-105 duration-300">
                         <img src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} className="w-full h-full object-cover rounded-[2rem]" alt="Profile"/>
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-pink-600 p-2 rounded-xl border-4 border-[#0a0110] shadow-lg"><Edit2 size={16} className="text-white"/></div>
                   </div>
                   <div className="text-center md:text-left space-y-2">
                      <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">{user.name}</h2>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                         <span className="text-pink-400 font-bold text-xs bg-pink-500/5 px-3 py-1 rounded-lg border border-pink-500/10">{user.email}</span>
                         {user.isAdmin && <span className="text-purple-400 font-bold text-xs bg-purple-500/5 px-3 py-1 rounded-lg border border-purple-500/10 uppercase tracking-tighter">System Lead</span>}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="glass-tech p-6 rounded-3xl border-pink-500/5 flex items-center gap-4 hover:border-pink-500/20 transition-all">
                      <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500"><Wallet size={24}/></div>
                      <div>
                         <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Available Units</div>
                         <div className="text-2xl font-black text-white">{user.tokens}</div>
                      </div>
                   </div>
                   <div className="glass-tech p-6 rounded-3xl border-pink-500/5 flex items-center gap-4 hover:border-pink-500/20 transition-all">
                      <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500"><Calendar size={24}/></div>
                      <div>
                         <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Joined Studio</div>
                         <div className="text-xl font-bold text-white">{new Date(user.joinedAt).toLocaleDateString()}</div>
                      </div>
                   </div>
                   <div className="glass-tech p-6 rounded-3xl border-pink-500/5 flex items-center gap-4 hover:border-pink-500/20 transition-all">
                      <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500"><Activity size={24}/></div>
                      <div>
                         <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Account Status</div>
                         <div className="text-xl font-bold text-green-400">{user.is_banned ? 'Suspended' : 'Active'}</div>
                      </div>
                   </div>
                </div>

                <div className="glass-tech p-8 md:p-10 rounded-[3rem] border-pink-500/5 space-y-6">
                   <div className="flex items-center gap-3 mb-2">
                      <MessageSquare size={20} className="text-pink-500"/>
                      <h3 className="text-lg font-black uppercase tracking-widest">Developer Bio</h3>
                   </div>
                   <p className="text-slate-400 text-sm leading-relaxed italic border-l-2 border-pink-500/20 pl-6 py-2">
                      {user.bio || "This developer is still fine-tuning their biological matrix description. No bio updated yet."}
                   </p>
                   
                   <div className="pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-bold">
                      <div className="space-y-4">
                         <div className="flex justify-between items-center text-slate-500 uppercase tracking-tighter"><span>Member ID</span> <span className="text-white font-mono">{user.id.slice(0, 12)}...</span></div>
                         <div className="flex justify-between items-center text-slate-500 uppercase tracking-tighter"><span>Security Clearance</span> <span className="text-white">{user.isAdmin ? 'Level 5 (Admin)' : 'Level 1 (Dev)'}</span></div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center text-slate-500 uppercase tracking-tighter"><span>Hardware Uplink</span> <span className="text-green-400">Stable</span></div>
                         <div className="flex justify-between items-center text-slate-500 uppercase tracking-tighter"><span>Verification Status</span> <span className={user.is_verified ? "text-pink-500" : "text-slate-400"}>{user.is_verified ? 'Authenticated' : 'Pending'}</span></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        ) : null}

        {/* --- MOBILE BOTTOM NAVIGATION --- */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0110]/95 backdrop-blur-3xl border-t border-pink-500/10 flex items-center justify-around p-2 pb-6 z-[100] animate-in slide-in-from-bottom duration-300">
          {[
            { id: AppMode.PREVIEW, icon: LayoutDashboard, label: 'Preview' },
            { id: AppMode.EDIT, icon: Code2, label: 'Edit' },
            { id: AppMode.SHOP, icon: ShoppingCart, label: 'Shop' },
            { id: AppMode.PROFILE, icon: UserIcon, label: 'Profile' }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setMode(item.id)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all active:scale-90 ${mode === item.id ? 'text-pink-500' : 'text-slate-500'}`}
            >
              <item.icon size={18} strokeWidth={mode === item.id ? 3 : 2} />
              <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
