import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Loader2, Globe, FileText, X } from 'lucide-react';
import { Github, Linkedin } from '../ui/Icons';
import { PixelCard } from '../ui/PixelCard';
import ArcadeButton from '../ArcadeButton';
import { useSubmitApplication, useRecruitmentStatus } from '../../api/hooks/usePublicAPI';
import { toast } from 'sonner';

const steps = [
  { id: 'personal', label: 'PERSONAL', icon: '👤' },
  { id: 'interests', label: 'INTERESTS', icon: '🎯' },
  { id: 'links', label: 'LINKS', icon: '🔗' },
  { id: 'review', label: 'REVIEW', icon: '✅' },
];

const interestOptions = [
  { value: 'frontend', label: 'Frontend Development', desc: 'React, Vue, TypeScript, CSS' },
  { value: 'backend', label: 'Backend Development', desc: 'Node.js, Python, Go, Databases' },
  { value: 'fullstack', label: 'Full Stack', desc: 'End-to-end product development' },
  { value: 'mobile', label: 'Mobile Development', desc: 'React Native, Flutter, iOS, Android' },
  { value: 'cybersecurity', label: 'Cybersecurity', desc: 'Pen testing, CTF, Security research' },
  { value: 'ml_ai', label: 'Machine Learning / AI', desc: 'ML models, Data science, NLP' },
  { value: 'devops', label: 'DevOps / Cloud', desc: 'Docker, K8s, AWS, CI/CD' },
  { value: 'blockchain', label: 'Blockchain / Web3', desc: 'Smart contracts, DeFi, dApps' },
  { value: 'ui_ux', label: 'UI/UX Design', desc: 'Figma, Prototyping, Design systems' },
];

const schema = z.object({
  personal: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    contact: z.string().min(10, 'Enter a valid phone number'),
    class_name: z.string().min(1, 'Select your class/year'),
  }),
  interests: z.object({
    interests: z.array(z.string()).min(1, 'Select at least one interest'),
  }),
  links: z.object({
    github_url: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
    linkedin_url: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    portfolio_url: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
  }),
});

const defaultValues = {
  personal: { name: '', email: '', contact: '', class_name: '' },
  interests: { interests: [] },
  links: { github_url: '', linkedin_url: '', portfolio_url: '' },
};

