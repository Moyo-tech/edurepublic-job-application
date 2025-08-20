"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle,
  User,
  Briefcase,
  FileText,
  Send,
  Sparkles,
  Eye,
  PartyPopper,
} from "lucide-react";
import myLogo from "../public/logomark.png";
import Image from "next/image";

interface FormData {
  // Step 1
  fullName: string;
  email: string;
  phone: string;

  // Step 2
  role: string;

  // Step 3 - Dynamic based on role
  socialMediaExperience?: string;
  portfolioLink?: string;
  socialMediaTools?: string;
  contentCreation?: string;
  emailMarketing?: string;
  livesInArea?: string;
  socialMediaPages?: string;

  itExpertise?: string;
  teachingExperience?: string;
  explainConcepts?: string;
  lmsPlatforms?: string;
  itPortfolioLink?: string;

  curriculumExperience?: string;
  needsAnalysis?: string;
  curriculumPortfolioLink?: string;
  toolsProficiency?: string;
  evaluateEffectiveness?: string;

  // Step 4
  coverLetter?: File;
  resume?: File;
}

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Role Selection", icon: Briefcase },
  { id: 3, title: "Role Questions", icon: FileText },
  { id: 4, title: "Upload Documents", icon: Upload },
  { id: 5, title: "Review & Submit", icon: Eye },
];

const roles = ["Social Media Manager", "IT Tutor", "Curriculum Designer"];

