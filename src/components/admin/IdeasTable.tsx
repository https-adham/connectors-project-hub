import React from 'react';
import { ProjectIdea } from '../../types/database';
import {
  PROJECT_TYPES,
  ESTIMATED_DURATIONS,
  REVIEW_STATUS_CONFIG,
  WILLING_TO_LEAD_OPTIONS,
} from '../../lib/constants';
import {
  Eye,
  EyeOff,
  User,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Calendar,
  Layers,
  Crown,
} from 'lucide-react';

interface IdeasTableProps {
  ideas: ProjectIdea[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
  onSelectIdea: (idea: ProjectIdea) => void;
}

export const IdeasTable: React.FC<IdeasTableProps> = ({
  ideas,
  totalCount,
  currentPage,
  pageSize,
  isLoading,
  onPageChange,
  onSelectIdea,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  if (isLoading) {
    return (
      <div className="card-futuristic p-8 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
        <p className="text-sm text-slate-300 font-medium">جاري جلب أفكار المشاريع من قاعدة البيانات...</p>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="card-futuristic p-12 text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
          <Inbox className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-200">لا توجد نتائج تطابق معايير البحث الحالية</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          جرّب تغيير فلاتر البحث أو التأكد من إرسال أول فكرة مشروع عبر المنصة.
        </p>
      </div>
    );
  }

  return (
    <div className="card-futuristic overflow-hidden">
      {/* Table responsive wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-xs font-semibold">
              <th className="py-3.5 px-4 font-semibold">تاريخ التقديم</th>
              <th className="py-3.5 px-4 font-semibold">عنوان الفكرة</th>
              <th className="py-3.5 px-4 font-semibold">صاحب الفكرة</th>
              <th className="py-3.5 px-4 font-semibold">التصنيف</th>
              <th className="py-3.5 px-4 font-semibold">المدة التقديرية</th>
              <th className="py-3.5 px-4 font-semibold text-center">الصعوبة</th>
              <th className="py-3.5 px-4 font-semibold text-center">القيادة</th>
              <th className="py-3.5 px-4 font-semibold">حالة المراجعة</th>
              <th className="py-3.5 px-4 font-semibold text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {ideas.map((idea) => {
              const statusCfg = REVIEW_STATUS_CONFIG[idea.review_status] || REVIEW_STATUS_CONFIG.new;
              const typeLabel =
                PROJECT_TYPES.find((t) => t.value === idea.project_type)?.label || idea.project_type;
              const durationLabel =
                ESTIMATED_DURATIONS.find((d) => d.value === idea.estimated_duration)?.label ||
                idea.estimated_duration;
              const leadOption = WILLING_TO_LEAD_OPTIONS.find((l) => l.value === idea.willing_to_lead);

              const isAnonymous = idea.submission_type === 'anonymous';

              return (
                <tr
                  key={idea.id}
                  className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                  onClick={() => onSelectIdea(idea)}
                >
                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(idea.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </td>

                  {/* Project Title */}
                  <td className="py-3.5 px-4 font-bold text-slate-100 max-w-[220px]">
                    <div className="truncate group-hover:text-cyan-300 transition-colors" title={idea.project_title}>
                      {idea.project_title}
                    </div>
                  </td>

                  {/* Submitter */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {isAnonymous ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-slate-800/80 text-slate-400 border border-slate-700">
                        <EyeOff className="w-3 h-3 text-slate-500" />
                        <span>Anonymous</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-200 font-medium">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="truncate max-w-[130px]" title={idea.submitter_name || ''}>
                          {idea.submitter_name || 'بدون اسم'}
                        </span>
                      </span>
                    )}
                  </td>

                  {/* Project Type */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-300">
                      <Layers className="w-3.5 h-3.5 text-sky-400" />
                      <span className="truncate max-w-[140px]">
                        {idea.project_type === 'other' ? idea.custom_project_type || 'أخرى' : typeLabel}
                      </span>
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-400">
                    {durationLabel.split(' (')[0]}
                  </td>

                  {/* Difficulty */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                        idea.difficulty_level <= 2
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : idea.difficulty_level <= 3
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {idea.difficulty_level} / 5
                    </span>
                  </td>

                  {/* Leadership */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {idea.willing_to_lead === 'yes' ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30"
                        title="مستعد لقيادة المشروع"
                      >
                        <Crown className="w-3 h-3 text-purple-400" />
                        <span>قائد</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">{leadOption?.label.split('،')[0] || '—'}</span>
                    )}
                  </td>

                  {/* Review Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.bgClass} ${statusCfg.colorClass} ${statusCfg.borderClass}`}
                    >
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectIdea(idea);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900 border border-sky-500/30 hover:border-cyan-400 text-sky-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all mx-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>عرض</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          إجمالي النتائج: <span className="font-bold text-slate-200">{totalCount}</span> فكرة
          {' | '}الصفحة <span className="font-bold text-cyan-300">{currentPage}</span> من{' '}
          <span className="font-bold text-slate-200">{totalPages}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`p-2 rounded-lg border flex items-center gap-1 transition-all ${
              currentPage <= 1
                ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600'
                : 'border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          <span className="px-3 py-1 rounded bg-slate-900 text-slate-200 font-bold">
            {currentPage}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`p-2 rounded-lg border flex items-center gap-1 transition-all ${
              currentPage >= totalPages
                ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600'
                : 'border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white'
            }`}
          >
            <span>التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
