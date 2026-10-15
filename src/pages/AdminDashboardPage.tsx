import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProjectIdea, DashboardMetrics, ProjectIdeaFilter } from '../types/database';
import {
  fetchProjectIdeas,
  fetchDashboardMetrics,
  exportToCSV,
} from '../lib/dbService';
import { MetricCards } from '../components/admin/MetricCards';
import { IdeasFilterBar } from '../components/admin/IdeasFilterBar';
import { IdeasTable } from '../components/admin/IdeasTable';
import { IdeaDetailModal } from '../components/admin/IdeaDetailModal';
import { Shield, Sparkles, AlertCircle } from 'lucide-react';

const INITIAL_METRICS: DashboardMetrics = {
  totalIdeas: 0,
  newIdeas: 0,
  underReview: 0,
  acceptedProvisionally: 0,
  needsMoreInfo: 0,
  potentialLeaders: 0,
};

export const AdminDashboardPage: React.FC = () => {
  const { isAdmin, isLoading: authLoading, adminProfile } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<DashboardMetrics>(INITIAL_METRICS);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(true);

  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [ideasLoading, setIdeasLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null);

  const [filters, setFilters] = useState<ProjectIdeaFilter>({
    searchQuery: '',
    projectType: 'all',
    reviewStatus: 'all',
    estimatedDuration: 'all',
    difficultyLevel: 'all',
    willingToLead: 'all',
    sortBy: 'created_at_desc',
    page: 1,
    pageSize: 10,
  });

  // Guard: If not admin and not loading, redirect to /admin/login
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin/login', { replace: true, state: { from: { pathname: '/admin' } } });
    }
  }, [isAdmin, authLoading, navigate]);

  const loadMetrics = useCallback(async () => {
    setMetricsLoading(true);
    const res = await fetchDashboardMetrics();
    if (!res.error) {
      setMetrics(res.metrics);
    }
    setMetricsLoading(false);
  }, []);

  const loadIdeas = useCallback(async () => {
    setIdeasLoading(true);
    setFetchError(null);
    const res = await fetchProjectIdeas(filters);
    if (res.error) {
      setFetchError(res.error);
      setIdeas([]);
      setTotalCount(0);
    } else {
      setIdeas(res.data);
      setTotalCount(res.totalCount);
    }
    setIdeasLoading(false);
  }, [filters]);

  useEffect(() => {
    if (isAdmin) {
      loadMetrics();
      loadIdeas();
    }
  }, [isAdmin, loadMetrics, loadIdeas]);

  const handleFilterUpdates = (updates: Partial<ProjectIdeaFilter>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      projectType: 'all',
      reviewStatus: 'all',
      estimatedDuration: 'all',
      difficultyLevel: 'all',
      willingToLead: 'all',
      sortBy: 'created_at_desc',
      page: 1,
      pageSize: 10,
    });
  };

  const handleRefresh = () => {
    loadMetrics();
    loadIdeas();
  };

  const handleExportCSV = async () => {
    // Fetch all records matching the current filters (without page limit)
    const allMatching = await fetchProjectIdeas({
      ...filters,
      page: 1,
      pageSize: 1000,
    });
    if (allMatching.data && allMatching.data.length > 0) {
      exportToCSV(allMatching.data, `connectors_ideas_${new Date().toISOString().slice(0, 10)}.csv`);
    } else {
      alert('لا توجد أفكار مطابقة للتصدير');
    }
  };

  const handleIdeaUpdated = (updatedIdea: ProjectIdea) => {
    setSelectedIdea(updatedIdea);
    setIdeas((prev) => prev.map((item) => (item.id === updatedIdea.id ? updatedIdea : item)));
    loadMetrics();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen tech-grid-bg flex items-center justify-center p-6">
        <div className="card-futuristic p-8 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-300 font-medium">جاري التحقق من صلاحيات المشرف...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen tech-grid-bg pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-sky-500/20">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
                <Shield className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                لوحة مراجعة أفكار المشاريع
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              مرحباً بك، <span className="text-cyan-300 font-semibold">{adminProfile?.full_name || 'مسؤول Connectors'}</span>. يمكنك هنا مراجعة وتصفية كافة المقترحات وإبداء الملاحظات.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>جلسة إدارة مؤمّنة بسياسات RLS</span>
            </span>
          </div>
        </div>

        {/* Database Error Banner if any */}
        {fetchError && (
          <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <div className="flex-1">
              <span>خطأ أثناء الاتصال بقاعدة البيانات: {fetchError}</span>
            </div>
          </div>
        )}

        {/* Real KPI Metrics Cards */}
        <MetricCards metrics={metrics} isLoading={metricsLoading} />

        {/* Search & Filter Bar */}
        <IdeasFilterBar
          filters={filters}
          onChange={handleFilterUpdates}
          onReset={handleResetFilters}
          onRefresh={handleRefresh}
          onExportCSV={handleExportCSV}
        />

        {/* Submissions Table with Pagination */}
        <IdeasTable
          ideas={ideas}
          totalCount={totalCount}
          currentPage={filters.page || 1}
          pageSize={filters.pageSize || 10}
          isLoading={ideasLoading}
          onPageChange={(page) => handleFilterUpdates({ page })}
          onSelectIdea={(idea) => setSelectedIdea(idea)}
        />

        {/* Submission Details Modal */}
        {selectedIdea && (
          <IdeaDetailModal
            idea={selectedIdea}
            onClose={() => setSelectedIdea(null)}
            onUpdated={handleIdeaUpdated}
          />
        )}

      </div>
    </div>
  );
};
