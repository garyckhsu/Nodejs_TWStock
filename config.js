var config = {};
//config.databaseUrl = 'mongodb://localhost:27017/stock_data';
config.databaseUrl = "mongodb://garyhsu:gary8270@ds243059.mlab.com:43059/stock_data";
//mongodb://your-user:your-pass@host:port/db-name
//mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
//mongodb://<dbuser>:<dbpassword>@ds243059.mlab.com:43059/stock_data
config.databaseName = 'stock_data';
config.collection = 'twexchangereport';

module.exports = config;