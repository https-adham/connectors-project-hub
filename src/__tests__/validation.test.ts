import { describe, it, expect } from 'vitest';
import { validateStep, validateEntireSubmission } from '../lib/validation';
import { SubmissionFormData } from '../types/database';

const baseValidData: SubmissionFormData = {
  submission_type: 'named',
  submitter_name: 'أحمد محمود',
  contact_method: 'ahmed@mans.edu.eg',
  project_title: 'منظومة الذكاء الاصطناعي لإدارة الطاقة',
  project_description: 'مشروع يهدف إلى التنبؤ باستهلاك الطاقة داخل مباني كلية الهندسة بجامعة المنصورة.',
  problem_statement: 'هدر الطاقة الكهربائية في المعامل خلال أوقات الفراغ وعدم وجود مراقبة فورية ذكية.',
  target_audience: 'إدارة كلية الهندسة وطلاب ومعامل قسم هندسة الذكاء الاصطناعي',
  project_type: 'ai_ml',
  custom_project_type: '',
  required_skills: ['Python', 'Deep Learning / PyTorch / TensorFlow', 'IoT'],
  custom_skills: [],
  estimated_duration: '1_to_3_months',
  difficulty_level: 3,
  willing_to_lead: 'yes',
  preferred_collaborators: 'عمر وخالد',
  estimated_team_size: '3_4',
  inspiration_url: 'https://github.com/example/energy-ai',
  additional_notes: 'نحتاج مستشعرات تيار كهربائي',
  consent: true,
  _honey: '',
};

describe('Validation Logic - Connectors Project Hub', () => {
  describe('Step 1: Submitter Info', () => {
    it('accepts valid named submission', () => {
      const errors = validateStep(1, baseValidData);
      expect(errors).toHaveLength(0);
    });

    it('rejects named submission without a name', () => {
      const data: SubmissionFormData = {
        ...baseValidData,
        submission_type: 'named',
        submitter_name: '',
      };
      const errors = validateStep(1, data);
      expect(errors.some((e) => e.field === 'submitter_name')).toBe(true);
    });

    it('accepts anonymous submission without name or contact method', () => {
      const data: SubmissionFormData = {
        ...baseValidData,
        submission_type: 'anonymous',
        submitter_name: '',
        contact_method: '',
      };
      const errors = validateStep(1, data);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Step 2: Idea Details', () => {
    it('accepts valid idea details', () => {
      const errors = validateStep(2, baseValidData);
      expect(errors).toHaveLength(0);
    });

    it('rejects short title or empty description', () => {
      const data: SubmissionFormData = {
        ...baseValidData,
        project_title: 'أ',
        project_description: 'قصير',
      };
      const errors = validateStep(2, data);
      expect(errors.some((e) => e.field === 'project_title')).toBe(true);
      expect(errors.some((e) => e.field === 'project_description')).toBe(true);
    });
  });

  describe('Step 3: Implementation Details', () => {
    it('accepts valid implementation fields', () => {
      const errors = validateStep(3, baseValidData);
      expect(errors).toHaveLength(0);
    });

    it('requires custom_project_type when project_type is other', () => {
      const data: SubmissionFormData = {
        ...baseValidData,
        project_type: 'other',
        custom_project_type: '',
      };
      const errors = validateStep(3, data);
      expect(errors.some((e) => e.field === 'custom_project_type')).toBe(true);
    });

    it('requires at least one skill selected', () => {
      const data: SubmissionFormData = {
        ...baseValidData,
        required_skills: [],
        custom_skills: [],
      };
      const errors = validateStep(3, data);
      expect(errors.some((e) => e.field === 'required_skills')).toBe(true);
    });

    it('enforces difficulty level between 1 and 5', () => {
      const data: SubmissionFormData = {
        ...baseValidData,
        difficulty_level: 6,
      };
      const errors = validateStep(3, data);
      expect(errors.some((e) => e.field === 'difficulty_level')).toBe(true);
    });
  });

  describe('Step 4: Team Participation', () => {
    it('accepts valid team participation data', () => {
      const errors = validateStep(4, baseValidData);
      expect(errors).toHaveLength(0);
    });

    it('validates willing_to_lead options', () => {
      const data: SubmissionFormData = {
        ...baseValidData,
        willing_to_lead: 'unsure',
      };
      const errors = validateStep(4, data);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Step 5: Additional Info & Consent', () => {
    it('accepts valid step 5 data with consent', () => {
      const errors = validateStep(5, baseValidData);
      expect(errors).toHaveLength(0);
    });

    it('rejects submission when consent is false', () => {
      const data: SubmissionFormData = {
        ...baseValidData,
        consent: false,
      };
      const errors = validateStep(5, data);
      expect(errors.some((e) => e.field === 'consent')).toBe(true);
    });

    it('validates inspiration URL format', () => {
      const data: SubmissionFormData = {
        ...baseValidData,
        inspiration_url: 'invalid-url-string',
      };
      const errors = validateStep(5, data);
      expect(errors.some((e) => e.field === 'inspiration_url')).toBe(true);
    });

    it('detects and rejects honeypot filled submissions (anti-bot)', () => {
      const data: SubmissionFormData = {
        ...baseValidData,
        _honey: 'bot-spam-content',
      };
      const errors = validateStep(5, data);
      expect(errors.some((e) => e.field === '_honey')).toBe(true);
    });
  });

  describe('Overall Form Validation', () => {
    it('passes for complete valid data', () => {
      const allErrors = validateEntireSubmission(baseValidData);
      expect(allErrors).toHaveLength(0);
    });
  });
});
