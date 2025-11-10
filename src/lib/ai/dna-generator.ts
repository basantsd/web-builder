// Project DNA Generator using AI

import { aiRouter } from './ai-router';
import { ProjectDNA, ProjectSetupForm } from '@/types/project';
import { TaskConfig } from '@/types/ai';

export class DNAGenerator {
  async generateProjectDNA(form: ProjectSetupForm): Promise<ProjectDNA> {
    const prompt = this.buildDNAPrompt(form);

    const taskConfig: TaskConfig = {
      type: 'complex_reasoning',
      qualityLevel: 'standard',
      maxCost: 0.5, // Maximum $0.50 for DNA generation
    };

    const response = await aiRouter.chat(taskConfig, {
      messages: [
        {
          role: 'system',
          content: `You are an expert software architect. Generate a comprehensive Project DNA document in JSON format.
The DNA should include complete tech stack decisions, architecture patterns, naming conventions, design system,
coding standards, and all necessary configuration. Be specific and detailed. Output ONLY valid JSON, no markdown, no explanation.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    try {
      // Remove markdown code blocks if present
      let jsonString = response.content.trim();
      if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }

      const dna: ProjectDNA = JSON.parse(jsonString);

      // Ensure required fields exist
      if (!dna.projectId) {
        dna.projectId = this.generateId();
      }
      if (!dna.createdAt) {
        dna.createdAt = new Date().toISOString();
      }
      if (!dna.updatedAt) {
        dna.updatedAt = new Date().toISOString();
      }
      if (!dna.version) {
        dna.version = '1.0.0';
      }

      return dna;
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
      // Fallback to template-based DNA
      return this.generateFallbackDNA(form);
    }
  }

  private buildDNAPrompt(form: ProjectSetupForm): string {
    return `
Generate a Project DNA for the following project:

**Project Details:**
- Name: ${form.name}
- Description: ${form.description || 'Not provided'}
- Type: ${form.type}
- Framework: ${form.framework}
- Styling: ${form.styling}
${form.database ? `- Database: ${form.database}` : ''}
- Features: ${form.features.join(', ')}

**Requirements:**
1. Choose appropriate tech stack based on the framework and project type
2. Define a clear architecture pattern
3. Establish naming conventions for files, variables, components, and constants
4. Create a comprehensive folder structure
5. Define a cohesive design system (colors, typography, spacing)
6. Set coding standards (linter, formatter, testing framework)
7. List necessary dependencies
8. Set environment requirements

Generate a complete ProjectDNA JSON object with all these details. Be specific and production-ready.
`;
  }

  private generateFallbackDNA(form: ProjectSetupForm): ProjectDNA {
    const projectId = this.generateId();

    return {
      projectId,
      techStack: {
        frontend: {
          framework: form.framework || 'React',
          language: 'TypeScript',
          styling: form.styling || 'Tailwind CSS',
          uiLibrary: 'shadcn/ui',
        },
        backend: {
          runtime: 'Node.js',
          framework: form.type === 'fullstack' ? 'Next.js API' : 'Express',
          language: 'TypeScript',
        },
        database: {
          primary: form.database || 'PostgreSQL',
          orm: 'Prisma',
          cache: 'Redis',
        },
      },
      architecture: {
        structure: 'monorepo',
        pattern: 'Feature-based',
        namingConventions: {
          files: 'kebab-case',
          variables: 'camelCase',
          components: 'PascalCase',
          constants: 'UPPER_SNAKE_CASE',
        },
        folderStructure: [
          'src/app',
          'src/components/ui',
          'src/components/features',
          'src/lib',
          'src/hooks',
          'src/types',
          'src/store',
          'prisma',
          'public',
          'tests',
        ],
      },
      features: form.features,
      designSystem: {
        colors: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          accent: '#f59e0b',
          background: '#ffffff',
          foreground: '#0a0a0a',
          muted: '#f1f5f9',
          border: '#e2e8f0',
        },
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
          },
        },
        spacing: '8px',
        borderRadius: '8px',
      },
      codingStandards: {
        linter: 'ESLint',
        formatter: 'Prettier',
        testing: 'Vitest',
        commitStyle: 'Conventional Commits',
        codeStyle: {
          maxLineLength: 100,
          semicolons: true,
          quotes: 'single',
          trailingComma: 'all',
          tabWidth: 2,
          useTabs: false,
        },
      },
      dependencies: {
        production: {
          react: '^18.3.0',
          'next': '^14.0.0',
          '@prisma/client': '^5.0.0',
          'zustand': '^4.0.0',
        },
        development: {
          typescript: '^5.0.0',
          '@types/react': '^18.0.0',
          '@types/node': '^20.0.0',
          'prettier': '^3.0.0',
          'eslint': '^8.0.0',
        },
      },
      environment: {
        nodeVersion: '20.x',
        packageManager: 'npm',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  private generateId(): string {
    return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async compressDNA(dna: ProjectDNA): Promise<string> {
    // Compress DNA for storage/transmission
    const jsonString = JSON.stringify(dna);

    // In production, you might use actual compression like gzip
    // For now, just return minified JSON
    return jsonString;
  }

  async decompressDNA(compressed: string): Promise<ProjectDNA> {
    try {
      return JSON.parse(compressed);
    } catch (error) {
      throw new Error('Failed to decompress Project DNA');
    }
  }
}

export const dnaGenerator = new DNAGenerator();
