"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, Check, Shield, Wrench, AlertTriangle } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

interface SurveyData {
  role: string
  other_role: string
  seniority: string
  company_type: string
  company_size: string
  industry: string
  product_type: string
  customer_segment: string
  main_challenge: string
  daily_tools: string[]
  other_tool: string
  learning_methods: string[]
  salary_currency: string
  salary_min: string
  salary_max: string
  salary_average: string
  email: string
}

interface AppSettings {
  general: {
    maintenanceMode: boolean
    [key: string]: any
  }
  [key: string]: any
}

const roleOptions = [
  "Product Manager",
  "Product Owner",
  "Product Designer / UX/UI Designer (UXer)",
  "Product Engineer / Software Engineer (Developer)",
  "Data Analyst / Product Analyst",
  "Product Marketing Manager",
  "Engineering Manager / Tech Lead",
  "Design Manager / Design Lead",
  "QA Engineer / Test Engineer",
  "DevOps Engineer / Platform Engineer",
  "Technical Writer / Documentation",
  "Customer Success Manager",
  "Sales Engineer / Solutions Engineer",
  "Other",
]

const seniorityOptions = [
  "Junior (0-2 years)",
  "Mid-level (2-5 years)",
  "Senior (5-8 years)",
  "Staff/Principal (8+ years)",
  "Manager/Lead",
  "Director/VP",
  "C-level/Founder",
]

const companySizeOptions = [
  "Early-stage Startup (Pre-seed/Seed)",
  "Growth-stage Startup (Series A-C)",
  "Scale-up (Series D+)",
  "SME (Small/Medium Enterprise)",
  "Large Corporate (1000+ employees)",
  "Enterprise (10,000+ employees)",
  "Consultancy/Agency",
  "Freelance/Independent",
]

const industryOptions = [
  "Technology/Software",
  "Financial Services/Fintech",
  "Healthcare/Medtech",
  "E-commerce/Retail",
  "Education/Edtech",
  "Media/Entertainment",
  "Manufacturing/Industrial",
  "Consulting/Professional Services",
  "Government/Public Sector",
  "Non-profit/NGO",
  "Other",
]

const productTypeOptions = [
  "SaaS (B2B)",
  "SaaS (B2C)",
  "Mobile App",
  "Web Application",
  "E-commerce Platform",
  "API/Developer Tools",
  "Hardware + Software",
  "Services/Consulting",
  "Internal Tools",
  "Other",
]

const customerSegmentOptions = ["B2B Product", "B2C Product", "B2B2C Product", "Internal Product", "Mixed (B2B + B2C)"]

const toolOptions = [
  "Jira",
  "Figma",
  "Notion",
  "Miro",
  "Trello",
  "Asana",
  "Monday.com",
  "ClickUp",
  "Linear",
  "Slack",
  "Microsoft Teams",
  "Zoom",
  "Google Workspace",
  "Microsoft 365",
  "Confluence",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "Sketch",
  "Adobe XD",
  "InVision",
  "Framer",
  "Webflow",
  "Airtable",
  "Coda",
  "Obsidian",
  "Roam Research",
  "Mural",
  "FigJam",
  "Whimsical",
  "Lucidchart",
  "Draw.io",
  "Canva",
  "Loom",
  "Other",
]

const learningOptions = ["Books", "Podcasts", "Courses", "Community", "Mentors", "Other"]

