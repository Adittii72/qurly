# 🔐 Qurly Testing Credentials & Quick Start

## ⚠️ Important: No Pre-existing Accounts

The database is fresh, so **there are no pre-existing accounts**. You need to create a new account first.

---

## 📝 Sample Signup Credentials

Use these sample credentials to create your first account:

### Option 1: Test User
```
Email: test@example.com
Username: testuser
Password: password123
Confirm Password: password123
```

### Option 2: Demo User
```
Email: demo@qurly.io
Username: demomerchant
Password: Demo1234!
Confirm Password: Demo1234!
```

### Option 3: Your Own
```
Email: your-email@example.com
Username: your-username
Password: (minimum 8 characters)
Confirm Password: (must match)
```

---

## 🚀 Quick Testing Steps

### 1. Open the App
- Go to: http://localhost:3000
- You should see the landing page

### 2. Sign Up (First Time)
1. Click "Sign Up" button
2. Fill in the form:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Sign Up"
4. You'll be automatically logged in

### 3. Login (Subsequent Times)
1. Click "Login" button
2. Fill in the form:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Login"
4. You'll be redirected to the app

---

## 🐛 Troubleshooting

### Issue: "Signup failed" error

**Cause**: CORS error or backend not running

**Solution**:
1. Make sure backend is running at http://localhost:8000
2. Make sure frontend is running at http://localhost:3000
3. Restart frontend to pick up environment variables:
   ```bash
   # Stop frontend (Ctrl+C)
   # Start again
   npm start
   ```

### Issue: "Invalid email or password"

**Cause**: Wrong credentials or account doesn't exist

**Solution**:
1. If first time, use "Sign Up" instead of "Login"
2. If account exists, check email and password are correct
3. Password is case-sensitive

### Issue: CORS error in console

**Cause**: Frontend trying to access wrong URL

**Solution**:
1. Check `frontend/.env` has:
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```
2. Restart frontend server
3. Hard refresh browser (Ctrl+Shift+R)

---

## 🧪 Test Shopify URLs

After logging in, use these URLs to test product analysis:

### 1. Gymshark (Fitness Apparel)
```
https://shop.gymshark.com/products/gymshark-speed-t-shirt-black
```

### 2. Allbirds (Sustainable Shoes)
```
https://www.allbirds.com/products/mens-wool-runners
```

### 3. Beardbrand (Grooming)
```
https://www.beardbrand.com/products/utility-beard-oil
```

### 4. MVMT (Watches)
```
https://www.mvmt.com/products/classic-black-leather
```

### 5. Pura Vida (Jewelry)
```
https://www.puravidabracelets.com/products/original-bracelet
```

---

## 📊 Expected Workflow

1. **Sign Up** → Create account
2. **Paste Shopify URL** → Analyze product
3. **View Scores** → See 4 dimension scores
4. **Check AI Readiness** → 10-point checklist
5. **Generate Rewrite** → Gemini-powered optimization
6. **Simulate Score** → Before/after comparison
7. **Save to Dashboard** → Store analysis
8. **View Dashboard** → Manage reports

---

## 🔑 Password Requirements

- **Minimum length**: 8 characters
- **No special requirements**: Just 8+ characters
- **Examples**:
  - ✅ `password123` (valid)
  - ✅ `Test1234` (valid)
  - ✅ `mypassword` (valid)
  - ❌ `pass123` (too short - only 7 characters)

---

## 💾 Database Location

Your accounts are stored in:
```
backend/qurly.db
```

This is a SQLite database file. If you want to reset and start fresh:
1. Stop the backend server
2. Delete `backend/qurly.db`
3. Restart the backend server
4. Database will be recreated empty

---

## 🔍 Checking if Account Exists

You can check the database directly:

```bash
# Navigate to backend
cd backend

# Open SQLite database
sqlite3 qurly.db

# List all users
SELECT id, email, username, created_at FROM users;

# Exit
.exit
```

---

## 🎯 Quick Test Checklist

- [ ] Backend running at http://localhost:8000
- [ ] Frontend running at http://localhost:3000
- [ ] Can access landing page
- [ ] Can open signup modal
- [ ] Can create account with test credentials
- [ ] Automatically logged in after signup
- [ ] Can logout
- [ ] Can login again with same credentials
- [ ] Can paste Shopify URL and analyze
- [ ] Can view AI Readiness Checklist
- [ ] Can generate Gemini rewrite
- [ ] Can save to dashboard
- [ ] Can view dashboard with saved reports

---

## 📞 Still Having Issues?

1. **Check Backend Logs**: Look at the terminal running the backend
2. **Check Frontend Console**: Open browser DevTools (F12) → Console tab
3. **Check Network Tab**: DevTools → Network tab → Look for failed requests
4. **Restart Both Servers**: Stop and start both backend and frontend

---

**Last Updated**: April 29, 2026  
**Servers**:
- Backend: http://localhost:8000 ✅
- Frontend: http://localhost:3000 ✅
