const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const { getConnection, closeConnection } = require('../config/db');
const verifyToken = require('../middleware/auth');

// GET /api/admin/stats — dashboard analytics
router.get('/stats', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(
            `SELECT 
                (SELECT COUNT(*) FROM opportunities WHERE status = 'active') AS total_active,
                (SELECT COUNT(*) FROM opportunities WHERE status = 'expired') AS total_expired,
                (SELECT COUNT(*) FROM users WHERE role_id = 2) AS total_students,
                (SELECT COUNT(*) FROM saved_opportunities) AS total_saves
            FROM dual`
        );

        const row = result.rows[0];
        res.status(200).json({
            success: true,
            data: {
                total_active:   row[0],
                total_expired:  row[1],
                total_students: row[2],
                total_saves:    row[3]
            }
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ success: false, message: 'Error fetching stats' });
    } finally {
        await closeConnection(connection);
    }
});

// GET /api/admin/opportunities — all opportunities for admin
router.get('/opportunities', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(
            `SELECT o.opp_id, o.title, c.category_name, d.dept_name,
                    o.deadline, o.status, o.opp_mode, o.is_paid,
                    o.views_count, o.save_count
             FROM opportunities o
             JOIN categories c ON o.category_id = c.category_id
             JOIN departments d ON o.dept_id = d.dept_id
             ORDER BY o.created_at DESC`
        );

        const opportunities = result.rows.map(row => ({
            opp_id:      row[0],
            title:       row[1],
            category:    row[2],
            department:  row[3],
            deadline:    row[4],
            status:      row[5],
            mode:        row[6],
            is_paid:     row[7],
            views_count: row[8],
            save_count:  row[9]
        }));

        res.status(200).json({ success: true, data: opportunities });

    } catch (error) {
        console.error('Admin opps error:', error);
        res.status(500).json({ success: false, message: 'Error fetching opportunities' });
    } finally {
        await closeConnection(connection);
    }
});

// DELETE /api/admin/opportunities/:id
router.delete('/opportunities/:id', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        await connection.execute(
            `DELETE FROM opportunities WHERE opp_id = :id`,
            { id: parseInt(req.params.id) },
            { autoCommit: true }
        );

        res.status(200).json({ success: true, message: 'Opportunity deleted' });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ success: false, message: 'Error deleting opportunity' });
    } finally {
        await closeConnection(connection);
    }
});


// GET /api/admin/recommendations/:user_id
router.get('/recommendations/:user_id', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(
            `BEGIN get_user_recommendations(:user_id, :results); END;`,
            {
                user_id: parseInt(req.params.user_id),
                results: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            }
        );

        const cursor = result.outBinds.results;
        const rows = await cursor.getRows(10);
        await cursor.close();

        const recommendations = rows.map(row => ({
            opp_id:      row[0],
            title:       row[1],
            description: row[2],
            category:    row[3],
            department:  row[4],
            deadline:    row[5],
            mode:        row[6],
            is_paid:     row[7],
            views_count: row[8],
            save_count:  row[9],
            posted_by:   row[10],
            trend_score: row[11]
        }));

        res.status(200).json({ success: true, data: recommendations });

    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).json({ success: false, message: 'Error fetching recommendations' });
    } finally {
        await closeConnection(connection);
    }
});

// GET /api/admin/expiring
router.get('/expiring', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(
            `SELECT opp_id, title, description, category_name, dept_name,
                    deadline, opp_mode, is_paid, views_count, save_count
             FROM expiring_opportunities`
        );

        const expiring = result.rows.map(row => ({
            opp_id:      row[0],
            title:       row[1],
            description: row[2],
            category:    row[3],
            department:  row[4],
            deadline:    row[5],
            mode:        row[6],
            is_paid:     row[7],
            views_count: row[8],
            save_count:  row[9]
        }));

        res.status(200).json({ success: true, data: expiring });

    } catch (error) {
        console.error('Expiring error:', error);
        res.status(500).json({ success: false, message: 'Error fetching expiring opportunities' });
    } finally {
        await closeConnection(connection);
    }
});

module.exports = router;
