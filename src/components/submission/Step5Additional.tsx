import React from 'react';
import { SubmissionFormData } from '../../types/database';
import { ValidationError } from '../../lib/validation';
import {
  PROJECT_TYPES,
  ESTIMATED_DURATIONS,
  WILLING_TO_LEAD_OPTIONS,
  ESTIMATED_TEAM_SIZES,
  DIFFICULTY_LEVELS,
} from '../../lib/constants';
import { Link2, MessageSquare, ShieldCheck, Edit3, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Step5Props {
  data: SubmissionFormData;
  onChange: (updates: Partial<SubmissionFormData>) => void;
  errors: ValidationError[];
  onJumpToStep: (step: number) => void;
}

export const Step5Additional: React.FC<Step5Props> = ({
  data,
  onChange,
  errors,
  onJumpToStep,
}) => {
  const getFieldError = (field: string) => errors.find((e) => e.field === field)?.message;

  const projectTypeLabel =
    PROJECT_TYPES.find((t) => t.value === data.project_type)?.label || data.project_type;
  const durationLabel =
    ESTIMATED_DURATIONS.find((d) => d.value === data.estimated_duration)?.label || data.estimated_duration;
  const leadLabel =
    WILLING_TO_LEAD_OPTIONS.find((l) => l.value === data.willing_to_lead)?.label || data.willing_to_lead;
  const teamSizeLabel =
    ESTIMATED_TEAM_SIZES.find((s) => s.value === data.estimated_team_size)?.label || data.estimated_team_size;
  const diffObj = DIFFICULTY_LEVELS.find((d) => d.value === data.difficulty_level);

  const allSkills = [...(data.required_skills || []), ...(data.custom_skills || [])];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <span>معلومات إضافية والمراجعة النهائية</span>
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          أضف أي روابط أو ملاحظات تكميلية، ثم راجع ملخص إجاباتك قبل إرسال الفكرة نهائياً.
        </p>
      </div>

      {/* Honeypot for bots (invisible to real users) */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="_honey"
          tabIndex={-1}
          autoComplete="off"
          value={data._honey || ''}
          onChange={(e) => onChange({ _honey: e.target.value })}
        />
      </div>

      {/* Inspiration URL */}
      <div>
        <label htmlFor="inspiration_url" className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
          <Link2 className="w-4 h-4 text-cyan-400" />
          <span>رابط إلهام أو مشروع مشابه</span>
          <span className="text-xs font-normal text-slate-400">(اختياري)</span>
        </label>
        <input
          id="inspiration_url"
          type="url"
          value={data.inspiration_url}
          onChange={(e) => onChange({ inspiration_url: e.target.value })}
          placeholder="https://github.com/... أو https://arxiv.org/..."
          className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all dir-ltr text-left ${
            getFieldError('inspiration_url')
              ? 'border-rose-500/80 focus:ring-rose-500/30'
              : 'border-slate-700/80 focus:border-cyan-400 focus:ring-cyan-500/20'
          }`}
        />
        {getFieldError('inspiration_url') && (
          <p className="text-xs text-rose-400 mt-1.5 font-medium">{getFieldError('inspiration_url')}</p>
        )}
      </div>

      {/* Additional Notes */}
      <div>
        <label htmlFor="additional_notes" className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span>ملاحظات أو توصيات إضافية</span>
          <span className="text-xs font-normal text-slate-400">(اختياري)</span>
        </label>
        <textarea
          id="additional_notes"
          rows={3}
          value={data.additional_notes}
          onChange={(e) => onChange({ additional_notes: e.target.value })}
          placeholder="أي تفاصيل أخرى تود إحاطة إدارة Connectors Team بها بخصوص الفكرة أو احتياجاتها الخاصة..."
          className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-y"
        />
      </div>

      {/* ========================================================================= */}
      {/* FINAL REVIEW ACCORDION / SUMMARY CARDS */}
      {/* ========================================================================= */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <span>المراجعة الشاملة لإجاباتك</span>
          </h4>
          <span className="text-xs text-slate-400">اضغط على "تعديل" لتغيير أي إجابة</span>
        </div>

        <div className="space-y-4">
          {/* Review Card 1: Submitter */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-300 block text-sm">1. صاحب الفكرة</span>
              <p className="text-slate-400">
                نوع التقديم:{' '}
                <span className="font-semibold text-slate-200">
                  {data.submission_type === 'anonymous' ? 'بدون هوية (Anonymous)' : 'بالاسم'}
                </span>
              </p>
              {data.submission_type === 'named' && (
                <>
                  <p className="text-slate-400">
                    الاسم: <span className="font-semibold text-slate-200">{data.submitter_name || '—'}</span>
                  </p>
                  <p className="text-slate-400">
                    وسيلة التواصل:{' '}
                    <span className="font-semibold text-slate-200">{data.contact_method || 'غير محددة'}</span>
                  </p>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => onJumpToStep(1)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-1 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تعديل</span>
            </button>
          </div>

          {/* Review Card 2: Idea Details */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
            <div className="space-y-1.5 text-xs max-w-xl">
              <span className="font-bold text-slate-300 block text-sm">2. تفاصيل الفكرة</span>
              <p className="text-slate-300 font-semibold text-sm">{data.project_title || '—'}</p>
              <p className="text-slate-400 line-clamp-2">
                <span className="text-slate-500 font-medium">الوصف: </span>
                {data.project_description || '—'}
              </p>
              <p className="text-slate-400 line-clamp-2">
                <span className="text-slate-500 font-medium">المشكلة: </span>
                {data.problem_statement || '—'}
              </p>
              <p className="text-slate-400">
                <span className="text-slate-500 font-medium">الفئة المستهدفة: </span>
                {data.target_audience || '—'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onJumpToStep(2)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-1 transition-all flex-shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تعديل</span>
            </button>
          </div>

          {/* Review Card 3: Implementation */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-slate-300 block text-sm">3. تفاصيل التنفيذ</span>
              <p className="text-slate-400">
                التصنيف:{' '}
                <span className="font-semibold text-cyan-300">
                  {data.project_type === 'other' ? data.custom_project_type || 'أخرى' : projectTypeLabel}
                </span>
              </p>
              <p className="text-slate-400">
                المدة التقديرية: <span className="font-semibold text-slate-200">{durationLabel}</span>
              </p>
              <p className="text-slate-400">
                درجة الصعوبة:{' '}
                <span className="font-semibold text-slate-200">
                  {diffObj ? `${diffObj.value} / 5 (${diffObj.label})` : '—'}
                </span>
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {allSkills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 border border-slate-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onJumpToStep(3)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-1 transition-all flex-shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تعديل</span>
            </button>
          </div>

          {/* Review Card 4: Team */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-300 block text-sm">4. المشاركة في الفريق</span>
              <p className="text-slate-400">
                الاستعداد للقيادة: <span className="font-semibold text-cyan-300">{leadLabel}</span>
              </p>
              <p className="text-slate-400">
                حجم الفريق: <span className="font-semibold text-slate-200">{teamSizeLabel}</span>
              </p>
              {data.preferred_collaborators && (
                <p className="text-slate-400">
                  زملاء مقترحون:{' '}
                  <span className="font-semibold text-slate-200">{data.preferred_collaborators}</span>
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onJumpToStep(4)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-1 transition-all flex-shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تعديل</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CONSENT CHECKBOX & PRIVACY GUARANTEE */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/40 to-slate-900/60 border border-sky-500/20">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={data.consent}
            onChange={(e) => onChange({ consent: e.target.checked })}
            className="w-5 h-5 mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500/30 cursor-pointer flex-shrink-0"
          />
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <span className="font-bold text-white block mb-0.5">
              موافقة التقديم وحفظ البيانات <span className="text-rose-400">*</span>
            </span>
            أوافق على حفظ وتخزين بيانات هذه الفكرة في قاعدة بيانات Connectors Team ومراجعتها من قبل مسؤولي الفريق المعتمدين بهدف تقييمها ودراسة إمكانية تبنيها وتنفيذها كمشروع حقيقي.
          </div>
        </label>
        {getFieldError('consent') && (
          <p className="text-xs text-rose-400 mt-2 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{getFieldError('consent')}</span>
          </p>
        )}
      </div>

      {/* Security Assurance Badge */}
      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>حماية كاملة للبيانات وسياسات أمان Row Level Security (RLS) مفعلة على قاعدة البيانات.</span>
      </div>
    </div>
  );
};
