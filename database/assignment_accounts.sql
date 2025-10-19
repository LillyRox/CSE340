account_firstname: Basic
account_lastname: Client
account_email: basic@340.edu
account_password: I@mABas1cCl!3nt
account_firstname: Happy
account_lastname: Employee
account_email: happy@340.edu
account_password: I@mAnEmpl0y33
account_firstname: Manager
account_lastname: User
account_email: manager@340.edu
account_password: I@mAnAdm!n1strat0r

UPDATE account SET account_type = 'Admin' WHERE account_email = 'manager@340.edu'
UPDATE account SET account_type = 'Employee' WHERE account_email = 'happy@340.edu'