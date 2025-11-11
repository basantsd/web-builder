# 🧪 Testing Guide & Deployment Instructions

## ✅ Local Testing Checklist

Run the application locally first to verify everything works:

```bash
npm run dev
```

Visit **http://localhost:3000** and test:

### 1. Landing Page (`/`)
- [ ] Page loads correctly
- [ ] Navigation links work (Playground, Dashboard, Docs, Sign In)
- [ ] "Start Building Now" button opens project creation form
- [ ] "View Demo" button navigates to `/playground`
- [ ] Feature cards display correctly
- [ ] Responsive design works on mobile

### 2. Project Creation Form
- [ ] Form fields work (name, description, type, framework, etc.)
- [ ] Feature checkboxes work
- [ ] "Create Project with AI" button works
- [ ] **Note**: Requires AI API key in `.env.local` to actually generate DNA
- [ ] Without API key: Shows error message
- [ ] With API key: Generates and displays Project DNA

### 3. Code Playground (`/playground`)
- [ ] Monaco Editor loads correctly
- [ ] Tab switching works (HTML, CSS, JS, TSX)
- [ ] Code editing works (type code, see syntax highlighting)
- [ ] Live Preview shows output
- [ ] Live Preview updates when code changes
- [ ] "📚 Templates" button opens template browser
- [ ] "✨ Generate with AI" button opens AI generation modal
- [ ] "📊 Dashboard" button navigates to dashboard

### 4. Template Browser (in Playground)
- [ ] Modal opens when clicking "📚 Templates"
- [ ] Search bar filters templates
- [ ] Category filters work (ALL, CRUD, AUTH, HOOK, etc.)
- [ ] Shows all 20 templates
- [ ] Clicking a template inserts code into editor
- [ ] Modal closes after selection

### 5. AI Code Generation (in Playground)
- [ ] Modal opens when clicking "✨ Generate with AI"
- [ ] Prompt textarea accepts input
- [ ] Quality level selector works
- [ ] Cost estimation displays correctly
- [ ] **Requires AI API key** to generate
- [ ] Without API key: Shows connection error
- [ ] With API key:
  - [ ] Generates code successfully
  - [ ] Shows provider, model, and actual cost
  - [ ] Code appears in TSX tab
  - [ ] Usage is tracked in dashboard

### 6. Usage Dashboard (`/dashboard`)
- [ ] Page loads correctly
- [ ] Shows "No Usage Data Yet" if no AI calls made
- [ ] After using AI generation:
  - [ ] Total API Calls displays
  - [ ] Total Cost displays
  - [ ] Money Saved displays
  - [ ] Average Cost per Call displays
  - [ ] Cost by Provider chart shows
  - [ ] Calls by Task Type chart shows
  - [ ] Model Usage table displays
  - [ ] Recent Activity shows last 5 requests
  - [ ] Savings Highlight card calculates correctly
- [ ] "Clear Data" button works
- [ ] "Go to Playground" button navigates correctly

---

## 🚀 Deployment to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier is fine)
- At least ONE AI API key (Claude, OpenAI, or OpenRouter)

### Step 1: Push to GitHub

Your code is already on GitHub in branch `claude/check-read-011CUzoSVppWcQizLgBTTBZp`

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository `basantsd/web-builder`
4. **IMPORTANT**: Select branch `claude/check-read-011CUzoSVppWcQizLgBTTBZp`

### Step 3: Configure Environment Variables

Add these in Vercel's environment variables section:

#### Required (add at least ONE):
```
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-...
OPENROUTER_API_KEY=sk-or-v1-...
```

#### Required for Auth (if you add auth later):
```
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-app.vercel.app
```

#### Optional (for production database):
```
DATABASE_URL=postgresql://...
```

### Step 4: Deploy Settings

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)
- **Node Version**: 20.x

### Step 5: Deploy!

Click "Deploy" and wait ~2-3 minutes

### Step 6: Test Production

Once deployed, visit your Vercel URL and test:
- Landing page loads
- Playground works
- Template browser works
- **AI generation works** (if API key configured)
- Dashboard works
- Navigation between pages works

---

## 🐛 Common Issues & Solutions

### Issue: "Module not found" errors
**Solution**: Make sure all paths use `@/` prefix correctly
- ✅ Correct: `import { Button } from '@/components/ui/button'`
- ❌ Wrong: `import { Button } from '../components/ui/button'`

### Issue: AI generation fails
**Possible causes**:
1. No API key configured → Add API key to `.env.local` or Vercel env vars
2. Invalid API key → Check key is correct and has credits
3. Network error → Check console for error details

### Issue: Dashboard shows no data
**Expected behavior**: Dashboard only shows data after you use AI generation
1. Go to Playground
2. Click "✨ Generate with AI"
3. Generate some code
4. Go back to Dashboard to see stats

### Issue: Build fails in Vercel
**Common causes**:
1. TypeScript errors → Run `npm run build` locally first
2. Missing dependencies → Run `npm install` and commit `package-lock.json`
3. Environment variable issues → Check all required vars are set

### Issue: Hydration mismatch errors
**Solution**: Usage dashboard uses `useEffect` and `mounted` state to prevent this
- Should not occur with current implementation
- If it does, check browser console for details

---

## 📊 What to Expect

### With AI API Key Configured:
- ✅ Full functionality
- ✅ Project DNA generation works
- ✅ AI code generation works
- ✅ Usage tracking works
- ✅ Dashboard shows real data

### Without AI API Key:
- ✅ Landing page works
- ✅ Playground works (manual code editing)
- ✅ Template browser works (insert templates)
- ❌ Project DNA generation fails (shows error)
- ❌ AI code generation fails (shows error)
- ✅ Dashboard works (but shows "No Usage Data")

---

## 🎯 Performance Expectations

### Localhost:
- Next.js dev server: ~18-20s first load
- Page navigation: <1s
- Code editor: <2s load time
- Live preview: Real-time updates

### Production (Vercel):
- First load: ~2-3s
- Subsequent loads: <500ms (Edge caching)
- AI generation: 5-30s (depends on model & complexity)
- Template insertion: Instant

---

## 💡 Tips for Testing

1. **Test without API key first** to see error handling
2. **Add API key** to test full functionality
3. **Use "Low" quality** for faster/cheaper AI generation during testing
4. **Generate 3-5 AI requests** to see dashboard populate
5. **Try different templates** to see variety
6. **Test on mobile** to verify responsive design

---

## 🎉 You're Ready!

When everything tests well locally:
1. ✅ Commit any final changes
2. ✅ Push to GitHub
3. ✅ Deploy to Vercel
4. ✅ Add environment variables
5. ✅ Test production URL
6. ✅ Share your demo! 🚀

---

**Questions or Issues?**
Check the console in browser DevTools for detailed error messages.
