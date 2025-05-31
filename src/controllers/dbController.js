// DATABASE CONTROLLER

const sqlite3 = require("sqlite3");
const fs = require("fs");

class DatabaseController {
    constructor() {
        this.words = JSON.parse(fs.readFileSync('./src/db/words.json', 'utf-8')); // Reading file with words
        this.db = new sqlite3.Database('./src/db/main.db', (err) => {
            if (err)
                console.error(`Couldn't load database: ${err.message}`);
            else
                console.log('Database loaded succesfully.');
        });
        this.createResultTable();
        this.getResults();
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
                date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
       this.db.prepare(query).run();
    }

    insertResult(data) {
        // Inserting test values
        /*
        for(let i=0; i<10; i++){
            const query = `
                INSERT INTO results (playerName, points) VALUES ("Patryk", ${Math.floor(Math.random() * 15)*10})
            `;
            this.db.prepare(query).run()
        }
        */
       const query = `
            INSERT INTO results (playerName, points) VALUES ("${data.playerName}", ${data.points})
        `;
        this.db.prepare(query).run();
    }

    getResults() {
        console.log("reading results")
        const query = `
            SELECT * FROM results
        `;
        this.db.all(query, (err, rows) => {
            if (err){
                console.error(`Couldn't read results: ${err.message}`);
            } else{
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
        this.db.prepare(query).run();o
    }
}

module.exports = DatabaseController;