export type Source = { file: string; page: string };
export type ModuleData = {
  id: string;
  title: string;
  prerequis: string[];
  ultraSimple: string[];
  points: string[];
  figures: string[];
  source: Source;
};

export const chapter1Modules: ModuleData[] = [
  {
    id: 'vision-humaine',
    title: 'Module 1 — Vision humaine et subjectivité',
    prerequis: ['Aucun prérequis technique.'],
    ultraSimple: ['L\'œil capte la lumière.', 'Le cerveau interprète et peut se tromper.'],
    points: ['Rétine, bâtonnets, cônes', 'Luminance, brightness, radiance', 'Lien vision humaine / vision numérique'],
    figures: ['introduction_p5_fig1.jpeg', 'introduction_p5_fig6.jpeg', 'introduction_p6_fig2.jpeg'],
    source: { file: 'introduction.md', page: '5-8' }
  },
  {
    id: 'sources-images',
    title: 'Module 2 — Sources d’images',
    prerequis: ['Comprendre qu\'une image est issue d\'une mesure.'],
    ultraSimple: ['Une image peut venir de la lumière, du son, ou d\'autres ondes.'],
    points: ['Rayons X, IR, UV, radar, IRM, ultrasons', 'Image synthétique'],
    figures: ['introduction_p11_fig5.jpeg', 'introduction_p12_fig4.jpeg', 'introduction_p13_fig3.jpeg'],
    source: { file: 'introduction.md', page: '11-14' }
  }
];
