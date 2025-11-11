'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUsageStore } from '@/lib/store/usage-store';

export default function DashboardPage() {
  const {
    records,
    getTotalCost,
    getTotalCalls,
    getCostByProvider,
    getCostByModel,
    getCallsByTaskType,
    getSavingsVsTraditional,
    clearRecords,
  } = useUsageStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const totalCost = getTotalCost();
  const totalCalls = getTotalCalls();
  const costByProvider = getCostByProvider();
  const costByModel = getCostByModel();
  const callsByTaskType = getCallsByTaskType();
  const savings = getSavingsVsTraditional();
  const avgCostPerCall = totalCalls > 0 ? totalCost / totalCalls : 0;

  const providers = Object.keys(costByProvider);
  const taskTypes = Object.keys(callsByTaskType);

  // Recent activity (last 5 records)
  const recentActivity = [...records].reverse().slice(0, 5);

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
            <h2 className="text-lg font-semibold text-gray-700">Usage Dashboard</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/playground'}>
              Go to Playground
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm('Clear all usage data?')) {
                  clearRecords();
                }
              }}
            >
              Clear Data
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {totalCalls === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>No Usage Data Yet</CardTitle>
              <CardDescription>
                Start using the AI features in the playground to see your usage statistics here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = '/playground'}>
                Go to Playground
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">Total API Calls</CardTitle>
                  <p className="text-3xl font-bold text-blue-600">{totalCalls}</p>
                </CardHeader>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">Total Cost</CardTitle>
                  <p className="text-3xl font-bold text-purple-600">${totalCost.toFixed(4)}</p>
                </CardHeader>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">Money Saved</CardTitle>
                  <p className="text-3xl font-bold text-green-600">${savings.toFixed(4)}</p>
                  <CardDescription className="text-xs">vs traditional tools</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">Avg Cost/Call</CardTitle>
                  <p className="text-3xl font-bold text-orange-600">${avgCostPerCall.toFixed(4)}</p>
                </CardHeader>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Cost by Provider */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost by Provider</CardTitle>
                  <CardDescription>Breakdown of costs across AI providers</CardDescription>
                </CardHeader>
                <CardContent>
                  {providers.length === 0 ? (
                    <p className="text-gray-500 text-sm">No data available</p>
                  ) : (
                    <div className="space-y-3">
                      {providers.map((provider) => {
                        const cost = costByProvider[provider];
                        const percentage = (cost / totalCost) * 100;
                        return (
                          <div key={provider} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium capitalize">{provider}</span>
                              <span className="text-gray-600">${cost.toFixed(4)} ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  provider === 'claude' ? 'bg-blue-500' :
                                  provider === 'openai' ? 'bg-green-500' :
                                  'bg-purple-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Calls by Task Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Calls by Task Type</CardTitle>
                  <CardDescription>Distribution of AI requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {taskTypes.length === 0 ? (
                    <p className="text-gray-500 text-sm">No data available</p>
                  ) : (
                    <div className="space-y-3">
                      {taskTypes.map((taskType) => {
                        const calls = callsByTaskType[taskType];
                        const percentage = (calls / totalCalls) * 100;
                        return (
                          <div key={taskType} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{taskType.replace(/_/g, ' ')}</span>
                              <span className="text-gray-600">{calls} calls ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Model Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Model Usage & Cost</CardTitle>
                <CardDescription>Detailed breakdown by AI model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200">
                      <tr className="text-left text-sm text-gray-600">
                        <th className="pb-3 font-medium">Model</th>
                        <th className="pb-3 font-medium text-right">Cost</th>
                        <th className="pb-3 font-medium text-right">% of Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Object.entries(costByModel)
                        .sort(([, a], [, b]) => b - a)
                        .map(([model, cost]) => {
                          const percentage = (cost / totalCost) * 100;
                          return (
                            <tr key={model} className="text-sm">
                              <td className="py-3 font-mono text-xs">{model}</td>
                              <td className="py-3 text-right">${cost.toFixed(4)}</td>
                              <td className="py-3 text-right text-gray-600">{percentage.toFixed(1)}%</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest AI requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${record.success ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="font-medium text-sm">{record.taskType.replace(/_/g, ' ')}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {record.provider} / {record.model} • {new Date(record.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">${record.cost.toFixed(4)}</div>
                        <div className="text-xs text-gray-500">
                          {record.inputTokens + record.outputTokens} tokens
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Savings Highlight */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">💰 Your Savings with CodeForge AI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-green-700">Traditional Tools Cost</p>
                    <p className="text-2xl font-bold text-green-900">${(totalCalls * 0.20).toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Your Actual Cost</p>
                    <p className="text-2xl font-bold text-green-900">${totalCost.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Money Saved</p>
                    <p className="text-3xl font-bold text-green-600">${savings.toFixed(4)}</p>
                    <p className="text-sm text-green-700 mt-1">
                      {savings > 0 ? `${((savings / (totalCalls * 0.20)) * 100).toFixed(0)}% savings` : 'Great start!'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
