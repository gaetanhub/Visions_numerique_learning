import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  Activity,
  BarChart3,
  Binary,
  BookOpen,
  Brain,
  CheckCircle2,
  CircleDot,
  Eye,
  FlaskConical,
  Gauge,
  GraduationCap,
  Grid3X3,
  Layers3,
  LockOpen,
  MousePointer2,
  Radio,
  RotateCcw,
  Sparkles,
  Target,
  Waves,
} from 'lucide-react';
import {
  chapterModules,
  moduleContent,
  type ChapterModule,
  type FigureNote,
  type LearningMode,
  type LabKind,
  type LabPart,
  type ModuleContent,
  type QuizItem,
} from './data/prototype';

type ModuleProgress = {
  completedModes: Record<LearningMode, boolean>;
  flashcardsRevealed: string[];
  quizAnswered: number;
  quizCorrect: number;
  labInteractions: number;
  lastMode: LearningMode;
};

type ProgressState = Record<string, ModuleProgress>;

const progressKey = 'vision-numerique-course-progress-v2';

const modeLabels: Record<LearningMode, string> = {
  learn: 'Apprendre',
  lab: 'Manipuler',
  review: 'Réviser',
};

const labLabels: Record<LabKind, string> = {
  vision: 'Contraste perceptif',
  sources: 'Modalités d’imagerie',
  pipeline: 'Pipeline de vision',
  pixels: 'Matrice de pixels',
  color: 'Synthèse RGB',
  roi: 'ROI et interpolation',
  'intensity-map': 'Fonction T',
  'intensity-invert': 'Négatif et seuil',
  'intensity-gamma': 'Log et gamma',
  histogram: 'Histogramme',
  'histogram-equalization': 'Égalisation',
  'spatial-lowpass': 'Passe-bas spatial',
  'spatial-kernel': 'Kernel spatial',
  'spatial-highpass': 'Contours',
  fourier: 'Domaine fréquentiel',
  morphology: 'Morphologie binaire',
  hough: 'Transformée de Hough',
};

