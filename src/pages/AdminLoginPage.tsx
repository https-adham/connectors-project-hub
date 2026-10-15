import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { ShieldCheck, Lock, Mail, AlertCircle, KeyRound } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, claimFirstAdmin, isAdmin, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // First admin bootstrap modal state
  const [showBootstrap, setShowBootstrap] = useState(false);
  const [adminFullName, setAdminFullName] = useState('');
  const [bootstrapStatus, setBootstrapStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(false);

  // If already authenticated and admin, redirect to /admin
  React.useEffect(() => {
    if (isAdmin) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAdmin, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const res = await signIn(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setErrorMsg(res.error || 'فشل تسجيل الدخول. تحقق من بياناتك أو صلاحياتك.');
    }
  };

  const handleClaimBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminFullName.trim()) {
      setBootstrapStatus({ success: false, message: 'يرجى كتابة اسمك الكامل كمسؤول أول' });
      return;
    }

    setIsBootstrapping(true);
    setBootstrapStatus(null);

    const res = await claimFirstAdmin(adminFullName.trim());
    setIsBootstrapping(false);
    setBootstrapStatus(res);

    if (res.success) {
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    }
  };

  const configured = isSupabaseConfigured();

  return (
    <div className="min-h-screen tech-grid-bg flex items-center justify-center p-4 sm:p-6">
      
      {/* Background glow accent */}
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="card-futuristic w-full max-w-md p-6 sm:p-8 bg-slate-950/90 border border-sky-500/30 shadow-2xl relative z-10 space-y-6">
        
        {/* Header with Logo */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-sky-950 to-slate-900 border border-cyan-400/40 p-2 shadow-glow-sm flex items-center justify-center">
            <img src="/logo.png" alt="Connectors Team" className="h-10 w-auto object-contain" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">دخول إدارة Connectors</h2>
            <p className="text-xs text-slate-400 mt-1">
              لوحة التحكم المركزية لمراجعة أفكار ومشاريع الفريق
            </p>
          </div>
        </div>

        {/* Database Config Alert if not set */}
        {!configured && (
          <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
            <div>
              <span className="font-bold block mb-0.5">تنبيه إعداد Supabase:</span>
              لم يتم ربط مفاتيح قاعدة البيانات بعد في ملف <code className="text-cyan-300 font-mono">.env</code>. راجع تعليمات README للربط بقاعدة بياناتك.
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>البريد الإلكتروني للمسؤول:</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@connectors.team"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-all dir-ltr text-left"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>كلمة المرور:</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-all dir-ltr text-left"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-sm shadow-glow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جاري التحقق والصلاحيات...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </>
            )}
          </button>
        </form>

        {/* Security & First Admin Setup Info */}
        <div className="pt-4 border-t border-slate-800 text-center space-y-2">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            <span>التسجيل العام للمسؤولين معطّل لأسباب أمنية.</span>
          </p>

          <button
            type="button"
            onClick={() => setShowBootstrap(!showBootstrap)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline"
          >
            {showBootstrap ? 'إخفاء دليل إعداد المسؤول الأول' : 'هل أنت مدير الفريق وتقوم بالإعداد لأول مرة؟'}
          </button>
        </div>

        {/* First Admin Bootstrap Drawer / Guidance */}
        {showBootstrap && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs text-slate-300 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>إجراءات تفعيل حساب المدير الأول:</span>
            </div>

            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed text-[11px]">
              <li>
                أنشئ حساب مستخدم في Supabase Auth عبر الداشبورد (Authentication ➔ Users).
              </li>
              <li>
                سجّل الدخول بالحساب لأول مرة، أو نفّذ استعلام SQL المباشر في لوحة Supabase SQL Editor:
                <pre className="mt-1 p-2 rounded bg-slate-950 font-mono text-[10px] text-cyan-300 overflow-x-auto text-left dir-ltr">
{`INSERT INTO public.admin_profiles (id, email, full_name, role)
SELECT id, email, 'Connectors Leader', 'super_admin'
FROM auth.users
WHERE email = 'YOUR_EMAIL@example.com';`}
                </pre>
              </li>
            </ol>

            {user && (
              <div className="pt-2 border-t border-slate-800">
                <span className="block mb-1 text-cyan-300 font-semibold">
                  حسابك الحالي مسجل: {user.email}
                </span>
                <form onSubmit={handleClaimBootstrap} className="space-y-2">
                  <input
                    type="text"
                    value={adminFullName}
                    onChange={(e) => setAdminFullName(e.target.value)}
                    placeholder="اسمك الكامل كمسؤول أول..."
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                  />
                  <button
                    type="submit"
                    disabled={isBootstrapping}
                    className="w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
                  >
                    {isBootstrapping ? 'جاري تفعيل الحساب...' : 'تفعيل حسابي كمسؤول رئيسي أول (Bootstrap)'}
                  </button>
                </form>

                {bootstrapStatus && (
                  <p
                    className={`text-[11px] mt-1 font-semibold ${
                      bootstrapStatus.success ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {bootstrapStatus.message}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
