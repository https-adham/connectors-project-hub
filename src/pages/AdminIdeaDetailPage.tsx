import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProjectIdea } from '../types/database';
import { fetchProjectIdeaById } from '../lib/dbService';
import { IdeaDetailModal } from '../components/admin/IdeaDetailModal';
import { ArrowRight, AlertCircle } from 'lucide-react';

export const AdminIdeaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAuth();

  const [idea, setIdea] = useState<ProjectIdea | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin/login', { replace: true });
      return;
    }

    if (id && isAdmin) {
      setIsLoading(true);
      fetchProjectIdeaById(id).then((res) => {
        setIsLoading(false);
        if (res.error) {
          setError(res.error);
        } else {
          setIdea(res.data);
        }
      });
    }
  }, [id, isAdmin, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen tech-grid-bg flex items-center justify-center p-6">
        <div className="card-futuristic p-8 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-300 font-medium">جاري جلب تفاصيل الفكرة...</p>
        </div>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="min-h-screen tech-grid-bg flex items-center justify-center p-6">
        <div className="card-futuristic p-8 max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">لم نتمكن من العثور على الفكرة</h2>
          <p className="text-xs text-slate-400">{error || 'قد تكون الفكرة حذفت أو أن المعرف غير صحيح.'}</p>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للوحة الإدارة</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <IdeaDetailModal
      idea={idea}
      onClose={() => navigate('/admin')}
      onUpdated={(updated) => setIdea(updated)}
    />
  );
};
