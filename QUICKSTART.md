# Quick Start Guide

## ✅ Current Status

**Backend Server**: ✅ Running on http://localhost:5000
**Frontend Server**: ✅ Running on http://localhost:3000

## ⚠️ MongoDB Required

The backend is currently unable to connect to MongoDB. You need to either:

### Option 1: Install MongoDB Locally

```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Option 2: Use MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

## 🚀 After MongoDB is Connected

### 1. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- Admin user: `admin` / `admin123`
- 10 sample products

### 2. Access the Application

**Customer Site**: http://localhost:3000
- Browse products
- Add to cart
- Checkout with COD or QR payment

**Admin Panel**: http://localhost:3000/admin/login
- Login: `admin` / `admin123`
- Manage products and orders

**API Documentation**: http://localhost:5000/api-docs

## 📝 Server Commands

Both servers are currently running in the background.

To view server logs:
- Backend logs: Check the terminal output
- Frontend logs: Check the terminal output

To restart servers:
```bash
# Stop current servers (Ctrl+C in terminals)
# Then restart:

# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## 🔧 Configuration

Make sure to update these files:

**backend/.env**:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_ACCESS_SECRET` - Change to a secure random string
- `JWT_REFRESH_SECRET` - Change to a secure random string
- `UPI_ID` - Your UPI ID for QR payments
- `WHATSAPP_NUMBER` - Your WhatsApp number (+91XXXXXXXXXX)

**frontend/.env**:
- `VITE_API_URL` - Backend URL (default: http://localhost:5000/api)
- `VITE_WHATSAPP_NUMBER` - Same as backend
- `VITE_UPI_ID` - Same as backend

## 🎯 Next Steps

1. **Set up MongoDB** (see options above)
2. **Run seed script** to populate database
3. **Visit http://localhost:3000** to see the store
4. **Visit http://localhost:3000/admin/login** to access admin panel

## 📞 Need Help?

Check the main [README.md](file:///home/jeba-prakash/Jeba/ecommerce/README.md) for detailed documentation.
