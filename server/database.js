const Sequelize = require('sequelize');

class Database {

    constructor() {
        this.db = new Sequelize('monopvply', 'dev', '123456', {
            host: 'db',
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        });

        this.User = this.db.define('user', {
            username: Sequelize.STRING,
            password: Sequelize.STRING
        });

        this.db.sync();
    }

    getUsers() {
        return this.User.findAll();
    }

    login(username, password) {
        return this.User.findOne({
           where: {
               username: username,
               password: password
           }
        });
    }

}

module.exports = Database;