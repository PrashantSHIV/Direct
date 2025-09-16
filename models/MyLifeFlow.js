const db = require('./MainDBConfig');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS timetable (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL, time TEXT NOT NULL, discipline TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Timetable table created/verified successfully');
        }
    });
});

exports.getTimetable = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM timetable";
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Database query error:', err);
                reject(err);
            } else {
                console.log('Database query result:', rows);
                console.log('Result type:', typeof rows);
                console.log('Is array:', Array.isArray(rows));
                resolve(rows || []);
            }
        });
    });
}

exports.addTimetable = (type, time, discipline) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO timetable (type, time, discipline) VALUES (?, ?, ?)";
        db.run(sql, [type, time, discipline], function(err) {
            if (err) {
                console.error('Error adding timetable:', err);
                reject(err);
            } else {
                console.log('Timetable item added successfully');
                resolve(this.lastID);
            }
        });
    });
}

exports.updateTimetable = (id, type, time, discipline) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE timetable SET type = ?, time = ?, discipline = ? WHERE id = ?";
        db.run(sql, [type, time, discipline, id], function(err) {
            if (err) {
                console.error('Error updating timetable:', err);
                reject(err);
            } else {
                console.log('Timetable item updated successfully');
                resolve(this.changes);
            }
        });
    });
}

exports.deleteTimetable = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM timetable WHERE id = ?";
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting timetable:', err);
                reject(err);
            } else {
                console.log('Timetable item deleted successfully');
                resolve(this.changes);
            }
        });
    });
}   