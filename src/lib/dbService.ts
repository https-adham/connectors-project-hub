import { supabase, isSupabaseConfigured } from './supabase';
import {
  ProjectIdea,
  SubmissionFormData,
  ProjectIdeaFilter,
  ReviewStatus,
  DashboardMetrics,
} from '../types/database';
import { validateEntireSubmission } from './validation';
import { PROJECT_TYPES, ESTIMATED_DURATIONS, WILLING_TO_LEAD_OPTIONS, ESTIMATED_TEAM_SIZES, REVIEW_STATUS_CONFIG } from './constants';

export interface SubmitResult {
  success: boolean;
  idea?: ProjectIdea;
  error?: string;
}

export async function submitProjectIdea(data: SubmissionFormData): Promise<SubmitResult> {
  // 1. Strict validation
  const validationErrors = validateEntireSubmission(data);
  if (validationErrors.length > 0) {
    return {
      success: false,
      error: validationErrors.map((e) => e.message).join(' | '),
    };
  }

  // 2. Check if Supabase is properly configured
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'لم يتم ربط قاعدة بيانات Supabase بعد. يرجى تزويد مفاتيح الربط في ملف البيئة (.env).',
    };
  }

  try {
    const isAnonymous = data.submission_type === 'anonymous';

    // 3. Prepare clean payload according to security policy
    const payload = {
      submission_type: data.submission_type,
      submitter_name: isAnonymous ? null : (data.submitter_name.trim() || null),
      contact_method: isAnonymous ? null : (data.contact_method.trim() || null),
      project_title: data.project_title.trim(),
      project_description: data.project_description.trim(),
      problem_statement: data.problem_statement.trim(),
      target_audience: data.target_audience.trim(),
      project_type: data.project_type,
      custom_project_type: data.project_type === 'other' ? data.custom_project_type.trim() : null,
      required_skills: data.required_skills || [],
      custom_skills: data.custom_skills || [],
      estimated_duration: data.estimated_duration,
      difficulty_level: Number(data.difficulty_level),
      willing_to_lead: data.willing_to_lead,
      preferred_collaborators: data.preferred_collaborators.trim() || null,
      estimated_team_size: data.estimated_team_size,
      inspiration_url: data.inspiration_url.trim() || null,
      additional_notes: data.additional_notes.trim() || null,
      review_status: 'new' as const,
    };

    const newId = crypto.randomUUID();
    const nowIso = new Date().toISOString();

    const insertRecord = {
      id: newId,
      created_at: nowIso,
      ...payload,
    };

    const { error } = await supabase
      .from('project_ideas')
      .insert(insertRecord);

    if (error) {
      console.error('Supabase submission insert error:', error);
      return {
        success: false,
        error: `خطأ أثناء الحفظ في قاعدة البيانات: ${error.message}`,
      };
    }

    const insertedIdea: ProjectIdea = {
      ...insertRecord,
      reviewer_notes: null,
      reviewed_at: null,
      reviewed_by: null,
    };

    return {
      success: true,
      idea: insertedIdea,
    };
  } catch (err: unknown) {
    console.error('Unexpected submission failure:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء إرسال الفكرة.',
    };
  }
}

export async function fetchProjectIdeas(
  filters: ProjectIdeaFilter = {}
): Promise<{ data: ProjectIdea[]; totalCount: number; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: [], totalCount: 0, error: 'Supabase غير مهيأ' };
  }

  try {
    let query = supabase.from('project_ideas').select('*', { count: 'exact' });

    // Search query
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.trim();
      query = query.or(`project_title.ilike.%${q}%,submitter_name.ilike.%${q}%,project_description.ilike.%${q}%`);
    }

    // Filters
    if (filters.projectType && filters.projectType !== 'all') {
      query = query.eq('project_type', filters.projectType);
    }
    if (filters.reviewStatus && filters.reviewStatus !== 'all') {
      query = query.eq('review_status', filters.reviewStatus);
    }
    if (filters.estimatedDuration && filters.estimatedDuration !== 'all') {
      query = query.eq('estimated_duration', filters.estimatedDuration);
    }
    if (filters.difficultyLevel && filters.difficultyLevel !== 'all') {
      query = query.eq('difficulty_level', Number(filters.difficultyLevel));
    }
    if (filters.willingToLead && filters.willingToLead !== 'all') {
      query = query.eq('willing_to_lead', filters.willingToLead);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'created_at_asc':
        query = query.order('created_at', { ascending: true });
        break;
      case 'difficulty_desc':
        query = query.order('difficulty_level', { ascending: false });
        break;
      case 'difficulty_asc':
        query = query.order('difficulty_level', { ascending: true });
        break;
      case 'created_at_desc':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    // Pagination
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      return { data: [], totalCount: 0, error: error.message };
    }

    return {
      data: (data || []) as ProjectIdea[],
      totalCount: count || 0,
      error: null,
    };
  } catch (err: unknown) {
    return {
      data: [],
      totalCount: 0,
      error: err instanceof Error ? err.message : 'فشل جلب الأفكار',
    };
  }
}

export async function fetchProjectIdeaById(id: string): Promise<{ data: ProjectIdea | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'قاعدة البيانات غير متصلة' };
  }

  try {
    const { data, error } = await supabase
      .from('project_ideas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as ProjectIdea, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'فشل جلب تفاصيل الفكرة' };
  }
}

