/**
 * Everything the site says about Mohammed Faisal lives here, taken from the resume (Resume2.pdf).
 * Edit this file to update the site; components only read from it.
 */

export const profile = {
  name: 'Mohammed Faisal',
  handle: 'faisal',
  degree: 'B.Tech in Computer Science',
  college: 'Jyothi Engineering College, Thrissur',
  /** Lines typed out in the hero, one at a time. */
  roles: [
    'building full-stack apps with Flask & MySQL',
    'automating the boring stuff with Python',
    'exploring networking & cybersecurity',
  ],
  openTo: 'Open to internships & entry-level roles',
  lookingFor:
    'Looking for internship or entry-level roles in software development, cybersecurity or system administration.',
  summary:
    "I'm a B.Tech Computer Science student with strong skills in web development, backend programming, networking and cybersecurity fundamentals. I build full-stack applications with Flask, MySQL and modern web technologies, I've completed live internship projects, and I like applying what I learn to real-world problems.",
  traits: ['strong analytical skills', 'time management', 'hard worker'],
  /** Set to a file in /public (e.g. './resume.pdf') to show a download button. Left empty because the PDF includes a phone number. */
  resumeUrl: '',
} as const

export const contact = {
  email: 'mhdfaisal9061@gmail.com',
  github: { label: 'github.com/faisssss', href: 'https://github.com/faisssss' },
  // The PDF's LinkedIn link is broken (it points to a local file); this is the profile it was meant to open.
  linkedin: {
    label: 'in/mohammed-faisal-09135125b',
    href: 'https://www.linkedin.com/in/mohammed-faisal-09135125b',
  },
} as const

export const quickFacts = [
  { value: 3, decimals: 0, label: 'projects built' },
  { value: 1, decimals: 0, label: 'internship' },
  { value: 2, decimals: 0, label: 'certifications' },
  { value: 7.42, decimals: 2, label: 'CGPA / 10' },
] as const

export type SkillIcon =
  | 'python'
  | 'cpp'
  | 'java'
  | 'html'
  | 'css'
  | 'javascript'
  | 'php'
  | 'mysql'
  | 'flask'
  | 'bootstrap'
  | 'pandas'
  | 'react'
  | 'tensorflow'
  | 'keras'
  | 'opencv'
  | 'git'
  | 'vscode'
  | 'xampp'
  | 'cisco'
  | 'excel'

export interface SkillGroup {
  key: string
  title: string
  note?: string
  items: { name: string; icon?: SkillIcon }[]
}

export const skillGroups: SkillGroup[] = [
  {
    key: 'languages',
    title: 'Languages',
    note: 'OOP in C++ and Java',
    items: [
      { name: 'Python', icon: 'python' },
      { name: 'C++', icon: 'cpp' },
      { name: 'Java', icon: 'java' },
    ],
  },
  {
    key: 'web',
    title: 'Web development',
    items: [
      { name: 'HTML', icon: 'html' },
      { name: 'CSS', icon: 'css' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'PHP', icon: 'php' },
      { name: 'Flask', icon: 'flask' },
      { name: 'Bootstrap', icon: 'bootstrap' },
      { name: 'React', icon: 'react' },
    ],
  },
  {
    key: 'databases',
    title: 'Databases',
    items: [{ name: 'MySQL', icon: 'mysql' }, { name: 'SQL' }],
  },
  {
    key: 'data',
    title: 'Data & ML',
    items: [
      { name: 'Pandas', icon: 'pandas' },
      { name: 'TensorFlow', icon: 'tensorflow' },
      { name: 'Keras', icon: 'keras' },
      { name: 'OpenCV', icon: 'opencv' },
      { name: 'NLP' },
    ],
  },
  {
    key: 'tools',
    title: 'Tools & platforms',
    items: [
      { name: 'Git', icon: 'git' },
      { name: 'VS Code', icon: 'vscode' },
      { name: 'XAMPP', icon: 'xampp' },
      { name: 'Cisco Packet Tracer', icon: 'cisco' },
      { name: 'SMTP' },
    ],
  },
  {
    key: 'analytics',
    title: 'Analytics',
    note: 'Pivot tables, formulas and interactive dashboards',
    items: [{ name: 'Excel', icon: 'excel' }, { name: 'Power BI' }],
  },
]

