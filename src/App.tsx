import { BookOpen, Lock } from 'lucide-react';
import { chapter1Modules } from './content/chapter1';
import { ModuleCard } from './components/ModuleCard';

const upcoming = [2, 3, 4, 5, 6, 7];

export function App(): JSX.Element {
  return (
    <div className="layout">
      <aside>
        <h1>Vision Numérique</h1>
        <p>Plateforme premium — Chapitre 1 complet</p>
        <nav>
          <a href="#chap1"><BookOpen size={16} /> Chapitre 1 (actif)</a>
          {upcoming.map((n) => (
            <span key={n} className="coming"><Lock size={14} /> Chapitre {n} — à venir</span>
          ))}
        </nav>
      </aside>
      <main id="chap1">
        <h2>Chapitre 1 — Fondations et image numérique</h2>
        <p>Théorie complète: modules 1 à 6, avec flashcards, quiz, sources et interactions.</p>
        {chapter1Modules.map((module) => (
          <ModuleCard key={module.id} module={module} imageBasePath="/chapitre_01/introduction" />
        ))}
      </main>
    </div>
  );
}