const RecruitmentSection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const { data: recruitmentStatus } = useRecruitmentStatus();
  const submitMutation = useSubmitApplication();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const watchedInterests = watch('interests.interests');
  const watchedPersonal = watch('personal');
  const watchedLinks = watch('links');

  const isLastStep = currentStep === steps.length - 1;
  const canGoNext = () => {
    if (currentStep === 0) return !errors.personal?.name && !errors.personal?.email && !errors.personal?.contact && !errors.personal?.class_name;
    if (currentStep === 1) return watchedInterests.length > 0;
    if (currentStep === 2) return true;
    return true;
  };

  const handleNext = () => {
    if (canGoNext() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.personal.name);
      formData.append('email', data.personal.email);
      formData.append('contact', data.personal.contact);
      formData.append('class_name', data.personal.class_name);
      formData.append('interested', data.interests.interests.join(', '));
      if (data.links.github_url) formData.append('github_url', data.links.github_url);
      if (data.links.linkedin_url) formData.append('linkedin_url', data.links.linkedin_url);
      if (data.links.portfolio_url) formData.append('portfolio_url', data.links.portfolio_url);
      if (resumeFile) formData.append('resume', resumeFile);

      await submitMutation.mutateAsync(formData);
      toast.success('Application submitted successfully!', {
        description: 'We\'ll review your application and get back to you soon.',
      });
      handleSubmit(() => {})(() => {});
      setCurrentStep(0);
      setResumeFile(null);
    } catch (error) {
      toast.error('Submission failed', {
        description: error?.response?.data?.message || 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const interestIcons = {
    frontend: <Github className="w-5 h-5" />,
    backend: <Globe className="w-5 h-5" />,
    fullstack: <Github className="w-5 h-5" />,
    mobile: <Globe className="w-5 h-5" />,
    cybersecurity: <Github className="w-5 h-5" />,
    ml_ai: <Globe className="w-5 h-5" />,
    devops: <Github className="w-5 h-5" />,
    blockchain: <Globe className="w-5 h-5" />,
    ui_ux: <Github className="w-5 h-5" />,
  };

  return (
    <section id="recruitment" className="py-20 md:py-32 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs text-accent-cyan uppercase tracking-widest">RECRUITMENT</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-2 text-fg">
            JOIN <span className="text-accent-cyan">SDC</span>
          </h2>
          <p className="mt-4 text-fg-muted max-w-2xl mx-auto">
            Applications open for the upcoming semester. Build real projects. Get mentored. Level up.
          </p>
        </motion.div>

        {recruitmentStatus && !recruitmentStatus.is_active && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 p-6 bg-accent-gold/10 border border-accent-gold/30 rounded-xl text-center"
          >
            <div className="flex items-center justify-center gap-2 text-accent-gold mb-2">
              <span className="font-mono text-xs">⚠</span>
              <span className="font-display text-lg">RECRUITMENT CURRENTLY CLOSED</span>
            </div>
            <p className="text-fg-muted">No active recruitment drive at the moment. Check back later or contact us for updates.</p>
          </motion.div>
        )}

        <div className="relative">
          {/* Progress Steps */}
          <div className="hidden md:flex items-center justify-between mb-10 relative">
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-border z-0" />
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative z-10 flex flex-col items-center"
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm font-bold
                  transition-all duration-300
                  ${index < currentStep
                    ? 'bg-accent-cyan text-bg border-2 border-accent-cyan'
                    : index === currentStep
                    ? 'bg-accent-cyan/10 text-accent-cyan border-2 border-accent-cyan/50 ring-4 ring-accent-cyan/20'
                    : 'bg-bg-deep text-fg-muted border-2 border-border'
                  }
                `}>
                  {index < currentStep ? <Check className="w-5 h-5" /> : step.icon}
                </div>
                <span className={`mt-2 font-mono text-xs uppercase tracking-wider ${index <= currentStep ? 'text-fg' : 'text-fg-muted'}`}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`absolute top-6 left-1/2 w-full h-0.5 ${index < currentStep ? 'bg-accent-cyan' : 'bg-border'}`} />
                )}
              </motion.div>
            ))}
          </div>

          {/* Mobile Progress */}
          <div className="md:hidden mb-8">
            <div className="flex items-center justify-between gap-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex-1 flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold
                    ${index < currentStep
                      ? 'bg-accent-cyan text-bg border-2 border-accent-cyan'
                      : index === currentStep
                      ? 'bg-accent-cyan/10 text-accent-cyan border-2 border-accent-cyan/50 ring-2 ring-accent-cyan/20'
                      : 'bg-bg-deep text-fg-muted border-2 border-border'
                    }
                  `}>
                    {index < currentStep ? <Check className="w-4 h-4" /> : step.icon}
                  </div>
                  <span className={`mt-1 font-mono text-[10px] uppercase ${index <= currentStep ? 'text-fg' : 'text-fg-muted'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 h-1 bg-border rounded relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-accent-cyan"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && <StepPersonal register={register} errors={errors.personal} watched={watchedPersonal} />}
              {currentStep === 1 && <StepInterests register={register} errors={errors.interests} interests={watchedInterests} setValue={setValue} />}
              {currentStep === 2 && <StepLinks register={register} errors={errors.links} watched={watchedLinks} />}
              {currentStep === 3 && <StepReview data={getValues()} resumeFile={resumeFile} setResumeFile={setResumeFile} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
            <ArcadeButton 
              variant="secondary" 
              onClick={handleBack}
              disabled={currentStep === 0}
              className="opacity-0 md:opacity-100"
            >
              BACK
            </ArcadeButton>
            
            <div className="flex items-center gap-3">
              {currentStep < steps.length - 1 ? (
                <ArcadeButton variant="primary" onClick={handleNext} disabled={!canGoNext()}>
                  NEXT <ChevronRight className="w-4 h-4" />
                </ArcadeButton>
              ) : (
                <ArcadeButton 
                  variant="primary" 
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      SUBMITTING...
                    </>
                  ) : (
                    'SUBMIT APPLICATION'
                  )}
                </ArcadeButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StepPersonal = ({ register, errors, watched }) => (
  <PixelCard className="space-y-6">
    <h3 className="font-display text-xl text-fg">PERSONAL INFORMATION</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputGroup label="FULL NAME" error={errors?.name}>
        <input
          {...register('personal.name')}
          type="text"
          placeholder="John Doe"
          className="w-full px-4 py-3 bg-bg-deep border border-border rounded-lg text-fg placeholder-fg-muted/50 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan"
        />
      </InputGroup>
      <InputGroup label="EMAIL" error={errors?.email}>
        <input
          {...register('personal.email')}
          type="email"
          placeholder="john@college.edu"
          className="w-full px-4 py-3 bg-bg-deep border border-border rounded-lg text-fg placeholder-fg-muted/50 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan"
        />
      </InputGroup>
      <InputGroup label="PHONE NUMBER" error={errors?.contact}>
        <input
          {...register('personal.contact')}
          type="tel"
          placeholder="+91 98765 43210"
          className="w-full px-4 py-3 bg-bg-deep border border-border rounded-lg text-fg placeholder-fg-muted/50 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan"
        />
      </InputGroup>
      <InputGroup label="CLASS / YEAR" error={errors?.class_name}>
        <select
          {...register('personal.class_name')}
          className="w-full px-4 py-3 bg-bg-deep border border-border rounded-lg text-fg focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan appearance-none"
        >
          <option value="">Select your year</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
          <option value="Masters">Masters</option>
          <option value="PhD">PhD</option>
        </select>
      </InputGroup>
    </div>
  </PixelCard>
);

const StepInterests = ({ register, errors, interests, setValue }) => (
  <PixelCard className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="font-display text-xl text-fg">AREAS OF INTEREST</h3>
      <span className="font-mono text-xs text-accent-cyan">{interests.length} SELECTED</span>
    </div>
    <p className="text-fg-muted text-sm">Select all that apply (minimum 1)</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {interestOptions.map((option) => {
        const isSelected = interests.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              const newInterests = isSelected
                ? interests.filter((i) => i !== option.value)
                : [...interests, option.value];
              setValue('interests.interests', newInterests, { shouldValidate: true });
            }}
            className={`
              relative p-4 rounded-xl border-2 text-left transition-all duration-200
              ${isSelected
                ? 'bg-accent-cyan/10 border-accent-cyan/50 ring-2 ring-accent-cyan/20'
                : 'bg-bg-deep border-border hover:border-accent-cyan/50'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-accent-cyan text-bg' : 'bg-bg-card border border-border'}`}>
                {interestIcons[option.value]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm text-fg">{option.label}</p>
                <p className="font-mono text-xs text-fg-muted">{option.desc}</p>
              </div>
            </div>
            {isSelected && (
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-accent-cyan text-bg rounded-full flex items-center justify-center">
                <Check className="w-3 h-3" />
              </div>
            )}
          </button>
        );
      })}
    </div>
    {errors?.interests && (
      <p className="text-accent-red/80 font-mono text-xs flex items-center gap-1">
        <X className="w-3 h-3" />
        Please select at least one area of interest
      </p>
    )}
  </PixelCard>
);

