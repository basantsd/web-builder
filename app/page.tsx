'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProjectSetupForm } from '@/types/project';

export default function Home() {
  const [step, setStep] = useState<'landing' | 'create'>('landing');
  const [loading, setLoading] = useState(false);
  const [projectForm, setProjectForm] = useState<Partial<ProjectSetupForm>>({
    type: 'fullstack',
    framework: 'Next.js',
    styling: 'Tailwind CSS',
    features: [],
  });

  const handleCreateProject = async () => {
    setLoading(true);
    // TODO: Call API to generate DNA and create project
    setTimeout(() => {
      setLoading(false);
      alert('Project DNA generated! (API integration pending)');
    }, 2000);
  };

  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg" />
              <h1 className="text-xl font-bold">CodeForge AI</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Button variant="ghost" size="sm">Features</Button>
              <Button variant="ghost" size="sm">Pricing</Button>
              <Button variant="ghost" size="sm">Docs</Button>
              <Button size="sm">Sign In</Button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              Multi-Provider AI • 90% Cost Savings
            </div>

            <h1 className="text-6xl font-bold tracking-tight">
              Build Full-Stack Apps with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Power
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Generate production-ready code with built-in testing, advanced memory, and smart routing
              across Claude, OpenAI, and OpenRouter. Save 90% on AI costs.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button size="lg" onClick={() => setStep('create')}>
                Start Building Now
              </Button>
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-20">
              <Card className="border-2 hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl">Multi-Provider AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Switch between Claude, OpenAI, and OpenRouter seamlessly. Smart routing picks the best model for each task.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-purple-300 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl">Built-in Testing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Browser automation with Playwright. Record, replay, and generate tests automatically.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-green-300 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl">90% Cost Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Template-first routing, prompt optimization, and smart caching reduce AI costs dramatically.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Tech Stack */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Powered by industry-leading technology</p>
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <span className="text-gray-400 font-semibold">Next.js 14</span>
                <span className="text-gray-400 font-semibold">TypeScript</span>
                <span className="text-gray-400 font-semibold">Claude AI</span>
                <span className="text-gray-400 font-semibold">OpenAI</span>
                <span className="text-gray-400 font-semibold">Playwright</span>
                <span className="text-gray-400 font-semibold">Prisma</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Project Creation Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button variant="ghost" onClick={() => setStep('landing')} className="mb-6">
          ← Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>
              Tell us about your project and we'll generate a comprehensive Project DNA with AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
              <Input
                placeholder="My Awesome App"
                value={projectForm.name || ''}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Input
                placeholder="A brief description of your project"
                value={projectForm.description || ''}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Type</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={projectForm.type}
                  onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value as any })}
                >
                  <option value="fullstack">Full-Stack</option>
                  <option value="frontend">Frontend Only</option>
                  <option value="backend">Backend Only</option>
                  <option value="api">API</option>
                  <option value="mobile">Mobile App</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Framework</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={projectForm.framework}
                  onChange={(e) => setProjectForm({ ...projectForm, framework: e.target.value })}
                >
                  <option value="Next.js">Next.js</option>
                  <option value="React">React</option>
                  <option value="Vue">Vue.js</option>
                  <option value="Angular">Angular</option>
                  <option value="Express">Express</option>
                  <option value="Fastify">Fastify</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Styling</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={projectForm.styling}
                  onChange={(e) => setProjectForm({ ...projectForm, styling: e.target.value })}
                >
                  <option value="Tailwind CSS">Tailwind CSS</option>
                  <option value="CSS Modules">CSS Modules</option>
                  <option value="Styled Components">Styled Components</option>
                  <option value="Emotion">Emotion</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Database</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={projectForm.database}
                  onChange={(e) => setProjectForm({ ...projectForm, database: e.target.value })}
                >
                  <option value="">None</option>
                  <option value="PostgreSQL">PostgreSQL</option>
                  <option value="MySQL">MySQL</option>
                  <option value="MongoDB">MongoDB</option>
                  <option value="SQLite">SQLite</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Features (Select all that apply)</label>
              <div className="grid md:grid-cols-2 gap-2">
                {['Authentication', 'Payments', 'Email', 'File Upload', 'Real-time', 'Search', 'Analytics', 'API'].map((feature) => (
                  <label key={feature} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={projectForm.features?.includes(feature)}
                      onChange={(e) => {
                        const features = projectForm.features || [];
                        if (e.target.checked) {
                          setProjectForm({ ...projectForm, features: [...features, feature] });
                        } else {
                          setProjectForm({ ...projectForm, features: features.filter((f) => f !== feature) });
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreateProject}
                disabled={!projectForm.name || loading}
                className="flex-1"
              >
                {loading ? 'Generating DNA...' : 'Create Project with AI'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
