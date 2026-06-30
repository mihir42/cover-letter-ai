# Cover Letter AI

An AI-powered tool that generates tailored cover letters. Paste your CV/experience and a job description, and get a professional cover letter in seconds.

**Live app:** [cover-letter-ai-bay.vercel.app](https://cover-letter-ai-bay.vercel.app)

## How it works

1. Paste your experience or CV
2. Paste the job description
3. Click Generate — the AI writes a tailored cover letter matching your background to the role

## Tech Stack

- **Frontend:** React + Vite, deployed on Vercel
- **Backend:** Flask + Gunicorn, deployed on Render
- **AI:** Groq API (llama-3.3-70b-versatile)

## Architecture

The React frontend sends the user's experience and job description to a Flask API endpoint. The backend builds a prompt and calls the Groq API to generate the cover letter, then returns it to the frontend for display.

## Running locally

**Backend:**
```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# add GROQ_API_KEY to a .env file
python app.py
```

**Frontend:**
```
cd frontend
npm install
npm run dev
```
