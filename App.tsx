
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
  Fingerprint as BioIcon, Camera, Laptop, Tablet, Menu, Smartphone as MobileIcon, Eye as ViewIcon, ExternalLink
} from 'lucide-react';
import { AppMode, ChatMessage, User as UserType, GithubConfig, Package, Transaction, ActivityLog } from './types';
import { GeminiService } from './services/geminiService';
import { DatabaseService } from './services/dbService';
import { GithubService } from './services/githubService';

// --- Auth components are restored and themed ---

const App: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [path, setPath] = useState(window.location.pathname);
  const [mode, setMode] = useState<AppMode>(AppMode.PREVIEW);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectFiles, setProjectFiles] = useState<Record<string, string>>({
    'index.html': '<div style="background:#0a0110; height:100vh; display:flex; align-items:center; justify-content:center; font-family:sans-serif; color:#ff2d75;"><h1>System Online</h1></div>'
  });
  
  // Build & Config States
  const [githubConfig, setGithubConfig] = useState<GithubConfig>({ token: '', repo: '', owner: '' });
  const [buildStatus, setBuildStatus] = useState<{ status: 'idle' | 'pushing' | 'building' | 'success' | 'error', message: string, apkUrl?: string }>({ status: 'idle', message: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'chat' | 'preview'>('chat');
  const [logoClicks, setLogoClicks] = useState(0);

  // Added state for packages to correctly handle async data and avoid JSX Promise errors
  const [packages, setPackages] = useState<Package[]>([]);

  const gemini = useRef(new GeminiService());
  const db = DatabaseService.getInstance();
  const github = useRef(new GithubService());

  useEffect(() => {
    db.getCurrentSession().then(async session => {
      if (session?.user) {
        const userData = await db.getUser(session.user.email || '', session.user.id);
        if (userData) setUser(userData);
      }
      setAuthLoading(false);
    });
    
    // Fetch packages into state on mount
    db.getPackages().then(pkgs => {
      if (pkgs && pkgs.length > 0) setPackages(pkgs);
    });

    // Load Github Config from local storage
    const savedGit = localStorage.getItem('github_config');
    if (savedGit) setGithubConfig(JSON.parse(savedGit));
  }, []);

  useEffect(() => {
    if (logoClicks >= 3) { setMode(AppMode.SETTINGS); setLogoClicks(0); }
  }, [logoClicks]);

  const handleLogout = async () => {
    await db.signOut();
    setUser(null);
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

  const handleBuildAPK = async () => {
    if (!githubConfig.token || !githubConfig.repo) {
      alert("গিটহাব কনফিগারেশন সেট করুন!");
      setMode(AppMode.SETTINGS);
      return;
    }
    setMode(AppMode.EDIT);
    setBuildStatus({ status: 'pushing', message: 'Uplinking code to GitHub...' });
    try {
      await github.current.pushToGithub(githubConfig, projectFiles);
      setBuildStatus({ status: 'building', message: 'Cloud Build sequence initiated. Please wait 3-5 mins...' });
      
      const checkInterval = setInterval(async () => {
        const details = await github.current.getLatestApk(githubConfig);
        if (details) {
          clearInterval(checkInterval);
          setBuildStatus({ status: 'success', message: 'APK Synthesized Successfully!', apkUrl: details.downloadUrl });
          setTimeout(() => {
            const qrContainer = document.getElementById('qrcode');
            if (qrContainer) {
              qrContainer.innerHTML = '';
              new (window as any).QRCode(qrContainer, { text: details.downloadUrl, width: 180, height: 180, colorDark: "#ff2d75", colorLight: "#ffffff" });
            }
          }, 500);
        }
      }, 15000);
    } catch (e: any) {
      setBuildStatus({ status: 'error', message: e.message || 'Build system failure.' });
    }
  };

  if (authLoading) return <div className="h-screen w-full flex items-center justify-center bg-[#0a0110] text-[#ff2d75]"><Loader2 className="animate-spin" size={40}/></div>;
  if (!user) return <div className="h-screen w-full flex items-center justify-center bg-[#0a0110] text-white">Please log in to continue.</div>;

  return (
    <div className="h-[100dvh] flex flex-col text-slate-100 bg-[#0a0110] overflow-hidden">
      {/* --- HEADER (Restored Gear Icon) --- */}
      <header className="h-16 md:h-20 border-b border-pink-500/10 glass-tech flex items-center justify-between px-4 md:px-8 z-50 relative cyber-border-pink">
        <div onClick={() => setLogoClicks(c => c + 1)} className="flex items-center gap-3 cursor-pointer select-none group">
          <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,45,117,0.5)] group-hover:scale-110 transition-transform"><Cpu size={20} className="text-white"/></div>
          <span className="font-black text-sm uppercase tracking-tighter hidden sm:block">OneClick <span className="text-pink-400">Studio</span></span>
        </div>

        <nav className="hidden lg:flex bg-black/40 rounded-xl p-1 border border-white/5 shadow-2xl">
          {[AppMode.PREVIEW, AppMode.EDIT, AppMode.SHOP, AppMode.PROFILE].map(m => (
            <button key={m} onClick={() => setMode(m)} className={`px-6 py-2.5 text-[10px] font-black uppercase rounded-lg transition-all ${mode === m ? 'active-nav-pink' : 'text-slate-400 hover:text-white'}`}>{m}</button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-xs font-bold text-pink-400">{user.tokens} Tokens</div>
          <button onClick={() => setMode(AppMode.SETTINGS)} className={`p-2 rounded-lg transition-all ${mode === AppMode.SETTINGS ? 'bg-pink-500 text-white' : 'text-slate-400 hover:bg-white/5'}`}><Settings size={20}/></button>
          <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg hidden sm:block"><LogOut size={20}/></button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {mode === AppMode.PREVIEW ? (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* CHAT AREA */}
            <section className={`w-full lg:w-[450px] border-r border-pink-500/10 flex flex-col bg-[#01040f]/50 backdrop-blur-xl h-full ${mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
              <div className="flex-1 p-6 overflow-y-auto code-scroll space-y-6 pb-32">
                {messages.length > 0 ? messages.map(m => (
                  <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(255,45,117,0.3)]' : 'bg-slate-900/80 border border-white/10 text-slate-100 shadow-xl'}`}>
                      {m.content}
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
                     <BrainCircuit size={64} className="mb-6 text-pink-400 animate-pulse"/>
                     <p className="text-xs font-black uppercase tracking-[0.4em]">Neural Core Online</p>
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

            {/* PREVIEW AREA (Mobile Friendly & Fixed) */}
            <section className={`flex-1 flex flex-col items-center justify-center p-4 relative ${mobileTab === 'chat' ? 'hidden lg:flex' : 'flex'}`}>
              <div className="absolute inset-0 bg-grid opacity-30"></div>
              
              {/* Device Frame */}
              <div className="relative z-10 w-full max-w-[360px] h-[720px] bg-slate-900 rounded-[3.5rem] border-[8px] border-slate-800 shadow-[0_0_60px_-15px_rgba(255,45,117,0.3)] overflow-hidden flex flex-col">
                 <div className="h-8 w-full flex items-center justify-center"><div className="w-20 h-5 bg-slate-800 rounded-b-xl"></div></div>
                 <iframe srcDoc={projectFiles['index.html']} className="flex-1 w-full bg-white" title="preview" />
                 <div className="h-10 w-full flex items-center justify-center gap-8 bg-slate-800/20 backdrop-blur-md">
                    <button className="text-slate-500"><Circle size={14}/></button>
                    <button className="text-slate-500"><Square size={14}/></button>
                 </div>
              </div>

              {/* Build Trigger Floating Button */}
              <button onClick={handleBuildAPK} className="absolute bottom-10 right-10 flex items-center gap-3 px-8 py-4 bg-pink-600 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(255,45,117,0.5)] active:scale-95 transition-all z-30">
                <Rocket size={18}/> Build Android APK
              </button>

              {/* Mobile Tab Switcher */}
              <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl p-2 rounded-2xl border border-white/10 flex gap-2 z-[100]">
                 <button onClick={() => setMobileTab('chat')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase ${mobileTab === 'chat' ? 'bg-pink-600 text-white' : 'text-slate-400'}`}>Chat</button>
                 <button onClick={() => setMobileTab('preview')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase ${mobileTab === 'preview' ? 'bg-pink-600 text-white' : 'text-slate-400'}`}>Visual</button>
              </div>
            </section>
          </div>
        ) : mode === AppMode.EDIT ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-10 animate-in fade-in">
             <div className="glass-tech w-full max-w-2xl p-10 md:p-16 rounded-[3rem] border-pink-500/20 text-center relative overflow-hidden">
                <div className="shimmer-pink absolute inset-0 pointer-events-none opacity-20"></div>
                
                {buildStatus.status === 'success' ? (
                  <div className="space-y-8">
                     <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-bounce"><CheckCircle2 size={48}/></div>
                     <h2 className="text-3xl md:text-4xl font-black text-white">APK Ready for Install</h2>
                     <div id="qrcode" className="p-6 bg-white rounded-3xl inline-block shadow-2xl"></div>
                     <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Scan QR to install on Mobile</p>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href={buildStatus.apkUrl} download className="flex items-center justify-center gap-3 px-10 py-5 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all"><Download size={20}/> Download APK</a>
                        <button onClick={() => setMode(AppMode.PREVIEW)} className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-sm hover:bg-white/10 transition-all">Back to Editor</button>
                     </div>
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
                    <style>{`@keyframes progress { 0% { width: 0%; } 50% { width: 70%; } 100% { width: 100%; } }`}</style>
                  </div>
                )}
             </div>
          </div>
        ) : mode === AppMode.SETTINGS ? (
          <div className="flex-1 p-6 md:p-20 overflow-y-auto">
             <div className="max-w-2xl mx-auto glass-tech p-10 md:p-16 rounded-[3rem] border-pink-500/20 shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center"><Github size={24} className="text-white"/></div>
                   <h2 className="text-3xl font-black tracking-tight text-white">GitHub <span className="text-pink-400">Uplink</span></h2>
                </div>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Personal Access Token</label>
                      <input type="password" value={githubConfig.token} onChange={e => setGithubConfig({...githubConfig, token: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-pink-400 outline-none focus:border-pink-500/50" placeholder="ghp_xxxxxxxxxxxx" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Owner (Username)</label>
                         <input type="text" value={githubConfig.owner} onChange={e => setGithubConfig({...githubConfig, owner: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white" placeholder="shojib_dev" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Repo Name</label>
                         <input type="text" value={githubConfig.repo} onChange={e => setGithubConfig({...githubConfig, repo: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white" placeholder="my-awesome-app" />
                      </div>
                   </div>
                   <button onClick={() => { localStorage.setItem('github_config', JSON.stringify(githubConfig)); alert("Configuration Secured!"); setMode(AppMode.PREVIEW); }} className="w-full py-5 bg-pink-600 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 flex items-center justify-center gap-3">
                      <Save size={20}/> Save Uplink Config
                   </button>
                </div>
             </div>
          </div>
        ) : mode === AppMode.SHOP ? (
          <div className="flex-1 p-6 md:p-20 overflow-y-auto">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Fixed Error: Promise returned by db.getPackages() cannot be rendered in JSX. Using packages state with fallback. */}
                {(packages.length > 0 ? packages : [
                  { name: 'Starter', tokens: 50, price: 500 },
                  { name: 'Pro', tokens: 250, price: 1500 },
                  { name: 'Elite', tokens: 1000, price: 5000 }
                ]).map((p, i) => (
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
          <div className="flex-1 p-6 md:p-10 overflow-y-auto">
             <div className="max-w-4xl mx-auto glass-tech p-10 md:p-16 rounded-[4rem] border-pink-500/10 flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
                <div className="shimmer-pink absolute inset-0 opacity-10 pointer-events-none"></div>
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-[3.5rem] border-4 border-pink-500/30 p-2 shadow-2xl">
                   <img src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} className="w-full h-full object-cover rounded-[3rem]" alt="Dev Profile"/>
                   <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-pink-600 rounded-2xl flex items-center justify-center border-4 border-[#0a0110] shadow-xl"><Sparkles size={24} className="text-white"/></div>
                </div>
                <div className="flex-1 text-center md:text-left">
                   <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-2">{user.name}</h2>
                   <p className="text-pink-400 font-black uppercase tracking-[0.5em] text-xs mb-8">{user.email}</p>
                   <div className="inline-flex items-center gap-4 px-8 py-4 bg-pink-500/10 border border-pink-500/20 rounded-[2rem]">
                      <Wallet className="text-pink-400" size={24}/>
                      <span className="text-3xl font-black text-white">{user.tokens} <span className="text-[10px] opacity-30 uppercase">Balance</span></span>
                   </div>
                </div>
             </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default App;
