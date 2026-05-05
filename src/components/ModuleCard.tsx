import { useMemo, useState } from 'react';
import type { ModuleData } from '../content/chapter1';

type Props = { module: ModuleData; imageBasePath: string };

function InteractiveVisual({ moduleId }: { moduleId: string }): JSX.Element {
  const [value, setValue] = useState(50);

  if (moduleId === 'definition-image') {
    const levels = Math.max(2, Math.round((value / 100) * 14 + 2));
    return (
      <div>
        <p>Quantification simulée : {levels} niveaux</p>
        <input type="range" min={0} max={100} value={value} onChange={(e) => setValue(Number(e.target.value))} />
        <div className="gradient" style={{ backgroundImage: `linear-gradient(90deg, ${Array.from({ length: levels }, (_, i) => `${Math.round((i * 255) / (levels - 1))} ${Math.round((i * 255) / (levels - 1))} ${Math.round((i * 255) / (levels - 1))}`).map((v, i, arr) => `rgb(${v}) ${(i * 100) / (arr.length - 1)}%`).join(',')})` }} />
      </div>
    );
  }

  return (
    <div>
      <p>Paramètre interactif : {value}</p>
      <input type="range" min={0} max={100} value={value} onChange={(e) => setValue(Number(e.target.value))} />
      <svg viewBox="0 0 240 70" className="viz" role="img" aria-label="visualisation">
        <rect x="0" y="0" width="240" height="70" fill="#edf2ff" />
        <circle cx={20 + value * 2} cy={35} r={10 + value / 10} fill="#2452e4" opacity="0.7" />
      </svg>
    </div>
  );
}

export function ModuleCard({ module, imageBasePath }: Props): JSX.Element {
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const flashcard = module.flashcards[cardIndex];

  const quizResult = useMemo(() => {
    if (selected === null) return null;
    const ok = selected === module.quiz[0].answerIndex;
    return { ok, feedback: module.quiz[0].feedback };
  }, [module, selected]);

  return (
    <article className="card" id={module.id}>
      <h3>{module.title}</h3>
      <section><h4>Prérequis</h4><ul>{module.prerequis.map((p) => <li key={p}>{p}</li>)}</ul></section>
      <section><h4>Explication ultra-simple</h4><ul>{module.ultraSimple.map((p) => <li key={p}>{p}</li>)}</ul></section>
      <section><h4>Cours structuré</h4><ul>{module.course.map((p) => <li key={p}>{p}</li>)}</ul></section>

      <section>
        <h4>Figures du cours</h4>
        <div className="figGrid">
          {module.figures.map((fig) => (
            <figure key={fig}>
              <img loading="lazy" src={`${imageBasePath}/${fig}`} alt={fig} />
              <figcaption>{fig}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section><h4>Visualisation interactive</h4><p>{module.interactiveHint}</p><InteractiveVisual moduleId={module.id} /></section>
      <section><h4>A retenir</h4><ul>{module.aRetenir.map((p) => <li key={p}>{p}</li>)}</ul></section>

      <section>
        <h4>Flashcards</h4>
        <div className="flashcard">
          <p><strong>Q:</strong> {flashcard.question}</p>
          {showAnswer && <p><strong>R:</strong> {flashcard.answer}</p>}
        </div>
        <div className="row">
          <button onClick={() => setShowAnswer((v) => !v)}>{showAnswer ? 'Masquer réponse' : 'Voir réponse'}</button>
          <button onClick={() => { setCardIndex((i) => (i + 1) % module.flashcards.length); setShowAnswer(false); }}>Carte suivante</button>
        </div>
      </section>

      <section>
        <h4>Mini-quiz</h4>
        <p>{module.quiz[0].question}</p>
        <div className="row wrap">
          {module.quiz[0].options.map((opt, i) => (
            <button key={opt} onClick={() => setSelected(i)}>{opt}</button>
          ))}
        </div>
        {quizResult && <p className={quizResult.ok ? 'ok' : 'ko'}>{quizResult.ok ? 'Bonne réponse.' : 'Essaie encore.'} {quizResult.feedback}</p>}
      </section>

      <p className="source">Source : {module.source.file}, page {module.source.page}</p>
    </article>
  );
}
