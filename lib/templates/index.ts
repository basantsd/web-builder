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

  // CRUD Update
  {
    id: 'crud-update',
    name: 'Update Item (CRUD Update)',
    description: 'API route to update an existing item',
    category: 'CRUD',
    language: 'typescript',
    framework: 'Next.js',
    tags: ['crud', 'api', 'update', 'database', 'put'],
    usageCount: 0,
    variables: ['ModelName', 'modelName'],
    code: `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    const {{modelName}} = await prisma.{{modelName}}.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      data: {{modelName}},
      message: '{{ModelName}} updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update {{modelName}}', details: error.message },
      { status: 500 }
    );
  }
}`,
    exampleUsage: 'ModelName=Post, modelName=post',
  },

  // CRUD Delete
  {
    id: 'crud-delete',
    name: 'Delete Item (CRUD Delete)',
    description: 'API route to delete an item by ID',
    category: 'CRUD',
    language: 'typescript',
    framework: 'Next.js',
    tags: ['crud', 'api', 'delete', 'database'],
    usageCount: 0,
    variables: ['ModelName', 'modelName'],
    code: `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.{{modelName}}.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: '{{ModelName}} deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete {{modelName}}', details: error.message },
      { status: 500 }
    );
  }
}`,
    exampleUsage: 'ModelName=Post, modelName=post',
  },

  // Signup API
  {
    id: 'auth-signup-api',
    name: 'Signup/Register API Route',
    description: 'User registration endpoint with password hashing',
    category: 'AUTH',
    language: 'typescript',
    framework: 'Next.js',
    tags: ['auth', 'signup', 'register', 'api', 'security'],
    usageCount: 0,
    variables: [],
    code: `import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/database/prisma';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      message: 'User created successfully',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Registration failed', details: error.message },
      { status: 500 }
    );
  }
}`,
  },

  // useDebounce Hook
  {
    id: 'hook-use-debounce',
    name: 'useDebounce Hook',
    description: 'React hook to debounce a value for search/input optimization',
    category: 'HOOK',
    language: 'typescript',
    framework: 'React',
    tags: ['react', 'hook', 'debounce', 'optimization', 'search'],
    usageCount: 0,
    variables: [],
    code: `import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage example:
// const searchTerm = 'example';
// const debouncedSearch = useDebounce(searchTerm, 500);
//
// useEffect(() => {
//   // API call with debouncedSearch
// }, [debouncedSearch]);`,
  },

  // useFetch Hook
  {
    id: 'hook-use-fetch',
    name: 'useFetch Hook',
    description: 'React hook for API calls with loading and error states',
    category: 'HOOK',
    language: 'typescript',
    framework: 'React',
    tags: ['react', 'hook', 'fetch', 'api', 'loading'],
    usageCount: 0,
    variables: [],
    code: `import { useEffect, useState } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}`,
  },

  // Contact Form Component
  {
    id: 'form-contact',
    name: 'Contact Form Component',
    description: 'Complete contact form with validation and submission',
    category: 'FORM',
    language: 'typescript',
    framework: 'React',
    tags: ['form', 'contact', 'validation', 'email'],
    usageCount: 0,
    variables: [],
    code: `'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6 text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
          <p className="text-gray-600">We'll get back to you soon.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>Send us a message and we'll respond as soon as possible</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <textarea
              className="w-full min-h-[150px] rounded-lg border border-gray-300 p-3 text-sm"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}`,
  },

  // Card Grid Component
  {
    id: 'component-card-grid',
    name: 'Card Grid Component',
    description: 'Responsive grid of cards for displaying items',
    category: 'COMPONENT',
    language: 'typescript',
    framework: 'React',
    tags: ['component', 'grid', 'cards', 'responsive', 'layout'],
    usageCount: 0,
    variables: ['ItemType'],
    code: `'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface {{ItemType}} {
  id: string;
  title: string;
  description: string;
  image?: string;
}

interface CardGridProps {
  items: {{ItemType}}[];
  onItemClick?: (item: {{ItemType}}) => void;
}

export function CardGrid({ items, onItemClick }: CardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card
          key={item.id}
          className="cursor-pointer hover:border-blue-400 transition-colors"
          onClick={() => onItemClick?.(item)}
        >
          {item.image && (
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}

      {items.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          No items to display
        </div>
      )}
    </div>
  );
}`,
    exampleUsage: 'ItemType=Product, Project, BlogPost, etc.',
  },

  // Protected Route Component
  {
    id: 'component-protected-route',
    name: 'Protected Route Component',
    description: 'HOC for protecting routes with authentication',
    category: 'COMPONENT',
    language: 'typescript',
    framework: 'React',
    tags: ['auth', 'protected', 'route', 'hoc', 'security'],
    usageCount: 0,
    variables: [],
    code: `'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          router.push('/login');
          return;
        }

        // Verify token with API
        const response = await fetch('/api/auth/verify', {
          headers: { Authorization: \`Bearer \${token}\` },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (error) {
        setIsAuthenticated(false);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}`,
  },

  // JWT Middleware
  {
    id: 'util-jwt-middleware',
    name: 'JWT Auth Middleware',
    description: 'Middleware for verifying JWT tokens in API routes',
    category: 'UTIL',
    language: 'typescript',
    framework: 'Next.js',
    tags: ['auth', 'jwt', 'middleware', 'security', 'api'],
    usageCount: 0,
    variables: [],
    code: `import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
  };
}

export async function authMiddleware(
  request: NextRequest,
  handler: (req: AuthRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        email: string;
      };

      // Add user to request
      (request as AuthRequest).user = decoded;

      return await handler(request as AuthRequest);
    } catch (err) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Usage in API route:
// export async function GET(request: NextRequest) {
//   return authMiddleware(request, async (req) => {
//     const userId = req.user?.userId;
//     // Your authenticated logic here
//   });
// }`,
  },

  // Pagination Component
  {
    id: 'component-pagination',
    name: 'Pagination Component',
    description: 'Reusable pagination component with page numbers',
    category: 'COMPONENT',
    language: 'typescript',
    framework: 'React',
    tags: ['pagination', 'component', 'navigation', 'ui'],
    usageCount: 0,
    variables: [],
    code: `'use client';

import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftSiblingIndex = Math.max(currentPage - 1, 1);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        for (let i = 1; i <= Math.min(maxVisible - 1, totalPages); i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        pages.push(1);
        pages.push('...');
        for (let i = Math.max(totalPages - maxVisible + 2, 2); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {pages.map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="px-3 py-1 text-gray-400">...</span>
          ) : (
            <Button
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </Button>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
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
