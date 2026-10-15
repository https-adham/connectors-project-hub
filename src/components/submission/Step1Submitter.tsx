import React from 'react';
import { SubmissionFormData } from '../../types/database';
import { ValidationError } from '../../lib/validation';
import { User, EyeOff, Mail, Info } from 'lucide-react';

interface Step1Props {
  data: SubmissionFormData;
  onChange: (updates: Partial<SubmissionFormData>) => void;
  errors: ValidationError[];
}

export const Step1Submitter: React.FC<Step1Props> = ({ data, onChange, errors }) => {
  const getFieldError = (field: string) => errors.find((e) => e.field === field)?.message;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <span>معلومات صاحب الفكرة</span>
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          اختر الطريقة التي تفضل تقديم فكرتك بها، سواء بالاسم أو بدون هوية بالكامل.
        </p>
      </div>

      {/* Mode Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Named Option */}
        <button
          type="button"
          onClick={() => onChange({ submission_type: 'named' })}
          className={`p-5 rounded-2xl border text-right transition-all duration-300 relative flex flex-col justify-between ${
            data.submission_type === 'named'
              ? 'bg-gradient-to-br from-sky-950/60 to-slate-900/90 border-cyan-400/70 shadow-glow-sm ring-1 ring-cyan-400/40'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                data.submission_type === 'named'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <User className="w-5 h-5" />
            </div>
            <span
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                data.submission_type === 'named'
                  ? 'border-cyan-400 bg-cyan-400 ring-2 ring-cyan-400/20'
                  : 'border-slate-600 bg-transparent'
              }`}
            />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-100 mb-1">تقديم بالاسم (Named)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              تظهر هويتك لإدارة الفريق لتسهيل التواصل معك وإشراكك في قيادة أو تنفيذ المشروع.
            </p>
          </div>
        </button>

        {/* Anonymous Option */}
        <button
          type="button"
          onClick={() => {
            onChange({
              submission_type: 'anonymous',
              submitter_name: '',
              contact_method: '',
            });
          }}
          className={`p-5 rounded-2xl border text-right transition-all duration-300 relative flex flex-col justify-between ${
            data.submission_type === 'anonymous'
              ? 'bg-gradient-to-br from-sky-950/60 to-slate-900/90 border-cyan-400/70 shadow-glow-sm ring-1 ring-cyan-400/40'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                data.submission_type === 'anonymous'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <EyeOff className="w-5 h-5" />
            </div>
            <span
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                data.submission_type === 'anonymous'
                  ? 'border-cyan-400 bg-cyan-400 ring-2 ring-cyan-400/20'
                  : 'border-slate-600 bg-transparent'
              }`}
            />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-100 mb-1">تقديم بدون هوية (Anonymous)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              سرية تامة 100%. لن يتم حفظ اسمك أو وسيلة تواصلك في قاعدة البيانات.
            </p>
          </div>
        </button>
      </div>

      {/* Named Fields Container */}
      {data.submission_type === 'named' ? (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="submitter_name" className="block text-sm font-semibold text-slate-200 mb-2">
              الاسم الكامل <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                id="submitter_name"
                type="text"
                value={data.submitter_name}
                onChange={(e) => onChange({ submitter_name: e.target.value })}
                placeholder="مثال: أحمد محمد علي"
                className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                  getFieldError('submitter_name')
                    ? 'border-rose-500/80 focus:ring-rose-500/30'
                    : 'border-slate-700/80 focus:border-cyan-400 focus:ring-cyan-500/20'
                }`}
              />
            </div>
            {getFieldError('submitter_name') && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium">{getFieldError('submitter_name')}</p>
            )}
          </div>

          {/* Contact Method Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="contact_method" className="block text-sm font-semibold text-slate-200">
                وسيلة التواصل المفضلة <span className="text-xs font-normal text-slate-400">(اختياري)</span>
              </label>
            </div>
            <div className="relative">
              <input
                id="contact_method"
                type="text"
                value={data.contact_method}
                onChange={(e) => onChange({ contact_method: e.target.value })}
                placeholder="البريد الجامعي / رقم هاتف / حساب تيليجرام"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              ستكون هذه البيانات متاحة لمسؤولي Connectors فقط للتنسيق معك حول الفكرة.
            </p>
          </div>
        </div>
      ) : (
        /* Anonymous notice */
        <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-3.5">
          <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-cyan-300 block mb-1">الوضع المجهول مفعّل:</span>
            لن يُطلب منك إدخال اسمك أو وسيلة تواصلك في هذه الاستمارة. ستُعرض فكرتك لإدارة الفريق ومراجعي الأفكار تحت اسم "Anonymous" لدراستها بناءً على جدارتها التقنية فقط.
          </div>
        </div>
      )}
    </div>
  );
};
