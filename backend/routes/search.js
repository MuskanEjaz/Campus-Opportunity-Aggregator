const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const { getConnection, closeConnection } = require('../config/db');
const verifyToken = require('../middleware/auth');

// GET /api/search
// Query params: category_id, dept_id, opp_mode, is_paid, deadline
// Example: /api/search?category_id=1&opp_mode=remote
router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(
            `BEGIN 
                filter_opportunities(
                    :category_id, 
                    :dept_id, 
                    :opp_mode, 
                    :is_paid, 
                    :deadline, 
                    :results
                ); 
             END;`,
            {
                category_id: { val: req.query.category_id ? 
                                Number(req.query.category_id) : null },
                dept_id:     { val: req.query.dept_id ? 
                                Number(req.query.dept_id) : null },
                opp_mode:    { val: req.query.opp_mode || null },
                is_paid: { val: (req.query.is_paid !== undefined && req.query.is_paid !== '') ? 
                            Number(req.query.is_paid) : null },
                deadline:    { val: req.query.deadline ? 
                                new Date(req.query.deadline) : null,
                               type: oracledb.TIMESTAMP },
                results:     { type: oracledb.CURSOR, 
                               dir: oracledb.BIND_OUT }
            }
        );

        // Read all rows from the cursor
        const cursor = result.outBinds.results;
        const rows = await cursor.getRows(100);
        await cursor.close();

        // Convert rows to readable JSON objects
        const opportunities = rows.map(row => ({
            opp_id:       row[0],
            title:        row[1],
            description:  row[2],
            category:     row[3],
            department:   row[4],
            deadline:     row[5],
            mode:         row[6],
            is_paid:      row[7],
            views_count:  row[8],
            save_count:   row[9],
            posted_by:    row[10],
            created_at:   row[11]
        }));

        res.status(200).json({
            success: true,
            count: opportunities.length,
            data: opportunities
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching opportunities' 
        });
    } finally {
        // Always close the connection whether it succeeded or failed
        await closeConnection(connection);
    }
});

// GET /api/search/:id — fetch single opportunity by ID
router.get('/:id', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(
            `SELECT 
                o.opp_id,
                o.title,
                o.description,
                c.category_name,
                d.dept_name,
                o.deadline,
                o.opp_mode,
                o.is_paid,
                o.views_count,
                o.save_count,
                u.user_name,
                o.created_at,
                o.status
            FROM opportunities o
            JOIN categories c ON o.category_id = c.category_id
            JOIN departments d ON o.dept_id = d.dept_id
            JOIN users u ON o.posted_by = u.user_id
            WHERE o.opp_id = :id`,
            { id: parseInt(req.params.id) }
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Opportunity not found'
            });
        }

        const row = result.rows[0];
        const opportunity = {
            opp_id:       row[0],
            title:        row[1],
            description:  row[2],
            category:     row[3],
            department:   row[4],
            deadline:     row[5],
            mode:         row[6],
            is_paid:      row[7],
            views_count:  row[8],
            save_count:   row[9],
            posted_by:    row[10],
            created_at:   row[11],
            status:       row[12]
        };

        res.status(200).json({
            success: true,
            data: opportunity
        });

    } catch (error) {
        console.error('Get opportunity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching opportunity'
        });
    } finally {
        await closeConnection(connection);
    }
});

// POST /api/search/:id/view — log a view, trigger increments views_count
router.post('/:id/view', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        // For now use a default user_id of 1 until auth is fully built
        await connection.execute(
            `INSERT INTO opportunity_views (user_id, opp_id) 
             VALUES (1, :opp_id)`,
            { opp_id: parseInt(req.params.id) },
            { autoCommit: true }
        );

        res.status(200).json({ success: true });

    } catch (error) {
        console.error('View log error:', error);
        res.status(500).json({ success: false });
    } finally {
        await closeConnection(connection);
    }
});

module.exports = router;