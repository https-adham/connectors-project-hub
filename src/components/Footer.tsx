import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-sky-500/15 bg-gradient-to-b from-[#030712] to-[#010409] text-slate-400 py-12 mt-20 relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-sky-500/5 to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-right">
          
          {/* Logo & Vision */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Connectors Team" className="h-9 w-auto" />
              <span className="text-lg font-black tracking-wider text-slate-100">
                CONNECTORS TEAM
              </span>
            </div>
            <p className="text-xs text-sky-400 font-semibold tracking-wide">
              FOR A CONNECTED WORLD
            </p>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              برنامج هندسة الذكاء الاصطناعي — كلية الهندسة — جامعة المنصورة، جمهورية مصر العربية.
            </p>
          </div>

          {/* Core Philosophy Quote */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>رؤيتنا المشتركة</span>
            </div>
            <p className="text-xs text-slate-300 italic text-center">
              "كل فكرة عظيمة بتبدأ بخطوة. نصنع أثراً حقيقياً بأيدي مهندسي المستقبل."
            </p>
          </div>

          {/* Quick links & Security Note */}
          <div className="flex flex-col items-center md:items-end gap-3 text-xs">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-slate-300 hover:text-cyan-400 transition-colors">
                تقديم فكرة
              </Link>
              <span>•</span>
              <Link to="/admin" className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                <span>لوحة التحكم</span>
              </Link>
            </div>
            <p className="text-[11px] text-slate-500 text-center md:text-left">
              جميع الأفكار والبيانات المدخلة محمية وتخضع لمراجعة إدارة الفريق فقط.
            </p>
            <p className="text-[11px] text-slate-600">
              © {new Date().getFullYear()} Connectors Team. All Rights Reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};
