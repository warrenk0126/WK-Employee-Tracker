USE company_db;

INSERT INTO departments (name) VALUES ('Sales'), ('Engineering'), ('HR');

SET @salesId = (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1);
SET @engineeringId = (SELECT id FROM departments WHERE name = 'Engineering' LIMIT 1);
SET @hrId = (SELECT id FROM departments WHERE name = 'HR' LIMIT 1);

INSERT INTO roles (title, salary, department_id) VALUES ('Sales Lead', 100000, @salesId), ('Software Engineer', 120000, @engineeringId), ('HR Manager', 80000, @hrId);

SET @salesLeadId = (SELECT id FROM roles WHERE title = 'Sales Lead' LIMIT 1);
SET @softwareEngineerId = (SELECT id FROM roles WHERE title = 'Software Engineer' LIMIT 1);
SET @hrManagerId = (SELECT id FROM roles WHERE title = 'HR Manager' LIMIT 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', @salesLeadId, NULL), ('Jane', 'Smith', @softwareEngineerId, 1), ('Emily', 'Johnson', @hrManagerId, 1);
