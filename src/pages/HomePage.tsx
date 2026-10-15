import React, { useState } from 'react';
import { SubmissionFormData, ProjectIdea } from '../types/database';
import { validateStep, validateEntireSubmission, ValidationError } from '../lib/validation';
import { submitProjectIdea } from '../lib/dbService';
import { StepIndicator } from '../components/submission/StepIndicator';
import { Step1Submitter } from '../components/submission/Step1Submitter';
import { Step2IdeaDetails } from '../components/submission/Step2IdeaDetails';
import { Step3Implementation } from '../components/submission/Step3Implementation';
import { Step4Team } from '../components/submission/Step4Team';
import { Step5Additional } from '../components/submission/Step5Additional';
import { SubmissionSuccess } from '../components/submission/SubmissionSuccess';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Send,
  ShieldCheck,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

const INITIAL_FORM_DATA: SubmissionFormData = {
  submission_type: 'named',
  submitter_name: '',
  contact_method: '',
  project_title: '',
  project_description: '',
  problem_statement: '',
  target_audience: '',
  project_type: 'ai_ml',
  custom_project_type: '',
  required_skills: ['Python', 'AI / Machine Learning'],
  custom_skills: [],
  estimated_duration: '1_to_3_months',
  difficulty_level: 3,
  willing_to_lead: 'yes',
  preferred_collaborators: '',
  estimated_team_size: '3_4',
  inspiration_url: '',
  additional_notes: '',
  consent: false,
  _honey: '',
};

