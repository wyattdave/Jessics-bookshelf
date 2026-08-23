/* David Walliams & Roald Dahl book data.
   Sources: Wikipedia (David Walliams bibliography, Roald Dahl bibliography). */

const SERIES = [
  {
    name: "Walliams Novels", emoji: "🎩", author: "David Walliams",
    colors: ["#2bc5b4", "#14879f"],
    story: "Laugh-out-loud adventures from David Walliams, packed with wild characters, daring schemes and heaps of heart.",
    books: [
      ["The Boy in the Dress", 2008, "👗", "Dennis is football-mad and bored — until fashion, friendship and a dazzling dress turn his world upside down."],
      ["Mr Stink", 2009, "🧦", "Chloe hides Mr Stink, the smelliest tramp in town, in the garden shed — and uncovers his surprising secret."],
      ["Billionaire Boy", 2010, "💷", "Joe Spud has a billion pounds and everything money can buy — except the one thing he really needs: a friend."],
      ["Gangsta Granny", 2011, "💎", "Ben thinks Granny is boring… until he discovers she's an international jewel thief plotting to steal the Crown Jewels!"],
      ["Ratburger", 2012, "🐀", "Zoe's pet rat is in terrible danger — the revolting Burt of Burt's Burgers has a horrible plan for him."],
      ["Demon Dentist", 2013, "🦷", "Strange things are happening to children's teeth in town, and Alfie is sure the creepy new dentist is behind it."],
      ["Awful Auntie", 2014, "🦉", "Stella wakes to find wicked Aunt Alberta and her giant owl plotting to steal her home — time to fight back!"],
      ["Grandpa's Great Escape", 2015, "✈️", "Grandpa thinks he's still a Spitfire pilot, so when he's locked away in Twilight Towers, Jack plans a daring escape."],
      ["The Midnight Gang", 2016, "🌙", "When the clock strikes midnight at Lord Funt Hospital, Tom and the children's ward set off on magical adventures."],
      ["Bad Dad", 2017, "🏎️", "Frank's dad was a champion racing driver — now Frank must help him pull off the getaway of a lifetime."],
      ["The Ice Monster", 2018, "🦣", "When a 10,000-year-old mammoth arrives at the museum, orphan Elsie hatches a plan to bring it home to the Arctic."],
      ["The Beast of Buckingham Palace", 2019, "🦁", "In a dark future London, young Prince Alfred must face a terrifying beast to save his mother and the kingdom."],
      ["Code Name Bananas", 2020, "🦍", "London, 1940: Eric and his gorilla friend Gertrude go on the run in a wild wartime adventure."],
      ["Gangsta Granny Strikes Again!", 2021, "👵", "The Black Cat is back?! Ben can't believe it — Granny's legend returns in a brand-new jewel-heist mystery."],
      ["Spaceboy", 2022, "🚀", "America, 1966: Ruth dreams of the stars — then a flying saucer crashes in the cornfield and the adventure begins."],
      ["Robodog", 2023, "🤖", "Robodog, the police-dog school's newest recruit, must save the city of Bedlam from the world's worst criminals."],
      ["Astrochimp", 2024, "🐵", "Chip the chimp blasts into orbit and becomes the unlikeliest hero of the entire space race."],
      ["Super Sleuth", 2024, "🔍", "Huxley, the world's second-greatest detective, must crack the case of the world's greatest detective's disappearance."]
    ]
  },
  {
    name: "The World's Worst…", emoji: "😈", author: "David Walliams",
    colors: ["#ff5a36", "#d42a0f"],
    story: "Collections of the most gruesome, ghastly and gigglesome characters ever to misbehave. Beware — they're the worst!",
    books: [
      ["The World's Worst Children", 2016, "😈", "Ten tales of the most terrible tots ever — from Nigel Nit-Boy to Sofia Sofa."],
      ["The World's Worst Children 2", 2017, "🤢", "Ten more monstrous kids, including Gruesome Griselda and Fussy Frankie."],
      ["The World's Worst Children 3", 2018, "🤪", "A third helping of horrendous children, starring Boastful Barnabas and friends."],
      ["The World's Worst Teachers", 2019, "📏", "Ten terrible teachers with dastardly ways — like Miss Seethe and Doctor Dread."],
      ["The World's Worst Parents", 2020, "👃", "From Peter Pong's ponging feet to Supermum — parents at their absolute worst."],
      ["The World's Worst Pets", 2022, "🐟", "Beware of the pets! Ten tales of terrible animals, from Furp the fish to Houdini the horse."],
      ["The World's Worst Monsters", 2023, "👹", "Ten fiendishly funny monsters that go bump, burp and boom in the night."],
      ["The World's Worst Superheroes", 2025, "🦸", "Capes, tights and total chaos — the least super superheroes ever assembled."]
    ]
  },
  {
    name: "Walliams Shorter Reads", emoji: "🟢", author: "David Walliams",
    colors: ["#7ed957", "#2fa84f"],
    story: "Quick, quirky adventures that pack a monster-sized laugh into a smaller book.",
    books: [
      ["Fing", 2019, "🧌", "Myrtle Meek wants a FING — but what IS a Fing? Her parents must journey to the deepest jungle to find out."],
      ["Slime", 2020, "🟢", "Ned discovers the amazing power of SLIME and sets out to teach the horrible grown-ups of Mulch a lesson."],
      ["Megamonster", 2021, "👾", "On a volcanic island school for naughty children, Larker must face the mad professor's MEGAMONSTER."]
    ]
  },
  {
    name: "Walliams Picture Books", emoji: "🐘", author: "David Walliams",
    colors: ["#4fb3ff", "#2f6fd6"],
    story: "Big, bright picture-book fun starring elephants, hippos, penguins and one party-mad granny.",
    books: [
      ["The Slightly Annoying Elephant", 2013, "🐘", "A very bossy, slightly annoying elephant moves in with Sam — completely uninvited."],
      ["The First Hippo on the Moon", 2014, "🦛", "Two hippos race to be the first hippo in space. 3… 2… 1… BLAST OFF!"],
      ["The Bear Who Went Boo!", 2015, "🐻‍❄️", "A cheeky polar bear cub just can't stop booing everyone at the North Pole."],
      ["There's a Snake in My School!", 2016, "🐍", "Miranda brings her pet snake Penelope to school — and chaos follows."],
      ["Boogie Bear", 2017, "🐻", "A lost polar bear drifts to a new land and just wants to find a friend."],
      ["Geronimo", 2018, "🐧", "Geronimo the baby penguin has one enormous dream: to FLY!"],
      ["The Creature Choir", 2019, "🎶", "Warble the walrus can't sing… or can she? A tale about finding your voice."],
      ["Little Monsters", 2020, "👻", "Howler the werewolf is meant to be scary, but he'd much rather be funny."],
      ["Grannysaurus", 2022, "🦖", "Spike's granny has a secret: at night she turns into a party-loving dinosaur!"],
      ["Marmalade", 2023, "🍊", "Marmalade the bright-orange panda doesn't fit in — until he discovers being different is brilliant."]
    ]
  },
  {
    name: "Roald Dahl Classics", emoji: "🍑", author: "Roald Dahl",
    colors: ["#ffb100", "#ff7a1a"],
    story: "Phizz-whizzing stories from the world's number one storyteller, full of magic, mischief and marvellous inventions.",
    books: [
      ["James and the Giant Peach", 1961, "🍑", "James escapes his horrid aunts inside a giant magical peach with a crew of giant insects."],
      ["Charlie and the Chocolate Factory", 1964, "🍫", "Charlie Bucket wins a golden ticket to Willy Wonka's wondrous chocolate factory."],
      ["The Magic Finger", 1966, "☝️", "When the Gregg family go hunting, a girl's magic finger teaches them a feathery lesson."],
      ["Fantastic Mr Fox", 1970, "🦊", "Clever Mr Fox outwits three foul farmers — Boggis, Bunce and Bean."],
      ["Charlie and the Great Glass Elevator", 1972, "🛗", "Charlie, Willy Wonka and the whole family blast into space in the great glass elevator."],
      ["Danny, the Champion of the World", 1975, "🐦", "Danny and his dad hatch the most daring pheasant-rescuing plan the world has ever seen."],
      ["The Enormous Crocodile", 1978, "🐊", "A greedy crocodile with secret plans and clever tricks slithers off to find a child for lunch."],
      ["The Twits", 1980, "🙃", "Mr and Mrs Twit are the nastiest couple alive — until the Muggle-Wump monkeys get their revenge."],
      ["George's Marvellous Medicine", 1981, "🧪", "George brews a marvellous medicine to cure his grizzly grandma of her nastiness."],
      ["The BFG", 1982, "👂", "Sophie and the Big Friendly Giant team up to stop the child-guzzling giants of Giant Country."],
      ["The Witches", 1983, "🐭", "A boy and his grandmother must stop the witches of England — even after he's turned into a mouse!"],
      ["The Giraffe and the Pelly and Me", 1985, "🦒", "Billy joins the Ladderless Window-Cleaning Company: a giraffe, a pelican and a cheeky monkey."],
      ["Matilda", 1988, "📚", "Brilliant Matilda uses her amazing mind to outsmart Miss Trunchbull, the terrifying headmistress."],
      ["Esio Trot", 1990, "🐢", "Mr Hoppy's tortoise trick might just win the heart of his lovely neighbour Mrs Silver."],
      ["The Vicar of Nibbleswicke", 1991, "⛪", "Poor Reverend Lee has a peculiar condition that makes him say important words backwards."],
      ["The Minpins", 1991, "🌲", "Billy ventures into the Forest of Sin and discovers the tiny Minpins who live inside the trees."]
    ]
  },
  {
    name: "Roald Dahl Rhymes & True Tales", emoji: "✒️", author: "Roald Dahl",
    colors: ["#9b59d0", "#5e35b1"],
    story: "Wickedly funny rhymes and Roald Dahl's own real-life adventures, from sweet-shop mischief to flying solo.",
    books: [
      ["Revolting Rhymes", 1982, "🐺", "Six classic fairy tales retold with wickedly funny twists."],
      ["Dirty Beasts", 1983, "🦂", "Rude and riotous rhymes about unlikely animals, from a toad to an anteater."],
      ["Boy: Tales of Childhood", 1984, "🍬", "Roald Dahl's own school days: sweet shops, mischief and the Great Mouse Plot."],
      ["Going Solo", 1986, "🛩️", "Young Roald sails to Africa and becomes a fighter pilot in this true-life adventure."],
      ["Rhyme Stew", 1989, "🥣", "A bubbling stew of hilarious rhymes stirring up well-known tales and characters."]
    ]
  }
];

