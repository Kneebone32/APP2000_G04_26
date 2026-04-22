// Skrevet av Kristoffer med mindre annet er spesifisert

import norddalsfjorden from "../assets/norddalsfjorden.jpg";
import graddiselva from "../assets/graddiselva.jpg";
import lyngenfjorden from "../assets/lyngenfjorden.jpg";

export const HERO_BILDER = [
  {
    src: norddalsfjorden,
    kreditering: "By Ximonic (Simo Räsänen) - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=48042325",
  },
  {
    src: graddiselva,
    kreditering: "By Ximonic (Simo Räsänen) - Own work, CC BY-SA 4.0, https://commons.wikimedia.org/w/index.php?curid=114190112",
  },
  {
    src: lyngenfjorden,
    kreditering: "By Ximonic, Simo Räsänen - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=15528145",
  },
];

// Returnerer et tilfeldig hero-bilde
export function tilfeldigBilde() {
  return HERO_BILDER[Math.floor(Math.random() * HERO_BILDER.length)];
}
