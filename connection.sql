-- CREATE DATABASE tododb

CREATE TABLE tasks(
    tasks_id SERIAL PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    task_status VARCHAR(10)
)

