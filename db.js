const mysql = require('mysql2/promise');

class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }

    async viewDepartments() {
        const [rows] = await this.connection.execute('SELECT * FROM departments');
        return rows;
    }

    async viewRoles() {
        const [rows] = await this.connection.execute('SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id = departments.id');
        return rows;
    }

    // Add similar methods for other queries...
}

module.exports = Database;
