const express = require('express');
const db = require('./database.js/DB.js');

const app = express();

app.use(express.json());

// Welcome Route
app.get('/', (req, res) => {
    res.send("Welcome to Notes App!");
});



app.get('/notes', (req, res) => {

    try {
        const notes = db.prepare(
            'SELECT * FROM notes ORDER BY id DESC'
        ).all();

        res.json(notes);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }

});


app.post('/notes', (req, res) => {

    try {
        const { title, content } = req.body;

        if (
            typeof title !== 'string' ||
            typeof content !== 'string' ||
            !title.trim() ||
            !content.trim()
        ) {
            return res.status(400).json({
                message: "Valid title and content are required"
            });
        }

        const stmt = db.prepare(
            'INSERT INTO notes (title, content) VALUES (?, ?)'
        );

        const result = stmt.run(title.trim(), content.trim());

        res.status(201).json({
            message: "Note added successfully!",
            id: result.lastInsertRowid
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }

});

app.get('/notes/:id', (req, res) => {

    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid note ID"
            });
        }

        const note = db.prepare(
            'SELECT * FROM notes WHERE id = ?'
        ).get(id);

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.json(note);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }

});


app.put('/notes/:id', (req, res) => {

    try {
        const id = Number(req.params.id);
        const { title, content } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid note ID"
            });
        }

        if (
            typeof title !== 'string' ||
            typeof content !== 'string' ||
            !title.trim() ||
            !content.trim()
        ) {
            return res.status(400).json({
                message: "Valid title and content are required"
            });
        }

        const stmt = db.prepare(
            'UPDATE notes SET title = ?, content = ? WHERE id = ?'
        );

        const result = stmt.run(title.trim(), content.trim(), id);

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.json({
            message: "Note updated successfully!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }

});

app.delete('/notes/:id', (req, res) => {

    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid note ID"
            });
        }

        const stmt = db.prepare(
            'DELETE FROM notes WHERE id = ?'
        );

        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.json({
            message: "Note deleted successfully!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }

});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});