export async function updateIdeaReview(
  id: string,
  reviewStatus: ReviewStatus,
  reviewerNotes: string | null,
  adminUserId: string
): Promise<{ success: boolean; data?: ProjectIdea; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'قاعدة البيانات غير متصلة' };
  }

  try {
    const payload = {
      review_status: reviewStatus,
      reviewer_notes: reviewerNotes ? reviewerNotes.trim() : null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminUserId,
    };

    const { data, error } = await supabase
      .from('project_ideas')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as ProjectIdea };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'فشل تحديث حالة الفكرة' };
  }
}

export async function fetchDashboardMetrics(): Promise<{ metrics: DashboardMetrics; error: string | null }> {
  const defaultMetrics: DashboardMetrics = {
    totalIdeas: 0,
    newIdeas: 0,
    underReview: 0,
    acceptedProvisionally: 0,
    needsMoreInfo: 0,
    potentialLeaders: 0,
  };

  if (!isSupabaseConfigured()) {
    return { metrics: defaultMetrics, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('project_ideas')
      .select('review_status, willing_to_lead');

    if (error) {
      return { metrics: defaultMetrics, error: error.message };
    }

    const items = data || [];
    const metrics: DashboardMetrics = {
      totalIdeas: items.length,
      newIdeas: items.filter((i) => i.review_status === 'new').length,
      underReview: items.filter((i) => i.review_status === 'under_review').length,
      acceptedProvisionally: items.filter((i) => i.review_status === 'accepted_provisionally').length,
      needsMoreInfo: items.filter((i) => i.review_status === 'needs_more_info').length,
      potentialLeaders: items.filter((i) => i.willing_to_lead === 'yes').length,
    };

    return { metrics, error: null };
  } catch (err: unknown) {
    return { metrics: defaultMetrics, error: err instanceof Error ? err.message : 'فشل حساب الإحصائيات' };
  }
}

export async function checkIsAdmin(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !userId) return false;

  try {
    // 1. First check admin_profiles directly
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('id, role')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      return true;
    }

    // 2. Fallback to RPC function is_admin
    const { data: rpcIsAdmin } = await supabase.rpc('is_admin');
    return Boolean(rpcIsAdmin);
  } catch {
    return false;
  }
}

export async function bootstrapFirstAdmin(adminName: string): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, message: 'Supabase غير متصل' };
  }

  try {
    const { data, error } = await supabase.rpc('bootstrap_first_admin', {
      admin_name: adminName,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return data as { success: boolean; message: string };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'فشل تفعيل حساب المدير الأول',
    };
  }
}

// UTF-8 CSV Export with BOM
export function exportToCSV(ideas: ProjectIdea[], filename = 'connectors_project_ideas.csv') {
  if (!ideas || ideas.length === 0) {
    alert('لا توجد أفكار للتصدير في القائمة المحددة');
    return;
  }

  const headers = [
    'المعرف',
    'تاريخ التقديم',
    'نوع التقديم',
    'صاحب الفكرة',
    'وسيلة التواصل',
    'عنوان المشروع',
    'الوصف',
    'المشكلة',
    'الفئة المستهدفة',
    'التصنيف',
    'التصنيف المخصص',
    'المهارات المطلوبة',
    'مهارات إضافية',
    'المدة التقديرية',
    'مستوى الصعوبة',
    'الاستعداد للقيادة',
    'الزملاء المقترحون',
    'حجم الفريق',
    'رابط الإلهام',
    'ملاحظات إضافية',
    'حالة المراجعة',
    'ملاحظات المراجع',
  ];

  const escapeCSV = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = ideas.map((idea) => {
    const typeLabel = PROJECT_TYPES.find((t) => t.value === idea.project_type)?.label || idea.project_type;
    const durationLabel = ESTIMATED_DURATIONS.find((d) => d.value === idea.estimated_duration)?.label || idea.estimated_duration;
    const leaderLabel = WILLING_TO_LEAD_OPTIONS.find((l) => l.value === idea.willing_to_lead)?.label || idea.willing_to_lead;
    const teamSizeLabel = ESTIMATED_TEAM_SIZES.find((s) => s.value === idea.estimated_team_size)?.label || idea.estimated_team_size;
    const statusLabel = REVIEW_STATUS_CONFIG[idea.review_status]?.label || idea.review_status;

    return [
      escapeCSV(idea.id),
      escapeCSV(new Date(idea.created_at).toLocaleString('ar-EG')),
      escapeCSV(idea.submission_type === 'anonymous' ? 'بدون هوية (مجهول)' : 'بالاسم'),
      escapeCSV(idea.submission_type === 'anonymous' ? 'مجهول (Anonymous)' : idea.submitter_name || ''),
      escapeCSV(idea.contact_method || ''),
      escapeCSV(idea.project_title),
      escapeCSV(idea.project_description),
      escapeCSV(idea.problem_statement),
      escapeCSV(idea.target_audience),
      escapeCSV(typeLabel),
      escapeCSV(idea.custom_project_type || ''),
      escapeCSV(Array.isArray(idea.required_skills) ? idea.required_skills.join(', ') : ''),
      escapeCSV(Array.isArray(idea.custom_skills) ? idea.custom_skills.join(', ') : ''),
      escapeCSV(durationLabel),
      escapeCSV(idea.difficulty_level),
      escapeCSV(leaderLabel),
      escapeCSV(idea.preferred_collaborators || ''),
      escapeCSV(teamSizeLabel),
      escapeCSV(idea.inspiration_url || ''),
      escapeCSV(idea.additional_notes || ''),
      escapeCSV(statusLabel),
      escapeCSV(idea.reviewer_notes || ''),
    ].join(',');
  });

  // UTF-8 BOM \uFEFF ensures Excel renders Arabic properly
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
