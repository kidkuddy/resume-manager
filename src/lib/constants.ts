// Predefined values for dropdowns and selects

export const LOCATIONS = [
  "Tunisia/Remote",
  "Tunisia",
  "Remote",
] as const;

export const EXPERIENCE_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
] as const;

export const PROJECT_TYPES = [
  { value: "academic", label: "Academic" },
  { value: "personal", label: "Personal" },
] as const;

export const PROJECT_STATUS = [
  { value: "completed", label: "Completed" },
  { value: "in-progress", label: "In Progress" },
  { value: "planning", label: "Planning" },
] as const;

export const COMMON_TECHNOLOGIES = [
  // Programming Languages
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "Swift", "Kotlin",
  // Frontend
  "React", "Vue.js", "Angular", "Next.js", "Nuxt.js", "Svelte", "HTML", "CSS", "Sass", "Tailwind CSS",
  // Backend
  "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "ASP.NET", "Ruby on Rails",
  // Databases
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Firebase", "Supabase",
  // Cloud & DevOps
  "AWS", "Google Cloud", "Azure", "Docker", "Kubernetes", "Terraform", "Jenkins", "GitHub Actions",
  // Tools
  "Git", "Figma", "Adobe Creative Suite", "Postman", "Jira", "Slack",
] as const;

// Certification constants
export const CERTIFICATION_STATUS = [
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "pending", label: "Pending" },
] as const;

export const CERTIFICATION_WORTHINESS = [
  { value: "premium", label: "Premium (Paid Certification)" },
  { value: "earned", label: "Earned (Free Exam, Studied)" },
  { value: "free", label: "Free (Online Course)" },
  { value: "basic", label: "Basic (Participation)" },
] as const;

// Education constants
export const DEGREE_TYPES = [
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "phd", label: "PhD" },
  { value: "engineering", label: "Engineering Degree" },
  { value: "associate", label: "Associate Degree" },
  { value: "diploma", label: "Diploma" },
  { value: "certificate", label: "Certificate" },
  { value: "other", label: "Other" },
] as const;

export const EDUCATION_STATUS = [
  { value: "completed", label: "Completed" },
  { value: "in-progress", label: "In Progress" },
  { value: "pending", label: "Pending (Planning to Enroll)" },
] as const;

// Skills constants
export const SKILL_CATEGORIES = [
  { value: "technical", label: "Technical Skills" },
  { value: "soft", label: "Soft Skills" },
  { value: "leadership", label: "Leadership & Management" },
  { value: "business", label: "Business & Strategy" },
  { value: "language", label: "Languages" },
  { value: "creative", label: "Creative & Design" },
  { value: "other", label: "Other" },
] as const;

export const SKILL_PROFICIENCY = [
  { 
    value: "experimented", 
    label: "Experimented", 
    description: "Just starting to learn or prototype with this skill" 
  },
  { 
    value: "familiar", 
    label: "Familiar", 
    description: "Have read about it or used it in tutorials" 
  },
  { 
    value: "proficient", 
    label: "Proficient", 
    description: "Have worked with it on real projects" 
  },
  { 
    value: "expert", 
    label: "Expert", 
    description: "Have mastered it and built many things with it" 
  },
] as const;

// Activity constants
export const ACTIVITY_TYPES = [
  { value: "volunteering", label: "Volunteering" },
  { value: "speaking", label: "Speaking & Presentations" },
  { value: "mentoring", label: "Mentoring & Coaching" },
  { value: "community", label: "Community Involvement" },
  { value: "other", label: "Other Activities" },
] as const;