function parseInitialRoute(): { moduleId: string; mode: LearningMode } {
  const [moduleId, routeMode] = window.location.hash.replace(/^#/, '').split('/');
  const validModule = moduleContent.some((module) => module.id === moduleId) ? moduleId : moduleContent[0].id;
  const validMode = routeMode === 'learn' || routeMode === 'lab' || routeMode === 'review' ? routeMode : 'learn';
  return { moduleId: validModule, mode: validMode };
}

function emptyProgress(): ModuleProgress {
  return {
    completedModes: { learn: false, lab: false, review: false },
    flashcardsRevealed: [],
    quizAnswered: 0,
    quizCorrect: 0,
    labInteractions: 0,
    lastMode: 'learn',
  };
}

function initialProgress(): ProgressState {
  return Object.fromEntries(moduleContent.map((module) => [module.id, emptyProgress()]));
}

function normalizeProgress(raw: unknown): ProgressState {
  const fallback = initialProgress();
  if (!raw || typeof raw !== 'object') return fallback;
  const candidate = raw as Record<string, Partial<ModuleProgress>>;
  for (const module of moduleContent) {
    const stored = candidate[module.id] || {};
    fallback[module.id] = {
      ...fallback[module.id],
      ...stored,
      completedModes: { ...fallback[module.id].completedModes, ...stored.completedModes },
      flashcardsRevealed: Array.isArray(stored.flashcardsRevealed) ? stored.flashcardsRevealed : [],
      lastMode: stored.lastMode || fallback[module.id].lastMode,
    };
  }
  return fallback;
}

function loadProgress(): ProgressState {
  const raw = localStorage.getItem(progressKey);
  if (!raw) return initialProgress();
  try {
    return normalizeProgress(JSON.parse(raw));
  } catch {
    localStorage.removeItem(progressKey);
    return initialProgress();
  }
}

function readiness(progress: ModuleProgress): number {
  const modeScore = Object.values(progress.completedModes).filter(Boolean).length * 18;
  const quizScore = progress.quizAnswered > 0 ? Math.round((progress.quizCorrect / progress.quizAnswered) * 28) : 0;
  const flashScore = Math.min(progress.flashcardsRevealed.length * 3, 12);
  const labScore = Math.min(progress.labInteractions * 2, 6);
  return Math.min(100, modeScore + quizScore + flashScore + labScore);
}

function formatBits(bits: number): string {
  if (bits < 8) return `${bits} bits`;
  const bytes = bits / 8;
  if (bytes < 1024) return `${bytes.toFixed(0)} octets`;
  return `${(bytes / 1024).toFixed(1)} Ko`;
}

function rawIntensity(x: number, y: number, width: number, height: number): number {
  const nx = width <= 1 ? 0 : x / (width - 1);
  const ny = height <= 1 ? 0 : y / (height - 1);
  const wave = (Math.sin((x + y) * 0.75) + 1) / 2;
  return Math.round((0.55 * nx + 0.28 * ny + 0.17 * wave) * 255);
}

function quantize(value: number, bits: number): number {
  const levels = 2 ** bits;
  const step = 255 / Math.max(1, levels - 1);
  return Math.round(value / step) * step;
}

function courseAsset(file: string): string {
  return `/course-assets/chapter-01/introduction/${file}`;
}

function figureAsset(figure: FigureNote): string {
  return figure.assetPath || courseAsset(figure.file);
}

function chapter2CourseAsset(file: string): string {
  return `/course-assets/chapter-02/transformation-intensite/${file}`;
}

function chapter2LabAsset(file: string): string {
  return `/course-assets/chapter-02/labo-02/${file}`;
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function logTransform(value: number, constant: number): number {
  return clampByte((255 * Math.log(1 + constant * value)) / Math.log(1 + constant * 255));
}

function gammaTransform(value: number, gamma: number, constant = 1): number {
  return clampByte(255 * constant * (value / 255) ** gamma);
}

function histogram(values: number[], bins = 16): number[] {
  const counts = Array.from({ length: bins }, () => 0);
  for (const value of values) {
    const index = Math.min(bins - 1, Math.floor((clampByte(value) / 256) * bins));
    counts[index] += 1;
  }
  return counts;
}

function cumulative(values: number[]): number[] {
  let total = 0;
  return values.map((value) => {
    total += value;
    return total;
  });
}

function normalizeValues(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  return values.map((value) => clampByte(((value - min) / span) * 255));
}

function equalizeValues(values: number[]): number[] {
  const counts = histogram(values, 256);
  const total = Math.max(1, values.length);
  const cdf = cumulative(counts);
  return values.map((value) => clampByte((cdf[clampByte(value)] / total) * 255));
}

export function App(): JSX.Element {
  const initialRoute = useMemo(() => parseInitialRoute(), []);
  const [selectedModuleId, setSelectedModuleId] = useState(initialRoute.moduleId);
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const selectedModule = moduleContent.find((module) => module.id === selectedModuleId) || moduleContent[0];
  const selectedProgress = progress[selectedModule.id] || emptyProgress();
  const [mode, setMode] = useState<LearningMode>(initialRoute.mode);

  useEffect(() => {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    const handleHashchange = (): void => {
      const route = parseInitialRoute();
      setSelectedModuleId(route.moduleId);
      setMode(route.mode);
    };

    window.addEventListener('hashchange', handleHashchange);
    return () => window.removeEventListener('hashchange', handleHashchange);
  }, []);

  useEffect(() => {
    const nextHash = `#${selectedModule.id}/${mode}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', nextHash);
    }
  }, [selectedModule.id, mode]);

  function updateModule(moduleId: string, updater: (current: ModuleProgress) => ModuleProgress): void {
    setProgress((current) => ({
      ...current,
      [moduleId]: updater(current[moduleId] || emptyProgress()),
    }));
  }

  function switchModule(moduleId: string): void {
    setSelectedModuleId(moduleId);
    setMode((progress[moduleId] || emptyProgress()).lastMode);
  }

  function switchMode(nextMode: LearningMode): void {
    setMode(nextMode);
    updateModule(selectedModule.id, (current) => ({ ...current, lastMode: nextMode }));
  }

  function completeMode(completedMode: LearningMode): void {
    updateModule(selectedModule.id, (current) => ({
      ...current,
      completedModes: { ...current.completedModes, [completedMode]: true },
      lastMode: completedMode,
    }));
  }

  function trackLabInteraction(): void {
    updateModule(selectedModule.id, (current) => ({
      ...current,
      labInteractions: current.labInteractions + 1,
    }));
  }

  function replaceSelectedProgress(next: ModuleProgress): void {
    setProgress((current) => ({ ...current, [selectedModule.id]: next }));
  }

  const selectedScore = readiness(selectedProgress);
  const globalScore = Math.round(
    moduleContent.reduce((sum, module) => sum + readiness(progress[module.id] || emptyProgress()), 0) / moduleContent.length
  );

  return (
    <div className={`appShell mode-${mode}`}>
      <Cockpit
        selectedModuleId={selectedModule.id}
        progress={progress}
        selectedScore={selectedScore}
        globalScore={globalScore}
        onModuleSelect={switchModule}
        onModeSelect={switchMode}
      />
      <main className="workspace">
        <ModuleHeader
          module={selectedModule}
          mode={mode}
          onModeSelect={switchMode}
          progress={selectedProgress}
          score={selectedScore}
        />
        {mode === 'learn' && <LearnMode key={selectedModule.id} module={selectedModule} onComplete={() => completeMode('learn')} />}
        {mode === 'lab' && (
          <LabMode
            key={selectedModule.id}
            module={selectedModule}
            onInteraction={trackLabInteraction}
            onComplete={() => completeMode('lab')}
          />
        )}
        {mode === 'review' && (
          <ReviewMode
            key={selectedModule.id}
            module={selectedModule}
            progress={selectedProgress}
            onProgress={replaceSelectedProgress}
            onComplete={() => completeMode('review')}
          />
        )}
      </main>
    </div>
  );
}

function Cockpit({
  selectedModuleId,
  progress,
  selectedScore,
  globalScore,
  onModuleSelect,
  onModeSelect,
}: {
  selectedModuleId: string;
  progress: ProgressState;
  selectedScore: number;
  globalScore: number;
  onModuleSelect: (moduleId: string) => void;
  onModeSelect: (mode: LearningMode) => void;
}): JSX.Element {
  const selectedProgress = progress[selectedModuleId] || emptyProgress();
  const completedModes = Object.values(selectedProgress.completedModes).filter(Boolean).length;
  const completedModules = moduleContent.filter((module) => {
    const moduleProgress = progress[module.id] || emptyProgress();
    return Object.values(moduleProgress.completedModes).every(Boolean);
  }).length;
  const groupedModules = [...chapterModules]
    .sort((first, second) => first.chapter - second.chapter || first.number - second.number)
    .reduce<Array<{ chapter: number; chapterTitle: string; modules: ChapterModule[] }>>((groups, module) => {
      const group = groups.find((item) => item.chapter === module.chapter);
      if (group) {
        group.modules.push(module);
        return groups;
      }
      return [...groups, { chapter: module.chapter, chapterTitle: module.chapterTitle, modules: [module] }];
    }, []);

  return (
    <aside className="cockpit">
      <div className="brandBlock">
        <span className="brandMark"><Grid3X3 size={18} /></span>
        <div>
          <p>Vision Numérique</p>
          <strong>Cours local en refonte</strong>
        </div>
      </div>

      <section className="readinessCard">
        <div>
          <p>Préparation module actif</p>
          <strong>{selectedScore}%</strong>
          <small>Progression globale : {globalScore}%</small>
        </div>
        <div className="readinessRing" style={{ '--score': `${selectedScore * 3.6}deg` } as CSSProperties}>
          <span>{completedModes}/3</span>
        </div>
      </section>

      <section className="metricGrid">
        <div>
          <BarChart3 size={16} />
          <strong>{selectedProgress.quizCorrect}/{Math.max(selectedProgress.quizAnswered, 1)}</strong>
          <span>quiz actif</span>
        </div>
        <div>
          <Brain size={16} />
          <strong>{selectedProgress.flashcardsRevealed.length}</strong>
          <span>cartes vues</span>
        </div>
        <div>
          <FlaskConical size={16} />
          <strong>{selectedProgress.labInteractions}</strong>
          <span>actions labo</span>
        </div>
        <div>
          <CheckCircle2 size={16} />
          <strong>{completedModules}/{moduleContent.length}</strong>
          <span>modules finis</span>
        </div>
      </section>

      <section className="moduleList" aria-label="Modules du cours">
        <div className="sectionTitle">
          <span>Modules</span>
          <small>Chapitres 1-7</small>
        </div>
        {groupedModules.map((group) => (
          <div className="chapterGroup" key={group.chapter}>
            <div className="chapterLabel">
              <span>Chapitre {group.chapter}</span>
              <small>{group.chapterTitle}</small>
            </div>
            {group.modules.map((module) => {
              const moduleProgress = progress[module.id] || emptyProgress();
              const moduleDone = Object.values(moduleProgress.completedModes).every(Boolean);
              const active = selectedModuleId === module.id;
          return (
            <button
              key={module.id}
              className={active ? 'moduleItem ready selected' : 'moduleItem ready'}
              onClick={() => onModuleSelect(module.id)}
              type="button"
            >
              <span className="moduleNumber">{module.number}</span>
              <div>
                <strong>{module.shortTitle}</strong>
                <p>{module.focus}</p>
              </div>
              {moduleDone ? <CheckCircle2 size={17} /> : <LockOpen size={16} />}
            </button>
          );
            })}
          </div>
        ))}
      </section>

      <section className="quickActions">
        <button onClick={() => onModeSelect('learn')}><BookOpen size={16} /> Apprendre</button>
        <button onClick={() => onModeSelect('lab')}><FlaskConical size={16} /> Manipuler</button>
        <button onClick={() => onModeSelect('review')}><Target size={16} /> Réviser</button>
      </section>
    </aside>
  );
}

function ModuleHeader({
  module,
  mode,
  onModeSelect,
  progress,
  score,
}: {
  module: ModuleContent;
  mode: LearningMode;
  onModeSelect: (mode: LearningMode) => void;
  progress: ModuleProgress;
  score: number;
}): JSX.Element {
  const modes: Array<{ id: LearningMode; label: string; icon: JSX.Element; detail: string }> = [
    { id: 'learn', label: 'Apprendre', icon: <BookOpen size={18} />, detail: 'cours guidé' },
    { id: 'lab', label: 'Manipuler', icon: <FlaskConical size={18} />, detail: labLabels[module.lab.kind] },
    { id: 'review', label: 'Réviser', icon: <GraduationCap size={18} />, detail: 'examen' },
  ];

  return (
    <header className="moduleHero">
      <div className="heroCopy">
        <p className="eyebrow">
          <Sparkles size={15} /> <span>Chapitre {module.chapter} · Module {module.number}<span className="sourceFileLabel"> · {module.source.file}</span>, page {module.source.page}</span>
        </p>
        <h1>{module.title}</h1>
        <p>{module.modeIntros[mode]}</p>
      </div>
      <div className="heroPanel">
        <div className="heroScore">
          <span>Score de préparation</span>
          <strong>{score}%</strong>
        </div>
        <div className="modeSwitch" role="tablist" aria-label="Modes du module">
          {modes.map((item) => (
            <button
              key={item.id}
              className={mode === item.id ? 'active' : ''}
              onClick={() => onModeSelect(item.id)}
              type="button"
            >
              {item.icon}
              <span>{item.label}</span>
              <small>{progress.completedModes[item.id] ? 'validé' : item.detail}</small>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function LearnMode({ module, onComplete }: { module: ModuleContent; onComplete: () => void }): JSX.Element {
  return (
    <section className="modeSurface learnSurface">
      <div className="lessonColumn">
        <div className="pathHeader">
          <span><BookOpen size={16} /> Apprendre</span>
          <strong>Lecture guidée et figures expliquées</strong>
        </div>

        {module.learnSections.map((section, index) => (
          <article className="lessonStep" key={section.title}>
            <div className="stepMarker">{index + 1}</div>
            <div>
              <p className="eyebrow">{section.eyebrow}</p>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="checkpoint"><CheckCircle2 size={16} /> {section.checkpoint}</div>
            </div>
          </article>
        ))}

        <button className="primaryAction" onClick={onComplete} type="button">
          <CheckCircle2 size={18} /> Marquer Apprendre comme compris
        </button>
      </div>

      <aside className="figureRail">
        <div className="stickyStack">
          <div className="sourceBox">
            <strong>Source principale</strong>
            <p>{module.source.file}, page {module.source.page}</p>
            <small>Figures locales du support de cours.</small>
          </div>
          {module.figureNotes.map((figure) => (
            <figure className="annotatedFigure" key={figure.file}>
              <img src={figureAsset(figure)} alt={figure.title} />
              <figcaption>
                <span>Page {figure.page}</span>
                <strong>{figure.title}</strong>
                <p><b>À regarder :</b> {figure.observe}</p>
                <p><b>Ce que ça enseigne :</b> {figure.teaches}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </aside>
    </section>
  );
}

function LabMode({
  module,
  onInteraction,
  onComplete,
}: {
  module: ModuleContent;
  onInteraction: () => void;
  onComplete: () => void;
}): JSX.Element {
  const [activePartId, setActivePartId] = useState(module.lab.parts[0]?.id || '');
  const activePart = module.lab.parts.find((part) => part.id === activePartId) || module.lab.parts[0];

  function selectPart(part: LabPart): void {
    if (part.id === activePart.id) return;
    setActivePartId(part.id);
    onInteraction();
  }

  return (
    <section className="modeSurface labSurface">
      <div className="labCanvas">
        <div className="labIntro">
          <p className="eyebrow"><FlaskConical size={15} /> Manipuler · {labLabels[module.lab.kind]}</p>
          <h2>{module.lab.title}</h2>
          <p>{module.lab.intro}</p>
          <span className="focusLabel">Focus détaillé</span>
          <div className="labPartTabs" data-lab-part-tabs aria-label="Focus détaillé du labo">
            {module.lab.parts.map((part) => {
              const active = activePart.id === part.id;
              return (
                <button
                  key={part.id}
                  className={active ? 'labPartButton active' : 'labPartButton'}
                  data-lab-part-id={part.id}
                  disabled={active}
                  aria-pressed={active}
                  onClick={() => selectPart(part)}
                  type="button"
                >
                  <span>{part.title}</span>
                  <small>{part.goal}</small>
                </button>
              );
            })}
          </div>
          <div className="labPartGoal">
            <strong>Focus : {activePart.title}</strong>
            <span>{activePart.goal}</span>
          </div>
        </div>
        <LabVisual module={module} activePart={activePart} onInteraction={onInteraction} />
      </div>

      <aside className="controlDeck">
        <div className="labFormula">
          <span>Source du labo</span>
          <strong>{module.source.file}</strong>
          <p>{activePart.sourceNote || module.lab.sourceNote}</p>
        </div>
        <button className="primaryAction labAction" onClick={onComplete} type="button">
          <CheckCircle2 size={18} /> J’ai compris la manipulation
        </button>
      </aside>
    </section>
  );
}

function LabVisual({
  module,
  activePart,
  onInteraction,
}: {
  module: ModuleContent;
  activePart: LabPart;
  onInteraction: () => void;
}): JSX.Element {
  if (module.lab.kind === 'vision') return <VisionLab activePart={activePart} onInteraction={onInteraction} />;
  if (module.lab.kind === 'sources') return <SourcesLab activePart={activePart} onInteraction={onInteraction} />;
  if (module.lab.kind === 'pipeline') return <PipelineLab activePart={activePart} onInteraction={onInteraction} />;
  if (module.lab.kind === 'pixels') return <PixelsLab activePart={activePart} onInteraction={onInteraction} />;
  if (module.lab.kind === 'color') return <ColorLab activePart={activePart} onInteraction={onInteraction} />;
  if (module.lab.kind === 'intensity-map') return <IntensityMapLab activePart={activePart} onInteraction={onInteraction} />;
  if (module.lab.kind === 'intensity-invert') return <IntensityInvertLab activePart={activePart} onInteraction={onInteraction} />;
  if (module.lab.kind === 'intensity-gamma') return <IntensityGammaLab activePart={activePart} onInteraction={onInteraction} />;
  if (module.lab.kind === 'histogram') return <HistogramLab activePart={activePart} onInteraction={onInteraction} />;
  if (module.lab.kind === 'histogram-equalization') return <HistogramEqualizationLab activePart={activePart} onInteraction={onInteraction} />;
  if (module.lab.kind === 'spatial-lowpass') return <SpatialLowpassLab module={module} activePart={activePart} onInteraction={onInteraction} />;
  if (module.lab.kind === 'spatial-kernel') return <SpatialKernelLab module={module} activePart={activePart} onInteraction={onInteraction} />;
  if (module.lab.kind === 'spatial-highpass') return <SpatialHighpassLab module={module} activePart={activePart} onInteraction={onInteraction} />;
  if (module.lab.kind === 'fourier') return <FourierLab module={module} activePart={activePart} onInteraction={onInteraction} />;
  if (module.lab.kind === 'morphology') return <MorphologyLab module={module} activePart={activePart} onInteraction={onInteraction} />;
  if (module.lab.kind === 'hough') return <HoughLab module={module} activePart={activePart} onInteraction={onInteraction} />;
  return <RoiLab activePart={activePart} onInteraction={onInteraction} />;
}

function VisionLab({ activePart, onInteraction }: { activePart: LabPart; onInteraction: () => void }): JSX.Element {
  const [context, setContext] = useState(45);
  const isMeasure = activePart.id === 'measure';
  const left = Math.max(0, 128 - context);
  const right = Math.min(255, 128 + context);
  const target = 128;

  function setAndTrack(nextContext: number): void {
    if (nextContext === context) return;
    setContext(nextContext);
    onInteraction();
  }

  return (
    <div className="labVisualStage visionVisual" data-lab-kind="vision">
      <div className="courseImageFrame">
        <img
          className="courseVisualImage"
          src={courseAsset('introduction_p7_fig2.jpeg')}
          alt="Illusion optique du support de cours"
          style={{ filter: `grayscale(1) contrast(${100 + context * 0.45}%) brightness(${100 + context * 0.12}%)` }}
        />
        <div className="adaptiveOverlay visionOverlay">
          <span>{isMeasure ? 'Intensité cible constante' : 'Brightness : perception subjective'}</span>
        </div>
      </div>

      <div className="perceptionLab">
        <div className="contrastPatch" style={{ backgroundColor: `rgb(${left}, ${left}, ${left})` }}>
          <span style={{ backgroundColor: `rgb(${target}, ${target}, ${target})` }} />
        </div>
        <div className="contrastPatch" style={{ backgroundColor: `rgb(${right}, ${right}, ${right})` }}>
          <span style={{ backgroundColor: `rgb(${target}, ${target}, ${target})` }} />
        </div>
      </div>
      <div className="labReadout">
        <article>
          <Eye size={18} />
          <span>Intensité cible</span>
          <strong>{target}</strong>
          <small>La cible garde la même intensité mesurée.</small>
        </article>
        <article>
          <Activity size={18} />
          <span>Contexte gauche/droite</span>
          <strong>{left} / {right}</strong>
          <small>Le contexte change la perception subjective.</small>
        </article>
        <article>
          <Gauge size={18} />
          <span>Notion du cours</span>
          <strong>Brightness</strong>
          <small>Perception subjective, non mesurable directement.</small>
        </article>
      </div>
      <div className="controlCard labInlineControl" data-primary-control>
        <label htmlFor="context">Écart de contexte : {context}</label>
        <input id="context" type="range" min={0} max={95} value={context} onChange={(event) => setAndTrack(Number(event.target.value))} />
        <div className="visualControlRow">
          <button disabled={context === 12} onClick={() => setAndTrack(12)} type="button">Contexte faible</button>
          <button disabled={context === 88} onClick={() => setAndTrack(88)} type="button">Contexte fort</button>
        </div>
      </div>
    </div>
  );
}

function SourcesLab({ activePart, onInteraction }: { activePart: LabPart; onInteraction: () => void }): JSX.Element {
  const modalities = [
    { name: 'Rayons X', part: 'electromagnetic', family: 'Électromagnétique', signal: 'Rayons X filtrés par la matière', reveals: 'Objets denses comme les os', file: 'introduction_p13_fig5.jpeg', filter: 'grayscale(1) contrast(1.25)', accent: '#dbe8ff', icon: <Radio size={22} /> },
    { name: 'Infra-rouge', part: 'electromagnetic', family: 'Électromagnétique', signal: 'Rayonnement hors visible', reveals: 'Bandes hors visible dans l’exemple de New York', file: 'introduction_p14_fig4.jpeg', filter: 'saturate(1.35) hue-rotate(-20deg) contrast(1.08)', accent: '#ffcf8a', icon: <Waves size={22} /> },
    { name: 'IRM', part: 'electromagnetic', family: 'Ondes radio + champ magnétique', signal: 'Signal radio capté après réalignement', reveals: 'Protons d’hydrogène dans le contexte médical', file: 'introduction_p14_fig19.jpeg', filter: 'grayscale(1) contrast(1.18)', accent: '#c5efe0', icon: <Activity size={22} /> },
    { name: 'Ultrasons', part: 'medical-acoustic', family: 'Acoustique', signal: 'Son réfléchi par les tissus', reveals: 'Distances et intensités en échographie', file: 'introduction_p14_fig23.jpeg', filter: 'grayscale(1) contrast(1.45)', accent: '#d8f3ff', icon: <Waves size={22} /> },
    { name: 'Synthétique', part: 'medical-acoustic', family: 'Ordinateur', signal: 'Image générée par ordinateur', reveals: 'Scène simulée ou créée', file: 'introduction_p11_fig5.jpeg', filter: 'saturate(1.1) contrast(1.08)', accent: '#e7ddff', icon: <Grid3X3 size={22} /> },
  ];
  const [index, setIndex] = useState(0);
  const current = modalities[index] || modalities[0];

  function selectSource(modalityIndex: number): void {
    if (modalityIndex === index) return;
    setIndex(modalityIndex);
    onInteraction();
  }

  return (
    <div className="labVisualStage sourceVisual" data-lab-kind="sources" style={{ '--accent': current.accent } as CSSProperties}>
      <div className="sourceChooser" data-primary-control>
        {modalities.map((modality) => {
          const modalityIndex = modalities.findIndex((item) => item.name === modality.name);
          const active = current.name === modality.name;
          const focused = modality.part === activePart.id;
          return (
          <button
            key={modality.name}
            className={`${active ? 'sourcePill active' : 'sourcePill'}${focused ? ' focused' : ''}`}
            disabled={active}
            onClick={() => selectSource(modalityIndex)}
            type="button"
          >
            {modality.name}
          </button>
          );
        })}
      </div>
      <div className="sourceDisplay">
        <div className="courseImageFrame sourceImageFrame">
          <img
            className="courseVisualImage"
            src={courseAsset(current.file)}
            alt={`Figure du cours pour ${current.name}`}
            style={{ filter: current.filter }}
          />
          <div className="adaptiveOverlay sourceSignal">
            {current.icon}
            <span>{current.family}</span>
          </div>
        </div>
        <div>
          <p className="eyebrow">{current.family}</p>
          <h3>{current.name}</h3>
          <p><b>Signal :</b> {current.signal}</p>
          <p><b>Ce que l’image met en évidence :</b> {current.reveals}</p>
        </div>
      </div>
    </div>
  );
}

function PipelineLab({ activePart, onInteraction }: { activePart: LabPart; onInteraction: () => void }): JSX.Element {
  const steps = [
    { name: 'Acquisition', part: 'processing', detail: 'Obtenir l’image depuis un capteur ou une source.', file: 'introduction_p9_fig1.jpeg', filter: 'saturate(0.9) contrast(0.96)', overlay: 'Signal acquis' },
    { name: 'Amélioration', part: 'processing', detail: 'Rendre l’image plus utile pour l’humain ou la suite du traitement.', file: 'introduction_p16_fig7.jpeg', filter: 'contrast(1.35) brightness(1.08)', overlay: 'Contraste renforcé' },
    { name: 'Segmentation', part: 'processing', detail: 'Isoler des zones ou objets pertinents.', file: 'introduction_p16_fig9.jpeg', filter: 'grayscale(1) contrast(1.4)', overlay: 'Zones isolées' },
    { name: 'Extraction de caractéristiques', part: 'analysis', detail: 'Construire ou apprendre des indices exploitables.', file: 'introduction_p20_fig8.jpeg', filter: 'grayscale(1) contrast(1.25)', overlay: 'Gradients / contours' },
    { name: 'Classification', part: 'analysis', detail: 'Attribuer une classe ou une décision.', file: 'introduction_p22_fig7.jpeg', filter: 'saturate(1.1) contrast(1.08)', overlay: 'Décision finale' },
  ];
  const [active, setActive] = useState(0);
  const current = steps[active] || steps[0];
  const currentStepIndex = steps.indexOf(current);

  function selectStep(index: number): void {
    if (index === currentStepIndex) return;
    setActive(index);
    onInteraction();
  }

  return (
    <div className="labVisualStage pipelineVisual" data-lab-kind="pipeline">
      <div className={`processingPreview step-${currentStepIndex}`}>
        <img
          className="courseVisualImage"
          src={courseAsset(current.file)}
          alt={`Étape ${current.name} du pipeline de vision`}
          style={{ filter: current.filter }}
        />
        <div className="adaptiveOverlay pipelineOverlay">
          <span>{current.overlay}</span>
        </div>
      </div>
      <div className="pipelineTrack" data-primary-control>
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const focused = step.part === activePart.id;
          return (
          <button
            key={step.name}
            className={`${isActive ? 'pipelineStep active' : 'pipelineStep'}${focused ? ' focused' : ''}`}
            disabled={isActive}
            onClick={() => selectStep(index)}
            type="button"
          >
            <span>{index + 1}</span>
            <strong>{step.name}</strong>
          </button>
          );
        })}
      </div>
      <div className="pipelineDetail">
        <p className="eyebrow">Étape active</p>
        <h3>{current.name}</h3>
        <p>{current.detail}</p>
      </div>
    </div>
  );
}

function PixelsLab({ activePart, onInteraction }: { activePart: LabPart; onInteraction: () => void }): JSX.Element {
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(9);
  const [bits, setBits] = useState(4);
  const [selected, setSelected] = useState({ x: 4, y: 3 });
  const figureFile = activePart.id === 'memory'
    ? 'introduction_p30_fig6.jpeg'
    : activePart.id === 'sampling'
      ? 'introduction_p27_fig1.jpeg'
      : 'introduction_p27_fig5.jpeg';

  useEffect(() => {
    setSelected((current) => ({
      x: Math.min(current.x, width - 1),
      y: Math.min(current.y, height - 1),
    }));
  }, [width, height]);

  const levels = 2 ** bits;
  const selectedRaw = rawIntensity(selected.x, selected.y, width, height);
  const selectedValue = quantize(selectedRaw, bits);
  const memoryBits = width * height * bits;
  const cells = useMemo(() => Array.from({ length: width * height }, (_, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    return { x, y, value: quantize(rawIntensity(x, y, width, height), bits) };
  }), [width, height, bits]);

  function setAndTrack(action: () => void): void {
    action();
    onInteraction();
  }

  function selectPixel(x: number, y: number): void {
    if (x === selected.x && y === selected.y) return;
    setSelected({ x, y });
    onInteraction();
  }

  return (
    <div className="labVisualStage pixelVisual" data-lab-kind="pixels">
      <div className="courseImageFrame pixelCourseFrame">
        <img
          className="courseVisualImage"
          src={courseAsset(figureFile)}
          alt="Échantillonnage et discrétisation du support de cours"
          style={{ filter: `grayscale(1) contrast(${95 + bits * 7}%)` }}
        />
        <div
          className="adaptiveOverlay samplingOverlay"
          style={{ '--sample-cols': width, '--sample-rows': height } as CSSProperties}
        >
          <span>{activePart.id === 'quantization' ? `${bits} bits = ${levels} niveaux` : `${height} x ${width}`}</span>
        </div>
      </div>

      <div className="visualGrid pixelBoard" style={{ '--cols': width } as CSSProperties}>
        {cells.map((cell) => {
          const active = cell.x === selected.x && cell.y === selected.y;
          return (
            <button
              key={`${cell.x}-${cell.y}`}
              className={active ? 'pixel active' : 'pixel'}
              style={{ backgroundColor: `rgb(${cell.value}, ${cell.value}, ${cell.value})` }}
              disabled={active}
              onClick={() => selectPixel(cell.x, cell.y)}
              type="button"
              aria-label={`Pixel ${cell.x},${cell.y}, intensité ${cell.value}`}
            />
          );
        })}
      </div>

      <div className="labReadout">
        <article>
          <MousePointer2 size={18} />
          <span>Pixel sélectionné</span>
          <strong>f({selected.x},{selected.y}) = {selectedValue}</strong>
          <small>Valeur simulée avant discrétisation : {selectedRaw}</small>
        </article>
        <article>
          <Binary size={18} />
          <span>Discrétisation</span>
          <strong>{bits} bits = {levels} niveaux</strong>
          <small>Plus k est faible, plus les nuances disparaissent.</small>
        </article>
        <article>
          <Activity size={18} />
          <span>Taille mémoire</span>
          <strong>{height} x {width} x {bits} = {memoryBits} bits</strong>
          <small>M x N x k = {formatBits(memoryBits)}.</small>
        </article>
      </div>

      <div className="labControlsGrid">
        <div className={`controlCard ${activePart.id === 'sampling' ? 'focusControl' : ''}`} data-primary-control={activePart.id === 'sampling' ? true : undefined}>
          <label htmlFor="width">Largeur N : {width}</label>
          <input id="width" type="range" min={6} max={20} value={width} onChange={(event) => setAndTrack(() => setWidth(Number(event.target.value)))} />
        </div>
        <div className={`controlCard ${activePart.id === 'sampling' ? 'focusControl' : ''}`}>
          <label htmlFor="height">Hauteur M : {height}</label>
          <input id="height" type="range" min={5} max={16} value={height} onChange={(event) => setAndTrack(() => setHeight(Number(event.target.value)))} />
        </div>
        <div className={`controlCard ${activePart.id === 'quantization' || activePart.id === 'memory' ? 'focusControl' : ''}`} data-primary-control={activePart.id === 'quantization' || activePart.id === 'memory' ? true : undefined}>
          <label htmlFor="bits">Profondeur k : {bits} bits</label>
          <input id="bits" type="range" min={1} max={8} value={bits} onChange={(event) => setAndTrack(() => setBits(Number(event.target.value)))} />
          <div className="visualControlRow">
            <button disabled={bits === 1} onClick={() => setAndTrack(() => setBits(1))} type="button">1 bit</button>
            <button disabled={bits === 8} onClick={() => setAndTrack(() => setBits(8))} type="button">8 bits</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorLab({ activePart, onInteraction }: { activePart: LabPart; onInteraction: () => void }): JSX.Element {
  const [red, setRed] = useState(220);
  const [green, setGreen] = useState(120);
  const [blue, setBlue] = useState(60);
  const [enabled, setEnabled] = useState({ r: true, g: true, b: true });
  const isChannels = activePart.id === 'channels';
  const value = {
    r: enabled.r ? red : 0,
    g: enabled.g ? green : 0,
    b: enabled.b ? blue : 0,
  };

  function setAndTrack(action: () => void): void {
    action();
    onInteraction();
  }

  return (
    <div
      className="labVisualStage colorVisual"
      data-lab-kind="color"
      style={{ '--red': value.r, '--green': value.g, '--blue': value.b } as CSSProperties}
    >
      <div className="courseImageFrame rgbCourseFrame">
        <img
          className="courseVisualImage"
          src={courseAsset('introduction_p32_fig2.jpeg')}
          alt="Représentation couleur RGB du support de cours"
          style={{ filter: `saturate(${0.8 + (value.r + value.g + value.b) / 765}) contrast(1.08)` }}
        />
        <div className="adaptiveOverlay rgbOverlay">
          <span className="rgbDot redDot" />
          <span className="rgbDot greenDot" />
          <span className="rgbDot blueDot" />
        </div>
      </div>
      <div className="rgbStage">
        <div className="rgbPreview" style={{ backgroundColor: `rgb(${value.r}, ${value.g}, ${value.b})` }} />
        <div className="rgbChannels" data-primary-control={isChannels ? true : undefined}>
            {[
              ['r', 'Rouge', red],
              ['g', 'Vert', green],
              ['b', 'Bleu', blue],
            ].map(([key, label, amount]) => (
              <button
                key={key}
                className={enabled[key as 'r' | 'g' | 'b'] ? `channel ${key} active` : `channel ${key}`}
                onClick={() => setAndTrack(() => setEnabled((current) => ({ ...current, [key]: !current[key as 'r' | 'g' | 'b'] })))}
                type="button"
              >
                <span>{label}</span>
                <strong>{enabled[key as 'r' | 'g' | 'b'] ? amount : 0}</strong>
              </button>
            ))}
        </div>
      </div>
      <div className="labControlsGrid" data-primary-control={isChannels ? undefined : true}>
          <div className="controlCard">
            <label htmlFor="red">Rouge : {red}</label>
            <input id="red" type="range" min={0} max={255} value={red} onChange={(event) => setAndTrack(() => setRed(Number(event.target.value)))} />
          </div>
          <div className="controlCard">
            <label htmlFor="green">Vert : {green}</label>
            <input id="green" type="range" min={0} max={255} value={green} onChange={(event) => setAndTrack(() => setGreen(Number(event.target.value)))} />
          </div>
          <div className="controlCard">
            <label htmlFor="blue">Bleu : {blue}</label>
            <input id="blue" type="range" min={0} max={255} value={blue} onChange={(event) => setAndTrack(() => setBlue(Number(event.target.value)))} />
          </div>
        </div>
      <div className="labReadout">
        <article>
          <Layers3 size={18} />
          <span>Synthèse additive</span>
          <strong>RGB</strong>
          <small>Rouge, vert et bleu comme dans le support.</small>
        </article>
        <article>
          <Activity size={18} />
          <span>Valeur affichée</span>
          <strong>({value.r}, {value.g}, {value.b})</strong>
          <small>Canaux désactivés ramenés à 0 dans cette simulation.</small>
        </article>
        <article>
          <Eye size={18} />
          <span>Usage du cours</span>
          <strong>Affichage</strong>
          <small>Écrans, téléviseurs, projecteurs, téléphones.</small>
        </article>
      </div>
    </div>
  );
}

function RoiLab({ activePart, onInteraction }: { activePart: LabPart; onInteraction: () => void }): JSX.Element {
  const [roiX, setRoiX] = useState(2);
  const [roiY, setRoiY] = useState(2);
  const [scale, setScale] = useState(2);
  const [method, setMethod] = useState<'nearest' | 'bilinear'>('nearest');
  const size = 8;
  const values = Array.from({ length: size * size }, (_, index) => {
    const x = index % size;
    const y = Math.floor(index / size);
    return rawIntensity(x, y, size, size);
  });
  const previewSize = 3 * scale;
  const readValue = (x: number, y: number): number => values[Math.max(0, Math.min(size - 1, y)) * size + Math.max(0, Math.min(size - 1, x))];
  const resizedCells = Array.from({ length: previewSize * previewSize }, (_, index) => {
    const x = index % previewSize;
    const y = Math.floor(index / previewSize);
    const sourceX = roiX + x / scale;
    const sourceY = roiY + y / scale;
    if (method === 'nearest') {
      return readValue(Math.round(sourceX), Math.round(sourceY));
    }
    const x0 = Math.floor(sourceX);
    const y0 = Math.floor(sourceY);
    const x1 = Math.min(size - 1, x0 + 1);
    const y1 = Math.min(size - 1, y0 + 1);
    const dx = sourceX - x0;
    const dy = sourceY - y0;
    const top = readValue(x0, y0) * (1 - dx) + readValue(x1, y0) * dx;
    const bottom = readValue(x0, y1) * (1 - dx) + readValue(x1, y1) * dx;
    return Math.round(top * (1 - dy) + bottom * dy);
  });
  const sample = method === 'nearest'
    ? values[roiY * size + roiX]
    : Math.round((values[roiY * size + roiX] + values[roiY * size + roiX + 1] + values[(roiY + 1) * size + roiX] + values[(roiY + 1) * size + roiX + 1]) / 4);
  const figureFile = activePart.id === 'resize'
    ? 'introduction_p34_fig1.jpeg'
    : activePart.id === 'interpolation'
      ? method === 'nearest' ? 'introduction_p35_fig5.jpeg' : 'introduction_p35_fig9.jpeg'
      : 'introduction_p33_fig2.jpeg';

  function setAndTrack(action: () => void): void {
    action();
    onInteraction();
  }

  function setMethodAndTrack(nextMethod: 'nearest' | 'bilinear'): void {
    if (nextMethod === method) return;
    setMethod(nextMethod);
    onInteraction();
  }

  return (
    <div
      className="labVisualStage roiVisual"
      data-lab-kind="roi"
      style={{
        '--roi-left': `${(roiX / size) * 100}%`,
        '--roi-top': `${(roiY / size) * 100}%`,
        '--roi-size': `${(3 / size) * 100}%`,
      } as CSSProperties}
    >
      <div className="courseImageFrame roiCourseFrame">
        <img
          className="courseVisualImage"
          src={courseAsset(figureFile)}
          alt="Region Of Interest du support de cours"
        />
        <div className="adaptiveOverlay roiImageOverlay">
          <span>{activePart.id === 'resize' ? `resize x${scale}` : activePart.id === 'interpolation' ? method : 'ROI'}</span>
        </div>
      </div>

      <div className="visualGrid roiBoard" style={{ '--cols': size } as CSSProperties}>
        {values.map((value, index) => {
          const x = index % size;
          const y = Math.floor(index / size);
          const inRoi = x >= roiX && x < roiX + 3 && y >= roiY && y < roiY + 3;
          return (
            <span
              key={`${x}-${y}`}
              className={inRoi ? 'roiPixel selected' : 'roiPixel'}
              style={{ backgroundColor: `rgb(${value}, ${value}, ${value})` }}
            />
          );
        })}
      </div>
      <div className="resizePreview" style={{ '--resize-cols': previewSize } as CSSProperties}>
        {resizedCells.map((value, index) => (
          <span key={index} style={{ backgroundColor: `rgb(${value}, ${value}, ${value})` }} />
        ))}
      </div>
      <div className="labReadout">
        <article>
          <MousePointer2 size={18} />
          <span>ROI</span>
          <strong>x={roiX}, y={roiY}, 3 x 3</strong>
          <small>Zone d’intérêt dans l’image.</small>
        </article>
        <article>
          <Activity size={18} />
          <span>Resize simulé</span>
          <strong>facteur x{scale}</strong>
          <small>La nouvelle grille demande des valeurs d’intensité.</small>
        </article>
        <article>
          <Gauge size={18} />
          <span>Méthode</span>
          <strong>{method === 'nearest' ? 'Plus proche voisin' : 'Bilinéaire'}</strong>
          <small>Exemple de valeur produite : {sample}</small>
        </article>
      </div>
      <div className="labControlsGrid">
          <div className={`controlCard ${activePart.id === 'roi' ? 'focusControl' : ''}`} data-primary-control={activePart.id === 'roi' ? true : undefined}>
            <label htmlFor="roiX">Position ROI x : {roiX}</label>
            <input id="roiX" type="range" min={0} max={5} value={roiX} onChange={(event) => setAndTrack(() => setRoiX(Number(event.target.value)))} />
          </div>
          <div className={`controlCard ${activePart.id === 'roi' ? 'focusControl' : ''}`}>
            <label htmlFor="roiY">Position ROI y : {roiY}</label>
            <input id="roiY" type="range" min={0} max={5} value={roiY} onChange={(event) => setAndTrack(() => setRoiY(Number(event.target.value)))} />
          </div>
          <div className={`controlCard ${activePart.id === 'resize' ? 'focusControl' : ''}`} data-primary-control={activePart.id === 'resize' ? true : undefined}>
          <label htmlFor="scale">Facteur resize : x{scale}</label>
          <input id="scale" type="range" min={2} max={4} value={scale} onChange={(event) => setAndTrack(() => setScale(Number(event.target.value)))} />
          </div>
        </div>
        <div className={`methodSwitch ${activePart.id === 'interpolation' ? 'focusControl' : ''}`} data-primary-control={activePart.id === 'interpolation' ? true : undefined}>
          <button className={method === 'nearest' ? 'active' : ''} disabled={method === 'nearest'} onClick={() => setMethodAndTrack('nearest')} type="button">Plus proche voisin</button>
          <button className={method === 'bilinear' ? 'active' : ''} disabled={method === 'bilinear'} onClick={() => setMethodAndTrack('bilinear')} type="button">Bilinéaire</button>
        </div>
    </div>
  );
}

function IntensityMapLab({ activePart, onInteraction }: { activePart: LabPart; onInteraction: () => void }): JSX.Element {
  const [mapping, setMapping] = useState<'identity' | 'log' | 'bit'>('identity');
  const [bit, setBit] = useState(7);
  const [selected, setSelected] = useState({ x: 4, y: 4 });
  const effectiveMapping = activePart.id === 'bit-plane' ? 'bit' : mapping;
  const size = 10;
  const sourceValues = Array.from({ length: size * size }, (_, index) => {
    const x = index % size;
    const y = Math.floor(index / size);
    return rawIntensity(x, y, size, size);
  });
  const transform = (value: number): number => {
    if (effectiveMapping === 'log') return logTransform(value, 3);
    if (effectiveMapping === 'bit') return ((value >> bit) & 1) * 255;
    return value;
  };
  const outputValues = sourceValues.map(transform);
  const selectedIndex = selected.y * size + selected.x;
  const selectedInput = sourceValues[selectedIndex];
  const selectedOutput = outputValues[selectedIndex];
  const curveSamples = Array.from({ length: 16 }, (_, index) => {
    const input = Math.round((index / 15) * 255);
    return { input, output: transform(input) };
  });

  function setAndTrack(action: () => void): void {
    action();
    onInteraction();
  }

  function selectPixel(x: number, y: number): void {
    if (x === selected.x && y === selected.y) return;
    setSelected({ x, y });
    onInteraction();
  }

  function selectMapping(nextMapping: 'identity' | 'log' | 'bit'): void {
    if (nextMapping === effectiveMapping) return;
    setMapping(nextMapping);
    onInteraction();
  }

  return (
    <div className="labVisualStage intensityVisual" data-lab-kind="intensity-map">
      <div className="courseImageFrame intensityCourseFrame">
        <img
          className="courseVisualImage"
          src={chapter2CourseAsset(activePart.id === 'bit-plane' ? 'transformationIntensite_p9_fig4.jpeg' : 'transformationIntensite_p2_fig2.jpeg')}
          alt="Types de transformation d’intensité du support de cours"
        />
        <div className="adaptiveOverlay intensityOverlay">
          <span>{activePart.id === 'bit-plane' ? `bit ${bit}` : 'g(x,y)=T[f(x,y)]'}</span>
        </div>
      </div>

      <div className="intensityWorkbench">
        <div className="visualGrid transformGrid" style={{ '--cols': size } as CSSProperties}>
          {outputValues.map((value, index) => {
            const x = index % size;
            const y = Math.floor(index / size);
            const active = x === selected.x && y === selected.y;
            return (
              <button
                key={`${x}-${y}`}
                className={active ? 'pixel active' : 'pixel'}
                style={{ backgroundColor: `rgb(${value}, ${value}, ${value})` }}
                disabled={active}
                onClick={() => selectPixel(x, y)}
                type="button"
                aria-label={`Pixel ${x},${y}, sortie ${value}`}
              />
            );
          })}
        </div>
        <div className="curvePanel" aria-label="Courbe de transformation">
          {curveSamples.map((sample) => (
            <span
              key={sample.input}
              style={{ height: `${Math.max(6, (sample.output / 255) * 100)}%` }}
              title={`${sample.input} -> ${sample.output}`}
            />
          ))}
        </div>
      </div>

      <div className="labReadout">
        <article>
          <MousePointer2 size={18} />
          <span>Pixel choisi</span>
          <strong>f({selected.x},{selected.y}) = {selectedInput}</strong>
          <small>La sortie vaut g({selected.x},{selected.y}) = {selectedOutput}.</small>
        </article>
        <article>
          <Activity size={18} />
          <span>Transformation T</span>
          <strong>{effectiveMapping === 'identity' ? 'Identité' : effectiveMapping === 'log' ? 'Log' : `Bit ${bit}`}</strong>
          <small>La manipulation reste point par point : voisinage 1x1.</small>
        </article>
        <article>
          <Binary size={18} />
          <span>Plan de bits</span>
          <strong>{effectiveMapping === 'bit' ? `${bit + 1}e bit` : 'désactivé'}</strong>
          <small>Le labo 2 demande une fonction bitwise() normalisée.</small>
        </article>
      </div>

      <div className="labControlsGrid">
          <div className={`controlCard ${activePart.id === 'function-t' ? 'focusControl' : ''}`} data-primary-control={activePart.id === 'function-t' ? true : undefined}>
          <label>Famille de T</label>
          <div className="methodSwitch inline">
            <button className={effectiveMapping === 'identity' ? 'active' : ''} disabled={effectiveMapping === 'identity'} onClick={() => selectMapping('identity')} type="button">Identité</button>
            <button className={effectiveMapping === 'log' ? 'active' : ''} disabled={effectiveMapping === 'log'} onClick={() => selectMapping('log')} type="button">Log</button>
            <button className={effectiveMapping === 'bit' ? 'active' : ''} disabled={effectiveMapping === 'bit'} onClick={() => selectMapping('bit')} type="button">Bit plane</button>
          </div>
          </div>
          <div className={`controlCard ${activePart.id === 'bit-plane' ? 'focusControl' : ''}`} data-primary-control={activePart.id === 'bit-plane' ? true : undefined}>
          <label htmlFor="bitPlane">Bit sélectionné : {bit}</label>
          <input id="bitPlane" type="range" min={0} max={7} value={bit} onChange={(event) => setAndTrack(() => setBit(Number(event.target.value)))} />
          </div>
        </div>
    </div>
  );
}

function IntensityInvertLab({ activePart, onInteraction }: { activePart: LabPart; onInteraction: () => void }): JSX.Element {
  const [mode, setMode] = useState<'identity' | 'negative' | 'threshold'>('negative');
  const [threshold, setThreshold] = useState(140);
  const [selected, setSelected] = useState({ x: 5, y: 3 });
  const effectiveMode = activePart.id === 'threshold' ? 'threshold' : mode;
  const width = 12;
  const height = 8;
  const sourceValues = Array.from({ length: width * height }, (_, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    return rawIntensity(x, y, width, height);
  });
  const transform = (value: number): number => {
    if (effectiveMode === 'negative') return 255 - value;
    if (effectiveMode === 'threshold') return value > threshold ? 255 : 0;
    return value;
  };
  const outputValues = sourceValues.map(transform);
  const selectedIndex = selected.y * width + selected.x;
  const selectedInput = sourceValues[selectedIndex];
  const selectedOutput = outputValues[selectedIndex];
  const imageFilter = effectiveMode === 'negative'
    ? 'invert(1) grayscale(1) contrast(1.08)'
    : effectiveMode === 'threshold'
      ? 'grayscale(1) contrast(2.8)'
      : 'grayscale(1) contrast(1.05)';

  function setAndTrack(action: () => void): void {
    action();
    onInteraction();
  }

  function selectPixel(x: number, y: number): void {
    if (x === selected.x && y === selected.y) return;
    setSelected({ x, y });
    onInteraction();
  }

  function selectMode(nextMode: 'identity' | 'negative' | 'threshold'): void {
    if (nextMode === effectiveMode) return;
    setMode(nextMode);
    onInteraction();
  }

  return (
    <div className="labVisualStage intensityVisual" data-lab-kind="intensity-invert">
      <div className="courseImageFrame intensityCourseFrame">
        <img
          className="courseVisualImage"
          src={chapter2LabAsset(effectiveMode === 'threshold' ? 'labo_02_p2_fig0.jpeg' : 'labo_02_p1_fig8.jpeg')}
          alt="Résultat du labo 2 pour négatif ou seuillage"
          style={{ filter: imageFilter }}
        />
        <div className="adaptiveOverlay intensityOverlay">
          <span>{effectiveMode === 'threshold' ? `seuil ${threshold}` : effectiveMode}</span>
        </div>
      </div>

      <div className="dualTransform">
        <div className="visualGrid transformGrid" style={{ '--cols': width } as CSSProperties}>
          {sourceValues.map((value, index) => <span key={index} className="pixel" style={{ backgroundColor: `rgb(${value}, ${value}, ${value})` }} />)}
        </div>
        <div className="visualGrid transformGrid" style={{ '--cols': width } as CSSProperties}>
          {outputValues.map((value, index) => {
            const x = index % width;
            const y = Math.floor(index / width);
            const active = x === selected.x && y === selected.y;
            return (
              <button
                key={`${x}-${y}`}
                className={active ? 'pixel active' : 'pixel'}
                style={{ backgroundColor: `rgb(${value}, ${value}, ${value})` }}
                disabled={active}
                onClick={() => selectPixel(x, y)}
                type="button"
                aria-label={`Pixel transformé ${x},${y}`}
              />
            );
          })}
        </div>
      </div>

      <div className="labReadout">
        <article>
          <Activity size={18} />
          <span>Règle active</span>
          <strong>{effectiveMode === 'negative' ? 's=255-r' : effectiveMode === 'threshold' ? `r>${threshold}` : 's=r'}</strong>
          <small>Le labo précise 255 si le pixel dépasse le seuil, 0 sinon.</small>
        </article>
        <article>
          <MousePointer2 size={18} />
          <span>Pixel</span>
          <strong>{selectedInput} vers {selectedOutput}</strong>
          <small>La transformation dépend uniquement de cette intensité.</small>
        </article>
        <article>
          <Target size={18} />
          <span>Usage</span>
          <strong>{effectiveMode === 'threshold' ? 'Segmentation' : 'Lisibilité'}</strong>
          <small>{effectiveMode === 'threshold' ? 'Le seuil est un input humain.' : 'Le négatif aide si les zones sombres dominent.'}</small>
        </article>
      </div>

      <div className="labControlsGrid">
          <div className={`controlCard ${activePart.id === 'negative' ? 'focusControl' : ''}`} data-primary-control={activePart.id === 'negative' ? true : undefined}>
            <label>Transformation</label>
            <div className="methodSwitch inline">
              <button className={effectiveMode === 'identity' ? 'active' : ''} disabled={effectiveMode === 'identity'} onClick={() => selectMode('identity')} type="button">Identité</button>
              <button className={effectiveMode === 'negative' ? 'active' : ''} disabled={effectiveMode === 'negative'} onClick={() => selectMode('negative')} type="button">Négatif</button>
              <button className={effectiveMode === 'threshold' ? 'active' : ''} disabled={effectiveMode === 'threshold'} onClick={() => selectMode('threshold')} type="button">Seuil</button>
            </div>
          </div>
          <div className={`controlCard ${activePart.id === 'threshold' ? 'focusControl' : ''}`} data-primary-control={activePart.id === 'threshold' ? true : undefined}>
            <label htmlFor="threshold">Seuil : {threshold}</label>
            <input id="threshold" type="range" min={20} max={235} value={threshold} onChange={(event) => setAndTrack(() => setThreshold(Number(event.target.value)))} />
          </div>
        </div>
    </div>
  );
}

function IntensityGammaLab({ activePart, onInteraction }: { activePart: LabPart; onInteraction: () => void }): JSX.Element {
  const mode = activePart.id === 'log' ? 'log' : 'gamma';
  const [gamma, setGamma] = useState(0.6);
  const [constant, setConstant] = useState(2);
  const width = 14;
  const height = 8;
  const sourceValues = Array.from({ length: width * height }, (_, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    return clampByte(rawIntensity(x, y, width, height) * 0.72);
  });
  const transform = (value: number): number => mode === 'log' ? logTransform(value, constant) : gammaTransform(value, gamma);
  const outputValues = sourceValues.map(transform);
  const curveSamples = Array.from({ length: 24 }, (_, index) => {
    const input = Math.round((index / 23) * 255);
    return { input, output: transform(input) };
  });
  const averageBefore = Math.round(sourceValues.reduce((sum, value) => sum + value, 0) / sourceValues.length);
  const averageAfter = Math.round(outputValues.reduce((sum, value) => sum + value, 0) / outputValues.length);

  function setAndTrack(action: () => void): void {
    action();
    onInteraction();
  }

  return (
    <div className="labVisualStage gammaVisual" data-lab-kind="intensity-gamma">
      <div className="courseImageFrame intensityCourseFrame">
        <img
          className="courseVisualImage"
          src={chapter2CourseAsset(mode === 'log' ? 'transformationIntensite_p6_fig2.jpeg' : 'transformationIntensite_p7_fig3.jpeg')}
          alt="Courbes log et gamma du support de cours"
          style={{ filter: `grayscale(1) brightness(${0.8 + averageAfter / 255}) contrast(1.12)` }}
        />
        <div className="adaptiveOverlay intensityOverlay">
          <span>{mode === 'log' ? `log c=${constant.toFixed(1)}` : `gamma=${gamma.toFixed(1)}`}</span>
        </div>
      </div>

      <div className="intensityWorkbench">
        <div className="visualGrid transformGrid" style={{ '--cols': width } as CSSProperties}>
          {outputValues.map((value, index) => <span key={index} className="pixel" style={{ backgroundColor: `rgb(${value}, ${value}, ${value})` }} />)}
        </div>
        <div className="curvePanel wide" aria-label="Courbe log ou gamma">
          {curveSamples.map((sample) => (
            <span
              key={sample.input}
              style={{ height: `${Math.max(5, (sample.output / 255) * 100)}%` }}
              title={`${sample.input} -> ${sample.output}`}
            />
          ))}
        </div>
      </div>

      <div className="labReadout">
        <article>
          <Gauge size={18} />
          <span>Moyenne image</span>
          <strong>{averageBefore} vers {averageAfter}</strong>
          <small>Le rendu change avec la transformation non linéaire.</small>
        </article>
        <article>
          <Activity size={18} />
          <span>Mode</span>
          <strong>{mode === 'log' ? 'Logarithmique' : 'Gamma'}</strong>
          <small>{mode === 'log' ? 'Dilatation des faibles intensités.' : 'Loi de puissance du chapitre.'}</small>
        </article>
        <article>
          <Eye size={18} />
          <span>Lecture cours</span>
          <strong>{mode === 'gamma' && gamma < 1 ? 'image sombre' : mode === 'gamma' ? 'image claire' : 'faibles valeurs'}</strong>
          <small>{mode === 'gamma' && gamma < 1 ? 'Gamma inférieur à 1 éclaircit.' : mode === 'gamma' ? 'Gamma supérieur à 1 assombrit.' : 'Le log les rend plus visibles.'}</small>
        </article>
      </div>

      <div className="labControlsGrid">
          <div className={`controlCard ${mode === 'gamma' ? 'focusControl' : ''}`} data-primary-control={mode === 'gamma' ? true : undefined}>
            <label htmlFor="gamma">Gamma : {gamma.toFixed(1)}</label>
            <input id="gamma" type="range" min={0.3} max={5} step={0.1} value={gamma} onChange={(event) => setAndTrack(() => setGamma(Number(event.target.value)))} />
          </div>
          <div className={`controlCard ${mode === 'log' ? 'focusControl' : ''}`} data-primary-control={mode === 'log' ? true : undefined}>
            <label htmlFor="logConstant">Constante log : {constant.toFixed(1)}</label>
            <input id="logConstant" type="range" min={0.5} max={6} step={0.5} value={constant} onChange={(event) => setAndTrack(() => setConstant(Number(event.target.value)))} />
          </div>
        </div>
    </div>
  );
}

function HistogramBars({ counts, showCumulative = false }: { counts: number[]; showCumulative?: boolean }): JSX.Element {
  const max = Math.max(1, ...counts);
  const cdf = cumulative(counts);
  const cdfMax = Math.max(1, cdf[cdf.length - 1]);
  return (
    <div className="histogramBars">
      {counts.map((count, index) => (
        <span key={index} style={{ height: `${Math.max(4, (count / max) * 100)}%` }}>
          {showCumulative && <i style={{ bottom: `${(cdf[index] / cdfMax) * 100}%` }} />}
        </span>
      ))}
    </div>
  );
}

function distributionValues(kind: 'dark' | 'balanced' | 'bright' | 'bimodal', count = 144): number[] {
  return Array.from({ length: count }, (_, index) => {
    const wave = Math.round(((Math.sin(index * 0.47) + 1) / 2) * 34);
    const jitter = (index * 37) % 31;
    if (kind === 'dark') return clampByte(18 + ((index * 19) % 72) + wave * 0.35);
    if (kind === 'bright') return clampByte(158 + ((index * 17) % 80) + wave * 0.35);
    if (kind === 'bimodal') return index % 2 === 0 ? clampByte(38 + jitter) : clampByte(178 + jitter + wave * 0.25);
    return clampByte(((index * 29) % 210) + 24 + wave * 0.2);
  });
}

function HistogramLab({ activePart, onInteraction }: { activePart: LabPart; onInteraction: () => void }): JSX.Element {
  const [distribution, setDistribution] = useState<'dark' | 'balanced' | 'bright' | 'bimodal'>('bimodal');
  const [showCumulative, setShowCumulative] = useState(true);
  const effectiveShowCumulative = showCumulative;
  const values = distributionValues(distribution);
  const counts = histogram(values, 16);
  const width = 12;

  function setAndTrack(action: () => void): void {
    action();
    onInteraction();
  }

  function selectDistribution(nextDistribution: 'dark' | 'balanced' | 'bright' | 'bimodal'): void {
    if (nextDistribution === distribution) return;
    setDistribution(nextDistribution);
    onInteraction();
  }

  return (
    <div className="labVisualStage histogramVisual" data-lab-kind="histogram">
      <div className="courseImageFrame histogramCourseFrame">
        <img
          className="courseVisualImage"
          src={chapter2CourseAsset(activePart.id === 'cumulative' ? 'transformationIntensite_p11_fig1.jpeg' : 'transformationIntensite_p12_fig1.jpeg')}
          alt="Histogramme des intensités du support de cours"
        />
        <div className="adaptiveOverlay intensityOverlay">
          <span>{effectiveShowCumulative ? 'histogramme + cumulative' : 'histogramme'}</span>
        </div>
      </div>

      <div className="histogramWorkbench">
        <div className="visualGrid transformGrid" style={{ '--cols': width } as CSSProperties}>
          {values.map((value, index) => <span key={index} className="pixel" style={{ backgroundColor: `rgb(${value}, ${value}, ${value})` }} />)}
        </div>
        <HistogramBars counts={counts} showCumulative={effectiveShowCumulative} />
      </div>

      <div className="labReadout">
        <article>
          <BarChart3 size={18} />
          <span>Classes</span>
          <strong>{counts.length}</strong>
          <small>Chaque barre compte une plage d’intensités.</small>
        </article>
        <article>
          <Activity size={18} />
          <span>Pixels comptés</span>
          <strong>{values.length}</strong>
          <small>Le labo demande un tableau de fréquences.</small>
        </article>
        <article>
          <Gauge size={18} />
          <span>Cumulative</span>
          <strong>{effectiveShowCumulative ? 'visible' : 'masquée'}</strong>
          <small>Elle additionne les fréquences de gauche à droite.</small>
        </article>
      </div>

      <div className="labControlsGrid">
          <div className={`controlCard ${activePart.id === 'histogram' ? 'focusControl' : ''}`} data-primary-control={activePart.id === 'histogram' ? true : undefined}>
            <label>Distribution simulée</label>
            <div className="methodSwitch inline">
              <button className={distribution === 'dark' ? 'active' : ''} disabled={distribution === 'dark'} onClick={() => selectDistribution('dark')} type="button">Sombre</button>
              <button className={distribution === 'balanced' ? 'active' : ''} disabled={distribution === 'balanced'} onClick={() => selectDistribution('balanced')} type="button">Étalée</button>
              <button className={distribution === 'bright' ? 'active' : ''} disabled={distribution === 'bright'} onClick={() => selectDistribution('bright')} type="button">Claire</button>
              <button className={distribution === 'bimodal' ? 'active' : ''} disabled={distribution === 'bimodal'} onClick={() => selectDistribution('bimodal')} type="button">Deux pics</button>
            </div>
          </div>
          <div className={`controlCard toggleCard ${activePart.id === 'cumulative' ? 'focusControl' : ''}`} data-primary-control={activePart.id === 'cumulative' ? true : undefined}>
            <label htmlFor="showCumulative">Afficher la cumulative</label>
            <input id="showCumulative" type="checkbox" checked={showCumulative} onChange={(event) => setAndTrack(() => setShowCumulative(event.target.checked))} />
          </div>
        </div>
    </div>
  );
}

function HistogramEqualizationLab({ activePart, onInteraction }: { activePart: LabPart; onInteraction: () => void }): JSX.Element {
  const [method, setMethod] = useState<'source' | 'normalize' | 'equalize'>('equalize');
  const effectiveMethod = activePart.id === 'normalize'
    ? method === 'equalize' ? 'normalize' : method
    : method === 'normalize' ? 'equalize' : method;
  const sourceValues = distributionValues('bimodal').map((value) => clampByte(82 + value * 0.32));
  const normalized = normalizeValues(sourceValues);
  const equalized = equalizeValues(sourceValues);
  const outputValues = effectiveMethod === 'normalize' ? normalized : effectiveMethod === 'equalize' ? equalized : sourceValues;
  const sourceCounts = histogram(sourceValues, 16);
  const outputCounts = histogram(outputValues, 16);
  const width = 12;
  const rangeBefore = `${Math.min(...sourceValues)}-${Math.max(...sourceValues)}`;
  const rangeAfter = `${Math.min(...outputValues)}-${Math.max(...outputValues)}`;

  function setAndTrack(nextMethod: 'source' | 'normalize' | 'equalize'): void {
    if (nextMethod === effectiveMethod) return;
    setMethod(nextMethod);
    onInteraction();
  }

  return (
    <div className="labVisualStage histogramVisual equalizationVisual" data-lab-kind="histogram-equalization">
      <div className="courseImageFrame histogramCourseFrame">
        <img
          className="courseVisualImage"
          src={chapter2CourseAsset(effectiveMethod === 'equalize' ? 'transformationIntensite_p17_fig9.jpeg' : 'transformationIntensite_p15_fig1.jpeg')}
          alt="Normalisation ou égalisation d’histogramme du support de cours"
        />
        <div className="adaptiveOverlay intensityOverlay">
          <span>{effectiveMethod === 'equalize' ? 'T(I)=Imax F_old(I)' : effectiveMethod}</span>
        </div>
      </div>

      <div className="histogramWorkbench equalizationWorkbench">
        <div className="visualGrid transformGrid" style={{ '--cols': width } as CSSProperties}>
          {outputValues.map((value, index) => <span key={index} className="pixel" style={{ backgroundColor: `rgb(${value}, ${value}, ${value})` }} />)}
        </div>
        <div className="histCompare">
          <div>
            <span>Avant</span>
            <HistogramBars counts={sourceCounts} />
          </div>
          <div>
            <span>Après</span>
            <HistogramBars counts={outputCounts} showCumulative={effectiveMethod === 'equalize'} />
          </div>
        </div>
      </div>

      <div className="labReadout">
        <article>
          <Gauge size={18} />
          <span>Plage</span>
          <strong>{rangeBefore} vers {rangeAfter}</strong>
          <small>La normalisation étend linéairement la plage disponible.</small>
        </article>
        <article>
          <BarChart3 size={18} />
          <span>Histogramme</span>
          <strong>{effectiveMethod === 'equalize' ? 'plus uniforme' : effectiveMethod === 'normalize' ? 'étendu' : 'source'}</strong>
          <small>{effectiveMethod === 'equalize' ? 'L’égalisation utilise la cumulative.' : 'La forme est surtout conservée en normalisation.'}</small>
        </article>
        <article>
          <Activity size={18} />
          <span>Paramètre</span>
          <strong>{effectiveMethod === 'equalize' ? 'aucun' : effectiveMethod === 'normalize' ? 'min/max' : 'aucun traitement'}</strong>
          <small>Le cours précise que l’égalisation ne nécessite pas de paramétrisation.</small>
        </article>
      </div>

      <div className={`methodSwitch ${activePart.id === 'normalize' || activePart.id === 'equalize' ? 'focusControl' : ''}`} data-primary-control>
        <button className={effectiveMethod === 'source' ? 'active' : ''} disabled={effectiveMethod === 'source'} onClick={() => setAndTrack('source')} type="button">Source</button>
        <button className={effectiveMethod === 'normalize' ? 'active' : ''} disabled={effectiveMethod === 'normalize'} onClick={() => setAndTrack('normalize')} type="button">Normaliser</button>
        <button className={effectiveMethod === 'equalize' ? 'active' : ''} disabled={effectiveMethod === 'equalize'} onClick={() => setAndTrack('equalize')} type="button">Égaliser</button>
      </div>
    </div>
  );
}

function activeCourseFigure(module: ModuleContent, activePart: LabPart): FigureNote {
  const partIndex = Math.max(0, module.lab.parts.findIndex((part) => part.id === activePart.id));
  return module.figureNotes[partIndex % module.figureNotes.length] || module.figureNotes[0];
}

function AdvancedCourseImage({
  figure,
  label,
  filter,
  children,
}: {
  figure: FigureNote;
  label: string;
  filter?: string;
  children?: JSX.Element;
}): JSX.Element {
  return (
    <div className="courseImageFrame advancedCourseFrame">
      <img
        className="courseVisualImage"
        src={figureAsset(figure)}
        alt={figure.title}
        style={{ filter }}
      />
      <div className="adaptiveOverlay advancedOverlay">
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

function spatialSourceValue(x: number, y: number, width: number, height: number, period: number, noise: number, edgeBoost = 0): number {
  const wave = ((Math.sin((x / Math.max(2, period)) * Math.PI * 2) + 1) / 2) * 92;
  const slow = (x / Math.max(1, width - 1)) * 58 + (y / Math.max(1, height - 1)) * 42;
  const edge = x > width / 2 ? edgeBoost : 0;
  const impulse = (x * 23 + y * 31) % 37 === 0 ? noise : 0;
  const pepper = (x * 17 + y * 19) % 41 === 0 ? -noise * 0.8 : 0;
  return clampByte(42 + slow + wave + edge + impulse + pepper);
}

function neighborhoodValues(values: number[], width: number, height: number, x: number, y: number, radius: number): number[] {
  const result: number[] = [];
  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      const nx = Math.max(0, Math.min(width - 1, x + dx));
      const ny = Math.max(0, Math.min(height - 1, y + dy));
      result.push(values[ny * width + nx]);
    }
  }
  return result;
}

function meanAround(values: number[], width: number, height: number, x: number, y: number, radius: number): number {
  const neighbors = neighborhoodValues(values, width, height, x, y, radius);
  return clampByte(neighbors.reduce((sum, value) => sum + value, 0) / neighbors.length);
}

function medianAround(values: number[], width: number, height: number, x: number, y: number, radius: number): number {
  const neighbors = neighborhoodValues(values, width, height, x, y, radius).sort((first, second) => first - second);
  return neighbors[Math.floor(neighbors.length / 2)] || 0;
}

function gaussianAround(values: number[], width: number, height: number, x: number, y: number, sigma: number): number {
  const radius = Math.max(1, Math.min(3, Math.ceil(sigma * 1.5)));
  let weighted = 0;
  let total = 0;
  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      const nx = Math.max(0, Math.min(width - 1, x + dx));
      const ny = Math.max(0, Math.min(height - 1, y + dy));
      const weight = Math.exp(-((dx * dx + dy * dy) / (2 * sigma * sigma)));
      weighted += values[ny * width + nx] * weight;
      total += weight;
    }
  }
  return clampByte(weighted / Math.max(0.0001, total));
}

function bilateralAround(values: number[], width: number, height: number, x: number, y: number, spatialSigma: number, intensitySigma: number): number {
  const radius = Math.max(1, Math.min(4, Math.ceil(spatialSigma * 1.4)));
  const center = values[y * width + x];
  let weighted = 0;
  let total = 0;
  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      const nx = Math.max(0, Math.min(width - 1, x + dx));
      const ny = Math.max(0, Math.min(height - 1, y + dy));
      const value = values[ny * width + nx];
      const spatial = Math.exp(-((dx * dx + dy * dy) / (2 * spatialSigma * spatialSigma)));
      const intensity = Math.exp(-(((value - center) * (value - center)) / (2 * intensitySigma * intensitySigma)));
      const weight = spatial * intensity;
      weighted += value * weight;
      total += weight;
    }
  }
  return clampByte(weighted / Math.max(0.0001, total));
}

function SpatialLowpassLab({ module, activePart, onInteraction }: { module: ModuleContent; activePart: LabPart; onInteraction: () => void }): JSX.Element {
  const [period, setPeriod] = useState(8);
  const [kernelSize, setKernelSize] = useState(3);
  const [sigma, setSigma] = useState(1.4);
  const [intensitySigma, setIntensitySigma] = useState(36);
  const [noise, setNoise] = useState(72);
  const [mode, setMode] = useState<'source' | 'lowpass' | 'highpass' | 'box' | 'gaussian' | 'median' | 'bilateral'>('lowpass');
  const width = 18;
  const height = 10;
  const figure = activeCourseFigure(module, activePart);
  const isLowHigh = activePart.id === 'low-high' || activePart.id === 'spectral';
  const isLissage = activePart.id === 'box' || activePart.id === 'gaussian' || activePart.id === 'median';
  const isBilateral = activePart.id === 'spatial-weight' || activePart.id === 'intensity-weight' || activePart.id === 'edges';
  const radius = Math.max(1, Math.floor(kernelSize / 2));
  const effectiveMode = isBilateral
    ? 'bilateral'
    : activePart.id === 'median'
      ? 'median'
      : activePart.id === 'gaussian'
        ? 'gaussian'
        : activePart.id === 'box'
          ? 'box'
          : isLowHigh
            ? mode
            : mode;
  const sourceValues = useMemo(() => Array.from({ length: width * height }, (_, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    const edgeBoost = isBilateral ? 70 : 0;
    return spatialSourceValue(x, y, width, height, period, noise, edgeBoost);
  }), [period, noise, isBilateral]);
  const outputValues = sourceValues.map((value, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    const mean = meanAround(sourceValues, width, height, x, y, radius);
    if (effectiveMode === 'source') return value;
    if (effectiveMode === 'highpass') return clampByte(Math.abs(value - mean) * 2.6);
    if (effectiveMode === 'median') return medianAround(sourceValues, width, height, x, y, radius);
    if (effectiveMode === 'gaussian') return gaussianAround(sourceValues, width, height, x, y, sigma);
    if (effectiveMode === 'bilateral') return bilateralAround(sourceValues, width, height, x, y, Math.max(0.8, sigma), Math.max(6, intensitySigma));
    return mean;
  });
  const variationBefore = Math.round(sourceValues.reduce((sum, value, index) => sum + Math.abs(value - (sourceValues[index - 1] ?? value)), 0) / sourceValues.length);
  const variationAfter = Math.round(outputValues.reduce((sum, value, index) => sum + Math.abs(value - (outputValues[index - 1] ?? value)), 0) / outputValues.length);
  const spatialModeLabel = effectiveMode === 'lowpass'
    ? 'passe-bas'
    : effectiveMode === 'highpass'
      ? 'passe-haut'
      : effectiveMode === 'box'
        ? 'moyenne'
        : effectiveMode === 'gaussian'
          ? 'gaussien'
          : effectiveMode === 'median'
            ? 'médian'
            : effectiveMode === 'bilateral'
              ? 'bilatéral'
              : 'source';
  const spectrum = Array.from({ length: 16 }, (_, index) => {
    const centerDistance = Math.abs(index - 7.5);
    const pass = effectiveMode === 'highpass' ? centerDistance / 7.5 : 1 - centerDistance / 8.5;
    const texture = Math.abs(Math.sin((index + 1) * period * 0.33));
    return Math.max(8, Math.round((0.25 + texture * 0.55 + pass * 0.65) * 100));
  });

  function setAndTrack(action: () => void): void {
    action();
    onInteraction();
  }

  function selectMode(nextMode: typeof mode): void {
    if (nextMode === mode) return;
    setMode(nextMode);
    onInteraction();
  }

  const primaryControl = (): JSX.Element => {
    if (activePart.id === 'frequency' || activePart.id === 'spectral') {
      return (
        <div className="controlCard focusControl" data-primary-control>
          <label htmlFor="spatialPeriod">Période du motif : {period} px</label>
          <input id="spatialPeriod" type="range" min={3} max={18} value={period} onChange={(event) => setAndTrack(() => setPeriod(Number(event.target.value)))} />
        </div>
      );
    }
    if (activePart.id === 'gaussian' || activePart.id === 'spatial-weight') {
      return (
        <div className="controlCard focusControl" data-primary-control>
          <label htmlFor="gaussianSigma">σ spatial : {sigma.toFixed(1)}</label>
          <input id="gaussianSigma" type="range" min={0.8} max={4} step={0.1} value={sigma} onChange={(event) => setAndTrack(() => setSigma(Number(event.target.value)))} />
        </div>
      );
    }
    if (activePart.id === 'intensity-weight' || activePart.id === 'edges') {
      return (
        <div className="controlCard focusControl" data-primary-control>
          <label htmlFor="intensitySigma">σ intensité : {intensitySigma}</label>
          <input id="intensitySigma" type="range" min={8} max={130} value={intensitySigma} onChange={(event) => setAndTrack(() => setIntensitySigma(Number(event.target.value)))} />
        </div>
      );
    }
    if (activePart.id === 'median') {
      return (
        <div className="controlCard focusControl" data-primary-control>
          <label htmlFor="impulseNoise">Bruit impulsionnel : {noise}</label>
          <input id="impulseNoise" type="range" min={0} max={150} value={noise} onChange={(event) => setAndTrack(() => setNoise(Number(event.target.value)))} />
        </div>
      );
    }
    if (isLissage) {
      return (
        <div className="controlCard focusControl" data-primary-control>
          <label htmlFor="kernelSize">Taille du voisinage : {kernelSize} x {kernelSize}</label>
          <input id="kernelSize" type="range" min={3} max={7} step={2} value={kernelSize} onChange={(event) => setAndTrack(() => setKernelSize(Number(event.target.value)))} />
        </div>
      );
    }
    return (
      <div className="controlCard focusControl" data-primary-control>
        <label>Filtre observé</label>
        <div className="methodSwitch inline">
          <button className={mode === 'source' ? 'active' : ''} disabled={mode === 'source'} onClick={() => selectMode('source')} type="button">Source</button>
          <button className={mode === 'lowpass' ? 'active' : ''} disabled={mode === 'lowpass'} onClick={() => selectMode('lowpass')} type="button">Passe-bas</button>
          <button className={mode === 'highpass' ? 'active' : ''} disabled={mode === 'highpass'} onClick={() => selectMode('highpass')} type="button">Passe-haut</button>
        </div>
      </div>
    );
  };

  return (
    <div className="labVisualStage advancedLab spatialLowpassLab" data-lab-kind="spatial-lowpass">
      <AdvancedCourseImage
        figure={figure}
        label={isBilateral ? `Bilatéral : σI ${intensitySigma}` : effectiveMode === 'highpass' ? 'Hautes fréquences' : `${spatialModeLabel} · ${kernelSize}x${kernelSize}`}
        filter={`grayscale(${effectiveMode === 'highpass' ? 1 : 0}) contrast(${1 + variationAfter / 120}) blur(${effectiveMode === 'lowpass' || effectiveMode === 'box' ? Math.max(0, radius - 1) * 0.5 : 0}px)`}
      />

      <div className="advancedWorkbench">
        <div className="visualGrid transformGrid advancedGrid" style={{ '--cols': width } as CSSProperties}>
          {outputValues.map((value, index) => <span key={index} className="pixel" style={{ backgroundColor: `rgb(${value}, ${value}, ${value})` }} />)}
        </div>
        <div className="spectrumBars" aria-label="Contenu fréquentiel simulé">
          {spectrum.map((value, index) => (
            <span key={index} style={{ height: `${value}%`, opacity: effectiveMode === 'highpass' ? 0.35 + Math.abs(index - 7.5) / 12 : 1 - Math.abs(index - 7.5) / 18 }} />
          ))}
        </div>
      </div>

      <div className="labReadout">
        <article>
          <Waves size={18} />
          <span>Fréquence</span>
          <strong>1/{period} px</strong>
          <small>Le support définit la fréquence spatiale comme l’inverse de la période.</small>
        </article>
        <article>
          <Gauge size={18} />
          <span>Variation moyenne</span>
          <strong>{variationBefore} vers {variationAfter}</strong>
          <small>Un passe-bas réduit les variations rapides ; un passe-haut les isole.</small>
        </article>
        <article>
          <Target size={18} />
          <span>Focus</span>
          <strong>{activePart.title}</strong>
          <small>{activePart.goal}</small>
        </article>
      </div>

      <div className="labControlsGrid advancedControls">
        {primaryControl()}
      </div>
    </div>
  );
}

const kernelSets = {
  mean: {
    label: 'Moyenne',
    values: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    divisor: 9,
  },
  sharpen: {
    label: 'Renforcement',
    values: [0, -1, 0, -1, 5, -1, 0, -1, 0],
    divisor: 1,
  },
  edge: {
    label: 'Contour',
    values: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
    divisor: 1,
  },
};

function SpatialKernelLab({ module, activePart, onInteraction }: { module: ModuleContent; activePart: LabPart; onInteraction: () => void }): JSX.Element {
  const [kernelType, setKernelType] = useState<keyof typeof kernelSets>('mean');
  const [centerX, setCenterX] = useState(2);
  const [centerY, setCenterY] = useState(2);
  const width = 6;
  const height = 6;
  const figure = activeCourseFigure(module, activePart);
  const values = Array.from({ length: width * height }, (_, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    return clampByte(36 + x * 25 + y * 22 + ((x + y) % 2) * 18);
  });
  const kernel = kernelSets[kernelType];
  const products = Array.from({ length: 9 }, (_, index) => {
    const dx = (index % 3) - 1;
    const dy = Math.floor(index / 3) - 1;
    const x = centerX + dx;
    const y = centerY + dy;
    const inside = x >= 0 && y >= 0 && x < width && y < height;
    const pixel = inside ? values[y * width + x] : 0;
    return { pixel, weight: kernel.values[index], inside };
  });
  const sum = products.reduce((total, item) => total + item.pixel * item.weight, 0);
  const output = clampByte(sum / kernel.divisor);
  const missingPixels = products.filter((item) => !item.inside).length;

  function setAndTrack(action: () => void): void {
    action();
    onInteraction();
  }

  function selectKernel(nextKernel: keyof typeof kernelSets): void {
    if (nextKernel === kernelType) return;
    setKernelType(nextKernel);
    onInteraction();
  }

  const primaryControl = activePart.id === 'kernel'
    ? (
      <div className="controlCard focusControl" data-primary-control>
        <label>Kernel appliqué</label>
        <div className="methodSwitch inline">
          {Object.entries(kernelSets).map(([key, item]) => (
            <button key={key} className={kernelType === key ? 'active' : ''} disabled={kernelType === key} onClick={() => selectKernel(key as keyof typeof kernelSets)} type="button">{item.label}</button>
          ))}
        </div>
      </div>
    )
    : (
      <div className="controlCard focusControl" data-primary-control>
        <label htmlFor="kernelX">Centre x : {centerX}</label>
        <input id="kernelX" type="range" min={0} max={width - 1} value={centerX} onChange={(event) => setAndTrack(() => setCenterX(Number(event.target.value)))} />
        <label htmlFor="kernelY">Centre y : {centerY}</label>
        <input id="kernelY" type="range" min={0} max={height - 1} value={centerY} onChange={(event) => setAndTrack(() => setCenterY(Number(event.target.value)))} />
      </div>
    );

  return (
    <div className="labVisualStage advancedLab spatialKernelLab" data-lab-kind="spatial-kernel">
      <AdvancedCourseImage figure={figure} label={`${kernel.label} · somme des produits`} filter={`grayscale(1) contrast(${1 + output / 240})`} />

      <div className="kernelWorkbench">
        <div className="visualGrid kernelImageGrid" style={{ '--cols': width } as CSSProperties}>
          {values.map((value, index) => {
            const x = index % width;
            const y = Math.floor(index / width);
            const selected = Math.abs(x - centerX) <= 1 && Math.abs(y - centerY) <= 1;
            const center = x === centerX && y === centerY;
            return <button key={index} className={`${selected ? 'kernelPixel selected' : 'kernelPixel'}${center ? ' center' : ''}`} disabled={center} style={{ backgroundColor: `rgb(${value}, ${value}, ${value})` }} onClick={() => setAndTrack(() => { setCenterX(x); setCenterY(y); })} type="button" aria-label={`pixel ${x},${y}`} />;
          })}
        </div>

        <div className="kernelMatrix">
          {products.map((item, index) => (
            <span key={index} className={item.inside ? 'kernelCell' : 'kernelCell padded'}>
              <b>{item.pixel}</b>
              <small>x {item.weight}</small>
            </span>
          ))}
        </div>
      </div>

      <div className="labReadout">
        <article>
          <Grid3X3 size={18} />
          <span>Voisinage</span>
          <strong>3 x 3</strong>
          <small>Le cours applique T dans un voisinage n x n.</small>
        </article>
        <article>
          <Activity size={18} />
          <span>Somme pondérée</span>
          <strong>{sum} / {kernel.divisor} = {output}</strong>
          <small>Chaque pixel est multiplié par le coefficient du kernel.</small>
        </article>
        <article>
          <Layers3 size={18} />
          <span>Padding</span>
          <strong>{missingPixels} pixel(s)</strong>
          <small>Hors image, cette simulation utilise un zéro padding.</small>
        </article>
      </div>

      <div className="labControlsGrid advancedControls">
        {primaryControl}
      </div>
    </div>
  );
}

function transitionSignal(length: number, rampWidth: number, noise: number): number[] {
  const center = length / 2;
  return Array.from({ length }, (_, index) => {
    const ramp = Math.max(0, Math.min(1, (index - center + rampWidth / 2) / Math.max(1, rampWidth)));
    const deterministicNoise = ((index * 37) % 19) - 9;
    return clampByte(42 + ramp * 170 + deterministicNoise * (noise / 40));
  });
}

function firstDerivative(values: number[]): number[] {
  return values.map((value, index) => Math.abs((values[index + 1] ?? value) - value));
}

function secondDerivative(values: number[]): number[] {
  return values.map((value, index) => Math.abs((values[index + 1] ?? value) + (values[index - 1] ?? value) - 2 * value));
}

function SpatialHighpassLab({ module, activePart, onInteraction }: { module: ModuleContent; activePart: LabPart; onInteraction: () => void }): JSX.Element {
  const [rampWidth, setRampWidth] = useState(7);
  const [noise, setNoise] = useState(24);
  const [threshold, setThreshold] = useState(42);
  const [operator, setOperator] = useState<'first' | 'second' | 'sobel' | 'laplacian' | 'canny'>('first');
  const figure = activeCourseFigure(module, activePart);
  const signal = transitionSignal(34, rampWidth, activePart.id === 'noise' ? noise : noise * 0.45);
  const first = firstDerivative(signal);
  const second = secondDerivative(signal);
  const activeResponse = operator === 'second' || operator === 'laplacian' ? second : first;
  const edgeCount = activeResponse.filter((value) => value >= threshold).length;
  const width = 18;
  const height = 8;
  const edgeValues = Array.from({ length: width * height }, (_, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    const base = spatialSourceValue(x, y, width, height, 8, noise, 72);
    const local = meanAround(Array.from({ length: width * height }, (_, cell) => {
      const cx = cell % width;
      const cy = Math.floor(cell / width);
      return spatialSourceValue(cx, cy, width, height, 8, noise, 72);
    }), width, height, x, y, 1);
    const response = Math.abs(base - local) * (operator === 'laplacian' || operator === 'second' ? 2.4 : 1.9);
    const cannyGate = operator === 'canny' ? response > threshold && (x + y) % 3 !== 0 : response > threshold;
    return cannyGate ? clampByte(response + 92) : clampByte(response * 0.35);
  });
  const operatorLabel = operator === 'first'
    ? 'Dérivée 1'
    : operator === 'second'
      ? 'Dérivée 2'
      : operator === 'sobel'
        ? 'Sobel'
        : operator === 'laplacian'
          ? 'Laplacien'
          : 'Canny';

  function setAndTrack(action: () => void): void {
    action();
    onInteraction();
  }

  function selectOperator(nextOperator: typeof operator): void {
    if (nextOperator === operator) return;
    setOperator(nextOperator);
    onInteraction();
  }

  const primaryControl = (): JSX.Element => {
    if (activePart.id === 'transition') {
      return (
        <div className="controlCard focusControl" data-primary-control>
          <label htmlFor="rampWidth">Largeur de transition : {rampWidth} px</label>
          <input id="rampWidth" type="range" min={2} max={16} value={rampWidth} onChange={(event) => setAndTrack(() => setRampWidth(Number(event.target.value)))} />
        </div>
      );
    }
    if (activePart.id === 'noise' || activePart.id === 'smoothing' || activePart.id === 'smooth-gradient') {
      return (
        <div className="controlCard focusControl" data-primary-control>
          <label htmlFor="edgeNoise">Bruit avant dérivation : {noise}</label>
          <input id="edgeNoise" type="range" min={0} max={95} value={noise} onChange={(event) => setAndTrack(() => setNoise(Number(event.target.value)))} />
        </div>
      );
    }
    if (activePart.id === 'nms' || activePart.id === 'hysteresis') {
      return (
        <div className="controlCard focusControl" data-primary-control>
          <label htmlFor="edgeThreshold">Seuil de contour : {threshold}</label>
          <input id="edgeThreshold" type="range" min={12} max={120} value={threshold} onChange={(event) => setAndTrack(() => setThreshold(Number(event.target.value)))} />
        </div>
      );
    }
    return (
      <div className="controlCard focusControl" data-primary-control>
        <label>Opérateur observé</label>
        <div className="methodSwitch inline">
          <button className={operator === 'first' ? 'active' : ''} disabled={operator === 'first'} onClick={() => selectOperator('first')} type="button">Dérivée 1</button>
          <button className={operator === 'second' ? 'active' : ''} disabled={operator === 'second'} onClick={() => selectOperator('second')} type="button">Dérivée 2</button>
          <button className={operator === 'sobel' ? 'active' : ''} disabled={operator === 'sobel'} onClick={() => selectOperator('sobel')} type="button">Sobel</button>
          <button className={operator === 'laplacian' ? 'active' : ''} disabled={operator === 'laplacian'} onClick={() => selectOperator('laplacian')} type="button">Laplacien</button>
          <button className={operator === 'canny' ? 'active' : ''} disabled={operator === 'canny'} onClick={() => selectOperator('canny')} type="button">Canny</button>
        </div>
      </div>
    );
  };

  return (
    <div className="labVisualStage advancedLab spatialHighpassLab" data-lab-kind="spatial-highpass">
      <AdvancedCourseImage figure={figure} label={operator === 'canny' ? 'Lissage · gradient · hystérésis' : `${operatorLabel} · seuil ${threshold}`} filter={`grayscale(1) contrast(${1.15 + edgeCount / 20})`} />

      <div className="edgeWorkbench">
        <div className="derivativePanel">
          {[signal, first, second].map((series, seriesIndex) => (
            <div className="derivativeTrack" key={seriesIndex}>
              {series.map((value, index) => (
                <span key={index} style={{ height: `${Math.max(5, (value / 255) * 100)}%` }} />
              ))}
            </div>
          ))}
        </div>
        <div className="visualGrid transformGrid advancedGrid" style={{ '--cols': width } as CSSProperties}>
          {edgeValues.map((value, index) => <span key={index} className="pixel" style={{ backgroundColor: `rgb(${value}, ${value}, ${value})` }} />)}
        </div>
      </div>

      <div className="labReadout">
        <article>
          <Activity size={18} />
          <span>Réponse</span>
          <strong>{edgeCount} dépassements</strong>
          <small>Après dérivation, le seuillage garde les variations fortes.</small>
        </article>
        <article>
          <Waves size={18} />
          <span>Formule discrète</span>
          <strong>{operator === 'second' || operator === 'laplacian' ? 'f(x+1)+f(x-1)-2f(x)' : 'f(x+1)-f(x)'}</strong>
          <small>Ces formules sont celles du chapitre pour les dérivées 1D.</small>
        </article>
        <article>
          <Target size={18} />
          <span>Focus</span>
          <strong>{activePart.title}</strong>
          <small>{activePart.goal}</small>
        </article>
      </div>

      <div className="labControlsGrid advancedControls">
        {primaryControl()}
      </div>
    </div>
  );
}

function FourierLab({ module, activePart, onInteraction }: { module: ModuleContent; activePart: LabPart; onInteraction: () => void }): JSX.Element {
  const [frequency, setFrequency] = useState(5);
  const [samples, setSamples] = useState(18);
  const [phase, setPhase] = useState(0);
  const [cutoff, setCutoff] = useState(34);
  const [filterMode, setFilterMode] = useState<'spectrum' | 'lowpass' | 'highpass'>('spectrum');
  const figure = activeCourseFigure(module, activePart);
  const width = 18;
  const height = 10;
  const effectiveFilter = activePart.id === 'lowpass' ? 'lowpass' : activePart.id === 'highpass' ? 'highpass' : filterMode;
  const spatialValues = Array.from({ length: width * height }, (_, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    const wave = (Math.sin((x / width) * Math.PI * 2 * frequency + phase) + Math.sin((y / height) * Math.PI * frequency * 0.8)) / 2;
    const mask = effectiveFilter === 'lowpass' ? 0.65 : effectiveFilter === 'highpass' ? 1.35 : 1;
    return clampByte(128 + wave * 70 * mask);
  });
  const spectrumSize = 13;
  const spectrumCells = Array.from({ length: spectrumSize * spectrumSize }, (_, index) => {
    const x = index % spectrumSize;
    const y = Math.floor(index / spectrumSize);
    const dx = x - Math.floor(spectrumSize / 2);
    const dy = y - Math.floor(spectrumSize / 2);
    const distance = Math.hypot(dx, dy);
    const peakDistance = Math.min(Math.abs(Math.hypot(dx - frequency / 2, dy) - 0.6), Math.abs(Math.hypot(dx + frequency / 2, dy) - 0.6));
    const base = Math.max(0, 1 - distance / 9);
    const peaks = Math.max(0, 1 - peakDistance);
    const passes = effectiveFilter === 'lowpass' ? distance <= cutoff / 9 : effectiveFilter === 'highpass' ? distance >= cutoff / 14 : true;
    return { value: clampByte((base * 90 + peaks * 165) * (passes ? 1 : 0.18)), passes };
  });
  const aliasRisk = samples <= frequency * 2;
  const visibleFrequencies = spectrumCells.filter((cell) => cell.value > 70 && cell.passes).length;
  const filterLabel = effectiveFilter === 'lowpass'
    ? 'passe-bas'
    : effectiveFilter === 'highpass'
      ? 'passe-haut'
      : 'spectre';

  function setAndTrack(action: () => void): void {
    action();
    onInteraction();
  }

  function selectFilter(nextFilter: typeof filterMode): void {
    if (nextFilter === filterMode) return;
    setFilterMode(nextFilter);
    onInteraction();
  }

  const primaryControl = (): JSX.Element => {
    if (activePart.id === 'sampling' || activePart.id === 'aliasing' || activePart.id === 'nyquist') {
      return (
        <div className="controlCard focusControl" data-primary-control>
          <label htmlFor="fourierSamples">Échantillons : {samples}</label>
          <input id="fourierSamples" type="range" min={6} max={48} value={samples} onChange={(event) => setAndTrack(() => setSamples(Number(event.target.value)))} />
        </div>
      );
    }
    if (activePart.id === 'amplitude-phase') {
      return (
        <div className="controlCard focusControl" data-primary-control>
          <label htmlFor="fourierPhase">Phase : {phase.toFixed(1)} rad</label>
          <input id="fourierPhase" type="range" min={0} max={6.2} step={0.1} value={phase} onChange={(event) => setAndTrack(() => setPhase(Number(event.target.value)))} />
        </div>
      );
    }
    if (activePart.id === 'transfer' || activePart.id === 'lowpass' || activePart.id === 'highpass') {
      return (
        <div className="controlCard focusControl" data-primary-control>
          <label htmlFor="fourierCutoff">Rayon de coupure : {cutoff}</label>
          <input id="fourierCutoff" type="range" min={12} max={70} value={cutoff} onChange={(event) => setAndTrack(() => setCutoff(Number(event.target.value)))} />
          <div className="methodSwitch inline">
            <button className={filterMode === 'spectrum' ? 'active' : ''} disabled={filterMode === 'spectrum'} onClick={() => selectFilter('spectrum')} type="button">Spectre</button>
            <button className={filterMode === 'lowpass' ? 'active' : ''} disabled={filterMode === 'lowpass'} onClick={() => selectFilter('lowpass')} type="button">Passe-bas</button>
            <button className={filterMode === 'highpass' ? 'active' : ''} disabled={filterMode === 'highpass'} onClick={() => selectFilter('highpass')} type="button">Passe-haut</button>
          </div>
        </div>
      );
    }
    return (
      <div className="controlCard focusControl" data-primary-control>
        <label htmlFor="fourierFrequency">Fréquence simulée : {frequency}</label>
        <input id="fourierFrequency" type="range" min={1} max={11} value={frequency} onChange={(event) => setAndTrack(() => setFrequency(Number(event.target.value)))} />
      </div>
    );
  };

  return (
    <div className="labVisualStage advancedLab fourierLab" data-lab-kind="fourier">
      <AdvancedCourseImage figure={figure} label={aliasRisk ? 'Risque aliasing' : effectiveFilter === 'spectrum' ? 'Spectre d’amplitudes' : `H(p,q) ${filterLabel}`} filter={`contrast(${1.05 + visibleFrequencies / 24}) saturate(${effectiveFilter === 'highpass' ? 0.2 : 0.85})`} />

      <div className="fourierWorkbench">
        <div className="visualGrid transformGrid advancedGrid fourierImageGrid" style={{ '--cols': width } as CSSProperties}>
          {spatialValues.map((value, index) => <span key={index} className="pixel" style={{ backgroundColor: `rgb(${value}, ${value}, ${value})` }} />)}
        </div>
        <div className="spectrumGrid" style={{ '--spectrum-cols': spectrumSize } as CSSProperties}>
          {spectrumCells.map((cell, index) => <span key={index} className={cell.passes ? 'spectrumCell pass' : 'spectrumCell stop'} style={{ backgroundColor: `rgb(${cell.value}, ${cell.value}, ${cell.value})` }} />)}
        </div>
      </div>

      <div className="labReadout">
        <article>
          <Waves size={18} />
          <span>Fréquence</span>
          <strong>{frequency}</strong>
          <small>Le spectre regroupe les contributions fréquentielles.</small>
        </article>
        <article>
          <Gauge size={18} />
          <span>Nyquist</span>
          <strong>{samples} {aliasRisk ? '<=' : '>'} 2 x {frequency}</strong>
          <small>Le chapitre exige une fréquence d’échantillonnage supérieure à 2 Fmax.</small>
        </article>
        <article>
          <Target size={18} />
          <span>Filtre</span>
          <strong>{effectiveFilter === 'spectrum' ? 'S(p,q)' : 'H(p,q)S(p,q)'}</strong>
          <small>En fréquentiel, le filtrage se fait par multiplication.</small>
        </article>
      </div>

      <div className="labControlsGrid advancedControls">
        {primaryControl()}
      </div>
    </div>
  );
}

type MorphShape = 'cross' | 'square' | 'line';
type MorphOperation = 'source' | 'erode' | 'dilate' | 'open' | 'close' | 'internal' | 'external';

function structuringOffsets(shape: MorphShape): Array<[number, number]> {
  if (shape === 'square') return [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
  if (shape === 'line') return [[-1, 0], [0, 0], [1, 0]];
  return [[0, -1], [-1, 0], [0, 0], [1, 0], [0, 1]];
}

function baseMorphologyGrid(width: number, height: number): boolean[] {
  return Array.from({ length: width * height }, (_, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    const blob = (x >= 3 && x <= 8 && y >= 2 && y <= 6) || (x >= 7 && x <= 11 && y >= 4 && y <= 8);
    const thin = x >= 1 && x <= 4 && y === 8;
    const noise = (x === 1 && y === 1) || (x === 12 && y === 2) || (x === 10 && y === 1);
    return blob || thin || noise;
  });
}

function erodeGrid(values: boolean[], width: number, height: number, offsets: Array<[number, number]>): boolean[] {
  return values.map((_, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    return offsets.every(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      return nx >= 0 && ny >= 0 && nx < width && ny < height && values[ny * width + nx];
    });
  });
}

function dilateGrid(values: boolean[], width: number, height: number, offsets: Array<[number, number]>): boolean[] {
  return values.map((_, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    return offsets.some(([dx, dy]) => {
      const nx = x - dx;
      const ny = y - dy;
      return nx >= 0 && ny >= 0 && nx < width && ny < height && values[ny * width + nx];
    });
  });
}

function applyMorphology(values: boolean[], width: number, height: number, shape: MorphShape, operation: MorphOperation, iterations: number): boolean[] {
  const offsets = structuringOffsets(shape);
  let result = [...values];
  const repeat = Math.max(1, iterations);
  const erode = (input: boolean[]) => erodeGrid(input, width, height, offsets);
  const dilate = (input: boolean[]) => dilateGrid(input, width, height, offsets);
  for (let step = 0; step < repeat; step += 1) {
    if (operation === 'erode') result = erode(result);
    if (operation === 'dilate') result = dilate(result);
    if (operation === 'open') result = dilate(erode(result));
    if (operation === 'close') result = erode(dilate(result));
    if (operation === 'internal') {
      const eroded = erode(result);
      result = result.map((value, index) => value && !eroded[index]);
    }
    if (operation === 'external') {
      const dilated = dilate(result);
      result = dilated.map((value, index) => value && !result[index]);
    }
  }
  return result;
}

function MorphologyLab({ module, activePart, onInteraction }: { module: ModuleContent; activePart: LabPart; onInteraction: () => void }): JSX.Element {
  const [shape, setShape] = useState<MorphShape>('cross');
  const [operation, setOperation] = useState<MorphOperation>('erode');
  const [iterations, setIterations] = useState(1);
  const width = 14;
  const height = 10;
  const figure = activeCourseFigure(module, activePart);
  const effectiveOperation: MorphOperation = activePart.id === 'erosion'
    ? 'erode'
    : activePart.id === 'dilation'
      ? 'dilate'
      : activePart.id === 'opening'
        ? 'open'
        : activePart.id === 'closing'
          ? 'close'
          : activePart.id === 'internal' || activePart.id === 'fingerprint'
            ? 'internal'
            : activePart.id === 'external'
              ? 'external'
              : operation;
  const source = baseMorphologyGrid(width, height);
  const output = applyMorphology(source, width, height, shape, effectiveOperation, iterations);
  const countBefore = source.filter(Boolean).length;
  const countAfter = output.filter(Boolean).length;
  const offsets = structuringOffsets(shape);
  const shapeLabel = shape === 'cross' ? 'croix' : shape === 'square' ? 'carré' : 'ligne';
  const operationLabel = effectiveOperation === 'erode'
    ? 'Érosion'
    : effectiveOperation === 'dilate'
      ? 'Dilatation'
      : effectiveOperation === 'open'
        ? 'Ouverture'
        : effectiveOperation === 'close'
          ? 'Fermeture'
          : effectiveOperation === 'internal'
            ? 'Contour interne'
            : effectiveOperation === 'external'
              ? 'Contour externe'
              : 'Source';

  function setAndTrack(action: () => void): void {
    action();
    onInteraction();
  }

  function selectShape(nextShape: MorphShape): void {
    if (nextShape === shape) return;
    setShape(nextShape);
    onInteraction();
  }

  function selectOperation(nextOperation: MorphOperation): void {
    if (nextOperation === operation) return;
    setOperation(nextOperation);
    onInteraction();
  }

  const primaryControl = (): JSX.Element => {
    if (
      activePart.id === 'structuring'
      || activePart.id === 'task-choice'
      || activePart.id === 'translation'
      || activePart.id === 'erosion'
      || activePart.id === 'dilation'
      || activePart.id === 'opening'
      || activePart.id === 'closing'
      || activePart.id === 'internal'
      || activePart.id === 'external'
      || activePart.id === 'fingerprint'
    ) {
      return (
        <div className="controlCard focusControl" data-primary-control>
          <label>Élément structurant</label>
          <div className="methodSwitch inline">
            <button className={shape === 'cross' ? 'active' : ''} disabled={shape === 'cross'} onClick={() => selectShape('cross')} type="button">Croix</button>
            <button className={shape === 'square' ? 'active' : ''} disabled={shape === 'square'} onClick={() => selectShape('square')} type="button">Carré</button>
            <button className={shape === 'line' ? 'active' : ''} disabled={shape === 'line'} onClick={() => selectShape('line')} type="button">Ligne</button>
          </div>
        </div>
      );
    }
    if (activePart.id === 'iterations') {
      return (
        <div className="controlCard focusControl" data-primary-control>
          <label htmlFor="morphIterations">Itérations : {iterations}</label>
          <input id="morphIterations" type="range" min={1} max={4} value={iterations} onChange={(event) => setAndTrack(() => setIterations(Number(event.target.value)))} />
        </div>
      );
    }
    return (
      <div className="controlCard focusControl" data-primary-control>
        <label>Opération morphologique</label>
        <div className="methodSwitch inline">
          <button className={operation === 'erode' ? 'active' : ''} disabled={operation === 'erode'} onClick={() => selectOperation('erode')} type="button">Érosion</button>
          <button className={operation === 'dilate' ? 'active' : ''} disabled={operation === 'dilate'} onClick={() => selectOperation('dilate')} type="button">Dilatation</button>
          <button className={operation === 'open' ? 'active' : ''} disabled={operation === 'open'} onClick={() => selectOperation('open')} type="button">Ouverture</button>
          <button className={operation === 'close' ? 'active' : ''} disabled={operation === 'close'} onClick={() => selectOperation('close')} type="button">Fermeture</button>
        </div>
      </div>
    );
  };

  return (
    <div className="labVisualStage advancedLab morphologyLab" data-lab-kind="morphology">
      <AdvancedCourseImage figure={figure} label={`${operationLabel} · B ${shapeLabel}`} filter={`grayscale(1) contrast(${1.05 + countAfter / 120})`} />

      <div className="morphWorkbench">
        <div className="morphGrid" style={{ '--morph-cols': width } as CSSProperties}>
          {source.map((active, index) => <span key={index} className={active ? 'morphCell active' : 'morphCell'} />)}
        </div>
        <div className="structuringElement" style={{ '--morph-cols': 3 } as CSSProperties}>
          {Array.from({ length: 9 }, (_, index) => {
            const dx = (index % 3) - 1;
            const dy = Math.floor(index / 3) - 1;
            const active = offsets.some(([ox, oy]) => ox === dx && oy === dy);
            return <span key={index} className={active ? 'morphCell active probe' : 'morphCell'} />;
          })}
        </div>
        <div className="morphGrid" style={{ '--morph-cols': width } as CSSProperties}>
          {output.map((active, index) => <span key={index} className={active ? 'morphCell active result' : 'morphCell'} />)}
        </div>
      </div>

      <div className="labReadout">
        <article>
          <Grid3X3 size={18} />
          <span>Ensemble A</span>
          <strong>{countBefore} vers {countAfter}</strong>
          <small>Les opérations agissent sur une image binaire vue comme ensemble.</small>
        </article>
        <article>
          <Layers3 size={18} />
          <span>Élément B</span>
          <strong>{offsets.length} points</strong>
          <small>Le support présente B comme sonde promenée sur l’image.</small>
        </article>
        <article>
          <Target size={18} />
          <span>Opération</span>
          <strong>{effectiveOperation === 'erode' ? 'A⊖B' : effectiveOperation === 'dilate' ? 'A⊕B' : operationLabel}</strong>
          <small>{effectiveOperation === 'erode' ? 'B doit être inclus dans A.' : effectiveOperation === 'dilate' ? 'B touche A autour du point.' : 'Combinaison d’érosion et dilatation.'}</small>
        </article>
      </div>

      <div className="labControlsGrid advancedControls">
        {primaryControl()}
      </div>
    </div>
  );
}

function HoughLab({ module, activePart, onInteraction }: { module: ModuleContent; activePart: LabPart; onInteraction: () => void }): JSX.Element {
  const [theta, setTheta] = useState(45);
  const [rho, setRho] = useState(42);
  const [threshold, setThreshold] = useState(5);
  const [resolution, setResolution] = useState(12);
  const [representation, setRepresentation] = useState<'mc' | 'polar'>('polar');
  const figure = activeCourseFigure(module, activePart);
  const points = [
    { x: 18, y: 76 },
    { x: 30, y: 64 },
    { x: 42, y: 52 },
    { x: 54, y: 40 },
    { x: 66, y: 28 },
    { x: 76, y: 20 },
    { x: 22, y: 24 },
    { x: 78, y: 72 },
  ];
  const thetaRad = (theta / 180) * Math.PI;
  const votes = points.map((point) => Math.abs(point.x * Math.cos(thetaRad) + point.y * Math.sin(thetaRad) - rho));
  const supportingVotes = votes.filter((distance) => distance < threshold).length;
  const accumulatorCells = Array.from({ length: resolution * resolution }, (_, index) => {
    const x = index % resolution;
    const y = Math.floor(index / resolution);
    const cellTheta = (x / Math.max(1, resolution - 1)) * 180;
    const cellRho = 12 + (y / Math.max(1, resolution - 1)) * 92;
    const nearTheta = Math.abs(cellTheta - theta);
    const nearRho = Math.abs(cellRho - rho);
    const value = clampByte(255 - nearTheta * 4 - nearRho * 3 + supportingVotes * 20);
    return value;
  });
  const peak = Math.max(...accumulatorCells);

  function setAndTrack(action: () => void): void {
    action();
    onInteraction();
  }

  function selectRepresentation(nextRepresentation: typeof representation): void {
    if (nextRepresentation === representation) return;
    setRepresentation(nextRepresentation);
    onInteraction();
  }

  const primaryControl = (): JSX.Element => {
    if (activePart.id === 'mc' || activePart.id === 'polar' || activePart.id === 'equation') {
      return (
        <div className="controlCard focusControl" data-primary-control>
          <label htmlFor="houghTheta">Angle θ : {theta}°</label>
          <input id="houghTheta" type="range" min={0} max={180} value={theta} onChange={(event) => setAndTrack(() => setTheta(Number(event.target.value)))} />
          <div className="methodSwitch inline">
            <button className={representation === 'mc' ? 'active' : ''} disabled={representation === 'mc'} onClick={() => selectRepresentation('mc')} type="button">m,c</button>
            <button className={representation === 'polar' ? 'active' : ''} disabled={representation === 'polar'} onClick={() => selectRepresentation('polar')} type="button">ρ,θ</button>
          </div>
        </div>
      );
    }
    if (activePart.id === 'resolution' || activePart.id === 'accumulator') {
      return (
        <div className="controlCard focusControl" data-primary-control>
          <label htmlFor="houghResolution">Résolution accumulateur : {resolution} x {resolution}</label>
          <input id="houghResolution" type="range" min={8} max={18} value={resolution} onChange={(event) => setAndTrack(() => setResolution(Number(event.target.value)))} />
        </div>
      );
    }
    if (activePart.id === 'votes' || activePart.id === 'peaks' || activePart.id === 'robustness' || activePart.id === 'preprocess' || activePart.id === 'draw-lines') {
      return (
        <div className="controlCard focusControl" data-primary-control>
          <label htmlFor="houghThreshold">Seuil de votes : {threshold}</label>
          <input id="houghThreshold" type="range" min={2} max={18} value={threshold} onChange={(event) => setAndTrack(() => setThreshold(Number(event.target.value)))} />
        </div>
      );
    }
    return (
      <div className="controlCard focusControl" data-primary-control>
        <label htmlFor="houghRho">Distance ρ : {rho}</label>
        <input id="houghRho" type="range" min={12} max={104} value={rho} onChange={(event) => setAndTrack(() => setRho(Number(event.target.value)))} />
      </div>
    );
  };

  return (
    <div className="labVisualStage advancedLab houghLab" data-lab-kind="hough">
      <AdvancedCourseImage figure={figure} label={representation === 'polar' ? 'ρ = x cosθ + y sinθ' : 'y = mx + c'} filter={`contrast(${1.05 + supportingVotes / 8}) grayscale(0.35)`} />

      <div className="houghWorkbench">
        <div className="houghPlane">
          <span className="houghLine" style={{ rotate: `${theta - 90}deg`, translate: `${rho - 50}px 0` }} />
          {points.map((point, index) => (
            <span key={index} className={votes[index] < threshold ? 'houghPoint support' : 'houghPoint'} style={{ left: `${point.x}%`, top: `${point.y}%` }} />
          ))}
        </div>
        <div className="accumulatorGrid" style={{ '--acc-cols': resolution } as CSSProperties}>
          {accumulatorCells.map((value, index) => <span key={index} className={value === peak ? 'accCell peak' : 'accCell'} style={{ backgroundColor: `rgb(${value}, ${Math.max(40, value - 70)}, ${Math.max(25, 255 - value)})` }} />)}
        </div>
      </div>

      <div className="labReadout">
        <article>
          <CircleDot size={18} />
          <span>Votes</span>
          <strong>{supportingVotes} / {points.length}</strong>
          <small>Chaque point de contour vote dans l’espace des paramètres.</small>
        </article>
        <article>
          <Gauge size={18} />
          <span>Paramètres</span>
          <strong>ρ {rho}, θ {theta}°</strong>
          <small>La forme polaire évite le problème des droites verticales.</small>
        </article>
        <article>
          <Target size={18} />
          <span>Pic</span>
          <strong>{peak}</strong>
          <small>Un maximum de l’accumulateur indique une droite probable.</small>
        </article>
      </div>

      <div className="labControlsGrid advancedControls">
        {primaryControl()}
      </div>
    </div>
  );
}

function ReviewMode({
  module,
  progress,
  onProgress,
  onComplete,
}: {
  module: ModuleContent;
  progress: ModuleProgress;
  onProgress: (progress: ModuleProgress) => void;
  onComplete: () => void;
}): JSX.Element {
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [validated, setValidated] = useState(false);
  const currentCard = module.flashcards[cardIndex];
  const currentQuestion = module.quiz[quizIndex];

  function revealCard(): void {
    setShowAnswer(true);
    if (!progress.flashcardsRevealed.includes(currentCard.id)) {
      onProgress({ ...progress, flashcardsRevealed: [...progress.flashcardsRevealed, currentCard.id] });
    }
  }

  function validateAnswer(): void {
    if (selectedAnswer === null || validated) return;
    const correct = selectedAnswer === currentQuestion.answerIndex;
    onProgress({
      ...progress,
      quizAnswered: progress.quizAnswered + 1,
      quizCorrect: progress.quizCorrect + (correct ? 1 : 0),
    });
    setValidated(true);
  }

  function nextQuestion(): void {
    setQuizIndex((current) => (current + 1) % module.quiz.length);
    setSelectedAnswer(null);
    setValidated(false);
  }

  const quizAccuracy = progress.quizAnswered > 0
    ? Math.round((progress.quizCorrect / progress.quizAnswered) * 100)
    : 0;

  return (
    <section className="modeSurface reviewSurface">
      <div className="reviewDashboard">
        <div className="reviewHero">
          <p className="eyebrow"><Target size={15} /> Réviser · Module {module.number}</p>
          <h2>Transformer la leçon en réflexes d’examen</h2>
          <p>{module.modeIntros.review}</p>
        </div>
        <div className="reviewStats">
          <article>
            <Gauge size={20} />
            <span>Précision quiz</span>
            <strong>{quizAccuracy}%</strong>
          </article>
          <article>
            <Layers3 size={20} />
            <span>Flashcards vues</span>
            <strong>{progress.flashcardsRevealed.length}/{module.flashcards.length}</strong>
          </article>
          <article>
            <FlaskConical size={20} />
            <span>Labo</span>
            <strong>{progress.labInteractions} actions</strong>
          </article>
        </div>
      </div>

      <div className="reviewGrid">
        <article className="examCard">
          <div className="cardHeader">
            <span>Flashcard {cardIndex + 1}/{module.flashcards.length}</span>
            <button type="button" onClick={() => { setCardIndex((cardIndex + 1) % module.flashcards.length); setShowAnswer(false); }}>
              <RotateCcw size={15} /> suivante
            </button>
          </div>
          <h3>{currentCard.question}</h3>
          {showAnswer ? <p className="answerBox">{currentCard.answer}</p> : <button className="primaryAction" onClick={revealCard} type="button">Afficher la réponse</button>}
        </article>

        <article className="examCard">
          <div className="cardHeader">
            <span>Quiz {quizIndex + 1}/{module.quiz.length}</span>
            <small>{validated ? 'corrigé' : 'à valider'}</small>
          </div>
          <h3>{currentQuestion.question}</h3>
          <div className="answerChoices">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option}
                className={selectedAnswer === index ? 'selected' : ''}
                disabled={validated}
                onClick={() => setSelectedAnswer(index)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
          {validated && <QuizFeedback question={currentQuestion} selectedAnswer={selectedAnswer} />}
          <div className="quizActions">
            <button className="primaryAction" onClick={validateAnswer} disabled={selectedAnswer === null || validated} type="button">
              Valider
            </button>
            <button onClick={nextQuestion} type="button">Question suivante</button>
          </div>
        </article>

        <article className="examCard pitfalls">
          <span>Pièges fréquents</span>
          <ul>
            {module.pitfalls.map((pitfall) => <li key={pitfall}>{pitfall}</li>)}
          </ul>
        </article>

        <article className="examCard examSummary">
          <span>Résumé examen</span>
          <p>{module.examSummary}</p>
          <p className="sourceLine">Source : {module.source.file}, page {module.source.page}</p>
          <button className="primaryAction" onClick={onComplete} type="button">
            <CheckCircle2 size={18} /> Marquer Réviser comme fait
          </button>
        </article>
      </div>
    </section>
  );
}

function QuizFeedback({ question, selectedAnswer }: { question: QuizItem; selectedAnswer: number | null }): JSX.Element {
  const correct = selectedAnswer === question.answerIndex;
  return (
    <div className={correct ? 'feedback ok' : 'feedback ko'}>
      <strong>{correct ? 'Correct.' : 'À reprendre.'}</strong>
      <p>{question.feedback}</p>
    </div>
  );
}