/** Logos for the scrolling strip in the skills section. */
export const techStrip: { name: string; icon: SkillIcon }[] = [
  { name: 'Python', icon: 'python' },
  { name: 'Flask', icon: 'flask' },
  { name: 'MySQL', icon: 'mysql' },
  { name: 'JavaScript', icon: 'javascript' },
  { name: 'React', icon: 'react' },
  { name: 'C++', icon: 'cpp' },
  { name: 'Java', icon: 'java' },
  { name: 'PHP', icon: 'php' },
  { name: 'HTML', icon: 'html' },
  { name: 'CSS', icon: 'css' },
  { name: 'Bootstrap', icon: 'bootstrap' },
  { name: 'Pandas', icon: 'pandas' },
  { name: 'TensorFlow', icon: 'tensorflow' },
  { name: 'OpenCV', icon: 'opencv' },
  { name: 'Git', icon: 'git' },
  { name: 'Cisco', icon: 'cisco' },
]

export const certifications = [
  { name: 'Academor Web Development Course', detail: '2 months · HTML, CSS, JavaScript' },
  { name: 'JS and ReactJS Bootcamp', detail: '7 days' },
] as const

export type CommitKind = 'work' | 'edu'

export interface Commit {
  kind: CommitKind
  /** Conventional-commit style prefix shown before the title */
  type: string
  title: string
  org: string
  date?: string
  refs?: string
  points: string[]
  tags?: string[]
}

/** Newest first, like `git log`. */
export const journey: Commit[] = [
  {
    kind: 'work',
    type: 'feat(work)',
    title: 'Intern',
    org: 'Orion Informatics',
    date: 'Apr 2025 – Jul 2025',
    refs: 'HEAD -> main',
    points: [
      'Designed and developed a full-stack web app for invoice file management using Flask.',
      'Implemented multi-file upload with document mapping, ZIP archiving, and email delivery via SMTP.',
      'Used HTML, CSS, Bootstrap, SQL, Pandas and XAMPP for complete backend and frontend integration.',
    ],
    tags: ['Flask', 'SMTP', 'Pandas', 'SQL', 'Bootstrap', 'XAMPP'],
  },
  {
    kind: 'edu',
    type: 'feat(edu)',
    title: 'B.Tech in Computer Science',
    org: 'Jyothi Engineering College, Thrissur',
    date: 'Nov 2022 – Jul 2026',
    points: ['CGPA: 7.42 / 10'],
  },
  {
    kind: 'edu',
    type: 'init',
    title: 'School — ISC & ICSE',
    org: "St. Mary's E.M. School, Kozhikode",
    points: ['Class 12 (ISC): 82.50%', 'Class 10 (ICSE): 94.50%'],
  },
]

export interface Project {
  slug: string
  file: string
  title: string
  status?: string
  summary: string
  points: string[]
  stack: string[]
  /** Optional links — add a repo or demo URL here and the card shows it. */
  links?: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    slug: 'voice-to-code',
    file: 'voice-to-code/',
    title: 'Voice-to-Code Converter',
    summary:
      'An AI-powered system that turns natural-language voice commands into executable programming code.',
    points: [
      'Uses NLP to process voice commands and map spoken instructions to programming constructs.',
      "Intent recognition identifies the programming action the user means.",
      'Context-aware: commands are interpreted against the existing code and previous instructions.',
    ],
    stack: ['NLP', 'Intent recognition', 'Voice commands'],
  },
  {
    slug: 'attendance-app',
    file: 'attendance_app/',
    title: 'Attendance App',
    summary:
      'Lets faculty record student attendance and automatically emails students whose attendance is low.',
    points: [
      'HTML and CSS interface designed to be simple and easy to use.',
      'XAMPP and MySQL manage student records, attendance data and database operations.',
      'Calculates attendance percentages and sends SMTP email alerts to students who fall behind.',
    ],
    stack: ['Python', 'MySQL', 'XAMPP', 'SMTP', 'HTML/CSS'],
  },
  {
    slug: 'currency-detection',
    file: 'currency_detector/',
    title: 'Currency Detection Web App',
    status: 'In progress',
    summary:
      'A computer-vision web app that identifies currencies from images and works out their denominations.',
    points: [
      'Image classification model to recognise different currencies from uploaded photos.',
      'Denomination recognition to read the value of the detected note.',
      'React interface for uploading images and viewing categorised prediction results.',
    ],
    stack: ['Python', 'TensorFlow / Keras', 'OpenCV', 'React'],
  },
]

export const sections = [
  { id: 'about', file: 'about.ts', label: 'About' },
  { id: 'skills', file: 'stack.json', label: 'Skills' },
  { id: 'journey', file: 'journey.log', label: 'Journey' },
  { id: 'projects', file: 'projects/', label: 'Projects' },
  { id: 'contact', file: 'contact.sh', label: 'Contact' },
] as const

export type SectionId = (typeof sections)[number]['id']
