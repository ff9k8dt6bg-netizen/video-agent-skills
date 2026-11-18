# Guide de montage : Kevin

**L'idée :** une vidéo qui ne respire jamais à vide. Il se passe quelque chose toutes les 2 secondes, et chaque chose arrive sur le mot qui la nomme. L'énergie vient des deux vidéos de référence (`video-agent/references/ANALYSE.md`). L'identité visuelle est la tienne.

## Couleurs : noir et rouge
- **Base** : fond noir texturé `#0E0E10`, texte blanc cassé `#F5F3F0`, accent **rouge** `#E5202E`. Les cartes sont gris anthracite `#1A1A1E`.
- **Écran Rouge** (2 ou 3 temps forts par vidéo) : le rouge en plein cadre, avec le texte en noir.
- Le rouge est réservé à un seul mot ou un seul chiffre à la fois. Pas de dégradé, pas de halo néon.
- Aperçu : `preview.jpg`, dans ce dossier.

## Typo
- Titres et chiffres : **Bricolage Grotesque 800**, serrée. Les chiffres sont énormes (250 px et plus) et comptent jusqu'à leur valeur.
- Textes d'interface et petites étiquettes : **DM Sans**. Rien sous 34 px.
- Un encart dit 2 à 4 mots au maximum, avec un seul mot en couleur.

## Sous-titres
- **2 mots maximum**, Bricolage 800, 80 px.
- Le mot prononcé arrive sur un **bloc rouge** (noir sur les écrans Rouge), en blanc, avec un léger flou.
- Ils sont placés sur la jointure en écran partagé, et sur la poitrine en plein écran, jamais sur la bouche.
- Ils sont masqués quand un encart affiche déjà les mêmes mots.

## Rythme et coupes
- **Zéro blanc** : aucun silence de plus de 0,25 s. La vidéo est accélérée à 1,15.
- **Un nouvel élément toutes les 1,5 à 2,5 s** : un texte qui s'écrit, un compteur, un logo réel, une interface recréée qui agit.
- **Trois vues en alternance**, changées toutes les 4 à 6 s :
  1. écran partagé : fond noir et encart en haut, caméra en bas ;
  2. caméra plein écran, pour une phrase forte, 5 s minimum ;
  3. écran Rouge plein cadre, pour le chiffre ou la révélation.
- Coupes franches, sans fondu. Une idée développée sur plusieurs phrases garde le même encart, qui se complète au lieu de changer.

## Zooms
- Un zoom avant de **1,12 maximum** sur un mot fort, au plus toutes les 4 s, tenu jusqu'à la coupe suivante.
- Une poussée lente de 0,6 %/s sur chaque plan.
- Le visage ne dépasse jamais 35 % du cadre.

## Musique
- Un seul tapis du début à la fin, discret (-26 LUFS) : **Code noir** pour les vidéos de création, **Néon** pour une annonce ou un résultat, **Enquête** pour une révélation.
- La musique se coupe 0,3 s sur chaque zoom avant.
- Le mix final est à -14 LUFS.

## Bruitages
- **3 à 4 par vidéo**, seulement sur les temps forts :
  - un `impact-boom` sur le mot qui retourne l'accroche ;
  - un `thud` quand le chiffre clé tombe ;
  - un `pop` quand une preuve arrive.
- Jamais de whoosh, de riser, de clic d'interface ni de bruit de mouvement.

## Accroche (0 à 2 s)
- Elle est lisible dès la première image, et quelque chose bouge déjà.
- C'est une **mini-histoire en 2 actes** : on montre une situation, puis elle se retourne sur le mot clé (par exemple, le chiffre qui s'effondre, ou l'outil cher remplacé).
- Le texte à l'écran ajoute quelque chose à la phrase dite, il ne la répète pas.

## Fin
- Caméra plein écran, une seule demande : « Commente MOT ».
- La feuille de commentaires est recréée, et le mot s'y tape.

## À ne pas reprendre des références
Le bandeau mono noir, le papier crème, l'orange et le cyan avec halo, l'éclat de verre en accroche, le mur et les accessoires de la personne. On garde le rythme, pas la signature.

*Pour les réglages du moteur, voir `style.json`, dans ce même dossier.*
