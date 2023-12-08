const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect(err => {
    if (err) throw err;
    start();
});

function start() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        })
        .then(answer => {
            switch (answer.action) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                default:
                    connection.end();
            }
        });
}

function viewDepartments() {
    const query = 'SELECT * FROM departments';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewRoles() {
    const query = 'SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id = departments.id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewEmployees() {
    const query = 'SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees manager ON manager.id = employees.manager_id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function addDepartment() {
    inquirer
        .prompt({
            name: 'name',
            type: 'input',
            message: 'Enter the name of the department:'
        })
        .then(answer => {
            const query = 'INSERT INTO departments (name) VALUES (?)';
            connection.query(query, answer.name, (err, res) => {
                if (err) throw err;
                console.log('Department added successfully!');
                start();
            });
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the title of the role:'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the salary of the role:'
            },
            {
                name: 'department_id',
                type: 'input',
                message: 'Enter the ID of the department that the role belongs to:'
            }
        ])
        .then(answer => {
            const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
            connection.query(query, [answer.title, answer.salary, answer.department_id], (err, res) => {
                if (err) throw err;
                console.log('Role added successfully!');
                start();
            });
        });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'Enter the first name of the employee:'
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'Enter the last name of the employee:'
            },
            {
                name: 'role_id',
                type: 'input',
                message: 'Enter the ID of the role of the employee:'
            },
            {
                name: 'manager_id',
                type: 'input',
                message: 'Enter the ID of the manager of the employee (or leave blank if none):'
            }
        ])
        .then(answer => {
            const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            connection.query(query, [answer.first_name, answer.last_name, answer.role_id, answer.manager_id || null], (err, res) => {
                if (err) throw err;
                console.log('Employee added successfully!');
                start();
            });
        });
}

function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                name: 'employee_id',
                type: 'input',
                message: 'Enter the ID of the employee whose role you want to update:'
            },
            {
                name: 'role_id',
                type: 'input',
                message: 'Enter the ID of the new role for the employee:'
            }
        ])
        .then(answer => {
            const query = 'UPDATE employees SET role_id = ? WHERE id = ?';
            connection.query(query, [answer.role_id, answer.employee_id], (err, res) => {
                if (err) throw err;
                console.log('Employee role updated successfully!');
                start();
            });
        });
}
