import { SubmissionFormData } from '../types/database';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateStep(step: number, data: SubmissionFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  switch (step) {
    case 1: {
      if (!data.submission_type || !['named', 'anonymous'].includes(data.submission_type)) {
        errors.push({ field: 'submission_type', message: 'يرجى اختيار نوع التقديم (بالاسم أو بدون هوية)' });
      }

      if (data.submission_type === 'named') {
        if (!data.submitter_name || data.submitter_name.trim().length < 2) {
          errors.push({ field: 'submitter_name', message: 'اسم صاحب الفكرة مطلوب (حرفين على الأقل)' });
        } else if (data.submitter_name.trim().length > 120) {
          errors.push({ field: 'submitter_name', message: 'اسم صاحب الفكرة طويل جداً (الحد الأقصى 120 حرف)' });
        }

        if (data.contact_method && data.contact_method.trim().length > 150) {
          errors.push({ field: 'contact_method', message: 'وسيلة التواصل طويلة جداً (الحد الأقصى 150 حرف)' });
        }
      }
      break;
    }

    case 2: {
      if (!data.project_title || data.project_title.trim().length < 3) {
        errors.push({ field: 'project_title', message: 'عنوان الفكرة مطلوب (3 أحرف على الأقل)' });
      } else if (data.project_title.trim().length > 150) {
        errors.push({ field: 'project_title', message: 'عنوان الفكرة طويل جداً (الحد الأقصى 150 حرف)' });
      }

      if (!data.project_description || data.project_description.trim().length < 15) {
        errors.push({ field: 'project_description', message: 'يرجى كتابة وصف موجز ومفهوم للفكرة (15 حرفاً على الأقل)' });
      } else if (data.project_description.trim().length > 3000) {
        errors.push({ field: 'project_description', message: 'الوصف تجاوز الحد الأقصى (3000 حرف)' });
      }

      if (!data.problem_statement || data.problem_statement.trim().length < 10) {
        errors.push({ field: 'problem_statement', message: 'يرجى توضيح المشكلة التي يعالجها المشروع (10 أحرف على الأقل)' });
      } else if (data.problem_statement.trim().length > 3000) {
        errors.push({ field: 'problem_statement', message: 'توضيح المشكلة تجاوز الحد الأقصى (3000 حرف)' });
      }

      if (!data.target_audience || data.target_audience.trim().length < 3) {
        errors.push({ field: 'target_audience', message: 'يرجى تحديد الفئة المستهدفة أو المستفيدين (3 أحرف على الأقل)' });
      } else if (data.target_audience.trim().length > 1500) {
        errors.push({ field: 'target_audience', message: 'تحديد الفئة المستهدفة تجاوز الحد الأقصى' });
      }
      break;
    }

    case 3: {
      if (!data.project_type) {
        errors.push({ field: 'project_type', message: 'يرجى اختيار تصنيف المشروع' });
      } else if (data.project_type === 'other') {
        if (!data.custom_project_type || data.custom_project_type.trim().length < 2) {
          errors.push({ field: 'custom_project_type', message: 'يرجى تحديد المجال المخصص عند اختيار "مجال آخر"' });
        }
      }

      const totalSkillsCount = (data.required_skills?.length || 0) + (data.custom_skills?.length || 0);
      if (totalSkillsCount === 0) {
        errors.push({ field: 'required_skills', message: 'يرجى اختيار مهارة أو أداة واحدة على الأقل لازمة للتنفيذ' });
      }

      if (!data.estimated_duration) {
        errors.push({ field: 'estimated_duration', message: 'يرجى تحديد المدة التقديرية لإنجاز المشروع' });
      }

      if (!data.difficulty_level || data.difficulty_level < 1 || data.difficulty_level > 5) {
        errors.push({ field: 'difficulty_level', message: 'يرجى تحديد درجة صعوبة المشروع التقديرية (بين 1 و 5)' });
      }
      break;
    }

    case 4: {
      if (!data.willing_to_lead || !['yes', 'no', 'unsure'].includes(data.willing_to_lead)) {
        errors.push({ field: 'willing_to_lead', message: 'يرجى تحديد مدى استعدادك لقيادة المشروع' });
      }

      if (!data.estimated_team_size) {
        errors.push({ field: 'estimated_team_size', message: 'يرجى تحديد حجم الفريق المقترح' });
      }

      if (data.preferred_collaborators && data.preferred_collaborators.trim().length > 500) {
        errors.push({ field: 'preferred_collaborators', message: 'قائمة الزملاء المقترحين طويلة جداً (الحد الأقصى 500 حرف)' });
      }
      break;
    }

    case 5: {
      if (data.inspiration_url && data.inspiration_url.trim() !== '') {
        try {
          const url = new URL(data.inspiration_url.trim());
          if (!['http:', 'https:'].includes(url.protocol)) {
            errors.push({ field: 'inspiration_url', message: 'يجب أن يبدأ الرابط بـ http:// أو https://' });
          }
        } catch {
          errors.push({ field: 'inspiration_url', message: 'صيغة الرابط غير صحيحة، يرجى التحقق من الرابط' });
        }
      }

      if (data.additional_notes && data.additional_notes.trim().length > 3000) {
        errors.push({ field: 'additional_notes', message: 'الملاحظات الإضافية تجاوزت الحد الأقصى' });
      }

      if (!data.consent) {
        errors.push({ field: 'consent', message: 'يجب الموافقة على تخزين الفكرة ومراجعتها من قبل إدارة فريق Connectors' });
      }

      // Honeypot check
      if (data._honey && data._honey.trim().length > 0) {
        errors.push({ field: '_honey', message: 'فشلت معالجة الطلب (كشف نشاط غير معتاد)' });
      }
      break;
    }
  }

  return errors;
}

export function validateEntireSubmission(data: SubmissionFormData): ValidationError[] {
  let allErrors: ValidationError[] = [];
  for (let s = 1; s <= 5; s++) {
    allErrors = allErrors.concat(validateStep(s, data));
  }
  return allErrors;
}
