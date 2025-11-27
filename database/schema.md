# Database Schema

Collections:

- `employees`
  - `_id` ObjectId
  - `name` string
  - `email` string
  - `position` string

- `tasks`
  - `_id` ObjectId
  - `title` string
  - `description` string
  - `status` enum('todo','in-progress','done')
  - `employee` ObjectId -> references `employees._id`
  - `dueDate` date

Relationship: each Task references an Employee via `employee` foreign key.
