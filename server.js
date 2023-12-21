const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');


const db = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'staff_organizer'
    });

db.connect(err => {
  if (err) throw err;
  console.log('Connected to the staff_organizer database.');
  runApp();
});
  
function runApp() {
  inquirer.prompt({
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
  }).then(answer => {
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
          case 'Exit':
              db.end();
              break;
          default:
              break;
      }
  });
}


function viewDepartments() {
  const query = 'SELECT * FROM department';
  db.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      runApp();
  });
}

function viewRoles() {
  const query = `SELECT role.id, role.title, department.name AS department, role.salary
                 FROM role
                 INNER JOIN department ON role.department_id = department.id`;
  db.promise().query(query)
      .then(([rows]) => {
          console.table(rows);
          runApp();
      })
      .catch(console.log);
}

function viewEmployees() {
  const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                 FROM employee
                 LEFT JOIN role ON employee.role_id = role.id
                 LEFT JOIN department ON role.department_id = department.id
                 LEFT JOIN employee manager ON employee.manager_id = manager.id`;
  db.promise().query(query)
      .then(([rows]) => {
          console.table(rows);
          runApp();
      })
      .catch(console.log);
}

function addDepartment() {
  inquirer.prompt({
      name: 'departmentName',
      type: 'input',
      message: 'What is the name of the department?',
  }).then(answer => {
      const query = 'INSERT INTO department (name) VALUES (?)';
      db.promise().query(query, answer.departmentName)
          .then(() => {
              console.log(`Added ${answer.departmentName} to the database`);
              runApp();
          })
          .catch(console.log);
  });
}

function addRole() {
  db.promise().query('SELECT * FROM department')
      .then(([departments]) => {
          return inquirer.prompt([
              {
                  name: 'title',
                  type: 'input',
                  message: 'What is the title of the role?',
              },
              {
                  name: 'salary',
                  type: 'input',
                  message: 'What is the salary for this role?',
                  validate: value => !isNaN(value) || 'Please enter a valid number'
              },
              {
                  name: 'departmentId',
                  type: 'list',
                  choices: departments.map(department => ({
                      name: department.name,
                      value: department.id
                  })),
                  message: 'Which department does the role belong to?',
              }
          ]);
      })
      .then(answers => {
          const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
          return db.promise().query(query, [answers.title, answers.salary, answers.departmentId]);
      })
      .then(() => {
          console.log('Role added to the database');
          runApp();
      })
      .catch(console.log);
}

function addEmployee() {
  let roles;
  let employees;
  db.promise().query('SELECT id, title FROM role')
      .then(([rows]) => {
          roles = rows;
          return db.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
      })
      .then(([rows]) => {
          employees = rows;
          return inquirer.prompt([
              {
                  name: 'firstName',
                  type: 'input',
                  message: "What is the employee's first name?",
              },
              {
                  name: 'lastName',
                  type: 'input',
                  message: "What is the employee's last name?",
              },
              {
                  name: 'roleId',
                  type: 'list',
                  choices: roles.map(role => ({ name: role.title, value: role.id })),
                  message: "What is the employee's role?",
              },
              {
                  name: 'managerId',
                  type: 'list',
                  choices: [{ name: 'None', value: null }].concat(
                      employees.map(employee => ({ name: employee.name, value: employee.id }))
                  ),
                  message: "Who is the employee's manager?",
              }
          ]);
      })
      .then(answers => {
          const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
          return db.promise().query(query, [answers.firstName, answers.lastName, answers.roleId, answers.managerId]);
      })
      .then(() => {
          console.log('Employee added to the database');
          runApp();
      })
      .catch(console.log);
}

function updateEmployeeRole() {
  let employees;
  let roles;
  db.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee')
      .then(([rows]) => {
          employees = rows;
          return db.promise().query('SELECT id, title FROM role');
      })
      .then(([rows]) => {
          roles = rows;
          return inquirer.prompt([
              {
                  name: 'employeeId',
                  type: 'list',
                  choices: employees.map(employee => ({ name: employee.name, value: employee.id })),
                  message: 'Which employee\'s role do you want to update?',
              },
              {
                  name: 'roleId',
                  type: 'list',
                  choices: roles.map(role => ({ name: role.title, value: role.id })),
                  message: 'Which role do you want to assign to the selected employee?',
              }
          ]);
      })
      .then(answers => {
          const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
          return db.promise().query(query, [answers.roleId, answers.employeeId]);
      })
      .then(() => {
          console.log('Employee role updated in the database');
          runApp();
      })
      .catch(console.log);
}

