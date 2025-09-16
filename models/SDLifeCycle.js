const db = require('./MainDBConfig');

// SD LIFE CYCLE Definition
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS sd_life_cycle_definitions (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, explanation TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Definitions table created/verified successfully');
        }
    });
});

// SD LIFE CYCLE Phases
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS sd_life_cycle_phases (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Phases table created/verified successfully');
        }
    });

    db.run("CREATE TABLE IF NOT EXISTS sd_life_cycle_phases_definitions (id INTEGER PRIMARY KEY AUTOINCREMENT, phase_id INTEGER NOT NULL, title TEXT NOT NULL, explanation TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Phases definitions table created/verified successfully');
        }
    });

    db.run("CREATE TABLE IF NOT EXISTS sd_life_cycle_phases_tools (id INTEGER PRIMARY KEY AUTOINCREMENT, phase_id INTEGER NOT NULL, name TEXT NOT NULL, source TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Phases tools table created/verified successfully');
        }
    });

    db.run("CREATE TABLE IF NOT EXISTS sd_life_cycle_phases_steps (id INTEGER PRIMARY KEY AUTOINCREMENT, phase_id INTEGER NOT NULL, step TEXT NOT NULL, reason TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Phases steps table created/verified successfully');
        }
    });
});

// SD LIFE CYCLE Project
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS sd_life_cycle_projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, date DATETIME NOT NULL, insight TEXT NOT NULL, owner TEXT NOT NULL, owner_work TEXT NOT NULL, created_by TEXT NOT NULL, github_link TEXT NOT NULL, project_link TEXT NOT NULL, start_date DATE NOT NULL, end_date DATE NOT NULL, status TEXT NOT NULL DEFAULT 'active', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Projects table created/verified successfully');
        }
    });

    db.run("CREATE TABLE IF NOT EXISTS sd_life_cycle_project_creators (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER NOT NULL, creator_name TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Project creators table created/verified successfully');
        }
    });

    db.run("CREATE TABLE IF NOT EXISTS sd_life_cycle_project_documents (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER NOT NULL, document_name TEXT NOT NULL, document_source TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Project documents table created/verified successfully');
        }
    });
});

// CRUD Functions for SD Life Cycle

// Definitions
exports.getDefinitions = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM sd_life_cycle_definitions ORDER BY created_at DESC";
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Error getting definitions:', err);
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
};