export default function ProductSurvey() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [surveyConfig, setSurveyConfig] = useState<any>(null)
  const [surveyData, setSurveyData] = useState<SurveyData>({
    role: "",
    other_role: "",
    seniority: "",
    company_type: "",
    company_size: "",
    industry: "",
    product_type: "",
    customer_segment: "",
    main_challenge: "",
    daily_tools: [],
    other_tool: "",
    learning_methods: [],
    salary_currency: "ARS", // Default to Argentine Pesos
    salary_min: "",
    salary_max: "",
    salary_average: "",
    email: "",
  })

  const totalSteps = 12

  // Check maintenance mode on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = localStorage.getItem("app_settings")
        if (savedSettings) {
          const settings: AppSettings = JSON.parse(savedSettings)
          setIsMaintenanceMode(settings.general?.maintenanceMode || false)
        }
        
        // Also check for survey configuration
        const surveyConfig = localStorage.getItem("survey_config")
        if (surveyConfig) {
          const config = JSON.parse(surveyConfig)
          setSurveyConfig(config)
          // You can add survey config checks here if needed
          console.log("Survey config loaded:", config)
        }
      } catch (error) {
        console.error("Error checking settings:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadSettings()
  }, [])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show maintenance mode screen
  if (isMaintenanceMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950 p-4">
        {/* Theme toggle */}
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        
        {/* Admin Login Button */}
        <div className="absolute top-4 left-4">
          <Button
            onClick={() => window.open("/auth/login", "_blank")}
            variant="outline"
            size="sm"
            className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white/90 text-slate-600 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300"
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin Login
          </Button>
        </div>

        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Under Maintenance
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            We're currently performing scheduled maintenance on our survey system. 
            Please check back later or contact the administrator if you need immediate assistance.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              This maintenance mode can be disabled by administrators in the settings panel.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleRoleSelect = (role: string) => {
    setSurveyData({ ...surveyData, role })
  }

  const handleSenioritySelect = (seniority: string) => {
    setSurveyData({ ...surveyData, seniority })
  }

  const handleChallengeChange = (main_challenge: string) => {
    setSurveyData({ ...surveyData, main_challenge })
  }

  const handleToolToggle = (tool: string) => {
    const updatedTools = surveyData.daily_tools.includes(tool)
      ? surveyData.daily_tools.filter((t) => t !== tool)
      : [...surveyData.daily_tools, tool]
    setSurveyData({ ...surveyData, daily_tools: updatedTools })
  }

  const handleLearningToggle = (method: string) => {
    const updatedMethods = surveyData.learning_methods.includes(method)
      ? surveyData.learning_methods.filter((m) => m !== method)
      : [...surveyData.learning_methods, method]
    setSurveyData({ ...surveyData, learning_methods: updatedMethods })
  }

  const handleEmailChange = (email: string) => {
    setSurveyData({ ...surveyData, email })
  }

  const handleOtherRoleChange = (other_role: string) => {
    setSurveyData({ ...surveyData, other_role })
  }

  const handleCompanySizeSelect = (company_size: string) => {
    setSurveyData({ ...surveyData, company_size })
  }

  const handleIndustrySelect = (industry: string) => {
    setSurveyData({ ...surveyData, industry })
  }

  const handleProductTypeSelect = (product_type: string) => {
    setSurveyData({ ...surveyData, product_type })
  }

  const handleCustomerSegmentSelect = (customer_segment: string) => {
    setSurveyData({ ...surveyData, customer_segment })
  }

  const handleOtherToolChange = (other_tool: string) => {
    setSurveyData({ ...surveyData, other_tool })
  }

  const isValidEmail = (email: string) => {
    if (!email) return true // Email is optional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return surveyData.role !== ""
      case 1:
        return surveyData.seniority !== ""
      case 2:
        return surveyData.company_size !== ""
      case 3:
        return surveyData.industry !== ""
      case 4:
        return surveyData.product_type !== ""
      case 5:
        return surveyData.customer_segment !== ""
      case 6:
        return surveyData.main_challenge.trim().length > 10
      case 7:
        return surveyData.daily_tools.length > 0
      case 8:
        return surveyData.learning_methods.length > 0
      case 9:
        return isValidEmail(surveyData.email)
      default:
        return true
    }
  }

  const submitSurvey = () => {
    try {
      const existing = JSON.parse(localStorage.getItem("survey") || "[]")
      const updated = [...existing, { ...surveyData, created_at: new Date().toISOString() }]
      localStorage.setItem("survey", JSON.stringify(updated))
      console.log("✅ Survey saved to localStorage:", updated)

      handleNext()
    } catch (error) {
      console.error("❌ Error saving to localStorage:", error)
      alert("Error saving survey locally.")
    }
  }

  const renderQuestion = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-slate-50">What's your current role?</h2>
              <p className="text-lg xl:text-xl text-slate-600 dark:text-slate-400">Help us understand your background</p>
            </div>
            <div className="grid gap-3 max-w-3xl mx-auto">
              {roleOptions.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 ${
                    surveyData.role === role
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="font-medium">{role}</span>
                </button>
              ))}
            </div>
            {surveyData.role === "Other" && (
              <div className="max-w-3xl mx-auto mt-4">
                <Input
                  value={surveyData.other_role}
                  onChange={(e) => handleOtherRoleChange(e.target.value)}
                  placeholder="Please specify your role..."
                  className="text-lg p-4 h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                />
              </div>
            )}
          </div>
        )

      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50">What's your seniority level?</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Help us understand your experience</p>
            </div>
            <div className="grid gap-3 max-w-2xl mx-auto">
              {seniorityOptions.map((seniority) => (
                <button
                  key={seniority}
                  onClick={() => handleSenioritySelect(seniority)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 ${
                    surveyData.seniority === seniority
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="font-medium">{seniority}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50">What type of company do you work for?</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Tell us about your company size and stage</p>
            </div>
            <div className="grid gap-3 max-w-2xl mx-auto">
              {companySizeOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => handleCompanySizeSelect(size)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 ${
                    surveyData.company_size === size
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="font-medium">{size}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50">What industry do you work in?</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Help us understand your market</p>
            </div>
            <div className="grid gap-3 max-w-2xl mx-auto">
              {industryOptions.map((industry) => (
                <button
                  key={industry}
                  onClick={() => handleIndustrySelect(industry)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 ${
                    surveyData.industry === industry
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="font-medium">{industry}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50">What type of product do you work on?</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Tell us about your product category</p>
            </div>
            <div className="grid gap-3 max-w-2xl mx-auto">
              {productTypeOptions.map((type) => (
                <button
                  key={type}
                  onClick={() => handleProductTypeSelect(type)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 ${
                    surveyData.product_type === type
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="font-medium">{type}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50">What's your customer segment?</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Who do you build products for?</p>
            </div>
            <div className="grid gap-3 max-w-2xl mx-auto">
              {customerSegmentOptions.map((segment) => (
                <button
                  key={segment}
                  onClick={() => handleCustomerSegmentSelect(segment)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 ${
                    surveyData.customer_segment === segment
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="font-medium">{segment}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50">What's your main product-related challenge?</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Share what you're struggling with most</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Textarea
                value={surveyData.main_challenge}
                onChange={(e) => handleChallengeChange(e.target.value)}
                placeholder="Describe your biggest challenge in product management, design, or development..."
                className="min-h-32 text-lg p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 resize-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400"
              />
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-slate-50">What tools do you use daily?</h2>
              <p className="text-lg xl:text-xl text-slate-600 dark:text-slate-400">Select all that apply</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-6xl mx-auto">
              {toolOptions.map((tool) => (
                <button
                  key={tool}
                  onClick={() => handleToolToggle(tool)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 ${
                    surveyData.daily_tools.includes(tool)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{tool}</span>
                    {surveyData.daily_tools.includes(tool) && <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  </div>
                </button>
              ))}
            </div>
            {surveyData.daily_tools.includes("Other") && (
              <div className="max-w-2xl mx-auto mt-4">
                <Input
                  value={surveyData.other_tool}
                  onChange={(e) => handleOtherToolChange(e.target.value)}
                  placeholder="Please specify the tool..."
                  className="text-lg p-4 h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                />
              </div>
            )}
          </div>
        )

      case 8:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50">How do you learn about product?</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Select all that apply</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {learningOptions.map((method) => (
                <button
                  key={method}
                  onClick={() => handleLearningToggle(method)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 ${
                    surveyData.learning_methods.includes(method)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{method}</span>
                    {surveyData.learning_methods.includes(method) && <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 9:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50">What's your salary range?</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Help us understand compensation in the product community (optional)</p>
            </div>
            <div className="max-w-lg mx-auto space-y-6">
              {/* Currency Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Currency:</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setSurveyData({ ...surveyData, salary_currency: "ARS", salary_min: "", salary_max: "", salary_average: "" })}
                    className={`flex-1 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                      surveyData.salary_currency === "ARS"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇦🇷</span>
                      <span className="font-medium">Pesos Argentinos</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSurveyData({ ...surveyData, salary_currency: "USD", salary_min: "", salary_max: "", salary_average: "" })}
                    className={`flex-1 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                      surveyData.salary_currency === "USD"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇺🇸</span>
                      <span className="font-medium">US Dollars</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Salary Input */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Salary Range</label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      value={surveyData.salary_min}
                      onChange={(e) => {
                        const min = parseInt(e.target.value) || 0
                        const max = parseInt(surveyData.salary_max) || 0
                        const avg = min > 0 && max > 0 ? Math.round((min + max) / 2).toString() : ""
                        setSurveyData({ 
                          ...surveyData, 
                          salary_min: e.target.value,
                          salary_average: avg
                        })
                      }}
                      placeholder={surveyData.salary_currency === "USD" ? "Min (e.g., 80000)" : "Min (e.g., 2000000)"}
                      className="text-lg p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                    <span className="text-slate-500">-</span>
                    <Input
                      type="number"
                      value={surveyData.salary_max}
                      onChange={(e) => {
                        const min = parseInt(surveyData.salary_min) || 0
                        const max = parseInt(e.target.value) || 0
                        const avg = min > 0 && max > 0 ? Math.round((min + max) / 2).toString() : ""
                        setSurveyData({ 
                          ...surveyData, 
                          salary_max: e.target.value,
                          salary_average: avg
                        })
                      }}
                      placeholder={surveyData.salary_currency === "USD" ? "Max (e.g., 120000)" : "Max (e.g., 3000000)"}
                      className="text-lg p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    OR
                  </span>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Average Salary</label>
                  <Input
                    type="number"
                    value={surveyData.salary_average}
                    onChange={(e) => {
                      const avg = parseInt(e.target.value) || 0
                      setSurveyData({ 
                        ...surveyData, 
                        salary_average: e.target.value,
                        salary_min: avg > 0 ? Math.round(avg * 0.85).toString() : "",
                        salary_max: avg > 0 ? Math.round(avg * 1.15).toString() : ""
                      })
                    }}
                    placeholder={surveyData.salary_currency === "USD" ? "Average (e.g., 100000)" : "Average (e.g., 2500000)"}
                    className="text-lg p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  {surveyData.salary_average && surveyData.salary_min && surveyData.salary_max && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Auto-calculated range: {parseInt(surveyData.salary_min).toLocaleString()} - {parseInt(surveyData.salary_max).toLocaleString()} {surveyData.salary_currency}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 10:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50">Your email</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Optional - only if you'd like us to follow up</p>
            </div>
            <div className="max-w-md mx-auto">
              <Input
                type="email"
                value={surveyData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="your@email.com"
                className={`text-lg p-4 h-14 rounded-xl border-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                  !isValidEmail(surveyData.email)
                    ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                    : "border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                }`}
              />
              {!isValidEmail(surveyData.email) && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2">Please enter a valid email address</p>
              )}
            </div>
          </div>
        )

      case 11:
        return (
          <div className="text-center space-y-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50">Thank you!</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Your responses help us build better products and create more valuable content for the product community.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950 flex items-center justify-center p-4 xl:p-8">
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-20">
        <ModeToggle />
      </div>
      
      {/* Admin Login Button */}
      <div className="fixed top-4 left-4 z-20">
        <Button
          onClick={() => window.open("/auth/login", "_blank")}
          variant="outline"
          size="sm"
          className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-lg"
        >
          <Shield className="w-4 h-4 mr-2" />
          Admin Login
        </Button>
      </div>

      <div className="w-full max-w-5xl mx-auto">
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 lg:p-12 xl:p-16">
            {/* Progress bar */}
            <div className="mb-8 lg:mb-12">
              <div className="flex justify-between items-center mb-3">
                                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {currentStep < totalSteps - 1 ? `${currentStep + 1} of ${totalSteps - 1}` : "Complete"}
                  </span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {Math.round(((currentStep + 1) / totalSteps) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Question content */}
            <div className="mb-8 lg:mb-12">{renderQuestion()}</div>

                          {/* Navigation buttons */}
              {currentStep < totalSteps - 1 && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 order-2 sm:order-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>

                {currentStep === 10 ? (
                  <Button
                    onClick={submitSurvey}
                    disabled={!canProceed() || isSubmitting}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Survey
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
