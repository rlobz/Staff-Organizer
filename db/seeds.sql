USE staff_organizer;

INSERT INTO department (name)
VALUES 
    ('Engineering'),
    ('Human Resources'),
    ('Marketing'),
    ('Sales'),
    ('Finance');

INSERT INTO role (title, salary, department_id)
VALUES 
    ('Software Engineer', 70000, 1),
    ('HR Manager', 60000, 2),
    ('Marketing Coordinator', 50000, 3),
    ('Sales Representative', 55000, 4),
    ('Accountant', 65000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Alice', 'Johnson', 1, NULL),
    ('Bob', 'Smith', 2, NULL),
    ('Carol', 'Daniels', 3, 2),
    ('David', 'Garcia', 4, 2),
    ('Eve', 'Martin', 5, 1);