export const HomePage: React.FC = () => {
  const [formData, setFormData] = useState<SubmissionFormData>(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [furthestStepReached, setFurthestStepReached] = useState<number>(1);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedIdea, setSubmittedIdea] = useState<ProjectIdea | null>(null);

  const handleFieldUpdates = (updates: Partial<SubmissionFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear specific field errors
    if (errors.length > 0) {
      const updatedKeys = Object.keys(updates);
      setErrors((prev) => prev.filter((e) => !updatedKeys.includes(e.field)));
    }
  };

  const handleNextStep = () => {
    const stepErrors = validateStep(currentStep, formData);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors([]);
    setSubmitError(null);
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    if (nextStep > furthestStepReached) {
      setFurthestStepReached(nextStep);
    }

    // Scroll smoothly to form top
    const formElement = document.getElementById('submission-form-container');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setErrors([]);
      setSubmitError(null);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleJumpToStep = (targetStep: number) => {
    if (targetStep >= 1 && targetStep <= 5) {
      setErrors([]);
      setSubmitError(null);
      setCurrentStep(targetStep);
      const formElement = document.getElementById('submission-form-container');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate all steps
    const allErrors = validateEntireSubmission(formData);
    if (allErrors.length > 0) {
      setErrors(allErrors);
      // Jump to first step with an error
      const step1Fields = ['submission_type', 'submitter_name'];
      const step2Fields = ['project_title', 'project_description', 'problem_statement', 'target_audience'];
      const step3Fields = ['project_type', 'custom_project_type', 'required_skills', 'estimated_duration', 'difficulty_level'];
      const step4Fields = ['willing_to_lead', 'estimated_team_size'];
      
      const firstErrorField = allErrors[0].field;
      if (step1Fields.includes(firstErrorField)) setCurrentStep(1);
      else if (step2Fields.includes(firstErrorField)) setCurrentStep(2);
      else if (step3Fields.includes(firstErrorField)) setCurrentStep(3);
      else if (step4Fields.includes(firstErrorField)) setCurrentStep(4);
      else setCurrentStep(5);

      setSubmitError('يرجى تصحيح الحقول المطلوبة والموافقة على الشروط قبل الإرسال.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // 2. Submit to database
    const result = await submitProjectIdea(formData);

    setIsSubmitting(false);

    if (result.success && result.idea) {
      setSubmittedIdea(result.idea);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } else {
      setSubmitError(result.error || 'فشل إرسال الفكرة إلى قاعدة البيانات. تم حفظ إجاباتك، يرجى المحاولة مرة أخرى.');
    }
  };

  const handleResetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(1);
    setFurthestStepReached(1);
    setErrors([]);
    setSubmitError(null);
    setSubmittedIdea(null);
  };

  const scrollToForm = () => {
    const el = document.getElementById('submission-form-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen tech-grid-bg pb-20">
      
      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden border-b border-sky-500/10">
        {/* Futuristic Glowing Ambient Orbs */}
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          
          {/* Tagline & Affiliation Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400/30 text-xs sm:text-sm text-cyan-300 shadow-glow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-bold tracking-wider">CONNECTORS TEAM</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">For A Connected World</span>
          </div>

          {/* Official Arabic Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-tight">
            "كل فكرة عظيمة{' '}
            <span className="bg-gradient-to-l from-cyan-400 via-sky-400 to-teal-300 bg-clip-text text-transparent glow-text-cyan">
              بتبدأ بخطوة.
            </span>
            "
          </h1>

          {/* Official Supporting Text */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            شارك فكرتك مع <span className="text-cyan-300 font-bold">Connectors Team</span>، وساعدنا نحوّل الأفكار المميزة لمشاريع حقيقية.
          </p>

          <p className="text-xs sm:text-sm text-slate-400">
            برنامج هندسة الذكاء الاصطناعي — كلية الهندسة — جامعة المنصورة
          </p>

          {/* Primary CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToForm}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 hover:from-sky-500 hover:via-cyan-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-glow-cyan flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <Lightbulb className="w-5 h-5 fill-slate-950 stroke-[2.5]" />
              <span>قدّم فكرتك</span>
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FORM CONTAINER SECTION */}
      {/* ========================================================================= */}
      <section
        id="submission-form-container"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16"
      >
        {submittedIdea ? (
          <SubmissionSuccess idea={submittedIdea} onReset={handleResetForm} />
        ) : (
          <div className="card-futuristic p-6 sm:p-10 shadow-2xl relative">
            
            {/* Step Progress Bar */}
            <StepIndicator
              currentStep={currentStep}
              totalSteps={5}
              onStepClick={handleJumpToStep}
              furthestStepReached={furthestStepReached}
            />

            {/* Error banner if submission failed */}
            {submitError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <div className="flex-1">{submitError}</div>
              </div>
            )}

            {/* Active Step Form View */}
            <form onSubmit={handleSubmit}>
              <div className="min-h-[380px]">
                {currentStep === 1 && (
                  <Step1Submitter
                    data={formData}
                    onChange={handleFieldUpdates}
                    errors={errors}
                  />
                )}

                {currentStep === 2 && (
                  <Step2IdeaDetails
                    data={formData}
                    onChange={handleFieldUpdates}
                    errors={errors}
                  />
                )}

                {currentStep === 3 && (
                  <Step3Implementation
                    data={formData}
                    onChange={handleFieldUpdates}
                    errors={errors}
                  />
                )}

                {currentStep === 4 && (
                  <Step4Team
                    data={formData}
                    onChange={handleFieldUpdates}
                    errors={errors}
                  />
                )}

                {currentStep === 5 && (
                  <Step5Additional
                    data={formData}
                    onChange={handleFieldUpdates}
                    errors={errors}
                    onJumpToStep={handleJumpToStep}
                  />
                )}
              </div>

              {/* Navigation Controls / Step Buttons */}
              <div className="mt-10 pt-6 border-t border-slate-800 flex items-center justify-between">
                {/* Back button */}
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>السابق</span>
                  </button>
                ) : (
                  <div />
                )}

                {/* Next or Submit Button */}
                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-glow-sm flex items-center gap-2 transition-all transform hover:scale-[1.02]"
                  >
                    <span>التالي</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-glow-teal flex items-center gap-2.5 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>جاري حفظ الفكرة في قاعدة البيانات...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 fill-slate-950 stroke-[2]" />
                        <span>إرسال الفكرة</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Privacy and DB Notice */}
            <div className="mt-6 pt-4 text-center">
              <span className="text-[11px] text-slate-500 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>يتم حفظ جميع الإجابات مباشرة في قاعدة بيانات Supabase PostgreSQL المؤمنة بسياسات RLS</span>
              </span>
            </div>

          </div>
        )}
      </section>

    </div>
  );
};
