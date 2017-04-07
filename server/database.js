const Sequelize = require('sequelize');

class Database {

    constructor() {
        this.sequelize = new Sequelize('monopvply', 'dev', '123456', {
            host: 'db',
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        });

        this.User = this.sequelize.define('user', {
            name: Sequelize.STRING,
            password: Sequelize.STRING
        });
    }

    sync() {
        return this.sequelize.sync({force: true});
    }

    getUsers() {
        return this.User.findAll();
    }

    login(username, password) {
        return this.User.findOne({
           where: {
               name: username,
               password: password
           }
        });
    }

}

module.exports = Database;