import React, { useState } from 'react';
import { ProjectIdea, ReviewStatus } from '../../types/database';
import {
  PROJECT_TYPES,
  ESTIMATED_DURATIONS,
  WILLING_TO_LEAD_OPTIONS,
  ESTIMATED_TEAM_SIZES,
  DIFFICULTY_LEVELS,
  REVIEW_STATUS_CONFIG,
} from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import { updateIdeaReview } from '../../lib/dbService';
import {
  X,
  Printer,
  Copy,
  Check,
  Calendar,
  User,
  EyeOff,
  Mail,
  FileText,
  Target,
  Wrench,
  Clock,
  Gauge,
  Compass,
  Users,
  Link2,
  MessageSquare,
  ShieldAlert,
  Save,
  CheckCircle2,
} from 'lucide-react';

interface IdeaDetailModalProps {
  idea: ProjectIdea;
  onClose: () => void;
  onUpdated: (updatedIdea: ProjectIdea) => void;
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({
  idea,
  onClose,
  onUpdated,
}) => {
  const { user } = useAuth();
  const [currentStatus, setCurrentStatus] = useState<ReviewStatus>(idea.review_status);
  const [reviewerNotes, setReviewerNotes] = useState<string>(idea.reviewer_notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const typeLabel =
    PROJECT_TYPES.find((t) => t.value === idea.project_type)?.label || idea.project_type;
  const durationLabel =
    ESTIMATED_DURATIONS.find((d) => d.value === idea.estimated_duration)?.label ||
    idea.estimated_duration;
  const leaderLabel =
    WILLING_TO_LEAD_OPTIONS.find((l) => l.value === idea.willing_to_lead)?.label ||
    idea.willing_to_lead;
  const teamSizeLabel =
    ESTIMATED_TEAM_SIZES.find((s) => s.value === idea.estimated_team_size)?.label ||
    idea.estimated_team_size;
  const diffObj = DIFFICULTY_LEVELS.find((d) => d.value === idea.difficulty_level);

  const isAnonymous = idea.submission_type === 'anonymous';

  const handleSaveReview = async () => {
    if (!user) {
      setSaveError('يجب أن تكون مسجلاً كمسؤول لتحديث المراجعة');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const res = await updateIdeaReview(idea.id, currentStatus, reviewerNotes, user.id);

    setIsSaving(false);
    if (res.success && res.data) {
      setSaveSuccess(true);
      onUpdated(res.data);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError(res.error || 'فشل حفظ التحديث في قاعدة البيانات');
    }
  };

  const handleCopySummary = () => {
    const textToCopy = `
=== CONNECTORS PROJECT HUB - فكرة مشروع ===
العنوان: ${idea.project_title}
تاريخ التقديم: ${new Date(idea.created_at).toLocaleString('ar-EG')}
صاحب الفكرة: ${isAnonymous ? 'مجهول (Anonymous)' : idea.submitter_name}
وسيلة التواصل: ${idea.contact_method || 'غير متوفرة'}
التصنيف: ${idea.project_type === 'other' ? idea.custom_project_type : typeLabel}
الوصف: ${idea.project_description}
المشكلة: ${idea.problem_statement}
المستفيدون: ${idea.target_audience}
المهارات: ${(idea.required_skills || []).concat(idea.custom_skills || []).join(', ')}
المدة: ${durationLabel}
الصعوبة: ${diffObj?.label || idea.difficulty_level}
الاستعداد للقيادة: ${leaderLabel}
حجم الفريق: ${teamSizeLabel}
الزملاء المقترحون: ${idea.preferred_collaborators || 'لا يوجد'}
الرابط المرجعي: ${idea.inspiration_url || 'لا يوجد'}
ملاحظات إضافية: ${idea.additional_notes || 'لا يوجد'}
حالة المراجعة الحالية: ${REVIEW_STATUS_CONFIG[idea.review_status]?.label}
`.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="card-futuristic w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-950 border border-sky-500/30 shadow-2xl relative animate-scaleUp">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-cyan-400 block">ID: {idea.id}</span>
              <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-1">{idea.project_title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              title="نسخ تفاصيل الفكرة كنص كامل"
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">نسخ التفاصيل</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              title="طباعة تقرير الفكرة"
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">طباعة</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-200">
          
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>تاريخ التقديم:</span>
              </span>
              <span className="font-semibold text-slate-100">
                {new Date(idea.created_at).toLocaleString('ar-EG')}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>صاحب الفكرة:</span>
              </span>
              {isAnonymous ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                  <EyeOff className="w-3 h-3 text-slate-400" />
                  <span>بدون هوية (Anonymous)</span>
                </span>
              ) : (
                <span className="font-bold text-cyan-300">{idea.submitter_name}</span>
              )}
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>وسيلة التواصل:</span>
              </span>
              <span className="font-semibold text-slate-100">
                {isAnonymous ? 'غير متوفرة (تقديم مجهول)' : idea.contact_method || 'لم تُحدد'}
              </span>
            </div>
          </div>

          {/* Section: Core Idea & Problem */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>جوهر الفكرة والمشكلة</span>
            </h4>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">وصف المشروع:</span>
                <p className="text-slate-100 leading-relaxed whitespace-pre-wrap">{idea.project_description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-1">المشكلة المستهدفة:</span>
                <p className="text-slate-100 leading-relaxed whitespace-pre-wrap">{idea.problem_statement}</p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-1">الفئة المستهدفة أو المستفيدون:</span>
                <p className="text-slate-100 leading-relaxed">{idea.target_audience}</p>
              </div>
            </div>
          </div>

          {/* Section: Technical & Implementation */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>تفاصيل التنفيذ والمهارات</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div>
                <span className="text-xs text-slate-400 block mb-1">تصنيف المشروع:</span>
                <span className="font-bold text-slate-100">
                  {idea.project_type === 'other' ? idea.custom_project_type || 'أخرى' : typeLabel}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>المدة التقديرية:</span>
                </span>
                <span className="font-semibold text-slate-100">{durationLabel}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  <span>مستوى الصعوبة:</span>
                </span>
                <span className="font-bold text-slate-100">
                  {diffObj ? `${diffObj.value} / 5 (${diffObj.label})` : idea.difficulty_level}
                </span>
              </div>
            </div>

            {/* Skills */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 block mb-2">المهارات والأدوات المطلوبة:</span>
              <div className="flex flex-wrap gap-2">
                {(idea.required_skills || []).map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-950/80 text-sky-300 border border-sky-500/30"
                  >
                    {s}
                  </span>
                ))}
                {(idea.custom_skills || []).map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-950/80 text-teal-300 border border-teal-500/30"
                  >
                    {s} (مخصص)
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Team & Leadership */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>المشاركة وتشكيل الفريق</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div>
                <span className="text-xs text-slate-400 block mb-1">الاستعداد للقيادة:</span>
                <span
                  className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
                    idea.willing_to_lead === 'yes'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {leaderLabel}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>حجم الفريق المقترح:</span>
                </span>
                <span className="font-semibold text-slate-100">{teamSizeLabel}</span>
              </div>

              {idea.preferred_collaborators && (
                <div className="sm:col-span-2 pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">زملاء مقترحون:</span>
                  <p className="text-slate-200">{idea.preferred_collaborators}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section: Additional Notes & URL */}
          {(idea.inspiration_url || idea.additional_notes) && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Link2 className="w-4 h-4 text-cyan-400" />
                <span>روابط وملاحظات إضافية</span>
              </h4>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
                {idea.inspiration_url && (
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">رابط الإلهام / مشروع مشابه:</span>
                    <a
                      href={idea.inspiration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline font-mono text-xs break-all"
                    >
                      {idea.inspiration_url}
                    </a>
                  </div>
                )}

                {idea.additional_notes && (
                  <div className={idea.inspiration_url ? 'pt-3 border-t border-slate-800' : ''}>
                    <span className="text-xs text-slate-400 block mb-1">ملاحظات صاحب الفكرة:</span>
                    <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{idea.additional_notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* ADMINISTRATIVE REVIEW MANAGEMENT SECTION (Real Database Updates) */}
          {/* ===================================================================== */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950/40 border-2 border-cyan-500/30 space-y-4 shadow-glow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
                <span>إدارة التقييم والمراجعة (خاص بمسؤولي Connectors)</span>
              </h4>
              {idea.reviewed_at && (
                <span className="text-[11px] text-slate-400">
                  آخر مراجعة: {new Date(idea.reviewed_at).toLocaleDateString('ar-EG')}
                </span>
              )}
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                تحديث حالة الفكرة:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(REVIEW_STATUS_CONFIG) as ReviewStatus[]).map((statusKey) => {
                  const cfg = REVIEW_STATUS_CONFIG[statusKey];
                  const isSelected = currentStatus === statusKey;
                  return (
                    <button
                      key={statusKey}
                      type="button"
                      onClick={() => setCurrentStatus(statusKey)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border text-right transition-all flex items-center justify-between ${
                        isSelected
                          ? `${cfg.bgClass} ${cfg.colorClass} ${cfg.borderClass} ring-2 ring-cyan-400/30 font-bold`
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{cfg.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Private Reviewer Notes */}
            <div>
              <label htmlFor="reviewer_notes" className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>ملاحظات المراجعين الداخلية (سرية للإدارة فقط):</span>
              </label>
              <textarea
                id="reviewer_notes"
                rows={3}
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                placeholder="أضف ملاحظاتك أو أسباب القبول/التأجيل، وتوصيات الفريق التقني هنا..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-all resize-y"
              />
            </div>

            {/* Save Status & Error Messages */}
            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>تم تحديث حالة الفكرة والملاحظات بنجاح في قاعدة البيانات!</span>
              </div>
            )}

            {saveError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>{saveError}</span>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveReview}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-glow-sm flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'جاري الحفظ في قاعدة البيانات...' : 'حفظ التحديث في قاعدة البيانات'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