const StepLinks = ({ register, errors, watched }) => (
  <PixelCard className="space-y-6">
    <h3 className="font-display text-xl text-fg">PROFILE LINKS</h3>
    <p className="text-fg-muted text-sm">Optional but highly recommended</p>
    <div className="space-y-4">
      <InputGroup label="GITHUB PROFILE" icon={<Github className="w-5 h-5" />} error={errors?.github_url}>
        <input
          {...register('links.github_url')}
          type="url"
          placeholder="https://github.com/username"
          className="w-full px-4 py-3 bg-bg-deep border border-border rounded-lg text-fg placeholder-fg-muted/50 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan"
        />
      </InputGroup>
      <InputGroup label="LINKEDIN PROFILE" icon={<Linkedin className="w-5 h-5" />} error={errors?.linkedin_url}>
        <input
          {...register('links.linkedin_url')}
          type="url"
          placeholder="https://linkedin.com/in/username"
          className="w-full px-4 py-3 bg-bg-deep border border-border rounded-lg text-fg placeholder-fg-muted/50 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan"
        />
      </InputGroup>
      <InputGroup label="PORTFOLIO / WEBSITE" icon={<Globe className="w-5 h-5" />} error={errors?.portfolio_url}>
        <input
          {...register('links.portfolio_url')}
          type="url"
          placeholder="https://yourportfolio.dev"
          className="w-full px-4 py-3 bg-bg-deep border border-border rounded-lg text-fg placeholder-fg-muted/50 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan"
        />
      </InputGroup>
    </div>
    <div className="border border-dashed border-border/50 rounded-xl p-4">
      <label className="flex items-center gap-3 cursor-pointer">
        <FileText className="w-6 h-6 text-fg-muted flex-shrink-0" />
        <div className="flex-1">
          <p className="font-mono text-sm text-fg">RESUME / CV (PDF, max 5MB)</p>
          <p className="font-mono text-xs text-fg-muted">Optional - helps us understand your background better</p>
        </div>
      </label>
    </div>
  </PixelCard>
);

