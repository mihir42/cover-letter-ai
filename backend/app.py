import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.json
    experience = data['experience']
    job_description = data['job_description']
    
    prompt = f"""Write a professional cover letter for someone with this experience:
{experience}

Applying for this job:
{job_description}

Write only the cover letter, no extra commentary."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return jsonify({"letter": response.choices[0].message.content})

if __name__ == '__main__':
    app.run(debug=True)