exports.addDefinition = (title, explanation) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO sd_life_cycle_definitions (title, explanation) VALUES (?, ?)";
        db.run(sql, [title, explanation], function(err) {
            if (err) {
                console.error('Error adding definition:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

exports.updateDefinition = (id, title, explanation) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE sd_life_cycle_definitions SET title = ?, explanation = ? WHERE id = ?";
        db.run(sql, [title, explanation, id], function(err) {
            if (err) {
                console.error('Error updating definition:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

exports.deleteDefinition = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM sd_life_cycle_definitions WHERE id = ?";
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting definition:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

// Phases
exports.getPhases = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM sd_life_cycle_phases ORDER BY created_at DESC";
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Error getting phases:', err);
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
};

exports.addPhase = (name) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO sd_life_cycle_phases (name) VALUES (?)";
        db.run(sql, [name], function(err) {
            if (err) {
                console.error('Error adding phase:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

exports.updatePhase = (id, name) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE sd_life_cycle_phases SET name = ? WHERE id = ?";
        db.run(sql, [name, id], function(err) {
            if (err) {
                console.error('Error updating phase:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

exports.deletePhase = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM sd_life_cycle_phases WHERE id = ?";
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting phase:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

// Phase Definitions
exports.getPhaseDefinitions = (phaseId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM sd_life_cycle_phases_definitions WHERE phase_id = ? ORDER BY created_at DESC";
        db.all(sql, [phaseId], (err, rows) => {
            if (err) {
                console.error('Error getting phase definitions:', err);
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
};

exports.addPhaseDefinition = (phaseId, title, explanation) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO sd_life_cycle_phases_definitions (phase_id, title, explanation) VALUES (?, ?, ?)";
        db.run(sql, [phaseId, title, explanation], function(err) {
            if (err) {
                console.error('Error adding phase definition:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

exports.updatePhaseDefinition = (id, title, explanation) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE sd_life_cycle_phases_definitions SET title = ?, explanation = ? WHERE id = ?";
        db.run(sql, [title, explanation, id], function(err) {
            if (err) {
                console.error('Error updating phase definition:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

exports.deletePhaseDefinition = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM sd_life_cycle_phases_definitions WHERE id = ?";
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting phase definition:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

// Phase Tools
exports.getPhaseTools = (phaseId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM sd_life_cycle_phases_tools WHERE phase_id = ? ORDER BY created_at DESC";
        db.all(sql, [phaseId], (err, rows) => {
            if (err) {
                console.error('Error getting phase tools:', err);
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
};

exports.addPhaseTool = (phaseId, name, source) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO sd_life_cycle_phases_tools (phase_id, name, source) VALUES (?, ?, ?)";
        db.run(sql, [phaseId, name, source], function(err) {
            if (err) {
                console.error('Error adding phase tool:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

exports.updatePhaseTool = (id, name, source) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE sd_life_cycle_phases_tools SET name = ?, source = ? WHERE id = ?";
        db.run(sql, [name, source, id], function(err) {
            if (err) {
                console.error('Error updating phase tool:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

exports.deletePhaseTool = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM sd_life_cycle_phases_tools WHERE id = ?";
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting phase tool:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

// Phase Steps
exports.getPhaseSteps = (phaseId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM sd_life_cycle_phases_steps WHERE phase_id = ? ORDER BY created_at DESC";
        db.all(sql, [phaseId], (err, rows) => {
            if (err) {
                console.error('Error getting phase steps:', err);
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
};

exports.addPhaseStep = (phaseId, step, reason) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO sd_life_cycle_phases_steps (phase_id, step, reason) VALUES (?, ?, ?)";
        db.run(sql, [phaseId, step, reason], function(err) {
            if (err) {
                console.error('Error adding phase step:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

exports.updatePhaseStep = (id, step, reason) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE sd_life_cycle_phases_steps SET step = ?, reason = ? WHERE id = ?";
        db.run(sql, [step, reason, id], function(err) {
            if (err) {
                console.error('Error updating phase step:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

exports.deletePhaseStep = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM sd_life_cycle_phases_steps WHERE id = ?";
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting phase step:', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

// Projects
exports.getProjects = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT p.*, 
                   GROUP_CONCAT(pc.creator_name) as creators,
                   GROUP_CONCAT(pd.document_name || '|' || pd.document_source) as documents
            FROM sd_life_cycle_projects p
            LEFT JOIN sd_life_cycle_project_creators pc ON p.id = pc.project_id
            LEFT JOIN sd_life_cycle_project_documents pd ON p.id = pd.project_id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `;
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Error getting projects:', err);
                reject(err);
            } else {
                // Process the results to match frontend structure
                const processedRows = (rows || []).map(row => ({
                    id: row.id,
                    name: row.name,
                    date: row.date,
                    insight: row.insight,
                    owner: row.owner,
                    ownerWork: row.owner_work,
                    creator: row.creators ? row.creators.split(',') : [],
                    githubLink: row.github_link,
                    projectLink: row.project_link,
                    documentsLink: row.documents ? row.documents.split(',').map(doc => {
                        const [name, source] = doc.split('|');
                        return { name, src: source };
                    }) : [],
                    startDate: row.start_date,
                    endDate: row.end_date,
                    status: row.status
                }));
                resolve(processedRows);
            }
        });
    });
};

exports.addProject = (name, date, insight, owner, ownerWork, createdBy, githubLink, projectLink, creators, documents, startDate, endDate, status) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            // Insert main project
            const sql = "INSERT INTO sd_life_cycle_projects (name, date, insight, owner, owner_work, created_by, github_link, project_link, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            db.run(sql, [name, date, insight, owner, ownerWork, createdBy, githubLink, projectLink, startDate, endDate, status], function(err) {
                if (err) {
                    console.error('Error adding project:', err);
                    db.run('ROLLBACK');
                    reject(err);
                    return;
                }
                
                const projectId = this.lastID;
                
                // Insert creators
                if (creators && creators.length > 0) {
                    const creatorStmt = db.prepare("INSERT INTO sd_life_cycle_project_creators (project_id, creator_name) VALUES (?, ?)");
                    creators.forEach(creator => {
                        if (creator.trim()) {
                            creatorStmt.run([projectId, creator.trim()]);
                        }
                    });
                    creatorStmt.finalize();
                }
                
                // Insert documents
                if (documents && documents.length > 0) {
                    const docStmt = db.prepare("INSERT INTO sd_life_cycle_project_documents (project_id, document_name, document_source) VALUES (?, ?, ?)");
                    documents.forEach(doc => {
                        if (doc.name && doc.src) {
                            docStmt.run([projectId, doc.name, doc.src]);
                        }
                    });
                    docStmt.finalize();
                }
                
                db.run('COMMIT', (err) => {
                    if (err) {
                        console.error('Error committing project transaction:', err);
                        reject(err);
                    } else {
                        resolve(this.changes);
                    }
                });
            });
        });
    });
};

exports.updateProject = (id, name, date, insight, owner, ownerWork, createdBy, githubLink, projectLink, creators, documents, startDate, endDate, status) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            // Update main project
            const sql = "UPDATE sd_life_cycle_projects SET name = ?, date = ?, insight = ?, owner = ?, owner_work = ?, created_by = ?, github_link = ?, project_link = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?";
            db.run(sql, [name, date, insight, owner, ownerWork, createdBy, githubLink, projectLink, startDate, endDate, status, id], function(err) {
                if (err) {
                    console.error('Error updating project:', err);
                    db.run('ROLLBACK');
                    reject(err);
                    return;
                }
                
                // Delete existing creators and documents
                db.run("DELETE FROM sd_life_cycle_project_creators WHERE project_id = ?", [id]);
                db.run("DELETE FROM sd_life_cycle_project_documents WHERE project_id = ?", [id]);
                
                // Insert new creators
                if (creators && creators.length > 0) {
                    const creatorStmt = db.prepare("INSERT INTO sd_life_cycle_project_creators (project_id, creator_name) VALUES (?, ?)");
                    creators.forEach(creator => {
                        if (creator.trim()) {
                            creatorStmt.run([id, creator.trim()]);
                        }
                    });
                    creatorStmt.finalize();
                }
                
                // Insert new documents
                if (documents && documents.length > 0) {
                    const docStmt = db.prepare("INSERT INTO sd_life_cycle_project_documents (project_id, document_name, document_source) VALUES (?, ?, ?)");
                    documents.forEach(doc => {
                        if (doc.name && doc.src) {
                            docStmt.run([id, doc.name, doc.src]);
                        }
                    });
                    docStmt.finalize();
                }
                
                db.run('COMMIT', (err) => {
                    if (err) {
                        console.error('Error committing project update transaction:', err);
                        reject(err);
                    } else {
                        resolve(this.changes);
                    }
                });
            });
        });
    });
};

exports.deleteProject = (id) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            // Delete related records first
            db.run("DELETE FROM sd_life_cycle_project_creators WHERE project_id = ?", [id]);
            db.run("DELETE FROM sd_life_cycle_project_documents WHERE project_id = ?", [id]);
            
            // Delete main project
            db.run("DELETE FROM sd_life_cycle_projects WHERE id = ?", [id], function(err) {
                if (err) {
                    console.error('Error deleting project:', err);
                    db.run('ROLLBACK');
                    reject(err);
                } else {
                    db.run('COMMIT', (err) => {
                        if (err) {
                            console.error('Error committing project deletion transaction:', err);
                            reject(err);
                        } else {
                            resolve(this.changes);
                        }
                    });
                }
            });
        });
    });
};

// Reordering Functions

// Reorder Definitions
exports.reorderDefinitions = (newOrder) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            // Create temporary table
            db.run("CREATE TEMPORARY TABLE temp_definitions AS SELECT * FROM sd_life_cycle_definitions WHERE 0");
            
            // Insert items in new order
            const stmt = db.prepare("INSERT INTO temp_definitions (id, title, explanation, created_at) VALUES (?, ?, ?, ?)");
            newOrder.forEach((item, index) => {
                stmt.run([item.id, item.title, item.explanation, item.created_at]);
            });
            stmt.finalize();
            
            // Delete old data
            db.run("DELETE FROM sd_life_cycle_definitions");
            
            // Insert reordered data
            db.run("INSERT INTO sd_life_cycle_definitions SELECT * FROM temp_definitions");
            
            // Drop temporary table
            db.run("DROP TABLE temp_definitions");
            
            db.run('COMMIT', (err) => {
                if (err) {
                    console.error('Error reordering definitions:', err);
                    db.run('ROLLBACK');
                    reject(err);
                } else {
                    resolve({ success: true });
                }
            });
        });
    });
};

// Reorder Phase Definitions
exports.reorderPhaseDefinitions = (phaseId, newOrder) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            // Create temporary table
            db.run("CREATE TEMPORARY TABLE temp_phase_definitions AS SELECT * FROM sd_life_cycle_phases_definitions WHERE 0");
            
            // Insert items in new order
            const stmt = db.prepare("INSERT INTO temp_phase_definitions (id, phase_id, title, explanation, created_at) VALUES (?, ?, ?, ?, ?)");
            newOrder.forEach((item, index) => {
                stmt.run([item.id, phaseId, item.title, item.explanation, item.created_at]);
            });
            stmt.finalize();
            
            // Delete old data for this phase
            db.run("DELETE FROM sd_life_cycle_phases_definitions WHERE phase_id = ?", [phaseId]);
            
            // Insert reordered data
            db.run("INSERT INTO sd_life_cycle_phases_definitions SELECT * FROM temp_phase_definitions");
            
            // Drop temporary table
            db.run("DROP TABLE temp_phase_definitions");
            
            db.run('COMMIT', (err) => {
                if (err) {
                    console.error('Error reordering phase definitions:', err);
                    db.run('ROLLBACK');
                    reject(err);
                } else {
                    resolve({ success: true });
                }
            });
        });
    });
};

// Reorder Phase Tools
exports.reorderPhaseTools = (phaseId, newOrder) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            // Create temporary table
            db.run("CREATE TEMPORARY TABLE temp_phase_tools AS SELECT * FROM sd_life_cycle_phases_tools WHERE 0");
            
            // Insert items in new order
            const stmt = db.prepare("INSERT INTO temp_phase_tools (id, phase_id, name, source, created_at) VALUES (?, ?, ?, ?, ?)");
            newOrder.forEach((item, index) => {
                stmt.run([item.id, phaseId, item.name, item.source, item.created_at]);
            });
            stmt.finalize();
            
            // Delete old data for this phase
            db.run("DELETE FROM sd_life_cycle_phases_tools WHERE phase_id = ?", [phaseId]);
            
            // Insert reordered data
            db.run("INSERT INTO sd_life_cycle_phases_tools SELECT * FROM temp_phase_tools");
            
            // Drop temporary table
            db.run("DROP TABLE temp_phase_tools");
            
            db.run('COMMIT', (err) => {
                if (err) {
                    console.error('Error reordering phase tools:', err);
                    db.run('ROLLBACK');
                    reject(err);
                } else {
                    resolve({ success: true });
                }
            });
        });
    });
};

// Reorder Phase Steps
exports.reorderPhaseSteps = (phaseId, newOrder) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            // Create temporary table
            db.run("CREATE TEMPORARY TABLE temp_phase_steps AS SELECT * FROM sd_life_cycle_phases_steps WHERE 0");
            
            // Insert items in new order
            const stmt = db.prepare("INSERT INTO temp_phase_steps (id, phase_id, step, reason, created_at) VALUES (?, ?, ?, ?, ?)");
            newOrder.forEach((item, index) => {
                stmt.run([item.id, phaseId, item.step, item.reason, item.created_at]);
            });
            stmt.finalize();
            
            // Delete old data for this phase
            db.run("DELETE FROM sd_life_cycle_phases_steps WHERE phase_id = ?", [phaseId]);
            
            // Insert reordered data
            db.run("INSERT INTO sd_life_cycle_phases_steps SELECT * FROM temp_phase_steps");
            
            // Drop temporary table
            db.run("DROP TABLE temp_phase_steps");
            
            db.run('COMMIT', (err) => {
                if (err) {
                    console.error('Error reordering phase steps:', err);
                    db.run('ROLLBACK');
                    reject(err);
                } else {
                    resolve({ success: true });
                }
            });
        });
    });
};

// Reorder Projects
exports.reorderProjects = (newOrder) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            // Create temporary table
            db.run("CREATE TEMPORARY TABLE temp_projects AS SELECT * FROM sd_life_cycle_projects WHERE 0");
            
            // Insert items in new order
            const stmt = db.prepare("INSERT INTO temp_projects (id, name, date, insight, owner, owner_work, created_by, github_link, project_link, start_date, end_date, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            newOrder.forEach((item, index) => {
                stmt.run([item.id, item.name, item.date, item.insight, item.owner, item.owner_work, item.created_by, item.github_link, item.project_link, item.start_date, item.end_date, item.status, item.created_at]);
            });
            stmt.finalize();
            
            // Delete old data
            db.run("DELETE FROM sd_life_cycle_projects");
            
            // Insert reordered data
            db.run("INSERT INTO sd_life_cycle_projects SELECT * FROM temp_projects");
            
            // Drop temporary table
            db.run("DROP TABLE temp_projects");
            
            db.run('COMMIT', (err) => {
                if (err) {
                    console.error('Error reordering projects:', err);
                    db.run('ROLLBACK');
                    reject(err);
                } else {
                    resolve({ success: true });
                }
            });
        });
    });
};