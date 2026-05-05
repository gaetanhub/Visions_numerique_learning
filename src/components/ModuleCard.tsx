import type { ModuleData } from '../content/chapter1';

export function ModuleCard({ module }: { module: ModuleData }): JSX.Element {
  return (
    <article className="card" id={module.id}>
      <h3>{module.title}</h3>
      <section>
        <h4>Prérequis</h4>
        <ul>{module.prerequis.map((p) => <li key={p}>{p}</li>)}</ul>
      </section>
      <section>
        <h4>Explication ultra-simple</h4>
        <ul>{module.ultraSimple.map((p) => <li key={p}>{p}</li>)}</ul>
      </section>
      <section>
        <h4>Cours</h4>
        <ul>{module.points.map((p) => <li key={p}>{p}</li>)}</ul>
      </section>
      <p><strong>Figures</strong> : {module.figures.join(', ')}</p>
      <p className="source">Source : {module.source.file}, page {module.source.page}</p>
    </article>
  );
}