const StepReview = ({ data, resumeFile, setResumeFile }) => (
  <PixelCard className="space-y-6">
    <h3 className="font-display text-xl text-fg">REVIEW & CONFIRM</h3>
    <p className="text-fg-muted text-sm">Please verify all information before submitting</p>
    
    <div className="space-y-4">
      <ReviewSection title="PERSONAL" data={data.personal} fields={[
        { label: 'Name', value: data.personal.name },
        { label: 'Email', value: data.personal.email },
        { label: 'Phone', value: data.personal.contact },
        { label: 'Class', value: data.personal.class_name },
      ]} />
      
      <ReviewSection title="INTERESTS" data={{}} fields={[
        { label: 'Selected', value: data.interests.interests.join(', ') || 'None' },
      ]} />
      
      <ReviewSection title="LINKS" data={data.links} fields={[
        { label: 'GitHub', value: data.links.github_url || 'Not provided' },
        { label: 'LinkedIn', value: data.links.linkedin_url || 'Not provided' },
        { label: 'Portfolio', value: data.links.portfolio_url || 'Not provided' },
      ]} />
      
      <ReviewSection title="RESUME" data={{}} fields={[
        { label: 'File', value: resumeFile ? resumeFile.name : 'Not attached' },
      ]} />
    </div>

    <div className="bg-accent-cyan/5 border border-accent-cyan/20 rounded-xl p-4">
      <p className="font-mono text-xs text-accent-cyan flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent-cyan" />
        By submitting, you agree to SDC's recruitment process and data handling policies.
      </p>
    </div>
  </PixelCard>
);

const ReviewSection = ({ title, fields }) => (
  <div className="bg-bg-deep/50 border border-border rounded-xl p-4">
    <h4 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-3">{title}</h4>
    <div className="space-y-2">
      {fields.map((field, i) => (
        <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="font-mono text-xs text-fg-muted w-full sm:w-24">{field.label}</span>
          <span className="font-mono text-sm text-fg break-all">{field.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const InputGroup = ({ label, children, error, icon }) => (
  <div className="relative">
    <label className="font-mono text-xs text-fg-muted uppercase tracking-wider mb-1.5 block">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted/50">{icon}</div>}
      {React.cloneElement(children, {
        className: `${children.props.className || ''} ${icon ? 'pl-10' : ''} ${error ? 'border-accent-red/50 focus:border-accent-red focus:ring-accent-red/20' : ''}`,
      })}
    </div>
    {error && (
      <p className="mt-1.5 font-mono text-xs text-accent-red/80 flex items-center gap-1">
        <X className="w-3 h-3" />
        {error.message}
      </p>
    )}
  </div>
);

export default RecruitmentSection;