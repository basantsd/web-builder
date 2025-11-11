// Project DNA and Project Types

export interface ProjectDNA {
  projectId: string;
  techStack: {
    frontend: {
      framework: string; // React, Vue, Angular, Next.js, etc.
      language: string; // TypeScript, JavaScript
      styling: string; // Tailwind, CSS Modules, Styled Components
      uiLibrary?: string; // shadcn/ui, MUI, Chakra, etc.
    };
    backend: {
      runtime: string; // Node.js, Deno, Bun
      framework: string; // Express, Fastify, Next.js API, Hono
      language: string; // TypeScript, JavaScript
    };
    database: {
      primary: string; // PostgreSQL, MySQL, MongoDB, SQLite
      orm?: string; // Prisma, Drizzle, TypeORM
      cache?: string; // Redis, Memcached
    };
  };
  architecture: {
    structure: string; // monorepo, mono, microservices
    pattern: string; // MVC, MVVM, Clean Architecture
    namingConventions: {
      files: string; // kebab-case, camelCase, PascalCase
      variables: string; // camelCase, snake_case
      components: string; // PascalCase
      constants: string; // UPPER_SNAKE_CASE
    };
    folderStructure: string[]; // Array of folder paths
  };
  features: string[]; // List of features (auth, payments, email, etc.)
  designSystem: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      foreground: string;
      muted: string;
      border: string;
    };
    typography: {
      fontFamily: string;
      headingFont?: string;
      fontSize: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
      };
    };
    spacing: string; // 4px, 8px base
    borderRadius: string; // 0px, 4px, 8px
  };
  codingStandards: {
    linter: string; // ESLint, Biome
    formatter: string; // Prettier, Biome
    testing: string; // Vitest, Jest, Playwright
    commitStyle: string; // Conventional Commits, etc.
    codeStyle: {
      maxLineLength: number;
      semicolons: boolean;
      quotes: 'single' | 'double';
      trailingComma: 'all' | 'es5' | 'none';
      tabWidth: number;
      useTabs: boolean;
    };
  };
  dependencies: {
    production: Record<string, string>;
    development: Record<string, string>;
  };
  environment: {
    nodeVersion: string;
    packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
  };
  createdAt: string;
  updatedAt: string;
  version: string;
}

export interface ProjectSetupForm {
  name: string;
  description?: string;
  type: 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'api';
  framework: string;
  styling: string;
  database?: string;
  features: string[];
  template?: string;
}

export interface ProjectContext {
  id: string;
  name: string;
  dna: ProjectDNA;
  files: Array<{
    path: string;
    content: string;
    language: string;
  }>;
  currentFile?: string;
}

export type TemplateCategory =
  | 'CRUD'
  | 'AUTH'
  | 'COMPONENT'
  | 'API'
  | 'DATABASE'
  | 'FORM'
  | 'LAYOUT'
  | 'HOOK'
  | 'UTIL';

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  code: string;
  variables: string[]; // Variable names to be replaced
  tags: string[];
  language: string;
  framework?: string;
  usageCount: number;
  exampleUsage?: string;
}
