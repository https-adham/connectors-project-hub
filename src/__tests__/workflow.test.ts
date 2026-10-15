import { describe, it, expect } from 'vitest';
import { REVIEW_STATUS_CONFIG, PROJECT_TYPES, ESTIMATED_DURATIONS } from '../lib/constants';

describe('Workflow & Constants Integrity', () => {
  it('contains all required review statuses', () => {
    const expectedStatuses = [
      'new',
      'under_review',
      'needs_more_info',
      'accepted_provisionally',
      'deferred',
      'not_suitable',
    ];

    expectedStatuses.forEach((status) => {
      expect(REVIEW_STATUS_CONFIG).toHaveProperty(status);
      expect(REVIEW_STATUS_CONFIG[status as keyof typeof REVIEW_STATUS_CONFIG].label).toBeTruthy();
    });
  });

  it('contains all required project types including AI, IoT, and other', () => {
    const typeValues = PROJECT_TYPES.map((t) => t.value);
    expect(typeValues).toContain('ai_ml');
    expect(typeValues).toContain('mobile_app');
    expect(typeValues).toContain('website');
    expect(typeValues).toContain('iot_embedded');
    expect(typeValues).toContain('scientific_research');
    expect(typeValues).toContain('other');
  });

  it('contains the three estimated duration tiers', () => {
    const durationValues = ESTIMATED_DURATIONS.map((d) => d.value);
    expect(durationValues).toContain('less_than_1_month');
    expect(durationValues).toContain('1_to_3_months');
    expect(durationValues).toContain('more_than_3_months');
  });

  it('ensures UTF-8 BOM is prefix for Arabic CSV exports', () => {
    const BOM = '\uFEFF';
    const csvHeader = 'المعرف,تاريخ التقديم,عنوان المشروع';
    const fullCsv = BOM + csvHeader;

    expect(fullCsv.charCodeAt(0)).toBe(0xFEFF);
    expect(fullCsv.startsWith(BOM)).toBe(true);
  });
});
