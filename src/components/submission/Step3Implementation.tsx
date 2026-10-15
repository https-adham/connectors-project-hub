import React, { useState } from 'react';
import { SubmissionFormData, ProjectType, EstimatedDuration } from '../../types/database';
import { ValidationError } from '../../lib/validation';
import {
  PROJECT_TYPES,
  DEFAULT_SKILLS,
  ESTIMATED_DURATIONS,
  DIFFICULTY_LEVELS,
} from '../../lib/constants';
import { Wrench, Clock, Gauge, Plus, X, Check } from 'lucide-react';

interface Step3Props {
  data: SubmissionFormData;
  onChange: (updates: Partial<SubmissionFormData>) => void;
  errors: ValidationError[];
}

export const Step3Implementation: React.FC<Step3Props> = ({ data, onChange, errors }) => {
  const [newSkillInput, setNewSkillInput] = useState('');
  const getFieldError = (field: string) => errors.find((e) => e.field === field)?.message;

  const toggleSkill = (skill: string) => {
    const current = [...data.required_skills];
    const index = current.indexOf(skill);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(skill);
    }
    onChange({ required_skills: current });
  };

  const addCustomSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    const currentCustom = [...(data.custom_skills || [])];
    if (!currentCustom.includes(trimmed)) {
      currentCustom.push(trimmed);
      onChange({ custom_skills: currentCustom });
    }
    setNewSkillInput('');
  };

  const removeCustomSkill = (skill: string) => {
    const currentCustom = (data.custom_skills || []).filter((s) => s !== skill);
    onChange({ custom_skills: currentCustom });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <span>تفاصيل التنفيذ والمهارات</span>
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          حدد المجال التقني، المهارات المطلوبة، والمدى الزمني والصعوبة التقديرية.
        </p>
      </div>

      {/* Project Type Grid */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2.5">
          تصنيف أو مجال المشروع <span className="text-rose-400">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PROJECT_TYPES.map((type) => {
            const isSelected = data.project_type === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => onChange({ project_type: type.value as ProjectType })}
                className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between text-xs sm:text-sm font-medium ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 shadow-glow-sm ring-1 ring-cyan-400/30'
                    : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <span>{type.label}</span>
                {isSelected && <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mr-2" />}
              </button>
            );
          })}
        </div>
        {getFieldError('project_type') && (
          <p className="text-xs text-rose-400 mt-1.5 font-medium">{getFieldError('project_type')}</p>
        )}

        {/* Custom Project Type if 'other' */}
        {data.project_type === 'other' && (
          <div className="mt-3 p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30">
            <label htmlFor="custom_project_type" className="block text-xs font-semibold text-cyan-300 mb-1.5">
              حدد المجال المخصص <span className="text-rose-400">*</span>
            </label>
            <input
              id="custom_project_type"
              type="text"
              value={data.custom_project_type}
              onChange={(e) => onChange({ custom_project_type: e.target.value })}
              placeholder="مثال: الأمن السيبراني المتقدم، الحوسبة الكمية، إلخ..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
            />
            {getFieldError('custom_project_type') && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{getFieldError('custom_project_type')}</p>
            )}
          </div>
        )}
      </div>

      {/* Skills Multi-Select */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-cyan-400" />
            <span>المهارات والأدوات المطلوبة للتنفيذ</span>
            <span className="text-rose-400">*</span>
          </label>
          <span className="text-xs text-slate-400">
            (تم تحديد: {(data.required_skills?.length || 0) + (data.custom_skills?.length || 0)})
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
          {/* Default Skill Chips */}
          <div className="flex flex-wrap gap-2">
            {DEFAULT_SKILLS.map((skill) => {
              const selected = data.required_skills?.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selected
                      ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-sm ring-1 ring-cyan-300'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>

          {/* Custom Skills Badges */}
          {data.custom_skills && data.custom_skills.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-2">مهارات مخصصة أضفتها:</span>
              <div className="flex flex-wrap gap-2">
                {data.custom_skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-teal-950/70 text-teal-300 border border-teal-500/40"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeCustomSkill(skill)}
                      className="hover:text-rose-400 focus:outline-none"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add Custom Skill Input */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomSkill();
                }
              }}
              placeholder="أضف مهارة أو أداة إضافية..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={addCustomSkill}
              className="px-3.5 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة</span>
            </button>
          </div>
        </div>
        {getFieldError('required_skills') && (
          <p className="text-xs text-rose-400 mt-1.5 font-medium">{getFieldError('required_skills')}</p>
        )}
      </div>

      {/* Estimated Duration */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2.5 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>المدة التقديرية لإنجاز المشروع</span>
          <span className="text-rose-400">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ESTIMATED_DURATIONS.map((dur) => {
            const isSelected = data.estimated_duration === dur.value;
            return (
              <button
                key={dur.value}
                type="button"
                onClick={() => onChange({ estimated_duration: dur.value as EstimatedDuration })}
                className={`p-3.5 rounded-xl border text-right transition-all flex items-center justify-between text-xs sm:text-sm font-medium ${
                  isSelected
                    ? 'bg-sky-950/60 border-cyan-400 text-cyan-200 shadow-glow-sm ring-1 ring-cyan-400/40'
                    : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{dur.label}</span>
                {isSelected && <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mr-1.5" />}
              </button>
            );
          })}
        </div>
        {getFieldError('estimated_duration') && (
          <p className="text-xs text-rose-400 mt-1.5 font-medium">{getFieldError('estimated_duration')}</p>
        )}
      </div>

      {/* Perceived Difficulty 1 - 5 */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2.5 flex items-center gap-1.5">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <span>درجة الصعوبة التقديرية (1 - 5)</span>
          <span className="text-rose-400">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {DIFFICULTY_LEVELS.map((diff) => {
            const isSelected = data.difficulty_level === diff.value;
            return (
              <button
                key={diff.value}
                type="button"
                onClick={() => onChange({ difficulty_level: diff.value })}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-950/80 to-slate-900 border-cyan-400 text-cyan-300 shadow-glow-sm ring-1 ring-cyan-400/50'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-base font-extrabold">{diff.value}</span>
                <span className="text-[11px] font-semibold">{diff.label.split(' - ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected difficulty explanation */}
        {data.difficulty_level && (
          <div className="mt-2.5 text-xs text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
            <span className="font-semibold text-slate-300">التوضيح: </span>
            {DIFFICULTY_LEVELS.find((d) => d.value === data.difficulty_level)?.description}
          </div>
        )}

        {getFieldError('difficulty_level') && (
          <p className="text-xs text-rose-400 mt-1.5 font-medium">{getFieldError('difficulty_level')}</p>
        )}
      </div>
    </div>
  );
};
