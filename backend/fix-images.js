const Database = require('better-sqlite3');
const db = new Database('bookstore.db');

const covers = {
  1: 'images/ThreeSummers.jpg',
  2: 'images/ATOMIC-HABITS.jpg',
  3: 'images/FallingFoward.jpg',
  4: 'images/LetThem.jpg',
  5: 'images/ThePsychologyOfMoney.jpg',
  6: 'images/Dairy.jpg',
  7: 'images/HungerGames.jpg',
  8: 'images/SilentPatient.jpg',
  9: 'images/Sapiens.jpg',
  10: 'images/Clean.jpg',
  11: 'images/Dune.jpg',
  12: 'images/Becoming.jpg',
  13: 'images/TheVeryHungey.jpg',
  14: 'images/WheretheCrawdads.jpg',
  15: 'images/ThinkingFast.jpg',
  16: "images/A_Good_Girl's_Guide_to_Murder.jpg"
};

const stmt = db.prepare('UPDATE books SET cover_image = ? WHERE book_id = ?');
for (const [id, cover] of Object.entries(covers)) {
  stmt.run(cover, id);
}

console.log('Cover images updated to local paths');
db.close();