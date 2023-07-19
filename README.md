# deliveroo-backend

This is a sample backend-project on managing restaurant delivery system

## Requirements

Node 18 <br>
MySql 8 <br>
Git <br>

## Common Setup

#### Clone the repo and install the dependencies.

```bash
git clone https://github.com/rasika1995/deliveroo-backend.git
cd deliveroo-backend
```

```bash
npm install
```

Run the project.

```bash
npm run start
```

This will run your project on port 8080

Open [http://localhost:8080](http://localhost:8080) and take a look around.

#### Set up the DB connection

Create the new connection in your MySQL Workbench or any other tool you use.

hostname: `127.0.0.1` <br>
port: `3306` <br>
username: `root` <br>
password: `12345678` <br>

It will create new connection for you. <br>

Then you have to import the database schema. <br> 

You can find the relevent <b>.sql</b> in directory: `src/db-config/db.sql` <br>

Then create the db schema with name: `deliveroo`

Open [http://localhost:8080/test-connection](http://localhost:8080/test-connection) and test whether you connection was successfully established or not.

### Postman API collection

You can find the published Postman API collection [here](https://documenter.getpostman.com/view/8252342/2s946ibWFs)

