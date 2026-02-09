
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
  Fingerprint as BioIcon, Camera
} from 'lucide-react';
import { AppMode, ChatMessage, User as UserType, GithubConfig, Package, Transaction, ActivityLog } from './types';
import { GeminiService } from './services/geminiService';
import { DatabaseService } from './services/dbService';
import { GithubService } from './services/githubService';

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
      <div className="glass-card p-10 rounded-[3rem] w-full max-w-md border-cyan-500/20 shadow-2xl animate-in zoom-in-95">
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

// --- SCAN PAGE ---
const ScanPage: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [isScanning, setIsScanning] = useState(false);
  const handleStartAuth = () => {
    setIsScanning(true);
    setTimeout(() => onFinish(), 2000);
  };
  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-start pt-6 md:justify-center md:pt-0 bg-[#0f172a] text-white relative overflow-hidden font-sans p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50"></div>
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
          <div className={`absolute inset-0 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all ${!isScanning ? 'animate-pulse' : ''}`}></div>
          <Fingerprint size={isScanning ? 80 : 70} className={`${isScanning ? 'text-cyan-400 scale-110' : 'text-blue-600'} transition-all duration-500 relative z-10 drop-shadow-[0_0_25px_rgba(6,182,212,0.6)] ${!isScanning ? 'animate-[float_3s_ease-in-out_infinite]' : 'animate-pulse'}`} />
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

// --- AUTH PAGE ---
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
    <div className="h-[100dvh] w-full flex flex-col items-center justify-start pt-6 md:justify-center md:pt-0 bg-[#0f172a] text-white relative overflow-hidden font-sans p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50"></div>
      <div className="relative w-full max-w-[400px] h-[520px] md:h-[580px] [perspective:1200px] animate-in fade-in zoom-in-95 duration-500 mt-2 md:mt-0">
        <div className={`relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] ${isRegister ? '[transform:rotateY(-90deg)]' : ''}`}>
          <div className="absolute inset-0 [backface-visibility:hidden] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col justify-center shadow-2xl [transform:translateZ(150px)] md:[transform:translateZ(200px)]">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-8">System <span className="text-cyan-400">Login</span></h2>
            <form onSubmit={handleAuth} className="space-y-4">
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm" placeholder="dev@oneclick.studio" />
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm" placeholder="••••••••" />
              <button disabled={isLoading} className="w-full py-4 bg-blue-600 rounded-2xl font-black uppercase text-sm">{isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Execute Login'}</button>
            </form>
            <button onClick={() => setIsRegister(true)} className="mt-4 text-xs text-cyan-400 font-bold hover:underline">No account? Create system entry</button>
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] bg-blue-600/10 backdrop-blur-xl border border-blue-500/20 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col justify-center shadow-2xl [transform:rotateY(90deg)_translateZ(150px)] md:[transform:rotateY(90deg)_translateZ(200px)]">
            <h2 className="text-2xl md:text-3xl font-black mb-8 tracking-tight text-cyan-400">New <span className="text-white">Registry</span></h2>
            <form onSubmit={handleAuth} className="space-y-4">
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm" placeholder="Full Name" />
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm" placeholder="Email" />
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm" placeholder="••••••••" />
              <button disabled={isLoading} className="w-full py-4 bg-cyan-500 text-black font-black uppercase text-sm">{isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Register Now'}</button>
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
  const [github, setGithub] = useState<GithubConfig>({ token: '', repo: '', owner: '' });
  const [logoClicks, setLogoClicks] = useState(0);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isPurchasing, setIsPurchasing] = useState<Package | null>(null);
  const [paymentStep, setPaymentStep] = useState<'method' | 'form' | 'processing' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [trxId, setTrxId] = useState<string>('');
  const [paymentNote, setPaymentNote] = useState<string>('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [adminTransactions, setAdminTransactions] = useState<Transaction[]>([]);
  const [adminUsers, setAdminUsers] = useState<UserType[]>([]);
  const [adminActivityLogs, setAdminActivityLogs] = useState<ActivityLog[]>([]);
  const [adminActiveTab, setAdminActiveTab] = useState<'analytics' | 'transactions' | 'packages' | 'users' | 'logs'>('analytics');
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null);
  const [adminStats, setAdminStats] = useState({ totalRevenue: 0, usersToday: 0, topPackage: 'Loading...', salesCount: 0 });
  const [adminSearch, setAdminSearch] = useState('');
  const [adminMethodFilter, setAdminMethodFilter] = useState('all');
  const [editingPackage, setEditingPackage] = useState<Partial<Package> | null>(null);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const gemini = useRef(new GeminiService());
  const db = DatabaseService.getInstance();
  const notificationSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

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
    if (user?.isAdmin) {
      const channel = db.supabase
        .channel('admin-notifications')
        .on('postgres_changes', { event: 'INSERT', table: 'transactions' }, (payload) => {
          if (payload.new.status === 'pending') {
            setHasNewNotification(true);
            notificationSound.current.play().catch(e => console.log("Sound error:", e));
            db.getAdminTransactions().then(setAdminTransactions);
          }
        })
        .subscribe();
      return () => { db.supabase.removeChannel(channel); };
    }
  }, [user]);

  useEffect(() => {
    if (logoClicks >= 3) { setMode(AppMode.SETTINGS); setLogoClicks(0); }
  }, [logoClicks]);

  useEffect(() => {
    if (user?.isAdmin && path === '/admin') setMode(AppMode.ADMIN);
  }, [user, path]);

  useEffect(() => {
    if (mode === AppMode.SHOP || (mode === AppMode.ADMIN && adminActiveTab === 'packages')) {
      db.getPackages().then(setPackages);
    }
    if (mode === AppMode.ADMIN && user?.isAdmin) {
      db.getAdminTransactions().then(setAdminTransactions);
      db.getAdminStats().then(setAdminStats);
      if (adminActiveTab === 'logs') db.getActivityLogs().then(setAdminActivityLogs);
      if (adminActiveTab === 'users') {
        db.supabase.from('users').select('*').order('created_at', { ascending: false }).then(({data}) => {
          if (data) setAdminUsers(data.map(u => ({ ...u, joinedAt: new Date(u.created_at).getTime(), isLoggedIn: true })));
        });
      }
    }
  }, [mode, user, adminActiveTab]);

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
    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result as string;
        await db.updateUserAvatar(user.id, base64);
        setUser({ ...user, avatar_url: base64 });
        alert("প্রোফাইল পিকচার সফলভাবে আপডেট হয়েছে!");
      } catch (err: any) { alert("আপলোড এরর: " + err.message); } finally { setIsUploadingAvatar(false); }
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) return alert("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
    setIsUpdatingPassword(true);
    try {
      await db.updatePassword(newPassword);
      alert("পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!");
      setNewPassword('');
    } catch (e: any) { alert("পাসওয়ার্ড পরিবর্তন এরর: " + e.message); } finally { setIsUpdatingPassword(false); }
  };

  const getAnalytics = (u: UserType) => {
    const totalProjects = Math.floor(u.tokens / 2) + 5; 
    return [
      { label: 'Total Builds', value: totalProjects, icon: Layers, color: 'text-blue-400' },
      { label: 'Uptime', value: "99.9%", icon: Activity, color: 'text-green-400' },
      { label: 'Efficiency', value: "94%", icon: Target, color: 'text-yellow-400' },
      { label: 'Avg Speed', value: "12s", icon: Zap, color: 'text-purple-400' }
    ];
  };

  if (authLoading) return <div className="h-screen w-full flex items-center justify-center bg-[#020617] text-cyan-500"><Loader2 className="animate-spin" size={40}/></div>;
  if (!user) return path === '/admin' ? <AdminLoginPage onLoginSuccess={setUser} /> : (path === '/login' ? <AuthPage onLoginSuccess={setUser} /> : <ScanPage onFinish={() => navigate('/login')} />);

  return (
    <div className="h-[100dvh] flex flex-col font-['Hind_Siliguri'] text-slate-100 bg-[#020617] overflow-hidden">
      <header className="h-20 border-b border-white/5 glass-card flex items-center justify-between px-8 z-50">
        <div onClick={() => setLogoClicks(c => c + 1)} className="flex items-center gap-3 cursor-pointer select-none group">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform"><Cpu size={20} className="text-black"/></div>
          <span className="font-black text-sm uppercase tracking-tighter">OneClick <span className="text-cyan-400">Studio</span></span>
        </div>
        <nav className="flex bg-slate-900/50 rounded-2xl p-1 border border-white/5">
          {[AppMode.PREVIEW, AppMode.EDIT, AppMode.SHOP, AppMode.PROFILE].map(m => (
            <button key={m} onClick={() => setMode(m)} className={`px-4 md:px-6 py-2 text-[10px] md:text-[11px] font-black uppercase rounded-xl transition-all ${mode === m ? 'bg-cyan-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}>{m}</button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <button className="px-4 py-2 bg-blue-600 rounded-xl text-xs font-black uppercase shadow-lg flex items-center gap-2 hover:bg-blue-500 transition-all"><Rocket size={16}/> Build APK</button>
            <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-bold text-cyan-400">{user.tokens} Tokens</div>
          </div>
          <button onClick={handleLogout} className="p-2.5 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"><LogOut size={20}/></button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {mode === AppMode.PREVIEW ? (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <section className="w-full lg:w-[450px] border-r border-white/5 flex flex-col bg-[#01040f] h-full">
              <div className="flex-1 p-6 md:p-8 overflow-y-auto code-scroll space-y-6 pb-40">
                {messages.length > 0 ? messages.map(m => (
                  <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-4`}>
                    <div className={`max-w-[92%] p-5 rounded-[2rem] shadow-xl ${m.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-slate-900/80 border border-white/5 text-slate-100 rounded-tl-none'}`}>
                      <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
                     <Monitor size={64} className="mb-6"/>
                     <p className="text-sm font-black uppercase tracking-widest">Start building your project</p>
                  </div>
                )}
              </div>
              <div className="p-6 md:p-8 absolute bottom-0 w-full bg-gradient-to-t from-[#01040f] to-transparent z-10">
                <div className="relative group">
                  <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder="আপনার প্রজেক্টের পরিবর্তন লিখুন..." className="w-full bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 pr-20 text-sm h-32 outline-none text-white focus:border-cyan-500/50 transition-all resize-none shadow-2xl" />
                  <button onClick={handleSend} disabled={isGenerating} className="absolute bottom-6 right-6 p-4 bg-cyan-600 rounded-3xl text-white shadow-2xl hover:bg-cyan-500 transition-all disabled:opacity-50">
                    {isGenerating ? <Loader2 className="animate-spin"/> : <Send size={20}/>}
                  </button>
                </div>
              </div>
            </section>
            <section className="flex-1 flex flex-col bg-[#020617] h-full items-center justify-center p-6 md:p-10 relative overflow-hidden">
               <div className="bg-slate-900 rounded-[3.5rem] md:rounded-[4.5rem] h-full md:h-[780px] w-full max-w-[380px] border-[10px] md:border-[14px] border-slate-800 shadow-2xl overflow-hidden group">
                 <iframe key={Object.keys(projectFiles).join('')} srcDoc={projectFiles['index.html'] || ''} title="preview" className="w-full h-full border-none bg-white" />
               </div>
            </section>
          </div>
        ) : mode === AppMode.EDIT ? (
          <div className="flex-1 flex bg-[#01040f] p-4 md:p-10 overflow-hidden">
            <div className="w-full max-w-5xl mx-auto flex flex-col h-full glass-card rounded-[2.5rem] md:rounded-[3rem] border-white/5 overflow-hidden shadow-2xl">
              <div className="h-16 border-b border-white/5 flex items-center px-8 gap-4 bg-white/5"><FileJson size={18} className="text-cyan-400"/><span className="text-xs font-black uppercase tracking-widest">Neural File Explorer</span></div>
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 p-6 bg-black/20 space-y-2 overflow-y-auto">
                  {Object.keys(projectFiles).map(filename => <button key={filename} className="w-full text-left p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center gap-3 truncate hover:bg-cyan-500/10 transition-colors"><FileCode size={14}/> {filename}</button>)}
                </div>
                <div className="flex-1 p-8 overflow-y-auto code-scroll font-mono text-sm text-cyan-100/60 leading-relaxed bg-black/40"><pre className="whitespace-pre-wrap">{Object.values(projectFiles).join('\n\n')}</pre></div>
              </div>
            </div>
          </div>
        ) : mode === AppMode.SHOP ? (
          <div className="flex-1 p-6 md:p-20 overflow-y-auto custom-scroll animate-in fade-in duration-500">
             <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">Token <span className="text-cyan-400">Vault</span></h1>
                  <p className="text-slate-400 text-lg md:text-xl font-medium">প্যাকেজ কিনুন এবং এআই ক্ষমতা বাড়িয়ে নিন</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="glass-card p-12 rounded-[4.5rem] border-white/10 relative transition-all hover:scale-[1.03] group shadow-2xl">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:bg-cyan-500 group-hover:text-black transition-all"><ShoppingCart size={28}/></div>
                      <h3 className="text-3xl font-black mb-2 tracking-tight">{pkg.name}</h3>
                      <div className="text-6xl font-black text-white mb-8 mt-10 tracking-tighter">{pkg.tokens} <span className="text-lg opacity-20 ml-1 font-black uppercase tracking-widest">Unit</span></div>
                      <button onClick={() => setIsPurchasing(pkg)} className="w-full py-5 bg-white/5 border border-white/10 rounded-[2rem] font-black text-xl hover:bg-cyan-500 hover:text-black transition-all shadow-xl active:scale-95">৳ {pkg.price}</button>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        ) : mode === AppMode.PROFILE ? (
          <div className="flex-1 overflow-y-auto custom-scroll p-6 md:p-12 animate-in fade-in duration-700 relative">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/5 blur-[120px] animate-pulse"></div>
            </div>
            <div className="max-w-6xl mx-auto space-y-10 pb-20 relative z-10">
               <div className="glass-card p-10 md:p-16 rounded-[4rem] md:rounded-[5.5rem] border-white/10 shadow-2xl flex flex-col md:flex-row items-center gap-12 group">
                  <div className="relative shrink-0">
                     <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-[4.5rem] border-4 border-cyan-500/30 p-2 bg-slate-900/50 shadow-2xl group-hover:scale-105 transition-transform duration-700 backdrop-blur-md overflow-hidden">
                        <img src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} className="w-full h-full object-cover rounded-[3.8rem]" alt="Profile"/>
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center gap-2">
                           <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                           <Camera className="text-cyan-400" size={32}/>
                           <span className="text-[10px] font-black uppercase text-white tracking-widest">Update Photo</span>
                        </label>
                        {isUploadingAvatar && <div className="absolute inset-0 bg-black/80 flex items-center justify-center"><Loader2 className="text-cyan-400 animate-spin" size={40}/></div>}
                     </div>
                     <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-cyan-500 rounded-[2rem] flex items-center justify-center border-4 border-[#020617] shadow-xl animate-bounce">
                        <Sparkles className="text-black" size={24}/>
                     </div>
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-8">
                     <div>
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">{user.name}</h2>
                          {user.is_verified && <div className="bg-cyan-500/20 p-2 rounded-2xl border border-cyan-500/40"><ShieldCheck className="text-cyan-400" size={32}/></div>}
                        </div>
                        <p className="text-cyan-400/70 font-black uppercase tracking-[0.5em] text-xs flex items-center justify-center md:justify-start gap-3"><Mail size={16}/> {user.email}</p>
                     </div>
                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-5">
                        <div className="px-10 py-5 bg-cyan-500/10 border border-cyan-500/30 rounded-[2.5rem] flex items-center gap-5 shadow-xl">
                           <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"><Wallet className="text-black" size={24}/></div>
                           <span className="text-3xl font-black text-white">{user.tokens} <span className="text-xs opacity-40 uppercase tracking-widest">Units</span></span>
                        </div>
                        <div className="px-10 py-5 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center gap-5 shadow-xl">
                           <Clock className="text-slate-400" size={24}/>
                           <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{new Date(user.joinedAt).toLocaleDateString()}</span>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Analytics */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {getAnalytics(user).map((stat, i) => (
                    <div key={i} className="glass-card p-10 rounded-[4rem] border-white/5 hover:border-cyan-500/30 transition-all shadow-2xl group hover:scale-[1.05] relative overflow-hidden">
                       <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 ${stat.color} shadow-lg`}><stat.icon size={32}/></div>
                       <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">{stat.label}</p>
                       <h4 className="text-5xl font-black text-white tracking-tighter">{stat.value}</h4>
                    </div>
                  ))}
               </div>

               {/* Password Change Section */}
               <div className="glass-card p-12 rounded-[5rem] border-white/10 relative overflow-hidden shadow-2xl bg-gradient-to-br from-red-500/5 to-transparent">
                  <h3 className="text-3xl font-black mb-10 flex items-center gap-5"><Lock className="text-red-400" size={32}/> Security Management</h3>
                  <div className="max-w-md space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">New Secret Matrix Key</label>
                       <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-5 text-sm outline-none focus:border-red-500/50 transition-all text-white" placeholder="Enter new password (min 6 chars)" />
                    </div>
                    <button onClick={handleChangePassword} disabled={isUpdatingPassword} className="px-10 py-5 bg-red-600 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-red-500 transition-all shadow-xl active:scale-95 disabled:opacity-50">
                       {isUpdatingPassword ? <Loader2 className="animate-spin mx-auto"/> : 'Update Secret Key'}
                    </button>
                  </div>
               </div>
            </div>
          </div>
        ) : null}
      </main>

      <style>{`
        .glass-card { background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
        .code-scroll::-webkit-scrollbar { width: 5px; }
        .code-scroll::-webkit-scrollbar-track { background: transparent; }
        .code-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        @keyframes custom-pulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
        .animate-pulse { animation: custom-pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes floating { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce { animation: floating 3s ease-in-out infinite; }
        .custom-scroll::-webkit-scrollbar { width: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 20px; }
      `}</style>
    </div>
  );
};

export default App;
