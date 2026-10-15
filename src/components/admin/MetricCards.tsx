import React from 'react';
import { DashboardMetrics } from '../../types/database';
import { Lightbulb, Clock, CheckCircle, HelpCircle, Compass, FileText } from 'lucide-react';

interface MetricCardsProps {
  metrics: DashboardMetrics;
  isLoading: boolean;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics, isLoading }) => {
  const cards = [
    {
      title: 'إجمالي الأفكار المقدمة',
      value: metrics.totalIdeas,
      icon: Lightbulb,
      color: 'from-sky-500 to-blue-600',
      textColor: 'text-sky-300',
      borderColor: 'border-sky-500/30',
      bgColor: 'bg-sky-500/10',
    },
    {
      title: 'أفكار جديدة بانتظار المراجعة',
      value: metrics.newIdeas,
      icon: Clock,
      color: 'from-cyan-500 to-teal-500',
      textColor: 'text-cyan-300',
      borderColor: 'border-cyan-500/30',
      bgColor: 'bg-cyan-500/10',
    },
    {
      title: 'قيد الدراسة والمراجعة',
      value: metrics.underReview,
      icon: FileText,
      color: 'from-amber-500 to-yellow-600',
      textColor: 'text-amber-300',
      borderColor: 'border-amber-500/30',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'مقبولة مبدئياً للتنفيذ',
      value: metrics.acceptedProvisionally,
      icon: CheckCircle,
      color: 'from-emerald-500 to-green-600',
      textColor: 'text-emerald-300',
      borderColor: 'border-emerald-500/30',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'تحتاج معلومات إضافية',
      value: metrics.needsMoreInfo,
      icon: HelpCircle,
      color: 'from-orange-500 to-rose-600',
      textColor: 'text-orange-300',
      borderColor: 'border-orange-500/30',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'مستعدون لقيادة المشاريع',
      value: metrics.potentialLeaders,
      icon: Compass,
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-300',
      borderColor: 'border-purple-500/30',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-slate-900/60 border ${c.borderColor} relative overflow-hidden transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between`}
          >
            {/* Top row: Icon and Title */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${c.bgColor} ${c.textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-400 line-clamp-2 min-h-[32px]">
                {c.title}
              </p>
            </div>

            {/* Value */}
            <div className="mt-3">
              {isLoading ? (
                <div className="h-7 w-12 bg-slate-800 animate-pulse rounded" />
              ) : (
                <span className={`text-2xl sm:text-3xl font-black ${c.textColor}`}>
                  {c.value}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
