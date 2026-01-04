import { Topic } from "../app/generated/prisma/client";
import prisma from "../lib/prisma";

const rawGames = [
  {
    title: "Angle",
    link: "https://angle.wtf/",
    topic: "puzzle",
  },
  {
    title: "Bandle",
    link: "https://bandle.app/",
    topic: "entertainment",
  },
  {
    title: "Bracket City",
    link: "https://www.theatlantic.com/games/bracket-city/",
    topic: "trivia",
  },
  {
    title: "COSTCODLE",
    link: "https://costcodle.com/",
    topic: "trivia",
  },
  {
    title: "Chess Puzzle",
    link: "https://www.chess.com/daily-chess-puzzle",
    topic: "puzzle",
  },
  {
    title: "Chronophoto",
    link: "https://www.chronophoto.app/",
    topic: "trivia",
  },
  {
    title: "Cine2Nerdle",
    link: "https://www.cinenerdle2.app/",
    topic: "entertainment",
  },
  {
    title: "Cinematrix",
    link: "https://www.vulture.com/article/daily-movie-grid-trivia-game-cinematrix.html",
    topic: "entertainment",
  },
  {
    title: "Circuits",
    link: "https://www.puzzmo.com/game/circuits/",
    topic: "puzzle",
  },
  {
    title: "Connections",
    link: "https://www.nytimes.com/games/connections",
    topic: "words",
  },
  {
    title: "Contexto",
    link: "https://contexto.me/en/",
    topic: "words",
  },
  {
    title: "Cryptic Crossword",
    link: "https://www.minutecryptic.com/",
    topic: "words",
  },
  {
    title: "Daily Tens",
    link: "https://dailytens.com/",
    topic: "trivia",
  },
  {
    title: "Dodeku",
    link: "https://dodeku.com/",
    topic: "puzzle",
  },
  {
    title: "Feudle",
    link: "https://googlefeud.com/feudle/",
    topic: "words",
  },
  {
    title: "Flagle",
    link: "https://www.flagle.io/",
    topic: "geography",
  },
  {
    title: "Food Guessr",
    link: "https://www.foodguessr.com/",
    topic: "food",
  },
  {
    title: "Framed",
    link: "https://framed.wtf/",
    topic: "entertainment",
  },
  {
    title: "Gamedle Character",
    link: "https://www.gamedle.wtf/characters#",
    topic: "gaming",
  },
  {
    title: "Gamedle Classic",
    link: "https://www.gamedle.wtf/classic#",
    topic: "gaming",
  },
  {
    title: "Globle",
    link: "https://globle-game.com/",
    topic: "geography",
  },
  {
    title: "Guess The Game",
    link: "https://guessthe.game/",
    topic: "gaming",
  },
  {
    title: "Guess The Movie",
    link: "https://guessthemovie.name/",
    topic: "entertainment",
  },
  {
    title: "Guess the Audio",
    link: "https://guesstheaudio.com/",
    topic: "entertainment",
  },
  {
    title: "Jumblie",
    link: "https://jumblie.com/",
    topic: "words",
  },
  {
    title: "Lyricle",
    link: "https://www.lyricle.app/",
    topic: "entertainment",
  },
  {
    title: "Mathler",
    link: "https://www.mathler.com/",
    topic: "puzzle",
  },
  {
    title: "Metaflora",
    link: "https://flora.metazooa.com/",
    topic: "nature",
  },
  {
    title: "Metazooa",
    link: "https://metazooa.com/",
    topic: "nature",
  },
  {
    title: "Mini Crossword",
    link: "https://minicrossword.com/",
    topic: "words",
  },
  {
    title: "Minigolfle",
    link: "https://minigolfle.com/",
    topic: "sports",
  },
  {
    title: "Move to Movie",
    link: "https://movietomovie.com/",
    topic: "entertainment",
  },
  {
    title: "Neighborle",
    link: "https://neighborle.com/",
    topic: "geography",
  },
  {
    title: "Nerdle",
    link: "https://nerdlegame.com/",
    topic: "puzzle",
  },
  {
    title: "Padlock",
    link: "https://www.padlockgame.net/",
    topic: "puzzle",
  },
  {
    title: "Pocket Puzzle",
    link: "https://playpocketpuzzles.com/foursquare/home",
    topic: "puzzle",
  },
  {
    title: "SpellCheck",
    link: "https://spellcheck.xyz/mode_select",
    topic: "words",
  },
  {
    title: "Squaredle",
    link: "https://squaredle.app/?level=xp",
    topic: "words",
  },
  {
    title: "Strands",
    link: "https://www.nytimes.com/games/strands",
    topic: "words",
  },
  {
    title: "Sudoku",
    link: "https://sudoku.com/challenges",
    topic: "puzzle",
  },
  {
    title: "Timeguessr",
    link: "https://timeguessr.com/",
    topic: "trivia",
  },
  {
    title: "Toppled",
    link: "https://bythomas.co.uk/toppled/",
    topic: "puzzle",
  },
  {
    title: "Tradle",
    link: "https://games.oec.world/en/tradle/",
    topic: "geography",
  },
  {
    title: "Travle",
    link: "https://travle.earth/?travle-lang=en",
    topic: "geography",
  },
  {
    title: "UrbanStats",
    link: "https://urbanstats.org/quiz.html",
    topic: "geography",
  },
  {
    title: "Verticle",
    link: "https://verticle.netlify.app/",
    topic: "words",
  },
  {
    title: "Waffle",
    link: "https://wafflegame.net/daily",
    topic: "words",
  },
  {
    title: "Wikipedia Game",
    link: "https://www.thewikipediagame.com/",
    topic: "trivia",
  },
  {
    title: "Word Search",
    link: "https://games.washingtonpost.com/games/daily-word-search",
    topic: "words",
  },
  {
    title: "Wordle",
    link: "https://www.nytimes.com/games/wordle/index.html",
    topic: "words",
  },
  {
    title: "Worldle",
    link: "https://worldle.teuteuf.fr/",
    topic: "geography",
  },
  {
    title: "Xordle",
    link: "https://xordle.org/",
    topic: "words",
  },
];

async function main() {
  console.log(`🎮 Seeding ${rawGames.length} games...\n`);

  await prisma.game.createMany({
    data: rawGames.map((g) => ({
      title: g.title,
      link: g.link,
      topic: g.topic as Topic,
      playCount: 0,
    })),
    skipDuplicates: true,
  });

  console.log(`\n✅ Seeded ${rawGames.length} games successfully!`);

  // Auto-promote owner
  const ownerEmail = "aidankmcalister@gmail.com";
  const ownerUser = await prisma.user.findUnique({
    where: { email: ownerEmail },
  });

  if (ownerUser) {
    await prisma.user.update({
      where: { email: ownerEmail },
      data: { role: "owner" },
    });
    console.log(`\n👑 Promoted ${ownerEmail} to owner`);
  } else {
    console.log(
      `\n⏳ Owner user not found yet (${ownerEmail}) - will be promoted on next seed after sign-in`
    );
  }
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
