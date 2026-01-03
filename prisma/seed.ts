import { PrismaClient, Topic } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Types for game seed data
interface GameSeedData {
  title: string;
  link: string;
  topic: Topic;
}

// Initialize Prisma client
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// Games data with assigned categories
const games: GameSeedData[] = [
  // Words category
  { title: "Wordle", link: "https://www.nytimes.com/games/wordle/index.html", topic: "words" },
  { title: "Connections", link: "https://www.nytimes.com/games/connections", topic: "words" },
  { title: "Strands", link: "https://www.nytimes.com/games/strands", topic: "words" },
  { title: "Mini Crossword", link: "https://minicrossword.com/", topic: "words" },
  { title: "Word Search", link: "https://games.washingtonpost.com/games/daily-word-search", topic: "words" },
  { title: "Squaredle", link: "https://squaredle.app/?level=xp", topic: "words" },
  { title: "Waffle", link: "https://wafflegame.net/daily", topic: "words" },
  { title: "Verticle", link: "https://verticle.netlify.app/", topic: "words" },
  { title: "Xordle", link: "https://xordle.org/", topic: "words" },
  { title: "Feudle", link: "https://googlefeud.com/feudle/", topic: "words" },
  { title: "Cryptic Crossword", link: "https://www.minutecryptic.com/", topic: "words" },
  { title: "Jumblie", link: "https://jumblie.com/", topic: "words" },
  { title: "SpellCheck", link: "https://spellcheck.xyz/mode_select", topic: "words" },
  
  // Puzzle category
  { title: "Angle", link: "https://angle.wtf/", topic: "puzzle" },
  { title: "Nerdle", link: "https://nerdlegame.com/", topic: "puzzle" },
  { title: "Mathler", link: "https://www.mathler.com/", topic: "puzzle" },
  { title: "Dodeku", link: "https://dodeku.com/", topic: "puzzle" },
  { title: "Padlock", link: "https://www.padlockgame.net/", topic: "puzzle" },
  { title: "Sudoku", link: "https://sudoku.com/challenges", topic: "puzzle" },
  { title: "Chess Puzzle", link: "https://www.chess.com/daily-chess-puzzle", topic: "puzzle" },
  { title: "Pocket Puzzle", link: "https://playpocketpuzzles.com/foursquare/home", topic: "puzzle" },
  { title: "Circuits", link: "https://www.puzzmo.com/game/circuits/", topic: "puzzle" },
  { title: "Toppled", link: "https://bythomas.co.uk/toppled/", topic: "puzzle" },
  
  // Geography category
  { title: "Worldle", link: "https://worldle.teuteuf.fr/", topic: "geography" },
  { title: "Globle", link: "https://globle-game.com/", topic: "geography" },
  { title: "Tradle", link: "https://games.oec.world/en/tradle/", topic: "geography" },
  { title: "Travle", link: "https://travle.earth/?travle-lang=en", topic: "geography" },
  { title: "Flagle", link: "https://www.flagle.io/", topic: "geography" },
  { title: "UrbanStats", link: "https://urbanstats.org/quiz.html", topic: "geography" },
  
  // Entertainment category (movies, music, tv)
  { title: "Framed", link: "https://framed.wtf/", topic: "entertainment" },
  { title: "Bandle", link: "https://bandle.app/", topic: "entertainment" },
  { title: "Guess the Audio", link: "https://guesstheaudio.com/", topic: "entertainment" },
  { title: "Lyricle", link: "https://www.lyricle.app/", topic: "entertainment" },
  { title: "Cinematrix", link: "https://www.vulture.com/article/daily-movie-grid-trivia-game-cinematrix.html", topic: "entertainment" },
  { title: "Cine2Nerdle", link: "https://www.cinenerdle2.app/", topic: "entertainment" },
  { title: "Move to Movie", link: "https://movietomovie.com/", topic: "entertainment" },
  { title: "Guess The Movie", link: "https://guessthemovie.name/", topic: "entertainment" },
  
  // Trivia category
  { title: "Bracket City", link: "https://www.theatlantic.com/games/bracket-city/", topic: "trivia" },
  { title: "Daily Tens", link: "https://dailytens.com/", topic: "trivia" },
  { title: "Wikipedia Game", link: "https://www.thewikipediagame.com/", topic: "trivia" },
  
  // Gaming category
  { title: "Gamedle Classic", link: "https://www.gamedle.wtf/classic#", topic: "gaming" },
  { title: "Gamedle Character", link: "https://www.gamedle.wtf/characters#", topic: "gaming" },
  { title: "Guess The Game", link: "https://guessthe.game/", topic: "gaming" },
  { title: "Squirdle", link: "https://squirdle.fireblend.com/daily.html", topic: "gaming" },
  
  // Nature category
  { title: "Metazooa", link: "https://metazooa.com/", topic: "nature" },
  { title: "Metaflora", link: "https://flora.metazooa.com/", topic: "nature" },
  
  // Food category
  { title: "Food Guessr", link: "https://www.foodguessr.com/", topic: "food" },
  
  // Sports category
  { title: "Minigolfle", link: "https://minigolfle.com/", topic: "sports" },
];

async function main() {
  console.log("🎮 Seeding games...");
  
  for (const game of games) {
    await prisma.game.upsert({
      where: { link: game.link },
      update: {
        title: game.title,
        topic: game.topic,
      },
      create: game,
    });
    console.log(`  ✓ ${game.title}`);
  }
  
  console.log(`\n✅ Seeded ${games.length} games successfully!`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
