import React from 'react';
import { ProjectIdeaFilter } from '../../types/database';
import {
  PROJECT_TYPES,
  REVIEW_STATUS_CONFIG,
  ESTIMATED_DURATIONS,
  WILLING_TO_LEAD_OPTIONS,
} from '../../lib/constants';
import { Search, RotateCcw, Download, Filter, X } from 'lucide-react';

interface IdeasFilterBarProps {
  filters: ProjectIdeaFilter;
  onChange: (updates: Partial<ProjectIdeaFilter>) => void;
  onReset: () => void;
  onRefresh: () => void;
  onExportCSV: () => void;
  isExporting?: boolean;
}

export const IdeasFilterBar: React.FC<IdeasFilterBarProps> = ({
  filters,
  onChange,
  onReset,
  onRefresh,
  onExportCSV,
  isExporting = false,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
      {/* Top row: Search input + Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={(e) => onChange({ searchQuery: e.target.value, page: 1 })}
            placeholder="ابحث بالعنوان، اسم صاحب الفكرة، أو كلمات من الوصف..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-all"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          {filters.searchQuery && (
            <button
              onClick={() => onChange({ searchQuery: '', page: 1 })}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Buttons: Refresh, Export, Reset */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            title="تحديث البيانات من السيرفر"
            className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تحديث</span>
          </button>

          <button
            type="button"
            onClick={onExportCSV}
            disabled={isExporting}
            className="px-3.5 py-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-glow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير CSV</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 text-xs font-medium flex items-center gap-1 transition-all"
            title="إعادة ضبط الفلاتر"
          >
            <span>إلغاء الفلاتر</span>
          </button>
        </div>
      </div>

      {/* Filter Selects Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-800/80">
        {/* Status Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" />
            <span>حالة المراجعة:</span>
          </label>
          <select
            value={filters.reviewStatus || 'all'}
            onChange={(e) => onChange({ reviewStatus: e.target.value, page: 1 })}
            className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="all">كل الحالات</option>
            {Object.entries(REVIEW_STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>

        {/* Project Type Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            تصنيف المشروع:
          </label>
          <select
            value={filters.projectType || 'all'}
            onChange={(e) => onChange({ projectType: e.target.value, page: 1 })}
            className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="all">كل التصنيفات</option>
            {PROJECT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            المدة التقديرية:
          </label>
          <select
            value={filters.estimatedDuration || 'all'}
            onChange={(e) => onChange({ estimatedDuration: e.target.value, page: 1 })}
            className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="all">كل المدد</option>
            {ESTIMATED_DURATIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            مستوى الصعوبة:
          </label>
          <select
            value={filters.difficultyLevel || 'all'}
            onChange={(e) => onChange({ difficultyLevel: e.target.value, page: 1 })}
            className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="all">كل المستويات</option>
            <option value="1">1 - مبتدئ جداً</option>
            <option value="2">2 - سهل إلى متوسط</option>
            <option value="3">3 - متوسط</option>
            <option value="4">4 - متقدم</option>
            <option value="5">5 - معقد وشديد التحدي</option>
          </select>
        </div>

        {/* Willingness to Lead */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            الاستعداد للقيادة:
          </label>
          <select
            value={filters.willingToLead || 'all'}
            onChange={(e) => onChange({ willingToLead: e.target.value, page: 1 })}
            className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="all">الكل</option>
            {WILLING_TO_LEAD_OPTIONS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            الترتيب حسب:
          </label>
          <select
            value={filters.sortBy || 'created_at_desc'}
            onChange={(e) => onChange({ sortBy: e.target.value as any, page: 1 })}
            className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="created_at_desc">الأحدث تقديماً أولاً</option>
            <option value="created_at_asc">الأقدم تقديماً أولاً</option>
            <option value="difficulty_desc">الأعلى صعوبة أولاً</option>
            <option value="difficulty_asc">الأقل صعوبة أولاً</option>
          </select>
        </div>
      </div>
    </div>
  );
};
