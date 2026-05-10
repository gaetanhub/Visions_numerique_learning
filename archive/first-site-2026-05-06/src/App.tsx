import { useMemo, useState } from 'react';
import { BookOpen, Brain, Lock, Search, Sparkles, Target } from 'lucide-react';
import { chapter1Modules } from './content/chapter1';
import { ModuleCard } from './components/ModuleCard';

const upcoming = [2, 3, 4, 5, 6, 7];
const glossary = ['Radiance', 'Luminance', 'Brightness', 'f(x,y)', 'M x N', 'ROI', 'Nearest neighbor', 'Bilinear', 'Segmentation', 'Classification'];

export function App(): JSX.Element {
  const [query, setQuery] = useState('');
  const filteredModules = useMemo(() => chapter1Modules.filter((m) => `${m.title} ${m.course.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <div className="page">
      <header className="hero">
        <p className="badge"><Sparkles size={14} /> Expérience premium</p>
        <h1>Vision Numérique — Chapitre 1</h1>
        <p>Parcours actif orienté compréhension profonde, mémorisation durable et entraînement progressif à l’examen.</p>
        <div className="heroStats">
          <span><BookOpen size={16} /> {chapter1Modules.length} modules</span>
          <span><Brain size={16} /> {chapter1Modules.reduce((acc, m) => acc + m.flashcards.length, 0)} flashcards</span>
          <span><Target size={16} /> {chapter1Modules.reduce((acc, m) => acc + m.quiz.length, 0)} questions</span>
        </div>
      </header>

      <div className="toolbar">
        <Search size={16} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un concept ou module…" />
      </div>

      <div className="layout">
        <aside>
          <h2>Plan du chapitre</h2>
          <nav>{chapter1Modules.map((module, index) => <a key={module.id} href={`#${module.id}`}>Module {index + 1}</a>)}</nav>
          <h3>Glossaire express</h3>
          <ul className="glossary">{glossary.map((g) => <li key={g}>{g}</li>)}</ul>
          <h3>Chapitres suivants</h3>
          <div className="comingStack">{upcoming.map((n) => <span key={n} className="coming"><Lock size={14} /> Chapitre {n} — à venir</span>)}</div>
        </aside>
        <main>{filteredModules.map((module) => <ModuleCard key={module.id} module={module} imageBasePath="/course-assets/chapter-01/introduction" />)}</main>
      </div>
    </div>
  );
}
