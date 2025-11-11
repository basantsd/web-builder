'use client';

import { useState } from 'react';
import { CodeEditor } from '@/components/editor/code-editor';
import { LivePreview } from '@/components/editor/live-preview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { templates, getTemplatesByCategory, searchTemplates, applyTemplateVariables } from '@/lib/templates';
import { CodeTemplate } from '@/types/project';

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'tsx'>('tsx');
  const [code, setCode] = useState({
    html: '<div id="app">\n  <h1>Hello CodeForge AI!</h1>\n  <p>Start building amazing things.</p>\n</div>',
    css: 'body {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n#app {\n  background: white;\n  padding: 40px;\n  border-radius: 20px;\n  box-shadow: 0 20px 60px rgba(0,0,0,0.3);\n  text-align: center;\n}\n\nh1 {\n  color: #667eea;\n  font-size: 2.5rem;\n  margin-bottom: 10px;\n}',
    js: "console.log('Welcome to CodeForge AI Playground!');\n\nconst app = document.getElementById('app');\nconst heading = app.querySelector('h1');\n\nheading.addEventListener('click', () => {\n  heading.style.color = heading.style.color === 'rgb(102, 126, 234)' ? '#764ba2' : '#667eea';\n});",
    tsx: `import React from 'react';\n\nfunction App() {\n  return (\n    <div className="app">\n      <h1>Hello CodeForge AI!</h1>\n      <p>Start building amazing things.</p>\n    </div>\n  );\n}\n\nexport default App;`,
  });

  const [showTemplates, setShowTemplates] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [aiPrompt, setAIPrompt] = useState('');
  const [aiLoading, setAILoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('claude');
  const [qualityLevel, setQualityLevel] = useState('standard');

  const categories = ['ALL', 'COMPONENT', 'CRUD', 'AUTH', 'HOOK', 'FORM', 'LAYOUT', 'UTIL', 'DATABASE'];

  const filteredTemplates = searchQuery
    ? searchTemplates(searchQuery)
    : selectedCategory === 'ALL'
    ? templates
    : getTemplatesByCategory(selectedCategory);

  const handleTemplateSelect = (template: CodeTemplate) => {
    // For simplicity, insert template into tsx tab
    setCode({ ...code, tsx: template.code });
    setActiveTab('tsx');
    setShowTemplates(false);
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;

    setAILoading(true);
    try {
      const response = await fetch('/api/generate/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          taskType: 'code_generation',
          qualityLevel,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Extract code from response (remove markdown if present)
        let generatedCode = data.code;
        if (generatedCode.includes('```')) {
          const match = generatedCode.match(/```(?:\w+)?\n([\s\S]*?)\n```/);
          if (match) generatedCode = match[1];
        }

        setCode({ ...code, tsx: generatedCode });
        setActiveTab('tsx');
        setShowAIGenerator(false);
        alert(`Code generated successfully!\n\nProvider: ${data.provider}\nModel: ${data.model}\nCost: $${data.usage.totalCost.toFixed(4)}`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      alert('Failed to generate code. Please check console for details.');
    } finally {
      setAILoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg" />
              <h1 className="text-xl font-bold">CodeForge AI</h1>
            </a>
            <span className="text-gray-400">|</span>
            <h2 className="text-lg font-semibold text-gray-700">Playground</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowTemplates(!showTemplates)}>
              📚 Templates
            </Button>
            <Button size="sm" onClick={() => setShowAIGenerator(!showAIGenerator)}>
              ✨ Generate with AI
            </Button>
          </div>
        </div>
      </header>

      {/* Template Browser Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Template Library</CardTitle>
                  <CardDescription>Choose from {templates.length} production-ready templates</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowTemplates(false)}>
                  ✕
                </Button>
              </div>
              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:border-blue-400 transition-colors"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="text-sm">{template.description}</CardDescription>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          {template.category}
                        </span>
                        {template.framework && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                            {template.framework}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Generator Modal */}
      {showAIGenerator && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generate Code with AI</CardTitle>
                  <CardDescription>Describe what you want to build</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowAIGenerator(false)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">What do you want to create?</label>
                <textarea
                  className="w-full h-32 rounded-lg border border-gray-300 p-3 text-sm resize-none"
                  placeholder="Example: Create a React component for a modern login form with email and password fields, validation, and a submit button. Use Tailwind CSS for styling."
                  value={aiPrompt}
                  onChange={(e) => setAIPrompt(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quality Level</label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                    value={qualityLevel}
                    onChange={(e) => setQualityLevel(e.target.value)}
                  >
                    <option value="low">Low (Fast & Cheap)</option>
                    <option value="standard">Standard (Balanced)</option>
                    <option value="high">High (Best Quality)</option>
                    <option value="premium">Premium (Top Tier)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Estimated Cost</label>
                  <div className="flex h-10 items-center px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                    {qualityLevel === 'low' && '~$0.01-0.02'}
                    {qualityLevel === 'standard' && '~$0.03-0.05'}
                    {qualityLevel === 'high' && '~$0.08-0.12'}
                    {qualityLevel === 'premium' && '~$0.15-0.25'}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAIGenerate}
                disabled={!aiPrompt.trim() || aiLoading}
                className="w-full"
              >
                {aiLoading ? 'Generating...' : '✨ Generate Code'}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Make sure you have an AI API key configured in .env.local
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Code Editor</CardTitle>
                  <div className="flex gap-1">
                    {['html', 'css', 'js', 'tsx'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          activeTab === tab
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tab.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CodeEditor
                  value={code[activeTab]}
                  onChange={(value) => setCode({ ...code, [activeTab]: value || '' })}
                  language={activeTab === 'tsx' ? 'typescript' : activeTab === 'js' ? 'javascript' : activeTab}
                  height="600px"
                />
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <LivePreview html={code.html} css={code.css} javascript={code.js} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm">📚 Templates</CardTitle>
              <p className="text-2xl font-bold text-blue-600">{templates.length}</p>
              <CardDescription>Ready-to-use patterns</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-sm">🤖 AI Providers</CardTitle>
              <p className="text-2xl font-bold text-purple-600">3</p>
              <CardDescription>Claude, OpenAI, OpenRouter</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-sm">💰 Cost Savings</CardTitle>
              <p className="text-2xl font-bold text-green-600">90%</p>
              <CardDescription>vs. traditional AI tools</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
