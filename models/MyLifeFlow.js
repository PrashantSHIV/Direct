const db = require('./MainDBConfig');

// TIME TABLE
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS timetable (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL, time TEXT NOT NULL, discipline TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Timetable table created/verified successfully');
        }
    });
});

// MIND
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS mind (id INTEGER PRIMARY KEY AUTOINCREMENT, section_name TEXT NOT NULL, technique_name TEXT NOT NULL, technique_steps TEXT)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Mind table created/verified successfully');
        }
    });
});

// BODY
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS exercise (id INTEGER PRIMARY KEY AUTOINCREMENT, section_name TEXT NOT NULL, technique_name TEXT NOT NULL, technique_steps TEXT)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Exercise table created/verified successfully');
        }
    });
    db.run("CREATE TABLE IF NOT EXISTS day_table (id INTEGER PRIMARY KEY AUTOINCREMENT, day TEXT NOT NULL, reps INTEGER NOT NULL, sets INTEGER NOT NULL, exercise_name TEXT NOT NULL)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Day table created/verified successfully');
        }
    });
    db.run("CREATE TABLE IF NOT EXISTS diet_table (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, benefits TEXT NOT NULL)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Diet table created/verified successfully');
        }
    });
    db.run("CREATE TABLE IF NOT EXISTS daily_diet_table (id INTEGER PRIMARY KEY AUTOINCREMENT, day TEXT NOT NULL, diet_name TEXT NOT NULL, quantity TEXT NOT NULL)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Daily diet table created/verified successfully');
        }
    });
});

// GOALS
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS goals (id INTEGER PRIMARY KEY AUTOINCREMENT, goal TEXT NOT NULL, reason TEXT NOT NULL, duration TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Goals table created/verified successfully');
        }
    });
});

// REMEMBER
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS remember (id INTEGER PRIMARY KEY AUTOINCREMENT, what TEXT NOT NULL, why TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Remember table created/verified successfully');
        }
    });
});

// TASK
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS task (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT NOT NULL, status TEXT DEFAULT 'active', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Task table created/verified successfully');
        }
    });
    
    // Add status column if it doesn't exist (migration)
    db.run("ALTER TABLE task ADD COLUMN status TEXT DEFAULT 'active'", (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding status column:', err);
        } else {
            console.log('Status column added/verified successfully');
        }
    });
});

// SUBJECTS
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS subjects (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, reason TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Subtask table created/verified successfully');
        }
    });
});

// Subjects Functions
exports.getSubjects = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM subjects";
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Database query error:', err);
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
}

exports.addSubjects = (name, reason) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO subjects (name, reason) VALUES (?, ?)";
        db.run(sql, [name, reason], function(err) {
            if (err) {
                console.error('Error adding subjects:', err);
                reject(err);
            }
            else {
                resolve(this.lastID);
            }
        });
    });
}

exports.updateSubjects = (id, name, reason) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE subjects SET name = ?, reason = ? WHERE id = ?";
        db.run(sql, [name, reason, id], function(err) {
            if (err) {
                console.error('Error updating subjects:', err);
                reject(err);
            }
            else {
                resolve(this.changes);
            }
        });
    });
}

exports.deleteSubjects = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM subjects WHERE id = ?";
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting subjects:', err);
                reject(err);
            }
            else {
                resolve(this.changes);
            }
        });
    });
}



// TimeTable Functions
exports.getTimetable = () => {
    return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM timetable";
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Database query error:', err);
                reject(err);
            } else {
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
                resolve(this.changes);
            }
        });
    });
}


// Mind Functions
exports.getMind = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM mind ORDER BY section_name, id";
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Database query error:', err);
                reject(err);
            } else {
                // Parse technique_steps from JSON string back to array
                const parsedRows = (rows || []).map(row => ({
                    ...row,
                    technique_steps: row.technique_steps ? JSON.parse(row.technique_steps) : []
                }));
                resolve(parsedRows);
            }
        });
    })
}