export default function JobApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    role: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const updateFormData = (field: string, value: string | File) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim())
        newErrors.fullName = "Full name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Invalid email format";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    }

    if (step === 2) {
      if (!formData.role) newErrors.role = "Please select a role";
    }

    if (step === 3) {
      if (formData.role === "Social Media Manager") {
        if (!formData.socialMediaExperience?.trim())
          newErrors.socialMediaExperience = "This field is required";
        if (!formData.portfolioLink?.trim())
          newErrors.portfolioLink = "Portfolio link is required";
        else if (!/^https?:\/\/.+/.test(formData.portfolioLink))
          newErrors.portfolioLink = "Must be a valid URL";
        if (!formData.socialMediaTools?.trim())
          newErrors.socialMediaTools = "This field is required";
        if (!formData.contentCreation)
          newErrors.contentCreation = "Please select an option";
        if (!formData.emailMarketing?.trim())
          newErrors.emailMarketing = "This field is required";
        if (!formData.livesInArea)
          newErrors.livesInArea = "Please select an option";
        if (!formData.socialMediaPages?.trim())
          newErrors.socialMediaPages = "This field is required";
      }

      if (formData.role === "IT Tutor") {
        if (!formData.itExpertise?.trim())
          newErrors.itExpertise = "This field is required";
        if (!formData.teachingExperience?.trim())
          newErrors.teachingExperience = "This field is required";
        if (!formData.explainConcepts?.trim())
          newErrors.explainConcepts = "This field is required";
        if (!formData.lmsPlatforms?.trim())
          newErrors.lmsPlatforms = "This field is required";
        if (!formData.itPortfolioLink?.trim())
          newErrors.itPortfolioLink = "Portfolio link is required";
        else if (!/^https?:\/\/.+/.test(formData.itPortfolioLink))
          newErrors.itPortfolioLink = "Must be a valid URL";
      }

      if (formData.role === "Curriculum Designer") {
        if (!formData.curriculumExperience?.trim())
          newErrors.curriculumExperience = "This field is required";
        if (!formData.needsAnalysis?.trim())
          newErrors.needsAnalysis = "This field is required";
        if (!formData.curriculumPortfolioLink?.trim())
          newErrors.curriculumPortfolioLink = "Portfolio link is required";
        else if (!/^https?:\/\/.+/.test(formData.curriculumPortfolioLink))
          newErrors.curriculumPortfolioLink = "Must be a valid URL";
        if (!formData.toolsProficiency?.trim())
          newErrors.toolsProficiency = "This field is required";
        if (!formData.evaluateEffectiveness?.trim())
          newErrors.evaluateEffectiveness = "This field is required";
      }
    }

    if (step === 4) {
      if (!formData.coverLetter)
        newErrors.coverLetter = "Cover letter is required";
      if (!formData.resume) newErrors.resume = "Resume is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 0 || validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    if (file) {

      const maxSize = 10 * 1024 * 1024 // 10MB in bytes

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          [field]: "File size must be less than 10MB. Please choose a smaller file.",
        }))
        return
      }

      // Clear any existing error for this field
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }))
      }
      updateFormData(field, file);
    }
  };

  const handleSubmit = async () => {
    if (validateStep(4)) {
      setIsSubmitting(true);

      try {
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value instanceof File) {
            form.append(key, value); // send file
          } else if (value) {
            form.append(key, value as string); // send text
          }
        });

        const response = await fetch("https://usebasin.com/f/e1c50fe8a6e1", {
          method: "POST",
          body: form,
          headers: { Accept: "application/json" }, // 👈 Basin recommends this
        });

        if (response.ok) {
          setIsSubmitted(true);
        } else {
          const errorData = await response.json();
          console.error("Submission error:", errorData);
          alert("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Error submitting form.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderWelcomeScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          <Image
            src={myLogo}
            alt="EduRepublic Logo"
            width={100}
            height={30}
            className="rounded-full"
          />
        </div>
        <h1 className="text-3xl font-bold text-white">
          Welcome to EduRepublic
        </h1>
        <p className="text-md text-white max-w-md mx-auto">
          Ready to join our team? Let's start your application journey.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          
          <div className="p-4 rounded-lg bg-white/5 border border-shamrock-50">
            <User className="w-8 h-8 text-shamrock-300 mx-auto mb-2" />
            <h3 className="font-semibold text-white mb-1">Personal Info</h3>
            <p className="text-sm text-gray-300">Tell us about yourself</p>
          </div>

          <div className="p-4 rounded-lg bg-white/20 border border-slate-50">
            <Briefcase className="w-8 h-8 text-shamrock-300 mx-auto mb-2" />
            <h3 className="font-semibold text-white mb-1">Role Selection</h3>
            <p className="text-sm text-gray-300">Choose your position</p>
          </div>

          <div className="p-4 rounded-lg bg-white/5 border border-slate-50">
            <FileText className="w-8 h-8 text-shamrock-300 mx-auto mb-2" />
            <h3 className="font-semibold text-white mb-1">Experience</h3>
            <p className="text-sm text-gray-300">Share your background</p>
          </div>

        </div>

        <div className="space-y-2">
          <p className="text-gray-200">
            This will take approximately 5-10 minutes
          </p>
          <p className="text-sm text-gray-300">
            All fields marked with * are required
          </p>
        </div>
        
      </div>
    </motion.div>
  );

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Let's get to know you
        </h2>
        <p className="text-gray-300">Tell us about yourself to get started</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName" className="text-gray-200 font-medium">
            Full Name *
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => updateFormData("fullName", e.target.value)}
            className={`mt-1 ${
              errors.fullName ? "border-red-500" : "border-gray-400"
            } focus:border-shamrock-300 focus:ring-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-gray-200 font-medium">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            className={`mt-1 ${
              errors.email ? "border-red-500" : "border-gray-400"
            } focus:border-shamrock-300 focus:ring-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="text-gray-200 font-medium">
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData("phone", e.target.value)}
            className={`mt-1 ${
              errors.phone ? "border-red-500" : "border-gray-400"
            } focus:border-shamrock-300 focus:ring-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
            placeholder="+1234567890"
          />
          {errors.phone && (
            <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
          )}
      
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          What role interests you?
        </h2>
        <p className="text-gray-300">
          Select the position you'd like to apply for
        </p>
      </div>

      <div>
        <Label className="text-gray-200 font-medium">Select Role *</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => updateFormData("role", value)}
        >
          <SelectTrigger
            className={`mt-1 ${
              errors.role ? "border-red-500" : "border-gray-400"
            } focus:border-shamrock-300 focus:ring-shamrock-300 bg-white/10 text-white`}
          >
            <SelectValue placeholder="Choose a role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-red-400 text-sm mt-1">{errors.role}</p>
        )}
      </div>
    </motion.div>
  );

  const renderStep3 = () => {
    if (!formData.role) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Tell us about your experience
          </h2>
          <p className="text-gray-300">
            Role-specific questions for {formData.role}
          </p>
        </div>

        {formData.role === "Social Media Manager" && (
          <div className="space-y-4">
            <div>
              <Label className="text-gray-200 font-medium">
                How long have you managed social media accounts? *
              </Label>
              <Input
                value={formData.socialMediaExperience || ""}
                onChange={(e) =>
                  updateFormData("socialMediaExperience", e.target.value)
                }
                className={`mt-1 ${
                  errors.socialMediaExperience
                    ? "border-red-500"
                    : "border-gray-400"
                } focus:border-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
                placeholder="e.g., 2 years"
              />
              {errors.socialMediaExperience && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.socialMediaExperience}
                </p>
              )}
            </div>

            <div>
              <Label className="text-gray-200 font-medium">
              Upload links to a portfolio or social media handles you've managed? *              </Label>
              <Input
                value={formData.portfolioLink || ""}
                onChange={(e) =>
                  updateFormData("portfolioLink", e.target.value)
                }
                className={`mt-1 ${
                  errors.portfolioLink ? "border-red-500" : "border-gray-400"
                } focus:border-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
                placeholder="https://your-portfolio.com"
              />
              {errors.portfolioLink && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.portfolioLink}
                </p>
              )}
            </div>

            <div>
              <Label className="text-gray-200 font-medium">
                Which social media tools are you familiar with? *
              </Label>
              <Input
                value={formData.socialMediaTools || ""}
                onChange={(e) =>
                  updateFormData("socialMediaTools", e.target.value)
                }
                className={`mt-1 ${
                  errors.socialMediaTools ? "border-red-500" : "border-gray-400"
                } focus:border-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
                placeholder="e.g., Hootsuite, Buffer, Canva"
              />
              {errors.socialMediaTools && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.socialMediaTools}
                </p>
              )}
            </div>

            <div>
              <Label className="text-gray-200 font-medium">
                Can you create content, film & edit videos? *
              </Label>
              <RadioGroup
                value={formData.contentCreation || ""}
                onValueChange={(value) =>
                  updateFormData("contentCreation", value)
                }
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="content-yes" />
                  <Label htmlFor="content-yes" className="text-gray-200">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="content-no" />
                  <Label htmlFor="content-no" className="text-gray-200">
                    No
                  </Label>
                </div>
              </RadioGroup>
              {errors.contentCreation && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.contentCreation}
                </p>
              )}
            </div>

            <div>
              <Label className="text-gray-200 font-medium">
              Are you familiar with email marketing? list the tools you are familiar with *
              </Label>
              <Input
                value={formData.emailMarketing || ""}
                onChange={(e) =>
                  updateFormData("emailMarketing", e.target.value)
                }
                className={`mt-1 ${
                  errors.emailMarketing ? "border-red-500" : "border-gray-400"
                } focus:border-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
                placeholder="e.g., Mailchimp, ConvertKit"
              />
              {errors.emailMarketing && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.emailMarketing}
                </p>
              )}
            </div>

            <div>
              <Label className="text-gray-200 font-medium">
                Do you live at Ajah, Ado, Badore or it's environs? *
              </Label>
              <RadioGroup
                value={formData.livesInArea || ""}
                onValueChange={(value) => updateFormData("livesInArea", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="area-yes" />
                  <Label htmlFor="area-yes" className="text-gray-200">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="area-no" />
                  <Label htmlFor="area-no" className="text-gray-200">
                    No
                  </Label>
                </div>
              </RadioGroup>
              {errors.livesInArea && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.livesInArea}
                </p>
              )}
            </div>

            <div>
              <Label className="text-gray-200 font-medium">
                Share your social media pages *
              </Label>
              <Textarea
                value={formData.socialMediaPages || ""}
                onChange={(e) =>
                  updateFormData("socialMediaPages", e.target.value)
                }
                className={`mt-1 ${
                  errors.socialMediaPages ? "border-red-500" : "border-gray-400"
                } focus:border-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
                placeholder="List your social media handles"
                rows={3}
              />
              {errors.socialMediaPages && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.socialMediaPages}
                </p>
              )}
            </div>
          </div>
        )}

        {formData.role === "IT Tutor" && (
          <div className="space-y-4">
            <div>
              <Label className="text-gray-200 font-medium">
              What are your areas of expertise in IT? *
              </Label>
              <Input
                value={formData.itExpertise || ""}
                onChange={(e) => updateFormData("itExpertise", e.target.value)}
                className={`mt-1 ${
                  errors.itExpertise ? "border-red-500" : "border-gray-400"
                } focus:border-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
                placeholder="e.g., Web Development, Data Analysis, Javascript"
              />
              {errors.itExpertise && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.itExpertise}
                </p>
              )}
            </div>

            <div>
              <Label className="text-gray-200 font-medium">
              Describe your experience in teaching or tutoring IT subjects. What age groups or skill levels have you worked with? *
              </Label>
              <Textarea
                value={formData.teachingExperience || ""}
                onChange={(e) =>
                  updateFormData("teachingExperience", e.target.value)
                }
                className={`mt-1 ${
                  errors.teachingExperience
                    ? "border-red-500"
                    : "border-gray-400"
                } focus:border-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
                placeholder="Describe your teaching experience"
                rows={4}
              />
              {errors.teachingExperience && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.teachingExperience}
                </p>
              )}
            </div>

            <div>
              <Label className="text-gray-200 font-medium">
              How do you approach explaining a complex technical concept to a beginner? Provide an example. *
              </Label>
              <Textarea
                value={formData.explainConcepts || ""}
                onChange={(e) =>
                  updateFormData("explainConcepts", e.target.value)
                }
                className={`mt-1 ${
                  errors.explainConcepts ? "border-red-500" : "border-gray-400"
                } focus:border-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
                placeholder="Describe your teaching methodology"
                rows={4}
              />
              {errors.explainConcepts && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.explainConcepts}
                </p>
              )}
            </div>

            <div>
              <Label className="text-gray-200 font-medium">
              Which Learning Management Systems (LMS) or online teaching platforms are you familiar with? *
              </Label>
              <Input
                value={formData.lmsPlatforms || ""}
                onChange={(e) => updateFormData("lmsPlatforms", e.target.value)}
                className={`mt-1 ${
                  errors.lmsPlatforms ? "border-red-500" : "border-gray-400"
                } focus:border-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
                placeholder="e.g., Moodle, Canvas, Blackboard"
              />
              {errors.lmsPlatforms && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.lmsPlatforms}
                </p>
              )}
            </div>

            <div>
              <Label className="text-gray-200 font-medium">
              Please provide a link to a portfolio of any teaching materials, tutorials, or projects you have created. *
              </Label>
              <Input
                value={formData.itPortfolioLink || ""}
                onChange={(e) =>
                  updateFormData("itPortfolioLink", e.target.value)
                }
                className={`mt-1 ${
                  errors.itPortfolioLink ? "border-red-500" : "border-gray-400"
                } focus:border-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
                placeholder="https://your-portfolio.com"
              />
              {errors.itPortfolioLink && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.itPortfolioLink}
                </p>
              )}
            </div>
          </div>
        )}

        {formData.role === "Curriculum Designer" && (
          <div className="space-y-4">
            <div>
              <Label className="text-gray-200 font-medium">
              Describe your experience in curriculum design and instructional design. Which instructional design models are you familiar with ? *
              </Label>
              <Textarea
                value={formData.curriculumExperience || ""}
                onChange={(e) =>
                  updateFormData("curriculumExperience", e.target.value)
                }
                className={`mt-1 ${
                  errors.curriculumExperience
                    ? "border-red-500"
                    : "border-gray-400"
                } focus:border-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
                placeholder="Describe your curriculum design experience"
                rows={4}
              />
              {errors.curriculumExperience && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.curriculumExperience}
                </p>
              )}
            </div>

            <div>
              <Label className="text-gray-200 font-medium">
              What is your process for conducting a needs analysis to determine learning objectives? *
              </Label>
              <Textarea
                value={formData.needsAnalysis || ""}
                onChange={(e) =>
                  updateFormData("needsAnalysis", e.target.value)
                }
                className={`mt-1 ${
                  errors.needsAnalysis ? "border-red-500" : "border-gray-400"
                } focus:border-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
                placeholder="Describe your needs analysis process"
                rows={4}
              />
              {errors.needsAnalysis && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.needsAnalysis}
                </p>
              )}
            </div>

            <div>
              <Label className="text-gray-200 font-medium">
              Please provide a link to a portfolio of curriculum or learning materials you have designed. *
              </Label>
              <Input
                value={formData.curriculumPortfolioLink || ""}
                onChange={(e) =>
                  updateFormData("curriculumPortfolioLink", e.target.value)
                }
                className={`mt-1 ${
                  errors.curriculumPortfolioLink
                    ? "border-red-500"
                    : "border-gray-400"
                } focus:border-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
                placeholder="https://your-portfolio.com"
              />
              {errors.curriculumPortfolioLink && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.curriculumPortfolioLink}
                </p>
              )}
            </div>

            <div>
              <Label className="text-gray-200 font-medium">
              Which e-learning authoring tools and multimedia development software are you proficient in? *
              </Label>
              <Input
                value={formData.toolsProficiency || ""}
                onChange={(e) =>
                  updateFormData("toolsProficiency", e.target.value)
                }
                className={`mt-1 ${
                  errors.toolsProficiency ? "border-red-500" : "border-gray-400"
                } focus:border-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
                placeholder="e.g., Articulate Storyline, Adobe Captivate"
              />
              {errors.toolsProficiency && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.toolsProficiency}
                </p>
              )}
            </div>

            <div>
              <Label className="text-gray-200 font-medium">
              How do you evaluate the effectiveness of a curriculum and measure learning outcomes? *
              </Label>
              <Textarea
                value={formData.evaluateEffectiveness || ""}
                onChange={(e) =>
                  updateFormData("evaluateEffectiveness", e.target.value)
                }
                className={`mt-1 ${
                  errors.evaluateEffectiveness
                    ? "border-red-500"
                    : "border-gray-400"
                } focus:border-shamrock-300 bg-white/10 text-white placeholder:text-gray-300`}
                placeholder="Describe your evaluation methods"
                rows={4}
              />
              {errors.evaluateEffectiveness && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.evaluateEffectiveness}
                </p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Upload your documents
        </h2>
        <p className="text-gray-300">
          Please upload your cover letter and resume
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-gray-200 font-medium">Cover Letter *</Label>
          <div
            className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              errors.coverLetter
                ? "border-red-400 bg-red-900/20"
                : "border-gray-400 hover:border-shamrock-300 hover:bg-shamrock-900/20"
            }`}
          >
            <input
              ref={(el) => (fileInputRefs.current["coverLetter"] = el)}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                handleFileUpload("coverLetter", e.target.files?.[0] || null)
              }
              className="hidden"
            />
            <Upload className="mx-auto h-12 w-12 text-gray-200 mb-4" />
            <p className="text-gray-200 mb-2">
              {formData.coverLetter
                ? formData.coverLetter.name
                : "Click to upload cover letter"}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRefs.current["coverLetter"]?.click()}
              className="border-shamrock-300 text-shamrock-300 hover:bg-shamrock-900/20 bg-transparent"
            >
              {formData.coverLetter ? "Change File" : "Choose File"}
            </Button>
            <p className="text-sm text-gray-300 mt-2">
              PDF, DOC, or DOCX (max 10MB)
            </p>
          </div>
          {errors.coverLetter && (
            <p className="text-red-400 text-sm mt-1">{errors.coverLetter}</p>
          )}
        </div>

        <div>
          <Label className="text-gray-200 font-medium">Resume/CV *</Label>
          <div
            className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              errors.resume
                ? "border-red-400 bg-red-900/20"
                : "border-gray-400 hover:border-shamrock-300 hover:bg-shamrock-900/20"
            }`}
          >
            <input
              ref={(el) => (fileInputRefs.current["resume"] = el)}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                handleFileUpload("resume", e.target.files?.[0] || null)
              }
              className="hidden"
            />
            <Upload className="mx-auto h-12 w-12 text-gray-200 mb-4" />
            <p className="text-gray-200 mb-2">
              {formData.resume
                ? formData.resume.name
                : "Click to upload resume"}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRefs.current["resume"]?.click()}
              className="border-shamrock-300 text-shamrock-300 hover:bg-shamrock-900/20 bg-transparent"
            >
              {formData.resume ? "Change File" : "Choose File"}
            </Button>
            <p className="text-sm text-gray-300 mt-2">
              PDF, DOC, or DOCX (max 10MB)
            </p>
          </div>
          {errors.resume && (
            <p className="text-red-400 text-sm mt-1">{errors.resume}</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderReviewScreen = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Review Your Application
        </h2>
        <p className="text-gray-300">
          Please review all information before submitting
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white/5 rounded-lg p-4 border border-gray-400">
          <h3 className="text-lg font-semibold text-shamrock-300 mb-3">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Full Name:</span>
              <p className="text-white font-medium">{formData.fullName}</p>
            </div>
            <div>
              <span className="text-gray-400">Email:</span>
              <p className="text-white font-medium">{formData.email}</p>
            </div>
            <div>
              <span className="text-gray-400">Phone:</span>
              <p className="text-white font-medium">{formData.phone}</p>
            </div>
            <div>
              <span className="text-gray-400">Role:</span>
              <p className="text-white font-medium">{formData.role}</p>
            </div>
          </div>
        </div>

        {/* Role-specific Information */}
        <div className="bg-white/5 rounded-lg p-4 border border-gray-400">
          <h3 className="text-lg font-semibold text-shamrock-300 mb-3">
            Experience & Qualifications
          </h3>
          <div className="space-y-3 text-sm">
            {formData.role === "Social Media Manager" && (
              <>
                <div>
                  <span className="text-gray-400">Experience:</span>
                  <p className="text-white">{formData.socialMediaExperience}</p>
                </div>
                <div>
                  <span className="text-gray-400">Portfolio:</span>
                  <p className="text-white break-all">
                    {formData.portfolioLink}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Tools:</span>
                  <p className="text-white">{formData.socialMediaTools}</p>
                </div>
                <div>
                  <span className="text-gray-400">Content Creation:</span>
                  <p className="text-white">{formData.contentCreation}</p>
                </div>
                <div>
                  <span className="text-gray-400">Email Marketing:</span>
                  <p className="text-white">{formData.emailMarketing}</p>
                </div>
                <div>
                  <span className="text-gray-400">Lives in Area:</span>
                  <p className="text-white">{formData.livesInArea}</p>
                </div>
              </>
            )}

            {formData.role === "IT Tutor" && (
              <>
                <div>
                  <span className="text-gray-400">IT Expertise:</span>
                  <p className="text-white">{formData.itExpertise}</p>
                </div>

                <div>
                  <span className="text-gray-400">Teaching Experience:</span>
                  <p className="text-white">{formData.teachingExperience}</p>
                </div>

                <div>
                  <span className="text-gray-400">Explain Concepts:</span>
                  <p className="text-white">{formData.explainConcepts}</p>
                </div>

                <div>
                  <span className="text-gray-400">LMS Platforms:</span>
                  <p className="text-white">{formData.lmsPlatforms}</p>
                </div>

                <div>
                  <span className="text-gray-400">Portfolio:</span>
                  <p className="text-white break-all">
                    {formData.itPortfolioLink}
                  </p>
                </div>
              </>
            )}

            {formData.role === "Curriculum Designer" && (
              <>
                <div>
                  <span className="text-gray-400">Curriculum Experience:</span>
                  <p className="text-white">{formData.curriculumExperience}</p>
                </div>
                <div>
                  <span className="text-gray-400">Tools Proficiency:</span>
                  <p className="text-white">{formData.toolsProficiency}</p>
                </div>
                <div>
                  <span className="text-gray-400">Portfolio:</span>
                  <p className="text-white break-all">
                    {formData.curriculumPortfolioLink}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Uploaded Documents */}
        <div className="bg-white/5 rounded-lg p-4 border border-gray-400">
          <h3 className="text-lg font-semibold text-shamrock-300 mb-3">
            Uploaded Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Cover Letter:</span>
              <p className="text-white font-medium">
                {formData.coverLetter?.name}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Resume:</span>
              <p className="text-white font-medium">{formData.resume?.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-shamrock-900/20 border border-shamrock-300/30 rounded-lg p-4">
        <p className="text-shamrock-200 text-sm">
          By submitting this application, you confirm that all information
          provided is accurate and complete.
        </p>
      </div>
    </motion.div>
  );

  const renderSuccessScreen = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="p-6 rounded-full bg-shamrock-300/20 border border-shamrock-300/30">
            <PartyPopper className="w-16 h-16 text-shamrock-300" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white">
          Application Submitted!
        </h1>
        <p className="text-lg text-gray-200 max-w-md mx-auto">
          Thank you for applying to EduRepublic. We've received your application
          successfully.
        </p>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-gray-400 max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-shamrock-300 mb-3">
          What's Next?
        </h3>
        <div className="space-y-3 text-sm text-gray-100">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-shamrock-300 mt-0.5 flex-shrink-0" />
            <p>We'll review your application within 3-5 business days</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-shamrock-300 mt-0.5 flex-shrink-0" />
            <p>You'll receive an email confirmation shortly</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-shamrock-300 mt-0.5 flex-shrink-0" />
            <p>If selected, we'll contact you for an interview</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Card className="backdrop-blur-md bg-white/10 shadow-xl rounded-2xl p-8 border border-gray-400">
          {renderSuccessScreen()}
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Progress Steps - Only show when not on welcome screen */}
      {currentStep > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      isCompleted
                        ? "bg-shamrock-300 border-shamrock-300 text-gray-900"
                        : isActive
                        ? "border-shamrock-300 text-shamrock-300 bg-transparent"
                        : "border-gray-400 text-gray-400 bg-transparent"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-2 transition-colors duration-300 ${
                        currentStep > step.id
                          ? "bg-shamrock-300"
                          : "bg-gray-400"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-300">
              Step {currentStep} of {steps.length}:{" "}
              {steps[currentStep - 1].title}
            </p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <Card className="backdrop-blur-md bg-white/10 shadow-xl rounded-2xl p-8 border border-gray-400">
        <AnimatePresence mode="wait">
          {currentStep === 0 && renderWelcomeScreen()}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderReviewScreen()}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-400">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 border-slate-50 text-gray-200 hover:bg-gray-200/20 disabled:opacity-50 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep === 0 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 bg-shamrock-300 hover:bg-shamrock-400 text-gray-900 border-0 font-medium px-8"
            >
              Start Application
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : currentStep < 4 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 bg-shamrock-300 hover:bg-shamrock-400 text-gray-900 border-0 font-medium"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : currentStep === 4 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 bg-shamrock-300 hover:bg-shamrock-400 text-gray-900 border-0 font-medium"
            >
              Review Application
              <Eye className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-shamrock-300 hover:bg-shamrock-400 text-gray-900 border-0 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <Send className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
