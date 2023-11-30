## Tech stack used
```
NodeJS + Express
PostgresSQL + Sequelize ORM
```

## API overview 
```
1 . /api/user/list (GET: Fetch all users list with minimal infos)

2. /api/user/details/:id (GET: Fetch single user with detailed infos)
   Params : id

3. /api/user/add  (POST: Add new User)
   Payload: { id, password, role, full_name, phone, email, age, birth_date}

4. /api/user/update (POST: Update existing User)
   Payload: { id, role, full_name, status, phone, email, age, birth_date}

5. /api/user/delete (POST: Delete exisiting User)
   Payload: { id }

Note: These are unprotected API routes, no auth middleware.
```

## Steps
1. Database setup (in this case I am using PostgreSQL)
```
CREATE TABLE "users" (
	"id" TEXT NOT NULL,
	"password" TEXT NOT NULL,
	"role" TEXT NOT NULL,
	"full_name" TEXT NOT NULL,
	"active" BOOLEAN NOT NULL DEFAULT 'true',
	"phone" TEXT NULL DEFAULT NULL,
	"email" TEXT NULL DEFAULT NULL,
	"created_by" TEXT NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL,
	"age" INTEGER NOT NULL,
	"birth_date" DATE NOT NULL,
	PRIMARY KEY ("id")
);

//Below is optional for dummy data
INSERT INTO users ("id", "password", "role", "full_name", "active", "phone", "email", "created_by", "created_at", "updated_at", "age", "birth_date") VALUES ('abu', '$2b$10$hT4HgSC0urtLjpISpKD4Pe3xOQsTvSI9Oq735USgWGa/auOZIKHEW', 'superadmin', 'Abu Bob', 'true', '0125242221445', 'abu@x.com', 'system', NOW(), NOW(), 27, '1996-01-24');
INSERT INTO users ("id", "password", "role", "full_name", "active", "phone", "email", "created_by", "created_at", "updated_at", "age", "birth_date") VALUES ('ali', '$2b$10$P6rgq06rGg/cGjt4LxbVjef66xaLndjyIFfYQgOjQ.kpm62yad25i', 'superadmin', 'Ali King', 'false', NULL, 'john@x.com', 'system', NOW(), NOW(), 56, '1952-09-12');
```

2. Create a .env file in your directory and fill your DB creds.
```
DATABASE_HOST = 'localhost'
DATABASE_PORT = '5432'
DATABASE_USER = 'postgres'
DATABASE_PASS = 'root'
DATABASE_NAME = 'postgres'
DATABASE_TIMEZONE = 'Asia/Kuala_Lumpur'

HASH_SALTROUND = 10
```

3. Command to run after git clone
```
npm i
npm run dev
```

4. (Optional) Sample Terraform script  to deploy into EC2 `./terraform/deployment.tf`
  
