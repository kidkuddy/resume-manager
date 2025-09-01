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
  { value: "programming", label: "Programming Languages" },
  { value: "framework", label: "Frameworks & Libraries" },
  { value: "database", label: "Databases" },
  { value: "tools", label: "Tools & Software" },
  { value: "cloud", label: "Cloud & DevOps" },
  { value: "soft-skills", label: "Soft Skills" },
  { value: "languages", label: "Languages" },
  { value: "other", label: "Other" },
] as const;

export const SKILL_PROFICIENCY = [
  { value: "experimented", label: "Experimented (Prototyping)" },
  { value: "familiar", label: "Familiar (Heard/Read About)" },
  { value: "proficient", label: "Proficient (Worked With)" },
  { value: "expert", label: "Expert (Built Many Things)" },
] as const;
