const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME || 'ecommerce',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || 'postgres',
        {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            logging: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    );
}

const connectDB = async () => {
    try {
        console.log('Attempting to connect to database...');
        if (process.env.DATABASE_URL) {
            console.log('Using DATABASE_URL for connection');
        } else {
            console.log(`Using individual DB variables: host=${process.env.DB_HOST || 'localhost'}, port=${process.env.DB_PORT || 5432}, user=${process.env.DB_USER || 'postgres'}, database=${process.env.DB_NAME || 'ecommerce'}`);
        }

        await sequelize.authenticate();
        console.log('PostgreSQL Connected successfully');

        // Sync all models
        await sequelize.sync({ alter: true });
        console.log('Database synchronized');
    } catch (error) {
        console.error('Unable to connect to database:');
        console.error('- Message:', error.message);
        console.error('- Code:', error.code);
        if (error.original) {
            console.error('- Original Error:', error.original.message);
        }
        throw error;
    }
};

module.exports = { sequelize, connectDB };
