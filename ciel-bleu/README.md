# Pourquoi le ciel est bleu (Remotion)

Vidéo verticale 1080x1920, 30 s, voix off fr-FR-HenriNeural (edge-tts).

- `voix/texte.txt` : le texte de la voix off. `voix/tts.py` génère `voix.mp3` + `mots.json` (minutage de chaque mot).
- `src/CielBleu.tsx` : l'animation, calée sur `src/mots.json`.
- `rendu/ciel-bleu.mp4` : le rendu final (son normalisé à -14 LUFS).

Refaire la vidéo :

```bash
cd ciel-bleu/voix && python3 tts.py && cp voix.mp3 ../public/ && cp mots.json ../src/ && cd ..
npm install
npx remotion render src/index.ts CielBleu out/ciel-bleu.mp4 --browser-executable=/usr/bin/google-chrome
ffmpeg -i out/ciel-bleu.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5 -c:a aac -b:a 192k rendu/ciel-bleu.mp4
```

edge-tts a besoin d'accéder à `speech.platform.bing.com` (et, dans un conteneur avec proxy, de `SSL_CERT_FILE` pointé sur son certificat).
