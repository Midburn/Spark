# Noob's guide to camps module development from scratch

### preconditions
>1. **Nvm** ( https://github.com/creationix/nvm/blob/master/README.markdown#installation )
>2. **mySQL** ( http://dev.mysql.com/downloads/mysql/ )
>3. **GIT** ( https://git-scm.com/downloads )

### setup Spark dev environment

```
$ git clone https://github.com/Midburn/Spark.git
$ cd spark
spark$ nvm install
spark$ nvm use
spark$ npm install
spark$ npm install -g nodemon knex
```

### Create the DB

```
spark$ sudo mysql -u root < migrations/create_db.sql
spark$ knex migrate:latest
```

### Start the server

```
spark$ nodemon server.js
```

### Create admin user

* http://localhost:3000/dev
* Create admin user

### Create a camp

* http://localhost:3000/he/camps
* login -
  * username: **a**
  * password: **a**
* click "create a new camp"
* give a unique name
* wait a second
* click "continue"
* fill-in the details
* can't save because you need to select a user

### Create a user

```
insert into users (email) values ('test@localhost');
```
