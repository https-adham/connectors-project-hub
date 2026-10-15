import { ProjectType, EstimatedDuration, WillingToLead, EstimatedTeamSize, ReviewStatus } from '../types/database';

export const PROJECT_TYPES: { value: ProjectType; label: string; iconName: string }[] = [
  { value: 'mobile_app', label: 'تطبيق هاتف (Mobile Application)', iconName: 'Smartphone' },
  { value: 'website', label: 'موقع ويب أو منصة (Website / Web App)', iconName: 'Globe' },
  { value: 'ai_ml', label: 'ذكاء اصطناعي وتعلم آلة (AI / Machine Learning)', iconName: 'Brain' },
  { value: 'hardware', label: 'عتاد إلكتروني (Hardware)', iconName: 'Cpu' },
  { value: 'iot_embedded', label: 'إنترنت الأشياء وأنظمة مدمجة (IoT / Embedded Systems)', iconName: 'Wifi' },
  { value: 'community_initiative', label: 'مبادرة مجتمعية أو طلابية (Community Initiative)', iconName: 'Users' },
  { value: 'event', label: 'فعالية أو هاكاثون (Event / Workshop)', iconName: 'Calendar' },
  { value: 'scientific_research', label: 'بحث علمي وورقة بحثية (Scientific Research)', iconName: 'BookOpen' },
  { value: 'ui_ux_design', label: 'تصميم تجربة وواجهة مستخدم (UI/UX Design)', iconName: 'Palette' },
  { value: 'internal_tool', label: 'أداة داخلية لفريق Connectors (Internal Team Tool)', iconName: 'Wrench' },
  { value: 'multidisciplinary', label: 'مشروع متعدد التخصصات (Multidisciplinary)', iconName: 'Layers' },
  { value: 'other', label: 'مجال آخر (Other)', iconName: 'Sparkles' },
];

export const ESTIMATED_DURATIONS: { value: EstimatedDuration; label: string }[] = [
  { value: 'less_than_1_month', label: 'أقل من شهر (Sprint سريع)' },
  { value: '1_to_3_months', label: 'من شهر إلى 3 أشهر (مشروع فصلي متوسط)' },
  { value: 'more_than_3_months', label: 'أكثر من 3 أشهر (مشروع استراتيجي طويل)' },
];

export const DIFFICULTY_LEVELS: { value: number; label: string; description: string }[] = [
  { value: 1, label: '1 - مبتدئ جداً', description: 'فكرة بسيطة تحتاج مفاهيم أولية وتنفيذ سريع' },
  { value: 2, label: '2 - سهل إلى متوسط', description: 'تحتاج مهارات برمجية أو تقنية أساسية' },
  { value: 3, label: '3 - متوسط', description: 'تتطلب تخطيطاً، تقنيات متعددة، وتكامل أجزاء مختلفة' },
  { value: 4, label: '4 - متقدم', description: 'تتطلب خوارزميات معقدة أو نمذجة أو هندسة عتاد' },
  { value: 5, label: '5 - معقد وشديد التحدي', description: 'بحث علمي متقدم أو حلول ريادية تتطلب مهارات استثنائية' },
];

export const WILLING_TO_LEAD_OPTIONS: { value: WillingToLead; label: string; desc: string }[] = [
  { value: 'yes', label: 'نعم، مستعد لقيادة المشروع', desc: 'لدي الرغبة في تنسيق الفريق والمتابعة' },
  { value: 'no', label: 'لا، أفضّل المشاركة كعضو فقط', desc: 'أود تقديم الفكرة والمساهمة في تنفيذها' },
  { value: 'unsure', label: 'غير متأكد حالياً', desc: 'يعتمد على متطلبات المشروع وتشكيلة الفريق' },
];

export const ESTIMATED_TEAM_SIZES: { value: EstimatedTeamSize; label: string }[] = [
  { value: '1_2', label: '1 - 2 أفراد (فريق مصغر)' },
  { value: '3_4', label: '3 - 4 أفراد (الفريق القياسي)' },
  { value: '5_6', label: '5 - 6 أفراد (مشروع موسع)' },
  { value: 'more_than_6', label: 'أكثر من 6 أفراد (مبادرة كبرى)' },
  { value: 'undecided', label: 'غير محدد بعد (حسب نطاق العمل)' },
];

export const DEFAULT_SKILLS = [
  'Python',
  'C / C++',
  'Java',
  'JavaScript / TypeScript',
  'React / Next.js',
  'Node.js / Express',
  'Mobile Development (Flutter/React Native)',
  'AI / Machine Learning',
  'Deep Learning / PyTorch / TensorFlow',
  'Computer Vision (OpenCV)',
  'Natural Language Processing (NLP)',
  'Data Analysis & Visualization',
  'UI/UX Design (Figma)',
  'Graphic Design',
  'Arduino & Microcontrollers',
  'Embedded Systems',
  'Internet of Things (IoT)',
  'Robotics / ROS',
  'Computer Networking',
  'Cybersecurity',
  'Cloud & DevOps (Docker, Linux)',
  'Scientific Research & Academic Writing',
  'Marketing & Content Creation',
  'Project & Event Management',
];

export const REVIEW_STATUS_CONFIG: Record<ReviewStatus, { label: string; colorClass: string; bgClass: string; borderClass: string }> = {
  new: {
    label: 'جديدة (بانتظار المراجعة)',
    colorClass: 'text-sky-400',
    bgClass: 'bg-sky-500/10',
    borderClass: 'border-sky-500/30',
  },
  under_review: {
    label: 'قيد المراجعة والدراسة',
    colorClass: 'text-amber-400',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/30',
  },
  needs_more_info: {
    label: 'تحتاج معلومات إضافية',
    colorClass: 'text-orange-400',
    bgClass: 'bg-orange-500/10',
    borderClass: 'border-orange-500/30',
  },
  accepted_provisionally: {
    label: 'مقبولة مبدئياً',
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/30',
  },
  deferred: {
    label: 'مؤجلة لفترة لاحقة',
    colorClass: 'text-purple-400',
    bgClass: 'bg-purple-500/10',
    borderClass: 'border-purple-500/30',
  },
  not_suitable: {
    label: 'غير مناسبة حالياً',
    colorClass: 'text-slate-400',
    bgClass: 'bg-slate-500/10',
    borderClass: 'border-slate-500/30',
  },
};
