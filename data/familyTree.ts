export type FamilyTreeBranch = {
  roman: string;
  branchName: string;
  photoLabel: string;
  generations: string[][];
};

export const familyTreeExpectedPersonEntryCount = 593;
export const familyTreeWorkbookEntryCount = 593;
export const familyTreeSourceTab = "tree_website_mock 1";
export const familyTreeSyncedAt = "pending-live-google-sheet-sync";
export const familyTreeGenerations = ["Root / Gen 1", "Gen 2", "Gen 3", "Gen 4", "Gen 5", "Gen 6"];

// Initial ingestion came from the uploaded Johnson Family Tree PDF mockup by generation column.
// Run `npm run family-tree:sync` after deploying the updated Apps Script to regenerate this from Google Sheets.
export const familyTreeBranches: FamilyTreeBranch[] = [
  {
    roman: "I",
    branchName: "Annie Mae Hines \"Bay\"",
    photoLabel: "Photo placeholder: annie-mae-hines-bay.jpg",
    generations: [
      ["Annie Mae Hines \"Bay\" (Robert)"],
      ["Larry Darnell", "Evelyn Ruth", "Rosemary", "Michael Ray", "Sam", "Shirley Ann", "Sandra Denise"],
      ["Daphne", "Darrian", "Larry", "Dayshani \"Daisy\"", "Antonio", "Annie", "Emmalee \"Cammona\"", "Charlotte", "Kartreace (Tony)", "Derrick Sr", "John Jr", "Shekela (Antonio)", "Shantela (Raufeil)", "Latasha (Marlon)", "Jameion", "Travis", "Shemeka", "Horace Jr", "Keisha", "Corey Sr", "Michael Ray", "Latonia (Debbie)", "De'Arlo", "Samantha", "Lorenzo Sr", "Sheronda", "Ronisha", "Ronald", "Will", "Tiffany", "LaShandria", "Marquita", "Cassandra", "Revis", "Antonio Jr (Jay)", "Damien"],
      ["Shadreka", "Lamar", "Jartavius", "Neya", "Patience", "Darrian Jr", "A'Niya", "Larry Jr", "Kayla", "Darcey", "Dayshanti", "DayQuan", "CortaeVion", "Cor'Marion", "LaNyla", "Derrica", "Derrick Jr", "Darius", "Demarcus", "Rylan", "Jasmine", "Jahnae", "Jaida", "Jamya", "Justus", "Bryson", "Jay'va", "Travis Jr", "Reniya", "Keon (Ronald)", "Kia", "Rontavious Sr Ashley", "Alexis", "Horace III (Alice)", "Vinnie", "Henry", "Kyndria", "Walter", "Eddie Jr (Luke)", "Keonna", "Corey Jr (Willie Mae)", "Shemeka", "True", "Briana", "Cameron", "Dearius", "Jada", "Jalen", "Alicia", "Lorenzo Jr", "Antonio Jr", "D'Andre", "Shiryl", "Serenity", "Carlos Jr", "Kamryn", "Kaitlyn", "Kyndyll", "Jayden (Jessica)", "Tawanda", "Everett", "Will Jr", "Jessica", "Jermiah Sr", "Jayden", "Shaquil", "Darrell", "Henrycia", "Bryceton", "Robert", "Tamia", "Jordan", "Mar'Khi", "Ty'kia", "Koby", "Aaliyah", "Carniyah", "Caenell", "Omari", "Peyton"],
      ["Kathelyn", "Layla", "Logan", "Tyrese", "Kamari", "Kehlani", "Amari", "Lamar", "A'Zariyah", "Katelynn", "Jaydon", "Sedquavious", "Tanaisa", "Karley", "Kenzie", "Kensley", "Ke'Ziah", "Andrea", "Jada", "Diari Rose", "Rontavious Jr", "Ashton", "Riley", "Irick Jr.", "Emorie", "Talia", "Tiryn", "Ayla", "Braylen", "Karson", "E'Keesia", "Onna", "Lay'Lonnie", "Jermiah Jr", "Sanliah", "Shaquil Jr", "Zoey", "Ta'lon", "Kaedan", "Taahj", "Tyun", "Treasure"],
      []
    ]
  },
  {
    roman: "II",
    branchName: "Ruby Lee Ray \"Pudden\"",
    photoLabel: "Photo placeholder: ruby-lee-ray-pudden.jpg",
    generations: [
      ["Ruby Lee Ray \"Pudden\" (Lee Bobby)"],
      ["Dorris Jean", "Ricky Lee", "Donald Ray", "Jasper Lee Jr"],
      ["Prince (Erwin)", "Mencho", "Lavell", "Ricky Jr", "Corinthia", "Shannon", "Ashley", "Jaylen", "Kami"],
      ["Kierica (Jessica)", "Precious", "Prince Jr", "Paidynn", "Cherreda", "Eric Jr", "Shatonya", "Ricky III", "Rickiyah", "Kerion", "Jamal", "Kaliy", "Bobnisha", "Bobby", "Jeremiah", "Zay"],
      ["Ky'Nia (Antoinette)", "Kijah", "Pariss (Terrica)", "Demarion", "Eian (Brittney)", "Dayton", "Dream"],
      []
    ]
  },
  {
    roman: "III",
    branchName: "Ethel Nell Jewett \"Pie\"",
    photoLabel: "Photo placeholder: ethel-nell-jewett-pie.jpg",
    generations: [
      ["Ethel Nell Jewett \"Pie\" (Edward Duke Sr.)"],
      ["Ronnie Johnson Sr", "Evelyn Faye Ann", "Marvin \"Rat\"", "Edward Duke Jr", "Yvonne"],
      ["Ronnie Jr", "LaQuita \"Penny\"", "Travis", "LaRonda", "Shenessia (Ochus)", "Ivory Jr", "Brandon", "Leonardo", "Eric", "Brianna", "Antonio (Herb)", "Juan Jr", "Quonessia", "Jewayn", "Ulaylah"],
      ["Kelan", "Kaitlyn", "Marcellous", "Iyanna", "Bryan", "Janisha", "Johnny", "Angel", "Thomas Jr", "Tamarie", "Ciara", "Ivory II", "Ivyanna", "Jynesis", "Draylen", "Jai'el", "Mila", "Evie", "Terria", "Toni", "Shania", "Antonio Jr", "Juan 3rd", "Ariel", "Juantavious", "Juanessya", "Juanterrious", "Juan'Dylnn", "Julian", "Montrey (Artaveon)", "Latonya", "Octavious Jr", "Jewayn", "Jamel"],
      ["Za'Kyela", "Jenelle", "Lyric"],
      []
    ]
  },
  {
    roman: "IV",
    branchName: "Clarence Johnson",
    photoLabel: "Photo placeholder: clarence-johnson.jpg",
    generations: [
      ["Clarence Johnson (Eula)"],
      ["Anthony", "Keith Lamonte", "Stephanie Ann"],
      ["Brandon", "Shaun", "LaParish", "Ashley", "K'NyKeria (Kelly)", "K'NyKeijuana", "K'NyKiara", "K'Nykhya", "Jeremiah"],
      ["Blaise", "Mila", "Aidan", "A'Miyah", "A'Nayah", "A'Milliyon", "Torrence Jr (Josh)", "Torrian", "Khloe", "Nevaeh", "Yasmine", "Tamar (Travis)", "Gianna", "Travis Jr", "Jr (Jeremiah)"],
      [],
      []
    ]
  },
  {
    roman: "V",
    branchName: "Joe Johnson II",
    photoLabel: "Photo placeholder: joe-johnson-ii.jpg",
    generations: [
      ["Joe Johnson II (Jodie)"],
      ["Joe", "Valerie Kerseta", "Ricky", "Tamika", "Elliott", "Brianna"],
      ["Brent", "Nicole", "Kendra", "Drayton", "Danny", "Christina", "Chante", "Seqouia (Richard)", "Richard II \"Scooter\"", "Ricky J", "Ricky Jr", "Rikeita", "Armani", "Anthony", "(Brittany) Ahziah", "Allonah", "Autumn", "Brooklyn", "Kenya", "Decarreus"],
      ["Tru Melody", "Chrishandra", "Steeve (Sammie)", "Jazale", "Kentrell", "Montrell", "Katrell", "Drayton Jr", "Dra'Mari", "Danel", "Danelo", "Lee Lee", "Stacey", "Josiah", "Isiah", "Aidan", "Armani Jr", "Miri", "Miasia", "Ka'lonna", "Dahlia", "Aniylah"],
      [],
      []
    ]
  },
  {
    roman: "VI",
    branchName: "Richard Lee Johnson",
    photoLabel: "Photo placeholder: richard-lee-johnson.jpg",
    generations: [
      ["Richard Lee Johnson (Yvonne)"],
      ["Andria Heaven (Yvonne)", "Tabitha", "Tykeem", "Tyrand", "Taron Genelle", "Stacey Marie", "Sam", "Ricky Lee", "Alonzo", "Monica"],
      ["Keith Jr (Keith)", "Keivon", "Harmony", "La Shania", "Jasmine", "LaToya", "Renea", "Oshima", "Quintillia (Harold)", "Nicholas", "Jessica", "Jonathan Sr", "Jerrica", "Austin", "Giana", "Porsha"],
      ["Carter", "Heaven", "Karlee", "Cameron", "DeAndre", "Shelby", "Markayla", "Jaromessa", "Jarnea", "Demarcleous Jr (Jonathan)", "Isabella", "MacKenzie", "Jonathan Jr", "Jalia", "William"],
      ["Zayia", "De'Marion", "Marlee", "Armoni", "De'liyah", "Major", "Jeremiah", "Ayla", "Tristan", "Heaven", "Ja'Vion"],
      []
    ]
  },
  {
    roman: "VII",
    branchName: "Bobbie Jean Youngblood",
    photoLabel: "Photo placeholder: bobbie-jean-youngblood.jpg",
    generations: [
      ["Bobbie Jean Youngblood (Matthew \"Blood\")"],
      ["Sharron Denise", "Evelyn LaShey", "Rena Reginald", "Shalonda Clarissa"],
      ["Brittany", "Ambreya", "Jr. Emberly", "Keith (Rashad)", "Eboni (Tim)", "Essence", "Albert III", "Taylor"],
      ["Caleb", "Kelcey", "Bryson", "Tristian", "Trinity", "Mikayla", "Kylan"],
      [],
      []
    ]
  },
  {
    roman: "VIII",
    branchName: "George Johnson Sr",
    photoLabel: "Photo placeholder: george-johnson-sr.jpg",
    generations: [
      ["George Johnson Sr"],
      ["Michael Anthony", "Shana Denise", "LaShell LaTia", "Jacques Darnell Eckles (Ana)", "George Jr", "Derrick Allen", "Benesser", "Kedrick Danyal Sr", "Martha Ann", "Iaisha Lanika", "Kristin Danette", "Isaac Sr (Barbara)", "LaShell"],
      ["Shara", "Shakria", "Ty'Aire", "Allen", "Anthony", "Javon (James)", "Tyler", "Gloria Morgan-Ceymone", "JaVon", "Jessica Danielle", "Ja'Nae Darnell", "Darrion", "Ariana", "Ayana", "Jayana", "Jordan"],
      ["Ti'Aego", "Tae'Zhone", "Ta'Miya", "Tai'Lynn", "Luca", "Luna", "Tyla", "Ja'Quarius"],
      [],
      []
    ]
  },
  {
    roman: "IX",
    branchName: "James Lee Johnson",
    photoLabel: "Photo placeholder: james-lee-johnson.jpg",
    generations: [
      ["James Lee"],
      ["James Lee", "Dominisha", "Jr Karson", "Tavares", "Alexus \"Squeaky\"", "Consuella Monique", "Venita Michelle"],
      ["Jamari", "Karlee", "Jaylen", "Cameron", "Khyree (Damon)"],
      [],
      [],
      []
    ]
  },
  {
    roman: "X",
    branchName: "Eugene Johnson",
    photoLabel: "Photo placeholder: eugene-johnson.jpg",
    generations: [
      ["Eugene Johnson (Patsy)"],
      ["BrianVon Keith", "Tracy Marie", "Evelyn Renee", "Daniel Shane", "DeCarlos Eugene", "Steven Lavar, Sr", "Landon"],
      ["Jasmine", "Brittany", "Brian", "Elisha", "Artavious", "Reginald", "Shannon", "Adrian", "Damon", "Erin", "LeMarco", "Justin", "Michael", "Mateo", "Daniel Jr", "Keishuna", "Mashane", "Markavious", "DeKauri", "Carlissa", "Kelsie", "Cody", "Steven Jr", "Ashton", "Jaden", "Lyric"],
      ["Cheyenne", "Brooklyn", "Asia", "Adrian", "Zoey", "Caliee", "Serenity", "Raheem"],
      [],
      []
    ]
  },
  {
    roman: "XI",
    branchName: "Melvin Johnson",
    photoLabel: "Photo placeholder: melvin-johnson.jpg",
    generations: [
      ["Melvin Johnson (Audrey)"],
      ["Anthony DeWayne", "Walectra Eline", "Tomeka"],
      ["Anthony Jr", "Lazarrick", "DeAnthony", "Daisha", "Amir", "Wanetra (Alsundra')", "WaDarian", "Justin", "Jasmine", "MaKayla", "Darry"],
      [],
      [],
      []
    ]
  },
  {
    roman: "XII",
    branchName: "Dianne Johnson Brooks",
    photoLabel: "Photo placeholder: dianne-johnson-brooks.jpg",
    generations: [
      ["Dianne Johnson Brooks (Gerald Brooks)"],
      ["Gerranda DeeShell (Shenika)", "Gerald Dee Jr", "DeeShaye Axel"],
      ["Ayden", "Arreic", "Brayden"],
      [],
      [],
      []
    ]
  },
  {
    roman: "XIII",
    branchName: "Leonard Earl Johnson Sr",
    photoLabel: "Photo placeholder: leonard-earl-johnson-sr.jpg",
    generations: [
      ["Leonard Earl Johnson Sr (Yvonne \"Vernse\")"],
      ["Lennisha Latona Yvette", "Leonard Earl Jr (Tonya)", "Wesley Lennya"],
      ["LeAyshia", "Lennasia (Sara)", "Landen", "Lennearia"],
      [],
      [],
      []
    ]
  },
  {
    roman: "XIV",
    branchName: "Sheila Yvonne Johnson Martins",
    photoLabel: "Photo placeholder: sheila-yvonne-johnson-martins.jpg",
    generations: [
      ["Sheila Yvonne Johnson Martins (Frank Martin)"],
      ["Mario DeWayne", "Jaylen"],
      ["Garrett (Gary)", "Gabrielle (Shelby)", "Jream", "Mya", "Markyia (Paula)"],
      ["Mark"],
      [],
      []
    ]
  },
  {
    roman: "XV",
    branchName: "Dorothy Wiley",
    photoLabel: "Photo placeholder: dorothy-wiley.jpg",
    generations: [
      ["Dorothy Wiley"],
      ["Stephanie", "Michael"],
      ["Zebulon", "Zebonique", "Cove"],
      ["Greyson", "Aniyah", "Andrea", "Andre"],
      [],
      []
    ]
  }
];

export const familyTreePersonEntryCount = familyTreeBranches.reduce(
  (total, branch) => total + branch.generations.reduce((branchTotal, generation) => branchTotal + generation.length, 0),
  0
);
