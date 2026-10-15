import React from 'react';
import { SubmissionFormData, WillingToLead, EstimatedTeamSize } from '../../types/database';
import { ValidationError } from '../../lib/validation';
import { WILLING_TO_LEAD_OPTIONS, ESTIMATED_TEAM_SIZES } from '../../lib/constants';
import { Compass, Users2, UserPlus, Check } from 'lucide-react';

interface Step4Props {
  data: SubmissionFormData;
  onChange: (updates: Partial<SubmissionFormData>) => void;
  errors: ValidationError[];
}

export const Step4Team: React.FC<Step4Props> = ({ data, onChange, errors }) => {
  const getFieldError = (field: string) => errors.find((e) => e.field === field)?.message;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <span>المشاركة وتشكيل الفريق</span>
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          حدد رغبتك القيادية وحجم الفريق الأمثل لتحقيق أهداف المشروع.
        </p>
      </div>

      {/* Willingness to lead */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-3 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>هل ترغب في قيادة وإدارة هذا المشروع؟</span>
          <span className="text-rose-400">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {WILLING_TO_LEAD_OPTIONS.map((opt) => {
            const isSelected = data.willing_to_lead === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ willing_to_lead: opt.value as WillingToLead })}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-950/60 to-slate-900 border-cyan-400 text-cyan-200 shadow-glow-sm ring-1 ring-cyan-400/40'
                    : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-100">{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{opt.desc}</p>
              </button>
            );
          })}
        </div>
        {getFieldError('willing_to_lead') && (
          <p className="text-xs text-rose-400 mt-1.5 font-medium">{getFieldError('willing_to_lead')}</p>
        )}
      </div>

      {/* Estimated Team Size */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-3 flex items-center gap-1.5">
          <Users2 className="w-4 h-4 text-cyan-400" />
          <span>الحجم التقديري لفريق العمل المطلوب</span>
          <span className="text-rose-400">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ESTIMATED_TEAM_SIZES.map((size) => {
            const isSelected = data.estimated_team_size === size.value;
            return (
              <button
                key={size.value}
                type="button"
                onClick={() => onChange({ estimated_team_size: size.value as EstimatedTeamSize })}
                className={`p-3.5 rounded-xl border text-right transition-all flex items-center justify-between text-xs sm:text-sm font-medium ${
                  isSelected
                    ? 'bg-sky-950/60 border-cyan-400 text-cyan-200 shadow-glow-sm ring-1 ring-cyan-400/40'
                    : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{size.label}</span>
                {isSelected && <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mr-1.5" />}
              </button>
            );
          })}
        </div>
        {getFieldError('estimated_team_size') && (
          <p className="text-xs text-rose-400 mt-1.5 font-medium">{getFieldError('estimated_team_size')}</p>
        )}
      </div>

      {/* Preferred Collaborators */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="preferred_collaborators" className="block text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-cyan-400" />
            <span>زملاء مقترحون تود العمل معهم</span>
            <span className="text-xs font-normal text-slate-400">(اختياري)</span>
          </label>
        </div>
        <textarea
          id="preferred_collaborators"
          rows={2}
          value={data.preferred_collaborators}
          onChange={(e) => onChange({ preferred_collaborators: e.target.value })}
          placeholder="أسماء زملاء في الكلية أو الفريق أو تخصصات معينة تفضل أن تنضم إليك..."
          className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-y"
        />
        <p className="text-xs text-slate-400 mt-1">
          إذا لم يكن لديك زملاء محددون، سيساعدك Connectors Team في مطابقة المهارات وتشكيل الفريق المناسب.
        </p>
      </div>
    </div>
  );
};
