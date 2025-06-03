// DATABASE CONTROLLER

const sqlite3 = require("sqlite3");
const fs = require("fs");

class DatabaseController {
    constructor() {
        this.words = JSON.parse(fs.readFileSync('./src/db/words.json', 'utf-8')); // Reading file with words
        this.db = new sqlite3.Database('./src/db/main.db', (err) => {
            if (err) {
                console.error(`Couldn't load database: ${err.message}`);
            } else {
                console.log('Database loaded succesfully.');
                this.createResultTable();
                //this.clearResults(); // Restoring database
                this.getResults();
            }
        });
    }

    // Returning random word method
    getRandomWord() {
        return this.words[Math.floor(Math.random() * this.words.length)];
    }

    createResultTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS results (
                result_id INTEGER PRIMARY KEY,
                playerName TEXT NOT NULL,
                points INTEGER NOT NULL,
                date date TEXT DEFAULT (DATE('now'))
            )
        `;
        this.db.prepare(query).run();
    }

    insertResult(player) {
        console.log("Saving winner results.");
        console.log(player);
        const query = `
            INSERT INTO results (playerName, points) VALUES (?, ?)
        `;
        this.db.run(query, [player.name, player.points], function (err) {
            if (err) {
                console.error(`Couldn't write result: ${err.message}`);
            } else {
                console.log("Result inserted successfully.");
            }
        });
    }

    getResults() {
        console.log("reading results")
        const query = `
            SELECT * FROM results
        `;
        this.db.all(query, (err, rows) => {
            if (err) {
                console.error(`Couldn't read results: ${err.message}`);
            } else {
                console.log('Results loaded succesfully.');
                console.log(rows)
            }
        });
    }

    // Clearing results table - use if needed
    clearResults() {
        const query = `
            DELETE FROM results;
            VACUUM;
        `;
        this.db.run(query, (err, rows) => {
            if (err) {
                console.error(`Couldn't clear database: ${err.message}`);
            } else {
                console.log('Clearing database finished succesfully.');
                // Inserting test values
                for (let i = 0; i < 10; i++) {
                    this.insertResult({ name: "Patryk", points: Math.floor(Math.random() * 15) * 10 });
                }
            }
        });
    }
}

module.exports = DatabaseController;