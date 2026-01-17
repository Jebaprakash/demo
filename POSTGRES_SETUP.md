# PostgreSQL Setup Guide

## ✅ Database Conversion Complete!

I've successfully converted your e-commerce backend from **MongoDB to PostgreSQL**. All code has been updated to use Sequelize ORM with PostgreSQL.

## What Was Changed

### Backend Files Updated:
- ✅ `package.json` - Replaced mongoose with sequelize, pg, pg-hstore
- ✅ `src/config/database.js` - PostgreSQL connection with Sequelize
- ✅ `src/models/Admin.js` - Sequelize model with UUID primary key
- ✅ `src/models/Product.js` - Sequelize model with ARRAY type for images
- ✅ `src/models/Order.js` - Sequelize model with JSONB for nested data
- ✅ `src/controllers/productController.js` - Sequelize queries
- ✅ `src/controllers/orderController.js` - Sequelize with transactions
- ✅ `src/controllers/adminController.js` - Sequelize methods
- ✅ `src/server.js` - PostgreSQL connection
- ✅ `scripts/seedData.js` - Sequelize seed script
- ✅ `.env.example` - PostgreSQL connection variables

## Install PostgreSQL

Run these commands:

```bash
# Install PostgreSQL
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql
```

## Create Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt, run:
CREATE DATABASE ecommerce;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE ecommerce TO postgres;
\q
```

## Update Environment Variables

The `.env` file has been created with these defaults:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=postgres
```

If you used different credentials, update `/home/jeba-prakash/Jeba/ecommerce/backend/.env`

## Seed the Database

```bash
cd /home/jeba-prakash/Jeba/ecommerce/backend
npm run seed
```

This will:
- Create all tables (admins, products, orders)
- Create admin user: `jeba` / `12345678`
- Add 10 sample products

## Start the Backend

The backend server will automatically restart once PostgreSQL is connected.

## Login to Admin Panel

Visit: http://localhost:3000/admin/login
- Username: `jeba`
- Password: `12345678`

## Why PostgreSQL?

✅ Easier to install than MongoDB
✅ Better for relational data
✅ JSONB support for flexible fields
✅ Strong ACID compliance
✅ Better performance for complex queries
✅ More familiar SQL syntax

---

**Next Step**: Install PostgreSQL using the commands above, then run the seed script!
