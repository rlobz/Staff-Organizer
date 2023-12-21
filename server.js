const inquirer = require('inquirer');
const mysql = require('mysql2');

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
