import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, Lightbulb, UserCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isAdmin, adminProfile, signOut } = useAuth();
  const location = useLocation();

  const isFormPage = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#030712]/85 border-b border-sky-500/20 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Info */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative p-1.5 rounded-xl bg-gradient-to-tr from-sky-950/60 to-slate-900/90 border border-sky-400/30 group-hover:border-cyan-400/60 transition-all duration-300 shadow-glow-sm">
              <img
                src="/logo.png"
                alt="Connectors Team Logo"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-wider bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                  CONNECTORS TEAM
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-300">
                  Project Hub
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium tracking-tight hidden md:inline">
                هندسة الذكاء الاصطناعي — كلية الهندسة — جامعة المنصورة
              </span>
            </div>
          </Link>

          {/* Navigation & Actions */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isFormPage
                  ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-glow-sm border border-cyan-400/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-cyan-300" />
              <span>قدّم فكرتك</span>
            </Link>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isAdminPage
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-glow-teal border border-teal-400/40'
                      : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30 border border-emerald-500/20'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">لوحة الإدارة</span>
                  <span className="sm:hidden">الإدارة</span>
                </Link>

                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="truncate max-w-[130px] font-medium">{adminProfile?.full_name || 'مسؤول'}</span>
                </div>

                <button
                  onClick={() => signOut()}
                  title="تسجيل الخروج"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-500/30 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-400 hover:text-sky-300 hover:bg-slate-900/60 border border-slate-800 hover:border-sky-500/30 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>دخول الإدارة</span>
              </Link>
            )}
          </nav>

        </div>
      </div>
    </header>
  );
};
