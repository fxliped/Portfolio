/**
 * Single source of truth for everything that isn't a case study.
 *
 * Populated from Felipe_Duenas_Resume.pdf (read 2026-08-14). Case studies live as
 * MDX in src/content/work/ — edit those separately.
 */

export const site = {
  name: "Felipe Duenas",
  initials: "FD",
  role: "Software Engineer · Data Engineering and Applied AI",
  positioning: "Software that enlivens data for intelligent decisions",
  /** One quiet line under the intro — the facts people scan for first. */
  subline: "Statistics & Data Science, UCLA '27",
  location: "SF Bay Area | Los Angeles",
  email: "duenasfd@gmail.com",
  resumePath: "/resume.pdf",

  /**
   * Photo for the ASCII portrait in the hero.
   *
   * Points at the derived web copy, not the camera original. portrait.jpeg is a
   * 24-megapixel 2.6 MB file carrying an EXIF rotation flag; the canvas samples it
   * down to ~70 characters wide, so shipping the original was 2.5 MB of waste and
   * left the orientation up to the browser. Regenerate after replacing the photo:
   *
   *   python3 -c "from PIL import Image, ImageOps; \
   *     im=ImageOps.exif_transpose(Image.open('public/portrait.jpeg')).convert('RGB'); \
   *     s=1400/max(im.size); \
   *     im.resize((round(im.width*s), round(im.height*s)), Image.LANCZOS) \
   *       .save('public/portrait-web.jpg', quality=82, optimize=True)"
   */
  portraitPath: "/portrait-web.jpg",

  currently:
    "At AWS that means the data infrastructure and pipeline logic for a supply chain automation platform — along with the agentic work so the platform's agent doesn't just sound better, it drives results.",

  intro: [
    "I'm a software engineer who specializes in data. At AWS that means the data infrastructure and pipeline logic for a supply chain automation platform — along with the agentic work so the platform's agent doesn't just sound better, it drives results.",
  ],

  links: [
    { label: "GitHub", href: "https://github.com/fxliped", icon: "github" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/felipe-duenas-b22974243",
      icon: "linkedin",
    },
    { label: "Email", href: "mailto:duenasfd@gmail.com", icon: "mail" },
  ],
} as const;

/**
 * Hero stat tiles. `value` counts up on scroll; `display` renders verbatim for
 * figures a counter can't animate (ranges, before/after).
 */
export interface Stat {
  value?: number;
  display?: string;
  prefix?: string;
  suffix?: string;
  label: string;
  hint: string;
}

export const stats: Stat[] = [
  {
    value: 3000,
    suffix: "+",
    label: "Tableau workbooks pipelined",
    hint: "into an AI-ready knowledge base",
  },
  {
    value: 45,
    suffix: "%",
    label: "More queryable data",
    hint: "for an internal agentic-AI platform",
  },
  {
    display: "3d → 4min",
    label: "Dashboard build time",
    hint: "generated from a prompt",
  },
  {
    value: 400,
    prefix: "$",
    suffix: "K",
    label: "Cost savings identified",
    hint: "across 12 availability zones",
  },
];

export interface Role {
  company: string;
  team: string;
  title: string;
  period: string;
  /** Short form for the logo strip, e.g. "2026 —". */
  years: string;
  location: string;
  current: boolean;
  /**
   * Two per role, deliberately. The full account of each project is its case
   * study — a four-bullet wall here just reprints the résumé.
   */
  bullets: string[];
  /** Kept for reference; the timeline stopped rendering these to cut noise. */
  stack: string[];
  /**
   * Whether to flatten the logo to one ink colour. True suits a wordmark. Set
   * false for anything with fine internal detail — UCLA's seal flattens to a solid
   * dot at 28px, and its blue reads cleanly against both themes as-is.
   */
  logoMono?: boolean;
  /**
   * Optional logo dropped into public/logos/ (SVG preferred, or 2x PNG).
   * Falls back to the company name set in the display serif, which looks
   * deliberate rather than broken — so the strip works before you add any.
   */
  logo?: string;
}

