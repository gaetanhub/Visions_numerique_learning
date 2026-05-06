import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, HelpCircle } from 'lucide-react';
import type { ModuleData, QuizItem } from '../content/chapter1';

type Props = { module: ModuleData; imageBasePath: string };

function InteractiveVisual({ moduleId }: { moduleId: string }): JSX.Element {
  const [a, setA] = useState(50);
  const [b, setB] = useState(50);
  return (
    <div className="interactiveBox">
      <label>Paramètre 1: {a}</label><input type="range" min={0} max={100} value={a} onChange={(e) => setA(Number(e.target.value))} />
      <label>Paramètre 2: {b}</label><input type="range" min={0} max={100} value={b} onChange={(e) => setB(Number(e.target.value))} />
      <p className="hint"><HelpCircle size={14} /> {moduleId === 'definition-image' ? 'Réduire le niveau simule la perte de nuances.' : 'Ajuste les paramètres pour visualiser l’influence des choix.'}</p>
      <svg viewBox="0 0 300 90" className="viz" role="img" aria-label="visualisation interactive"><rect x="0" y="0" width="300" height="90" fill="#edf2ff" /><circle cx={30 + a * 2.2} cy={45} r={7 + b / 7} fill="#2452e4" opacity="0.75" /></svg>
    </div>
  );
}

function useExamMode(questions: QuizItem[]): { running: boolean; timeLeft: number; index: number; start: () => void; answer: (value: number) => void } {
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) { setRunning(false); return; }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [running, timeLeft]);

  function start(): void { setRunning(true); setTimeLeft(90); setIndex(0); }
  function answer(_value: number): void { setIndex((i) => (i + 1) % questions.length); }

  return { running, timeLeft, index, start, answer };
}

export function ModuleCard({ module, imageBasePath }: Props): JSX.Element {
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [note, setNote] = useState('');
  const exam = useExamMode(module.quiz);

  useEffect(() => {
    const raw = localStorage.getItem(`vn-progress-${module.id}`);
    if (raw) setScore((JSON.parse(raw) as { score: number }).score || 0);
    const savedNote = localStorage.getItem(`vn-note-${module.id}`);
    if (savedNote) setNote(savedNote);
  }, [module.id]);

  const flashcard = module.flashcards[cardIndex];
  const q = module.quiz[quizIndex];
  const result = useMemo(() => (selected === null ? null : selected === q.answerIndex), [q.answerIndex, selected]);

  function nextQuestion(): void {
    if (selected === q.answerIndex) {
      const nextScore = score + 1;
      setScore(nextScore);
      localStorage.setItem(`vn-progress-${module.id}`, JSON.stringify({ score: nextScore }));
    }
    setSelected(null);
    setQuizIndex((i) => (i + 1) % module.quiz.length);
  }

  return (
    <article className="card" id={module.id}>
      <h3>{module.title}</h3>
      <p className="progress">Progression quiz locale: {score}</p>
      <section><h4>Objectifs pédagogiques</h4><ul>{module.objectifs.map((o) => <li key={o}>{o}</li>)}</ul></section>
      <section><h4>Prérequis</h4><ul>{module.prerequis.map((p) => <li key={p}>{p}</li>)}</ul></section>
      <section className="ultraSimple"><h4>Explication ultra-simple</h4><ul>{module.ultraSimple.map((u) => <li key={u}><ChevronRight size={14} /> {u}</li>)}</ul></section>
      <section><h4>Cours structuré</h4><ul>{module.course.map((c) => <li key={c}>{c}</li>)}</ul></section>
      <section><h4>Erreurs fréquentes</h4><ul>{module.erreursFrequentes.map((e) => <li key={e}>{e}</li>)}</ul></section>
      <section><h4>Figures du cours</h4><div className="figGrid">{module.figures.map((fig) => <figure key={fig}><img loading="lazy" src={`${imageBasePath}/${fig}`} alt={fig} /><figcaption>{fig}</figcaption></figure>)}</div></section>
      <section><h4>Visualisation interactive</h4><p>{module.interactiveHint}</p><InteractiveVisual moduleId={module.id} /></section>
      <section><h4>A retenir</h4><ul>{module.aRetenir.map((r) => <li key={r}>{r}</li>)}</ul></section>

      <section>
        <h4>Flashcards</h4>
        <div className="flashcard"><p><strong>Q:</strong> {flashcard.question}</p>{showAnswer && <p><strong>R:</strong> {flashcard.answer}</p>}</div>
        <div className="row"><button onClick={() => setShowAnswer((v) => !v)}>{showAnswer ? 'Masquer réponse' : 'Voir réponse'}</button><button onClick={() => { setCardIndex((i) => (i + 1) % module.flashcards.length); setShowAnswer(false); }}>Carte suivante</button></div>
      </section>

      <section>
        <h4>Mini-quiz ({quizIndex + 1}/{module.quiz.length})</h4>
        <p>{q.question}</p>
        <div className="row wrap">{q.options.map((opt, i) => <button key={opt} onClick={() => setSelected(i)}>{opt}</button>)}</div>
        {result !== null && <p className={result ? 'ok' : 'ko'}>{result ? 'Bonne réponse.' : 'Incorrect.'} {q.feedback}</p>}
        <button onClick={nextQuestion}>Question suivante</button>
      </section>

      <section>
        <h4>Mode examen rapide (90s)</h4>
        <div className="row wrap">
          <button onClick={exam.start}>Démarrer</button>
          <span className="timer">Temps restant: {exam.timeLeft}s</span>
        </div>
        {exam.running && (
          <div className="examBox">
            <p>{module.quiz[exam.index].question}</p>
            <div className="row wrap">{module.quiz[exam.index].options.map((opt, i) => <button key={opt} onClick={() => exam.answer(i)}>{opt}</button>)}</div>
          </div>
        )}
      </section>

      <section>
        <h4>Mes notes personnelles</h4>
        <textarea value={note} onChange={(e) => { setNote(e.target.value); localStorage.setItem(`vn-note-${module.id}`, e.target.value); }} placeholder="Écris ici tes points de révision." />
      </section>

      <p className="source">Source : {module.source.file}, page {module.source.page}</p>
    </article>
  );
}
