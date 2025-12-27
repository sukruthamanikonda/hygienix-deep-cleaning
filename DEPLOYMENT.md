# Deployment Guide: Vercel & Render

This guide explains how to deploy the Hygienix Deep Cleaning application using **GitHub**, **Vercel** (Frontend), and **Render** (Backend).

## 🚀 Step 1: Push to GitHub

1. **Initialize Git (if not done):**
   ```bash
   git init
   git add .
   git commit -m "chore: prepare for deployment"
   ```
2. **Create a Repo on GitHub:**
   - Go to [GitHub](https://github.com/new) and create a private repository.
3. **Push Code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

---

## 🛠️ Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. **Configuration:**
   - **Name:** `hygienix-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. **Environment Variables:**
   Click **Advanced** > **Add Environment Variable**:
   - `PORT`: `5001`
   - `JWT_SECRET`: (Generate a random string)
   - `WHATSAPP_PHONE_NUMBER_ID`: `975554148965319`
   - `WHATSAPP_TOKEN`: (Your Meta Token)
   - `ADMIN_WHATSAPP_NUMBER`: `9535901059`
   - `ADMIN_EMAIL`: `admin@hygienix.in`
   - `ADMIN_PASSWORD`: (Your Admin Password)
6. Click **Create Web Service**.
7. **Note the URL:** It will look like `https://hygienix-backend.onrender.com`.

---

## 🌐 Step 3: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** > **Project**.
3. Import your GitHub repository.
4. **Configuration:**
   - **Project Name:** `hygienix-frontend`
   - **Framework Preset:** `Create React App`
   - **Root Directory:** `./` (Default)
5. **Environment Variables:**
   - `REACT_APP_API_BASE_URL`: `https://YOUR_BACKEND_URL.onrender.com/api`
6. Click **Deploy**.

---

## 🔒 Important Security Notes

- **Persistent Data**: Render's free tier uses an ephemeral disk. This means your SQLite database (`hygienix.db`) will reset whenever the server restarts. 
  - *Recommendation*: For a production app, use Render's **PostgreSQL** or a managed MySQL database and update `db.js`.
- **CORS**: Ensure `backend/server.js` allows requests from your Vercel URL. Currently, it is set to `origin: true` which is flexible for testing but should be restricted to your Vercel domain later.

---

## 🔄 Updates

Every time you push to the `main` branch on GitHub, both Vercel and Render will automatically redeploy your changes.
