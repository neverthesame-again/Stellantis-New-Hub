import { 
  LayoutDashboard, 
  Inbox, 
  Sparkles, 
  Sliders, 
  Cpu, 
  Bot, 
  Wrench, 
  BookmarkCheck,
  PlayCircle,
  Gauge,
  Scale
} from 'lucide-react';
import { AMS_EXPERIENCE_SUBPAGES } from '../domains/ai-for-ams/navigation/amsRoutes.js';

// Top-level pages shown in the sidebar for every domain
export const MAIN_PAGES = [
  { id: 'dashboard',  label: 'Dashboard',          icon: LayoutDashboard },
  { id: 'inbox',      label: 'Workflow Inbox',     icon: Inbox },
  { id: 'experience', label: 'AI Experience Zone', icon: Sparkles }
];

export const INBOX_COUNTS = {
  'AI for AMS': 7,
  'Engineering leaders': 3,
  'Engineering leader': 3,
  'AI for AD': 9
};

const ENG_SUBPAGES = [
  { id: 'persona',       label: 'Persona Dashboard',  icon: Sliders,       badge: '9' },
  { id: 'inbox',         label: 'Workflow Inbox',     icon: Inbox,         badge: '7' },
  { id: 'models',        label: 'Model Catalogue',    icon: Cpu,           badge: '8' },
  { id: 'agents',        label: 'Agent & Workflows',  icon: Bot,           badge: '8' },
  { id: 'tools',         label: 'AI Tools Catalogue', icon: Wrench,        badge: '10' },
  { id: 'subscriptions', label: 'My Subscriptions',   icon: BookmarkCheck, badge: '14' }
];

// AI Experience Zone sub-pages per domain — the first entry is the default
export const EXPERIENCE_SUBPAGES = {
  'Engineering leaders': ENG_SUBPAGES,
  'Engineering leader': ENG_SUBPAGES,
  // AMS owns its sub-page list (journey order) in its own domain folder
  'AI for AMS': AMS_EXPERIENCE_SUBPAGES,
  'AI for AD': [
    { id: 'persona',       label: 'Persona Dashboard',  icon: Sliders },
    { id: 'inbox',         label: 'Workflow Inbox',     icon: Inbox,         badge: '9' },
    { id: 'models',        label: 'Model Catalogue',    icon: Cpu,           badge: '8' },
    { id: 'agents',        label: 'Agent & Workflows',  icon: Bot,           badge: '8' },
    { id: 'harness',       label: 'AI Harness',         icon: PlayCircle,    badge: '1' },
    { id: 'evaluation',    label: 'Evaluation Center',  icon: Gauge,         badge: '5' },
    { id: 'governance',    label: 'Governance Center',  icon: Scale,         badge: '4' },
    { id: 'tools',         label: 'AI Tools Catalogue', icon: Wrench,        badge: '23' },
    { id: 'subscriptions', label: 'My Subscriptions',   icon: BookmarkCheck, badge: '20' }
  ]
};

export const defaultSubPage = (domain) => EXPERIENCE_SUBPAGES[domain]?.[0]?.id || 'persona';