/* Build the full book list. */
const BOOKS = (() => {
  const books = [];
  const coverMap = typeof BOOK_COVERS === "undefined" ? {} : BOOK_COVERS;
  let num = 0;
  for (const s of SERIES) {
    s.bookIds = [];
    for (const [title, year, emoji, blurb] of s.books) {
      num++;
      const id = "b" + num;
      s.bookIds.push(id);
      books.push({
        id,
        num,
        title,
        author: s.author,
        year,
        emoji,
        series: s.name,
        colors: s.colors,
        seriesEmoji: s.emoji,
        blurb,
        bio: `${blurb} Written by ${s.author} and first published in ${year}. ${s.story}`,
        cover: coverMap[id] || null
      });
    }
  }
  return books;
})();

const SERIES_NAMES = SERIES.map(s => s.name);

/* Milestone achievements — reading badges! */
const MILESTONES = [
  { count: 1, name: "First Page Turned", emoji: "📖", desc: "You read your very first book — the adventure begins!" },
  { count: 3, name: "Story Snacker", emoji: "🍫", desc: "3 books read — scrumdiddlyumptious!" },
  { count: 5, name: "Golden Ticket", emoji: "🎫", desc: "5 books read — you found a golden ticket!" },
  { count: 10, name: "Phizz-Whizzing Reader", emoji: "✨", desc: "10 books read — absolutely phizz-whizzing!" },
  { count: 15, name: "Giant Peach Picker", emoji: "🍑", desc: "15 books read — a truly giant achievement!" },
  { count: 20, name: "Gangsta Reader", emoji: "👵", desc: "20 books read — even Gangsta Granny is impressed!" },
  { count: 25, name: "Billionaire Bookworm", emoji: "🐛", desc: "25 books read — richer than Joe Spud in stories!" },
  { count: 30, name: "Marvellous Medicine", emoji: "🧪", desc: "30 books read — a marvellous mixture of stories!" },
  { count: 35, name: "Midnight Gang Member", emoji: "🌙", desc: "35 books read — welcome to the Midnight Gang!" },
  { count: 40, name: "Big Friendly Reader", emoji: "👂", desc: "40 books read — the BFG salutes you!" },
  { count: 50, name: "World's BEST Reader", emoji: "🏆", desc: "50 books read — the opposite of the world's worst!" },
  { count: 60, name: "The Complete Bookshelf", emoji: "👑", desc: "Every single book read — the ultimate champion of the world!" }
];
