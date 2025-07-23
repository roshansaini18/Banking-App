MERN Stack Bank Application
A secure and scalable banking application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. This project implements role-based access control to manage operations for customers, employees, and administrators efficiently.

Features
Role-Based Access
Distinct dashboards and permissions for Customer, Employee, and Admin roles.

Secure login/logout functionality with token-based authentication.

Account Management
Employee/Admin can create new accounts within their assigned branches.

Update and manage customer details seamlessly.

Automatic email delivery of credentials to new customers and employees.

Transactions
Employees can perform credit/debit transactions restricted to their branch.

Customers can view personal transaction history.

Employees/Admins can view branch-level summaries:

Total credited amount

Total debited amount

Total balance available in the branch

Email Notifications
Instant email notifications for account credentials.

Technology Stack
Frontend: React.js, Redux/Context API, TailwindCSS or Material UI

Backend: Node.js, Express.js

Database: MongoDB with Mongoose ODM

Authentication: JWT and bcrypt.js

Email Service: Nodemailer (SMTP or email API)
