import React from 'react';
import { SubmissionFormData } from '../../types/database';
import { ValidationError } from '../../lib/validation';
import { FileText, AlertCircle, Users } from 'lucide-react';

interface Step2Props {
  data: SubmissionFormData;
  onChange: (updates: Partial<SubmissionFormData>) => void;
  errors: ValidationError[];
}

export const Step2IdeaDetails: React.FC<Step2Props> = ({ data, onChange, errors }) => {
  const getFieldError = (field: string) => errors.find((e) => e.field === field)?.message;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <span>تفاصيل وجوهر الفكرة</span>
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          اشرح فكرتك بوضوح، ما هي المشكلة الحقيقية التي تحلها ومن هم المستفيدون منها.
        </p>
      </div>

      {/* Project Title */}
      <div>
        <label htmlFor="project_title" className="block text-sm font-semibold text-slate-200 mb-2">
          عنوان أو اسم المشروع المقترح <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <input
            id="project_title"
            type="text"
            value={data.project_title}
            onChange={(e) => onChange({ project_title: e.target.value })}
            placeholder="مثال: نظام ذكي للتعرف على الإشارات في الحرم الجامعي"
            className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
              getFieldError('project_title')
                ? 'border-rose-500/80 focus:ring-rose-500/30'
                : 'border-slate-700/80 focus:border-cyan-400 focus:ring-cyan-500/20'
            }`}
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        {getFieldError('project_title') ? (
          <p className="text-xs text-rose-400 mt-1.5 font-medium">{getFieldError('project_title')}</p>
        ) : (
          <p className="text-xs text-slate-400 mt-1">عنوان جذاب ومختصر يعبر عن ماهية المشروع.</p>
        )}
      </div>

      {/* Short Description */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="project_description" className="block text-sm font-semibold text-slate-200">
            وصف موجز للمشروع <span className="text-rose-400">*</span>
          </label>
          <span className="text-xs text-slate-400">حوالي جملتين أو ثلاث جمل</span>
        </div>
        <textarea
          id="project_description"
          rows={3}
          value={data.project_description}
          onChange={(e) => onChange({ project_description: e.target.value })}
          placeholder="لخّص الفكرة في سطور واضحة: كيف يعمل المشروع؟ ما هي نتيجته النهائية؟"
          className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all resize-y ${
            getFieldError('project_description')
              ? 'border-rose-500/80 focus:ring-rose-500/30'
              : 'border-slate-700/80 focus:border-cyan-400 focus:ring-cyan-500/20'
          }`}
        />
        {getFieldError('project_description') && (
          <p className="text-xs text-rose-400 mt-1.5 font-medium">{getFieldError('project_description')}</p>
        )}
      </div>

      {/* Problem Statement */}
      <div>
        <label htmlFor="problem_statement" className="block text-sm font-semibold text-slate-200 mb-2">
          المشكلة التي يهدف المشروع إلى حلها <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <textarea
            id="problem_statement"
            rows={3}
            value={data.problem_statement}
            onChange={(e) => onChange({ problem_statement: e.target.value })}
            placeholder="ما هو التحدي أو الاحتياج القائم؟ لماذا يعد تنفيذ هذا الحل مهماً وذا قيمة؟"
            className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all resize-y ${
              getFieldError('problem_statement')
                ? 'border-rose-500/80 focus:ring-rose-500/30'
                : 'border-slate-700/80 focus:border-cyan-400 focus:ring-cyan-500/20'
            }`}
          />
        </div>
        {getFieldError('problem_statement') ? (
          <p className="text-xs text-rose-400 mt-1.5 font-medium">{getFieldError('problem_statement')}</p>
        ) : (
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 inline" />
            <span>المشاريع القوية هي التي تبدأ بمشكلة واقعية محددة.</span>
          </p>
        )}
      </div>

      {/* Target Audience */}
      <div>
        <label htmlFor="target_audience" className="block text-sm font-semibold text-slate-200 mb-2">
          الفئة المستهدفة أو المستفيدون <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <input
            id="target_audience"
            type="text"
            value={data.target_audience}
            onChange={(e) => onChange({ target_audience: e.target.value })}
            placeholder="مثال: طلاب هندسة المنصورة، مرضى السكري، رواد الأعمال، فريق Connectors الداخلي..."
            className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
              getFieldError('target_audience')
                ? 'border-rose-500/80 focus:ring-rose-500/30'
                : 'border-slate-700/80 focus:border-cyan-400 focus:ring-cyan-500/20'
            }`}
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <Users className="w-4 h-4" />
          </div>
        </div>
        {getFieldError('target_audience') && (
          <p className="text-xs text-rose-400 mt-1.5 font-medium">{getFieldError('target_audience')}</p>
        )}
      </div>
    </div>
  );
};
