# Staff-Organizer

The Staff Organizer Application is a command-line tool that allows you to manage departments, roles, and employees in your organization. It provides functionality to view, add, and update records in a MySQL database.

![Gif demo of Staff-Organizer](./assets/Staff%20Organizer.gif)

## Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/rlobz/Staff-Organizer.git
```
2. Navigate to the project directory:

```bash
cd staff-organizer
```
3. Install the required npm packages:

```bash
npm install
```
4. Set up your MySQL database:

- Create a MySQL database named staff_organizer.
- Run the SQL commands in schema.sql to create the necessary tables.

5. Seed the database with sample data:

- Run the SQL commands in seedssql.sql to populate the tables with sample data.

6. Configure your MySQL connection:

- Open server.js.
- Modify the db object with your MySQL connection details, including host, user, password, and database.

# Usage

To run the application, use the following command:

```bash
node server.js
```

The application will display a list of actions you can perform, including:

- View all departments
- View all roles
- View all employees
- Add a department
- Add a role
- Add an employee
- Update an employee role
- Reset Database
- Exit

Select an action by typing the corresponding option number or using the arrow keys and pressing Enter.

Follow the prompts to complete each action. You can manage your organization's data easily using this command-line interface.

## Credits

**Rafal Lobzowski**
- Github: [@rlobz](https://github.com/rlobz)