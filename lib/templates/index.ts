// Code Template Library

import { CodeTemplate } from '@/types/project';

export const templates: CodeTemplate[] = [
  // React Components
  {
    id: 'react-component-functional',
    name: 'React Functional Component',
    description: 'Basic functional component with TypeScript',
    category: 'COMPONENT',
    language: 'typescript',
    framework: 'React',
    tags: ['react', 'typescript', 'component', 'functional'],
    usageCount: 0,
    variables: ['ComponentName', 'props'],
    code: `import React from 'react';

interface {{ComponentName}}Props {
  {{props}}
}

export const {{ComponentName}}: React.FC<{{ComponentName}}Props> = ({ {{props}} }) => {
  return (
    <div className="{{ComponentName}}">
      {/* Component content */}
    </div>
  );
};`,
    exampleUsage: 'ComponentName=Button, props=onClick: () => void; children: React.ReactNode',
  },

  // CRUD Operations
  {
    id: 'crud-read-all',
    name: 'Get All Items (CRUD Read)',
    description: 'API route to fetch all items from database',
    category: 'CRUD',
    language: 'typescript',
    framework: 'Next.js',
    tags: ['crud', 'api', 'read', 'database'],
    usageCount: 0,
    variables: ['ModelName', 'modelName'],
    code: `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';

export async function GET(request: NextRequest) {
  try {
    const {{modelName}}s = await prisma.{{modelName}}.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: {{modelName}}s,
      count: {{modelName}}s.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch {{modelName}}s', details: error.message },
      { status: 500 }
    );
  }
}`,
    exampleUsage: 'ModelName=User, modelName=user',
  },

  {
    id: 'crud-create',
    name: 'Create Item (CRUD Create)',
    description: 'API route to create a new item',
    category: 'CRUD',
    language: 'typescript',
    framework: 'Next.js',
    tags: ['crud', 'api', 'create', 'database'],
    usageCount: 0,
    variables: ['ModelName', 'modelName', 'fields'],
    code: `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { {{fields}} } = body;

    const {{modelName}} = await prisma.{{modelName}}.create({
      data: {
        {{fields}},
      },
    });

    return NextResponse.json({
      success: true,
      data: {{modelName}},
      message: '{{ModelName}} created successfully',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create {{modelName}}', details: error.message },
      { status: 500 }
    );
  }
}`,
    exampleUsage: 'ModelName=Post, modelName=post, fields=title, content, authorId',
  },

  // Authentication
  {
    id: 'auth-login-api',
    name: 'Login API Route',
    description: 'Authentication endpoint for user login',
    category: 'AUTH',
    language: 'typescript',
    framework: 'Next.js',
    tags: ['auth', 'login', 'api', 'security'],
    usageCount: 0,
    variables: [],
    code: `import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/database/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Login failed', details: error.message },
      { status: 500 }
    );
  }
}`,
  },

  // Custom Hooks
  {
    id: 'hook-use-local-storage',
    name: 'useLocalStorage Hook',
    description: 'React hook for persistent state with localStorage',
    category: 'HOOK',
    language: 'typescript',
    framework: 'React',
    tags: ['react', 'hook', 'localstorage', 'state'],
    usageCount: 0,
    variables: [],
    code: `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}`,
  },

  // Forms
  {
    id: 'form-login',
    name: 'Login Form Component',
    description: 'Complete login form with validation',
    category: 'FORM',
    language: 'typescript',
    framework: 'React',
    tags: ['form', 'auth', 'login', 'validation'],
    usageCount: 0,
    variables: [],
    code: `'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}`,
  },

  // API Utilities
  {
    id: 'util-api-handler',
    name: 'API Error Handler',
    description: 'Centralized error handling for API routes',
    category: 'UTIL',
    language: 'typescript',
    framework: 'Next.js',
    tags: ['api', 'error', 'handler', 'utility'],
    usageCount: 0,
    variables: [],
    code: `import { NextResponse } from 'next/server';

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}

export async function withErrorHandler<T>(
  handler: () => Promise<T>
): Promise<T | NextResponse> {
  try {
    return await handler();
  } catch (error) {
    return handleAPIError(error);
  }
}`,
  },

  // Database Schema
  {
    id: 'database-schema-user',
    name: 'User Schema (Prisma)',
    description: 'Complete user model with authentication',
    category: 'DATABASE',
    language: 'prisma',
    tags: ['database', 'prisma', 'user', 'auth'],
    usageCount: 0,
    variables: [],
    code: `model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          String    @default("USER")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]

  @@index([email])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}`,
  },

  // Layout Components
  {
    id: 'layout-dashboard',
    name: 'Dashboard Layout',
    description: 'Responsive dashboard layout with sidebar',
    category: 'LAYOUT',
    language: 'typescript',
    framework: 'React',
    tags: ['layout', 'dashboard', 'sidebar', 'responsive'],
    usageCount: 0,
    variables: [],
    code: `'use client';

import { useState } from 'react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={\`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform \${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}\`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {/* Navigation items */}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={\`\${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all\`}>
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}`,
  },

  // API Response Format
  {
    id: 'util-api-response',
    name: 'Standard API Response',
    description: 'Consistent API response format utility',
    category: 'UTIL',
    language: 'typescript',
    framework: 'Next.js',
    tags: ['api', 'response', 'utility', 'standard'],
    usageCount: 0,
    variables: [],
    code: `import { NextResponse } from 'next/server';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json({
    success: true,
    data,
    message,
  } as APIResponse<T>, { status });
}

export function errorResponse(error: string, status = 400) {
  return NextResponse.json({
    success: false,
    error,
  } as APIResponse, { status });
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
) {
  return NextResponse.json({
    success: true,
    data,
    meta: { page, limit, total },
  } as APIResponse<T[]>);
}`,
  },
];

// Template search and retrieval
export function getTemplateById(id: string): CodeTemplate | undefined {
  return templates.find((t) => t.id === id);
}

export function searchTemplates(query: string): CodeTemplate[] {
  const lowerQuery = query.toLowerCase();
  return templates.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some((tag) => tag.includes(lowerQuery))
  );
}

export function getTemplatesByCategory(category: string): CodeTemplate[] {
  return templates.filter((t) => t.category === category);
}

export function getTemplatesByFramework(framework: string): CodeTemplate[] {
  return templates.filter((t) => t.framework === framework);
}

// Template variable substitution
export function applyTemplateVariables(
  template: CodeTemplate,
  variables: Record<string, string>
): string {
  let code = template.code;

  // Replace all variables
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    code = code.replace(regex, value);
  });

  return code;
}
