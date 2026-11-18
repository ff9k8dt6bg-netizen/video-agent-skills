// Short: "Bienvenue sur ma chaîne". Paper only (no take): 15 s, times are plain seconds.
// Beats (all in the captured component source/bienvenue.html, subtitles burned in it):
//   0.0  hook: « Bienvenue » already rising on frame 0, « sur ma chaîne » + blue underline (1.75)
//   2.95 the title glides up as a header and stays
//   3.05 player: cursor taps play (4.35), « Épisode 1 », progress runs
//   6.05 week strip: a new video drops on Thursday (6.6), scroll to week 2 (8.35) and 3 (9.3)
//  10.25 subscribe: tap S'abonner (11.3) -> Abonné + check, 999 -> 1 000, bell (12.55)
//  13.65 the title comes back centred, « À très vite » (14.0)
window.SPEC = {
  title: 'Bienvenue sur ma chaîne',
  silent: true,
  duration: 15,
  media: {
    bienvenue: { src: 'assets/bienvenue.mov', width: 1080, alpha: true },
  },
  layout: { keys: [[0, 1920]] },
  scenes: [
    { type: 'overlay', media: 'bienvenue', from: 0, to: 15 },
  ],
  // Néon: the energetic bed for paper-only motion videos; offset on its pulse (a)
  music: { bed: 'neon', offset: 9.2 },
  sfx: {
    swish: 0, accents: 0,
    extra: [
      [4.35, 'tap', .06],            // play
      [6.6, 'pop', .08], [8.35, 'pop', .08], [9.3, 'pop', .08],   // new video each week
      [11.3, 'thud', -6],            // S'abonner: the payoff
      [12.55, 'pop', .08],           // bell
    ],
  },
};
