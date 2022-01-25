const Datastore = require('nedb');

const db = new Datastore('database.db');
database.loadDatabase();