exports.addMind = (section_name, technique_name, technique_steps) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO mind (section_name, technique_name, technique_steps) VALUES (?, ?, ?)";
        // Convert array to JSON string if it's an array
        const stepsJson = Array.isArray(technique_steps) ? JSON.stringify(technique_steps) : technique_steps;
        db.run(sql, [section_name, technique_name, stepsJson], function(err) {
            if (err) {
                console.error('Error adding mind:', err);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

exports.updateMind = (id, section_name, technique_name, technique_steps) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE mind SET section_name = ?, technique_name = ?, technique_steps = ? WHERE id = ?";
        // Convert array to JSON string if it's an array
        const stepsJson = Array.isArray(technique_steps) ? JSON.stringify(technique_steps) : technique_steps;
        db.run(sql, [section_name, technique_name, stepsJson, id], function(err) {
            if (err) {
                console.error('Error updating mind:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

exports.deleteMind = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM mind WHERE id = ?";
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting mind:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

// Function to reorder mind items by updating IDs
exports.reorderMindItems = (section_name, newOrder) => {
    return new Promise((resolve, reject) => {
        // First, get all items in the section
        const getSql = "SELECT * FROM mind WHERE section_name = ? ORDER BY id";
        db.all(getSql, [section_name], (err, rows) => {
            if (err) {
                console.error('Error getting mind items for reorder:', err);
                reject(err);
                return;
            }

            // Create a temporary table to store reordered items
            const tempTableSql = "CREATE TEMPORARY TABLE temp_mind AS SELECT * FROM mind WHERE 0";
            db.run(tempTableSql, (err) => {
                if (err) {
                    console.error('Error creating temp table:', err);
                    reject(err);
                    return;
                }

                // Insert items in new order with new IDs
                let completed = 0;
                const total = newOrder.length;
                
                if (total === 0) {
                    resolve({ success: true });
                    return;
                }

                newOrder.forEach((itemId, newIndex) => {
                    const originalItem = rows.find(row => row.id === itemId);
                    if (originalItem) {
                        const insertSql = "INSERT INTO temp_mind (id, section_name, technique_name, technique_steps) VALUES (?, ?, ?, ?)";
                        const newId = newIndex + 1; // Start from 1
                        db.run(insertSql, [newId, originalItem.section_name, originalItem.technique_name, originalItem.technique_steps], (err) => {
                            if (err) {
                                console.error('Error inserting reordered item:', err);
                                reject(err);
                                return;
                            }
                            
                            completed++;
                            if (completed === total) {
                                // Delete original items
                                const deleteSql = "DELETE FROM mind WHERE section_name = ?";
                                db.run(deleteSql, [section_name], (err) => {
                                    if (err) {
                                        console.error('Error deleting original items:', err);
                                        reject(err);
                                        return;
                                    }
                                    
                                    // Insert reordered items back
                                    const insertBackSql = "INSERT INTO mind SELECT * FROM temp_mind";
                                    db.run(insertBackSql, (err) => {
                                        if (err) {
                                            console.error('Error inserting reordered items back:', err);
                                            reject(err);
                                        } else {
                                            resolve({ success: true });
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            });
        });
    });
}

// Body Exercise Functions
exports.getExercise = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM exercise";
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Database query error:', err);
                reject(err);
            } else {
                // Parse technique_steps from JSON string back to array
                const parsedRows = (rows || []).map(row => ({
                    ...row,
                    technique_steps: row.technique_steps ? JSON.parse(row.technique_steps) : []
                }));
                resolve(parsedRows);
            }
        });
    });
}

exports.addExercise = (section_name, technique_name, technique_steps) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO exercise (section_name, technique_name, technique_steps) VALUES (?, ?, ?)";
        // Convert array to JSON string if it's an array
        const stepsJson = Array.isArray(technique_steps) ? JSON.stringify(technique_steps) : technique_steps;
        db.run(sql, [section_name, technique_name, stepsJson], function(err) {
            if (err) {
                console.error('Error adding exercise:', err);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

exports.updateExercise = (id, section_name, technique_name, technique_steps) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE exercise SET section_name = ?, technique_name = ?, technique_steps = ? WHERE id = ?";
        // Convert array to JSON string if it's an array
        const stepsJson = Array.isArray(technique_steps) ? JSON.stringify(technique_steps) : technique_steps;
        db.run(sql, [section_name, technique_name, stepsJson, id], function(err) {
            if (err) {
                console.error('Error updating exercise:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

exports.deleteExercise = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM exercise WHERE id = ?";
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting exercise:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

// Function to reorder exercise items by updating IDs
exports.reorderExercise = (section_name, newOrder) => {
    return new Promise((resolve, reject) => {
        // First, get all items in the section
        const getSql = "SELECT * FROM exercise WHERE section_name = ? ORDER BY id";
        db.all(getSql, [section_name], (err, rows) => {
            if (err) {
                console.error('Error getting exercise items for reorder:', err);
                reject(err);
                return;
            }

            // Create a temporary table to store reordered items
            const tempTableSql = "CREATE TEMPORARY TABLE temp_exercise AS SELECT * FROM exercise WHERE 0";
            db.run(tempTableSql, (err) => {
                if (err) {
                    console.error('Error creating temp table:', err);
                    reject(err);
                    return;
                }

                // Insert items in new order with new IDs
                let completed = 0;
                const total = newOrder.length;
                
                if (total === 0) {
                    resolve({ success: true });
                    return;
                }

                newOrder.forEach((itemId, newIndex) => {
                    const originalItem = rows.find(row => row.id === itemId);
                    if (originalItem) {
                        const insertSql = "INSERT INTO temp_exercise (id, section_name, technique_name, technique_steps) VALUES (?, ?, ?, ?)";
                        const newId = newIndex + 1; // Start from 1
                        db.run(insertSql, [newId, originalItem.section_name, originalItem.technique_name, originalItem.technique_steps], (err) => {
                            if (err) {
                                console.error('Error inserting reordered exercise item:', err);
                                reject(err);
                                return;
                            }
                            
                            completed++;
                            if (completed === total) {
                                // Delete original items
                                const deleteSql = "DELETE FROM exercise WHERE section_name = ?";
                                db.run(deleteSql, [section_name], (err) => {
                                    if (err) {
                                        console.error('Error deleting original exercise items:', err);
                                        reject(err);
                                        return;
                                    }
                                    
                                    // Insert reordered items back
                                    const insertBackSql = "INSERT INTO exercise SELECT * FROM temp_exercise";
                                    db.run(insertBackSql, (err) => {
                                        if (err) {
                                            console.error('Error inserting reordered exercise items back:', err);
                                            reject(err);
                                        } else {
                                            resolve({ success: true });
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            });
        });
    });
}

// Body Day Table Functions
exports.getDayTable = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM day_table";
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Database query error:', err);
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
}

exports.addDayTable = (day, reps, sets, exercise_name) => {
    return new Promise((resolve, reject) => {      
        const sql = "INSERT INTO day_table (day, reps, sets, exercise_name) VALUES (?, ?, ?, ?)";
        db.run(sql, [day, reps, sets, exercise_name], function(err) {
            if (err) {
                console.error('Error adding day table:', err);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

exports.updateDayTable = (id, day, reps, sets, exercise_name) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE day_table SET day = ?, reps = ?, sets = ?, exercise_name = ? WHERE id = ?";
        db.run(sql, [day, reps, sets, exercise_name, id], function(err) {
            if (err) {
                console.error('Error updating day table:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

exports.deleteDayTable = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM day_table WHERE id = ?";
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting day table:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

// Function to reorder day table items by updating IDs
exports.reorderDayTable = (day, newOrder) => {
    return new Promise((resolve, reject) => {
        // First, get all items for the day
        const getSql = "SELECT * FROM day_table WHERE day = ? ORDER BY id";
        db.all(getSql, [day], (err, rows) => {
            if (err) {
                console.error('Error getting day table items for reorder:', err);
                reject(err);
                return;
            }

            // Create a temporary table to store reordered items
            const tempTableSql = "CREATE TEMPORARY TABLE temp_day_table AS SELECT * FROM day_table WHERE 0";
            db.run(tempTableSql, (err) => {
                if (err) {
                    console.error('Error creating temp table:', err);
                    reject(err);
                    return;
                }

                // Insert items in new order with new IDs
                let completed = 0;
                const total = newOrder.length;
                
                if (total === 0) {
                    resolve({ success: true });
                    return;
                }

                newOrder.forEach((itemId, newIndex) => {
                    const originalItem = rows.find(row => row.id === itemId);
                    if (originalItem) {
                        const insertSql = "INSERT INTO temp_day_table (id, day, reps, sets, exercise_name) VALUES (?, ?, ?, ?, ?)";
                        const newId = newIndex + 1; // Start from 1
                        db.run(insertSql, [newId, originalItem.day, originalItem.reps, originalItem.sets, originalItem.exercise_name], (err) => {
                            if (err) {
                                console.error('Error inserting reordered day table item:', err);
                                reject(err);
                                return;
                            }
                            
                            completed++;
                            if (completed === total) {
                                // Delete original items
                                const deleteSql = "DELETE FROM day_table WHERE day = ?";
                                db.run(deleteSql, [day], (err) => {
                                    if (err) {
                                        console.error('Error deleting original day table items:', err);
                                        reject(err);
                                        return;
                                    }
                                    
                                    // Insert reordered items back
                                    const insertBackSql = "INSERT INTO day_table SELECT * FROM temp_day_table";
                                    db.run(insertBackSql, (err) => {
                                        if (err) {
                                            console.error('Error inserting reordered day table items back:', err);
                                            reject(err);
                                        } else {
                                            resolve({ success: true });
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            });
        });
    });
}

// Body Diet Table Functions
exports.getDietTable = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM diet_table";
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Database query error:', err);
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
}   

exports.addDietTable = (name, benefits) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO diet_table (name, benefits) VALUES (?, ?)";
        db.run(sql, [name, benefits], function(err) {
            if (err) {
                console.error('Error adding diet table:', err);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}   

exports.updateDietTable = (id, name, benefits) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE diet_table SET name = ?, benefits = ? WHERE id = ?";
        db.run(sql, [name, benefits, id], function(err) {
            if (err) {
                console.error('Error updating diet table:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

exports.deleteDietTable = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM diet_table WHERE id = ?";
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting diet table:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

// Function to reorder diet table items by updating IDs
exports.reorderDietTable = (newOrder) => {
    return new Promise((resolve, reject) => {
        // First, get all diet items
        const getSql = "SELECT * FROM diet_table ORDER BY id";
        db.all(getSql, [], (err, rows) => {
            if (err) {
                console.error('Error getting diet table items for reorder:', err);
                reject(err);
                return;
            }

            // Create a temporary table to store reordered items
            const tempTableSql = "CREATE TEMPORARY TABLE temp_diet_table AS SELECT * FROM diet_table WHERE 0";
            db.run(tempTableSql, (err) => {
                if (err) {
                    console.error('Error creating temp table:', err);
                    reject(err);
                    return;
                }

                // Insert items in new order with new IDs
                let completed = 0;
                const total = newOrder.length;
                
                if (total === 0) {
                    resolve({ success: true });
                    return;
                }

                newOrder.forEach((itemId, newIndex) => {
                    const originalItem = rows.find(row => row.id === itemId);
                    if (originalItem) {
                        const insertSql = "INSERT INTO temp_diet_table (id, name, benefits) VALUES (?, ?, ?)";
                        const newId = newIndex + 1; // Start from 1
                        db.run(insertSql, [newId, originalItem.name, originalItem.benefits], (err) => {
                            if (err) {
                                console.error('Error inserting reordered diet table item:', err);
                                reject(err);
                                return;
                            }
                            
                            completed++;
                            if (completed === total) {
                                // Delete original items
                                const deleteSql = "DELETE FROM diet_table";
                                db.run(deleteSql, (err) => {
                                    if (err) {
                                        console.error('Error deleting original diet table items:', err);
                                        reject(err);
                                        return;
                                    }
                                    
                                    // Insert reordered items back
                                    const insertBackSql = "INSERT INTO diet_table SELECT * FROM temp_diet_table";
                                    db.run(insertBackSql, (err) => {
                                        if (err) {
                                            console.error('Error inserting reordered diet table items back:', err);
                                            reject(err);
                                        } else {
                                            resolve({ success: true });
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            });
        });
    });
}   

// Body Daily Diet Table Functions
exports.getDailyDietTable = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM daily_diet_table";
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Database query error:', err);
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
}

exports.addDailyDietTable = (day, diet_name, quantity) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO daily_diet_table (day, diet_name, quantity) VALUES (?, ?, ?)";
        db.run(sql, [day, diet_name, quantity], function(err) {
            if (err) {
                console.error('Error adding daily diet table:', err);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

exports.updateDailyDietTable = (id, day, diet_name, quantity) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE daily_diet_table SET day = ?, diet_name = ?, quantity = ? WHERE id = ?";
        db.run(sql, [day, diet_name, quantity, id], function(err) {
            if (err) {
                console.error('Error updating daily diet table:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

exports.deleteDailyDietTable = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM daily_diet_table WHERE id = ?";
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting daily diet table:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

// Function to reorder daily diet table items by updating IDs
exports.reorderDailyDietTable = (day, newOrder) => {
    return new Promise((resolve, reject) => {
        // First, get all items for the day
        const getSql = "SELECT * FROM daily_diet_table WHERE day = ? ORDER BY id";
        db.all(getSql, [day], (err, rows) => {
            if (err) {
                console.error('Error getting daily diet table items for reorder:', err);
                reject(err);
                return;
            }

            // Create a temporary table to store reordered items
            const tempTableSql = "CREATE TEMPORARY TABLE temp_daily_diet_table AS SELECT * FROM daily_diet_table WHERE 0";
            db.run(tempTableSql, (err) => {
                if (err) {
                    console.error('Error creating temp table:', err);
                    reject(err);
                    return;
                }

                // Insert items in new order with new IDs
                let completed = 0;
                const total = newOrder.length;
                
                if (total === 0) {
                    resolve({ success: true });
                    return;
                }

                newOrder.forEach((itemId, newIndex) => {
                    const originalItem = rows.find(row => row.id === itemId);
                    if (originalItem) {
                        const insertSql = "INSERT INTO temp_daily_diet_table (id, day, diet_name, quantity) VALUES (?, ?, ?, ?)";
                        const newId = newIndex + 1; // Start from 1
                        db.run(insertSql, [newId, originalItem.day, originalItem.diet_name, originalItem.quantity], (err) => {
                            if (err) {
                                console.error('Error inserting reordered daily diet table item:', err);
                                reject(err);
                                return;
                            }
                            
                            completed++;
                            if (completed === total) {
                                // Delete original items
                                const deleteSql = "DELETE FROM daily_diet_table WHERE day = ?";
                                db.run(deleteSql, [day], (err) => {
                                    if (err) {
                                        console.error('Error deleting original daily diet table items:', err);
                                        reject(err);
                                        return;
                                    }
                                    
                                    // Insert reordered items back
                                    const insertBackSql = "INSERT INTO daily_diet_table SELECT * FROM temp_daily_diet_table";
                                    db.run(insertBackSql, (err) => {
                                        if (err) {
                                            console.error('Error inserting reordered daily diet table items back:', err);
                                            reject(err);
                                        } else {
                                            resolve({ success: true });
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            });
        });
    });
}

// Goals Functions
exports.getGoals = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM goals";
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Database query error:', err);
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
}

exports.addGoals = (goal, reason, duration) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO goals (goal, reason, duration) VALUES (?, ?, ?)";
        db.run(sql, [goal, reason, duration], function(err) {
            if (err) {
                console.error('Error adding goals:', err);
                reject(err);
            } else { 
                resolve(this.lastID);
            }
        });
    });
}

exports.updateGoals = (id, goal, reason, duration) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE goals SET goal = ?, reason = ?, duration = ? WHERE id = ?";
        db.run(sql, [goal, reason, duration, id], function(err) {
            if (err) {
                console.error('Error updating goals:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

exports.deleteGoals = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM goals WHERE id = ?";
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting goals:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

// Function to reorder goals by updating IDs
exports.reorderGoals = (newOrder) => {
    return new Promise((resolve, reject) => {
        // First, get all goals
        const getSql = "SELECT * FROM goals ORDER BY id";
        db.all(getSql, [], (err, rows) => {
            if (err) {
                console.error('Error getting goals for reorder:', err);
                reject(err);
                return;
            }

            // Create a temporary table to store reordered items
            const tempTableSql = "CREATE TEMPORARY TABLE temp_goals AS SELECT * FROM goals WHERE 0";
            db.run(tempTableSql, (err) => {
                if (err) {
                    console.error('Error creating temp table:', err);
                    reject(err);
                    return;
                }

                // Insert items in new order with new IDs
                let completed = 0;
                const total = newOrder.length;
                
                if (total === 0) {
                    resolve({ success: true });
                    return;
                }

                newOrder.forEach((itemId, newIndex) => {
                    const originalItem = rows.find(row => row.id === itemId);
                    if (originalItem) {
                        const insertSql = "INSERT INTO temp_goals (id, goal, reason, duration, created_at) VALUES (?, ?, ?, ?, ?)";
                        const newId = newIndex + 1; // Start from 1
                        db.run(insertSql, [newId, originalItem.goal, originalItem.reason, originalItem.duration, originalItem.created_at], (err) => {
                            if (err) {
                                console.error('Error inserting reordered goal:', err);
                                reject(err);
                                return;
                            }
                            
                            completed++;
                            if (completed === total) {
                                // Delete original items
                                const deleteSql = "DELETE FROM goals";
                                db.run(deleteSql, (err) => {
                                    if (err) {
                                        console.error('Error deleting original goals:', err);
                                        reject(err);
                                        return;
                                    }
                                    
                                    // Insert reordered items back
                                    const insertBackSql = "INSERT INTO goals SELECT * FROM temp_goals";
                                    db.run(insertBackSql, (err) => {
                                        if (err) {
                                            console.error('Error inserting reordered goals back:', err);
                                            reject(err);
                                        } else {
                                            resolve({ success: true });
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            });
        });
    });
}

// Remember Functions
exports.getRemember = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM remember";
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Database query error:', err);
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
}

exports.addRemember = (what, why) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO remember (what, why) VALUES (?, ?)";
        db.run(sql, [what, why], function(err) {
            if (err) {
                console.error('Error adding remember:', err);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

exports.updateRemember = (id, what, why) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE remember SET what = ?, why = ? WHERE id = ?";
        db.run(sql, [what, why, id], function(err) {
            if (err) {
                console.error('Error updating remember:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

exports.deleteRemember = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM remember WHERE id = ?";
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting remember:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

// Function to reorder remember items by updating IDs
exports.reorderRemember = (newOrder) => {
    return new Promise((resolve, reject) => {
        // First, get all remember items
        const getSql = "SELECT * FROM remember ORDER BY id";
        db.all(getSql, [], (err, rows) => {
            if (err) {
                console.error('Error getting remember items for reorder:', err);
                reject(err);
                return;
            }

            // Create a temporary table to store reordered items
            const tempTableSql = "CREATE TEMPORARY TABLE temp_remember AS SELECT * FROM remember WHERE 0";
            db.run(tempTableSql, (err) => {
                if (err) {
                    console.error('Error creating temp table:', err);
                    reject(err);
                    return;
                }

                // Insert items in new order with new IDs
                let completed = 0;
                const total = newOrder.length;
                
                if (total === 0) {
                    resolve({ success: true });
                    return;
                }

                newOrder.forEach((itemId, newIndex) => {
                    const originalItem = rows.find(row => row.id === itemId);
                    if (originalItem) {
                        const insertSql = "INSERT INTO temp_remember (id, what, why, created_at) VALUES (?, ?, ?, ?)";
                        const newId = newIndex + 1; // Start from 1
                        db.run(insertSql, [newId, originalItem.what, originalItem.why, originalItem.created_at], (err) => {
                            if (err) {
                                console.error('Error inserting reordered remember item:', err);
                                reject(err);
                                return;
                            }
                            
                            completed++;
                            if (completed === total) {
                                // Delete original items
                                const deleteSql = "DELETE FROM remember";
                                db.run(deleteSql, (err) => {
                                    if (err) {
                                        console.error('Error deleting original remember items:', err);
                                        reject(err);
                                        return;
                                    }
                                    
                                    // Insert reordered items back
                                    const insertBackSql = "INSERT INTO remember SELECT * FROM temp_remember";
                                    db.run(insertBackSql, (err) => {
                                        if (err) {
                                            console.error('Error inserting reordered remember items back:', err);
                                            reject(err);
                                        } else {
                                            resolve({ success: true });
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            });
        });
    });
}

// Task Functions
exports.getTask = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM task";
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Database query error:', err);
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
}

exports.addTask = (task) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO task (task) VALUES (?)";
        db.run(sql, [task], function(err) {
            if (err) {
                console.error('Error adding task:', err);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

exports.updateTask = (id, task, status) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE task SET task = ?, status = ? WHERE id = ?";
        db.run(sql, [task, status || 'active', id], function(err) {
            if (err) {
                console.error('Error updating task:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

exports.deleteTask = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM task WHERE id = ?";
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting task:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

// Reorder Subjects items
exports.reorderSubjects = (newOrder) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            // Create temporary table
            db.run(`CREATE TEMPORARY TABLE temp_subjects AS SELECT * FROM subjects WHERE 1=0`);
            
            // Insert items in new order
            newOrder.forEach((id, index) => {
                db.run(`INSERT INTO temp_subjects SELECT * FROM subjects WHERE id = ?`, [id], (err) => {
                    if (err) {
                        console.error('Error inserting into temp table:', err);
                        db.run('ROLLBACK');
                        reject(err);
                    }
                });
            });
            
            // Delete original data
            db.run(`DELETE FROM subjects`, (err) => {
                if (err) {
                    console.error('Error deleting original data:', err);
                    db.run('ROLLBACK');
                    reject(err);
                }
            });
            
            // Insert reordered data with new IDs
            db.run(`INSERT INTO subjects (name, reason) SELECT name, reason FROM temp_subjects`, (err) => {
                if (err) {
                    console.error('Error inserting reordered data:', err);
                    db.run('ROLLBACK');
                    reject(err);
                } else {
                    db.run('COMMIT', (err) => {
                        if (err) {
                            console.error('Error committing transaction:', err);
                            reject(err);
                        } else {
                            console.log('Subjects items reordered successfully');
                            resolve();
                        }
                    });
                }
            });
        });
    });
}

// Reorder Tasks items
exports.reorderTasks = (newOrder) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            // Create temporary table
            db.run(`CREATE TEMPORARY TABLE temp_task AS SELECT * FROM task WHERE 1=0`);
            
            // Insert items in new order
            newOrder.forEach((id, index) => {
                db.run(`INSERT INTO temp_task SELECT * FROM task WHERE id = ?`, [id], (err) => {
                    if (err) {
                        console.error('Error inserting into temp table:', err);
                        db.run('ROLLBACK');
                        reject(err);
                    }
                });
            });
            
            // Delete original data
            db.run(`DELETE FROM task`, (err) => {
                if (err) {
                    console.error('Error deleting original data:', err);
                    db.run('ROLLBACK');
                    reject(err);
                }
            });
            
            // Insert reordered data with new IDs
            db.run(`INSERT INTO task (task, status, created_at) SELECT task, status, created_at FROM temp_task`, (err) => {
                if (err) {
                    console.error('Error inserting reordered data:', err);
                    db.run('ROLLBACK');
                    reject(err);
                } else {
                    db.run('COMMIT', (err) => {
                        if (err) {
                            console.error('Error committing transaction:', err);
                            reject(err);
                        } else {
                            console.log('Tasks items reordered successfully');
                            resolve();
                        }
                    });
                }
            });
        });
    });
}   