const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a new mission (only title)
router.post('/missions', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Mission title is required' });
        }

        const { rows } = await db.query(
            'INSERT INTO missions (title) VALUES ($1) RETURNING *',
            [title]
        );
        res.json(rows[0]);
    } catch (error) {
        console.error('Error creating mission:', error);
        res.status(500).json({ error: 'Error creating mission' });
    }
});

// Get all missions with their targets and progress
router.get('/missions', async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT 
                m.*,
                COALESCE(json_agg(t.*) FILTER (WHERE t.id IS NOT NULL), '[]') as targets,
                COUNT(t.id) as total_targets,
                COUNT(CASE WHEN t.is_completed THEN 1 END) as completed_targets
            FROM missions m
            LEFT JOIN targets t ON m.id = t.mission_id
            GROUP BY m.id
            ORDER BY m.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching missions:', error);
        res.status(500).json({ error: 'Error fetching missions' });
    }
});

// Add target to a mission
router.post('/missions/:missionId/targets', async (req, res) => {
    try {
        const { missionId } = req.params;
        const { title } = req.body;

        // Check if mission exists and is not finalized
        const { rows: missions } = await db.query(
            'SELECT * FROM missions WHERE id = $1',
            [missionId]
        );

        if (missions.length === 0) {
            return res.status(404).json({ error: 'Mission not found' });
        }

        if (missions[0].is_finalized) {
            return res.status(400).json({ error: 'Cannot add targets to finalized mission' });
        }

        const { rows } = await db.query(
            'INSERT INTO targets (mission_id, title) VALUES ($1, $2) RETURNING *',
            [missionId, title]
        );
        res.json(rows[0]);
    } catch (error) {
        console.error('Error adding target:', error);
        res.status(500).json({ error: 'Error adding target' });
    }
});

// Delete target (only before mission is finalized)
router.delete('/targets/:targetId', async (req, res) => {
    try {
        const { targetId } = req.params;
        
        // Check if target exists and mission is not finalized
        const { rows } = await db.query(`
            SELECT t.*, m.is_finalized 
            FROM targets t 
            JOIN missions m ON t.mission_id = m.id 
            WHERE t.id = $1
        `, [targetId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Target not found' });
        }

        if (rows[0].is_finalized) {
            return res.status(400).json({ error: 'Cannot delete target from finalized mission' });
        }

        await db.query('DELETE FROM targets WHERE id = $1', [targetId]);
        res.json({ message: 'Target deleted successfully' });
    } catch (error) {
        console.error('Error deleting target:', error);
        res.status(500).json({ error: 'Error deleting target' });
    }
});

// Finalize mission (convert DELETE TARGET to DONE buttons)
router.post('/missions/:missionId/finalize', async (req, res) => {
    try {
        const { missionId } = req.params;
        
        // Check if mission has any targets
        const { rows: targets } = await db.query(
            'SELECT COUNT(*) FROM targets WHERE mission_id = $1',
            [missionId]
        );

        if (parseInt(targets[0].count) === 0) {
            return res.status(400).json({ error: 'Cannot finalize mission without targets' });
        }

        const { rows } = await db.query(
            'UPDATE missions SET is_finalized = true WHERE id = $1 RETURNING *',
            [missionId]
        );
        res.json(rows[0]);
    } catch (error) {
        console.error('Error finalizing mission:', error);
        res.status(500).json({ error: 'Error finalizing mission' });
    }
});

// Mark target as done (only after mission is finalized)
router.patch('/targets/:targetId/complete', async (req, res) => {
    try {
        const { targetId } = req.params;
        
        // Check if target exists and mission is finalized
        const { rows: checkResult } = await db.query(`
            SELECT t.*, m.is_finalized 
            FROM targets t 
            JOIN missions m ON t.mission_id = m.id 
            WHERE t.id = $1
        `, [targetId]);

        if (checkResult.length === 0) {
            return res.status(404).json({ error: 'Target not found' });
        }

        if (!checkResult[0].is_finalized) {
            return res.status(400).json({ error: 'Cannot mark target as done before mission is finalized' });
        }

        const { rows } = await db.query(
            'UPDATE targets SET is_completed = true WHERE id = $1 RETURNING *',
            [targetId]
        );
        res.json(rows[0]);
    } catch (error) {
        console.error('Error completing target:', error);
        res.status(500).json({ error: 'Error completing target' });
    }
});

// Delete mission
router.delete('/missions/:missionId', async (req, res) => {
    try {
        const { missionId } = req.params;
        await db.query('DELETE FROM missions WHERE id = $1', [missionId]);
        res.json({ message: 'Mission deleted successfully' });
    } catch (error) {
        console.error('Error deleting mission:', error);
        res.status(500).json({ error: 'Error deleting mission' });
    }
});

module.exports = router;