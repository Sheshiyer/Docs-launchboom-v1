# HeyZack Campaign Dashboard - React Implementation Prompt

## Project Overview
Create a modern, interactive React dashboard for the HeyZack LaunchBoom Templates repository using Next.js, NextUI, ReactBits.dev components, and client-side markdown parsing.

## Technology Stack

### Core Framework
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **NextUI v2** as primary component library
- **ReactBits.dev** components for enhanced UI elements

### Data Processing
- **Client-side markdown parsing** using `react-markdown`
- **Gray-matter** for frontmatter extraction
- **Remark/Rehype** plugins for enhanced markdown processing
- **Mermaid.js** for interactive diagram rendering

### Chart Libraries (Future Integration)
- **Recharts** - Primary charting library (React-native)
- **Chart.js with react-chartjs-2** - Advanced chart types
- **D3.js** - Custom visualizations
- **Tremor** - Dashboard-specific charts
- **Victory** - Animated charts

### State Management
- **Zustand** for global state
- **React Query/TanStack Query** for data fetching
- **Local Storage** for user preferences

## Dashboard Architecture

### Page Structure
```
/dashboard
├── / (Dashboard Home)
├── /templates (Template Navigator)
├── /campaign (Campaign Builder)
├── /analytics (Analytics & Charts)
├── /personas (Persona Profiles)
└── /resources (Resource Library)
```

### Component Hierarchy
```
App
├── Layout (NextUI Provider, Navigation)
├── Dashboard Home
│   ├── CampaignOverview
│   ├── ProgressMetrics
│   ├── QuickActions
│   └── RecentActivity
├── Template Navigator
│   ├── FolderTree
│   ├── TemplatePreview
│   ├── SearchFilter
│   └── TemplateCard
├── Campaign Builder
│   ├── StageFlow (Mermaid)
│   ├── PersonaJourney
│   ├── ContentMapping
│   └── TimelineView
├── Analytics Dashboard
│   ├── PricingCalculator
│   ├── ROICharts
│   ├── CampaignMetrics
│   └── PerformanceGraphs
├── Persona Profiles
│   ├── PersonaCard
│   ├── JourneyMap
│   ├── StageMapping
│   └── InteractiveFlow
└── Resource Library
    ├── SearchInterface
    ├── FilterSidebar
    ├── ContentGrid
    └── ExportTools
```

## Key Features

### 1. Interactive Template Navigation
- **Folder-based browsing** of the 10-category structure
- **Live markdown preview** with syntax highlighting
- **Template relationship mapping** showing dependencies
- **Search and filter** across all content
- **Tagging system** for content categorization

### 2. Campaign Flow Visualization
- **Mermaid diagram rendering** for campaign journeys
- **Interactive stage progression** (Foundation → Launch → Post-Launch)
- **Persona journey mapping** with clickable touchpoints
- **Content timeline** showing production schedules

### 3. Data Visualization
- **Pricing calculator** with interactive charts
- **ROI analysis** with comparison graphs
- **Campaign metrics** dashboard
- **Performance tracking** with trend analysis
- **Goal progress** visualization

### 4. Content Management
- **Markdown editor** with live preview
- **Template customization** interface
- **Export functionality** (PDF, DOCX, MD)
- **Version tracking** for template changes
- **Collaboration tools** for team editing

## Implementation Phases

### Phase 1: Foundation Setup (Week 1)
```bash
# Project initialization
npx create-next-app@latest heyzack-dashboard --typescript --tailwind --app
cd heyzack-dashboard

# Install core dependencies
npm install @nextui-org/react framer-motion
npm install react-markdown gray-matter
npm install mermaid
npm install zustand @tanstack/react-query
npm install lucide-react

# Install ReactBits.dev components
npm install @reactbits/ui

# Install chart libraries
npm install recharts chart.js react-chartjs-2
npm install @tremor/react
npm install victory
```

### Phase 2: Core Components (Week 2)
- Set up NextUI theme and providers
- Create base layout with navigation
- Implement markdown parsing pipeline
- Build folder structure navigator
- Create template preview components

### Phase 3: Interactive Features (Week 3)
- Integrate Mermaid.js for diagrams
- Build campaign flow visualization
- Implement search and filtering
- Create persona journey mapping
- Add interactive chart components

### Phase 4: Advanced Features (Week 4)
- Build analytics dashboard
- Implement export functionality
- Add template editing capabilities
- Create performance tracking
- Optimize for mobile responsiveness

## Data Structure

### Markdown Processing Pipeline
```typescript
interface TemplateFile {
  id: string;
  path: string;
  category: string;
  title: string;
  content: string;
  frontmatter: {
    stage?: string;
    persona?: string;
    type?: string;
    priority?: number;
    tags?: string[];
  };
  lastModified: Date;
}

interface CampaignStage {
  id: string;
  name: string;
  description: string;
  templates: TemplateFile[];
  personas: string[];
  status: 'completed' | 'current' | 'pending';
}
```

