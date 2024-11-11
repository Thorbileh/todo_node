const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname)));


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tododb',
    password: '',
    port: 5432,
})

app.get('/displayTask', async(req, res) =>{

    try {
        const result = await pool.query("SELECT * FROM tasks");
        res.json(result.rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error retrieving tasks');
    }
});

app.get('/displayTask/:tasks_id', async (req, res) => {
    try {
      const tasks_id = parseInt(req.params.tasks_id);
      if (isNaN(tasks_id)) {
        return res.status(404).send('ID not found');
      }
  
      const result = await pool.query(`SELECT * FROM tasks WHERE tasks_id = ${tasks_id}`);
      
      if (result.rows.length === 0) {
        return res.status(404).send('Task not found');
      }
  
      res.json(result.rows);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Error retrieving tasks');
    }
  });
  

app.post('/addTask', async(req, res) => {
    try {
        const { task_name, task_status } = req.body;

        if (!task_name || !task_status) {
            return res.status(400).send('task name and status must be specified');
        }

        const checkQuery = `SELECT * FROM tasks WHERE task_name = '${task_name}' AND task_status = 'Pending'`;
        const checkResult = await pool.query(checkQuery);

        if (checkResult.rows.length > 0) {
            
            return res.status(409).send('Tasks already exists');
        }
        

        const insertQuery = `INSERT INTO tasks (task_name, task_status) VALUES ('${task_name}', '${task_status}') RETURNING *`;
        const insertResult = await pool.query(insertQuery);

        res.status(201).json(insertResult.rows[0]); 
        
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error adding task');
    }
})


app.put('/updateTask/:tasks_id', async (req, res) => {
    try {
      const tasks_id = req.params.tasks_id;
      const { task_name, task_status } = req.body;
  
      
      const currentTaskQuery = `SELECT task_status FROM tasks WHERE tasks_id = ${tasks_id}`;
      const currentTaskResult = await pool.query(currentTaskQuery);
  
      if (currentTaskResult.rows.length === 0) {
        return res.status(404).send('Task not found');
      }
  
      const currentStatus = currentTaskResult.rows[0].task_status;
      if (currentStatus === 'Completed') {
        return res.status(403).send('Task cannot be updated as it is already completed');
      }
  
      if (!task_name || !task_status) {
        return res.status(400).send('Task name and status must be specified');
      }
        
      const checkQuery = `SELECT * FROM tasks WHERE task_name = '${task_name}' AND task_status = 'Pending' AND tasks_id != ${tasks_id}`;
      const checkResult = await pool.query(checkQuery);
  
      if (checkResult.rows.length > 0) {
        return res.status(409).send('Task with the same name and pending status already exists');
      }
  
      const updateQuery = `UPDATE tasks SET task_name = '${task_name}', task_status = '${task_status}' WHERE tasks_id = ${tasks_id} RETURNING *`;
      const updateResult = await pool.query(updateQuery);
  
      if (updateResult.rowCount === 0) {
        return res.status(404).send('Task not found');
      }
  
      res.status(200).json({ message: 'Task updated successfully', task: updateResult.rows[0] });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error updating task');
    }
  });
  

app.delete('/deleteTask/:tasks_id', async(req, res) => {
    try {
        const tasks_id  = req.params.tasks_id;

        const deleteQuery = `DELETE FROM tasks WHERE tasks_id = ${tasks_id}`;
        const deleteResult = await pool.query(deleteQuery);

        if (deleteResult.rowCount === 0) {
            return res.status(404).send('Task not found');
        }

        res.status(200).json({ message: 'Task deleted successfully' });

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error deleting task');
    }
});

const PORT = 3000;

app.listen(PORT, async (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});