export const experience: Role[] = [
  {
    company: "Amazon Web Services",
    logo: "/logos/aws.png",
    team: "Data Platform",
    years: "2026 —",
    title: "Software Engineer Intern",
    period: "May 2026 — Present",
    location: "Seattle, WA",
    current: true,
    bullets: [
      "The org's operational knowledge lived in 3,000+ Tableau dashboards that no software could read. I built the pipeline that turned them into something an AI agent can answer from — 45% more of the org's data became reachable, and the accuracy gain traced to the data, not the prompt.",
      "Then went the other direction: tooling on LangGraph and MCP that takes a sentence and gives back a dashboard. Three days of work, down to four minutes.",
    ],
    stack: ["Python", "Airflow", "Tableau", "Redshift", "LangGraph", "MCP"],
  },
  {
    company: "UCLA Trustworthy AI Labs",
    logo: "/logos/ucla.png",
    logoMono: false,
    team: "Agentic Data Science",
    years: "2026",
    title: "Backend & AI Engineer Intern",
    period: "Jan 2026 — May 2026",
    location: "Los Angeles, CA",
    current: false,
    bullets: [
      "Built an agent that plans and runs a whole analysis from a plain-language question — 71% task completion on the BIRD benchmark, eight points above GPT-4o.",
      "The interesting part was the harness that told us why it failed: 34 schemas, 120+ question types, and three architectural fixes worth +11% that we'd never have found from a pass/fail score.",
    ],
    stack: [
      "Python",
      "AWS Lambda",
      "API Gateway",
      "CDK",
      "Docker",
      "PostgreSQL",
    ],
  },
  {
    company: "Amazon Web Services",
    team: "",
    years: "2025",
    title: "Business Intelligence Engineer Intern",
    period: "Jun 2025 — Sep 2025",
    location: "Arlington, VA",
    current: false,
    bullets: [
      "Forecast data center power well enough to see what the old error band hid: 1.9% MAE against a 6.3% baseline, which surfaced the under-usage behind a $400K savings initiative across 12 availability zones.",
      "Also did the plumbing — 500M+ daily telemetry events through dbt and Redshift, and a weekly report that took six hours now takes thirty minutes.",
    ],
    stack: ["Python", "dbt", "Redshift", "Tableau", "scikit-learn", "SQL"],
  },
  {
    company: "Acer",
    logo: "/logos/acer.png",
    team: "",
    years: "2024",
    title: "Data Analyst Intern",
    period: "Jun 2024 — Sep 2024",
    location: "San Jose, CA",
    current: false,
    bullets: [
      "Twenty years of records scattered across Oracle, SharePoint, and spreadsheets, pulled into one model that cut cross-team query time by 35%.",
      "Reconciling 12,000+ IT assets turned up a $22K licensing discrepancy nobody had noticed. It was fixed within one billing cycle.",
    ],
    stack: ["SQL", "Oracle DB", "Tableau", "Excel", "SharePoint"],
  },
];

/**
 * Logo for an organisation name, for the case-study panels.
 *
 * Derived from `experience` rather than duplicated, so a logo added to the timeline
 * shows up on the work panels too and the two can't disagree. Case studies name
 * their org as a plain string, which is the only join key available.
 */
export function orgLogo(
  org: string,
): { src: string; mono: boolean } | undefined {
  const role = experience.find((r) => r.company === org && r.logo);
  return role?.logo
    ? { src: role.logo, mono: role.logoMono !== false }
    : undefined;
}

/**
 * Deliberately short. This was five groups and 35 entries, which reads as a
 * keyword list — the point is what I reach for first, not everything I've touched.
 */
export const skills = [
  {
    group: "Languages",
    items: ["Python", "SQL", "Java", "R", "Bash"],
  },
  {
    group: "Cloud",
    items: ["AWS", "GCP", "Redshift", "Snowflake", "S3", "Lambda", "Bedrock"],
  },
  {
    group: "Data platform",
    items: ["Airflow", "dbt", "Spark", "Docker", "Terraform", "CDK"],
  },
  {
    group: "Applied AI",
    items: [
      "Claude",
      "LangGraph",
      "MCP",
      "RAG",
      "Retrieval evaluation",
      "Vector databases",
    ],
  },
  {
    group: "Modeling",
    items: [
      "scikit-learn",
      "PyTorch",
      "Forecasting",
      "Anomaly detection",
      "NLP",
    ],
  },
] as const;

/**
 * Lab — things built outside work. Kept short on purpose: three, one line each,
 * no invented metrics. Copy is drawn from each repo's README and file tree, so
 * it says what the code actually does. The `note` under the heading says these
 * are personal and course projects, which is why the bar is different from the
 * case studies above.
 *
 * `accent` cycles the local colour; `preview` is an optional image in public/lab/.
 */
export interface LabProject {
  title: string;
  /** One line. Punchy beats complete. */
  blurb: string;
  /** What it demonstrates — the three lanes I'm aiming at. */
  lane: string;
  tags: string[];
  repo: string;
  accent: "accent-blue" | "accent-orange" | "accent-purple";
  /** Key into components/pixel/LabFigure.astro — the panel's 8-bit figure. */
  figure: "data-pipe" | "agent-game" | "market-lstm";
}

export const lab: LabProject[] = [
  {
    title: "Event demand intelligence",
    blurb:
      "A real pipeline, end to end: paged event data out of an API into S3, staged into Snowflake, modelled in dbt down to daily attendance by country and category — the whole thing on an Airflow DAG in Docker Compose.",
    lane: "Data engineering",
    tags: ["Airflow", "dbt", "Snowflake", "S3", "Docker"],
    repo: "https://github.com/fxliped/event-demand-intelligence",
    accent: "accent-blue",
    figure: "data-pipe",
  },
  {
    title: "Autonomous reasoning agent",
    blurb:
      "ReAct agents that play repeated games and then read their own transcripts. An offline judge finds where the reasoning went wrong and writes a lesson the next run gets in its prompt. Team project of four.",
    lane: "Applied AI · evaluation",
    tags: ["Python", "ReAct", "Gemini", "Tracing"],
    repo: "https://github.com/fxliped/Autonomous-Reasoning-Agent",
    accent: "accent-orange",
    figure: "agent-game",
  },
  {
    title: "Asset Edge",
    blurb:
      "A finance research app I built to learn the whole stack: RAG over SEC filings and news, an LSTM taking a swing at the next hour of price, FastAPI behind a React front end.",
    lane: "Applied AI · full stack",
    tags: ["FastAPI", "React", "LangChain", "ChromaDB", "PyTorch"],
    repo: "https://github.com/fxliped/GenAI-Finance-Engine",
    accent: "accent-purple",
    figure: "market-lstm",
  },
];

export const education = [
  {
    school: "University of California, Los Angeles",
    degree: "B.S. Statistics & Data Science · Minor in Data Engineering",
    period: "Expected March 2027",
  },
] as const;