### State Management
```typescript
interface DashboardState {
  templates: TemplateFile[];
  currentStage: string;
  selectedPersona: string;
  searchQuery: string;
  filters: {
    category: string[];
    stage: string[];
    type: string[];
  };
  preferences: {
    theme: 'light' | 'dark';
    layout: 'grid' | 'list';
    sidebarCollapsed: boolean;
  };
}
```

## UI Components

### ReactBits.dev Integration
- **Magnetic buttons** for CTAs
- **Glassmorphism cards** for content display
- **Animated counters** for metrics
- **Interactive tooltips** for help text
- **Smooth transitions** between views

### NextUI Components
- **Navigation** with NextUI Navbar
- **Cards** for template display
- **Modals** for detailed views
- **Tables** for data presentation
- **Forms** for template editing

### Custom Components
```typescript
// Template Card with preview
<TemplateCard
  template={template}
  onPreview={() => setPreview(template)}
  onEdit={() => setEditor(template)}
  showMetrics={true}
/>

// Interactive Mermaid Diagram
<MermaidDiagram
  chart={campaignFlow}
  interactive={true}
  onNodeClick={handleStageClick}
/>

// Pricing Calculator
<PricingCalculator
  data={pricingData}
  onCalculate={handleROICalculation}
  showCharts={true}
/>
```

## Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Layout Adaptations
- **Mobile**: Single column, collapsible sidebar
- **Tablet**: Two column, floating sidebar
- **Desktop**: Three column, fixed sidebar

## Performance Optimization

### Code Splitting
- Route-based splitting for each dashboard page
- Component-level splitting for heavy features
- Dynamic imports for chart libraries

### Data Loading
- Client-side markdown parsing with caching
- Lazy loading for template content
- Virtual scrolling for large lists
- Progressive image loading

## Accessibility

### WCAG 2.1 AA Compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Focus management
- ARIA labels and descriptions

## Development Workflow

### File Structure
```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── templates/
│   │   ├── campaign/
│   │   ├── analytics/
│   │   ├── personas/
│   │   └── resources/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/ (NextUI + ReactBits)
│   ├── charts/
│   ├── templates/
│   └── navigation/
├── lib/
│   ├── markdown.ts
│   ├── data.ts
│   └── utils.ts
├── stores/
│   └── dashboard.ts
└── types/
    └── index.ts
```

### Environment Setup
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DATA_SOURCE=./docs
NEXT_PUBLIC_ANALYTICS_ID=
```

## Integration with Existing Repository

### Data Source Mapping
```typescript
const FOLDER_MAPPING = {
  '01_Foundation': 'foundation',
  '02_Campaign_Core': 'campaign-core',
  '03_Email_Marketing': 'email-marketing',
  '04_Advertising': 'advertising',
  '05_Visual_Assets': 'visual-assets',
  '06_Supporting_Materials': 'supporting',
  '07_Project_Management': 'project-mgmt',
  '08_Templates_Master': 'templates',
  '09_Strategic_Analysis': 'strategy',
  '10_Reference_Materials': 'reference'
};
```

### Content Processing
- Parse all `.md` files from data-sources folder
- Extract frontmatter for metadata
- Process mermaid diagrams
- Generate search index
- Create template relationships

## Success Criteria

### Functional Requirements
- ✅ Browse all 10 template categories
- ✅ Preview markdown content with formatting
- ✅ Interactive mermaid diagrams
- ✅ Search and filter templates
- ✅ Responsive design across devices
- ✅ Export templates in multiple formats

### Performance Requirements
- ⚡ Initial page load < 3 seconds
- ⚡ Template preview < 1 second
- ⚡ Search results < 500ms
- ⚡ Chart rendering < 2 seconds

### User Experience
- 🎨 Modern, intuitive interface
- 🎨 Smooth animations and transitions
- 🎨 Consistent design language
- 🎨 Accessible to all users

## Next Steps

1. **Initialize Next.js project** with TypeScript and Tailwind
2. **Install dependencies** (NextUI, ReactBits, chart libraries)
3. **Set up folder structure** and basic routing
4. **Implement markdown parsing** pipeline
5. **Create base components** and layout
6. **Build template navigator** with preview
7. **Add interactive features** (search, filters, charts)
8. **Integrate mermaid diagrams** for campaign flows
9. **Implement analytics dashboard** with pricing calculator
10. **Add export functionality** and final optimizations

This dashboard will transform the static HeyZack template repository into an interactive, visual tool for campaign management and template navigation.