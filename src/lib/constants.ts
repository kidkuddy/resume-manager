// Predefined values for dropdowns and selects

export const LOCATIONS = [
  "Remote",
  "New York, NY",
  "San Francisco, CA", 
  "Los Angeles, CA",
  "Seattle, WA",
  "Austin, TX",
  "Boston, MA",
  "Chicago, IL",
  "Denver, CO",
  "Atlanta, GA",
  "Miami, FL",
  "Portland, OR",
  "Washington, DC",
  "London, UK",
  "Berlin, Germany",
  "Amsterdam, Netherlands",
  "Toronto, Canada",
  "Sydney, Australia",
  "Tokyo, Japan",
  "Singapore",
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
