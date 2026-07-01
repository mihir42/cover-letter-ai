import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
import razorpay
import hmac

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

razorpay_client = razorpay.Client(
    auth=(
        os.getenv("RAZORPAY_KEY_ID"),
        os.getenv("RAZORPAY_KEY_SECRET")
    )
)

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

@app.route('/api/create-order', methods=['POST'])
def create_order():
    data = request.json

    amount = data.get("amount")

    if not amount:
        return jsonify({"error": "Amount is required"}), 400

    order = razorpay_client.order.create({
        "amount": int(amount * 100),   # Convert ₹ to paise
        "currency": "INR",
        "payment_capture": True
    })

    return jsonify({
        "order_id": order["id"],
        "amount": order["amount"],
        "currency": order["currency"],
        "key": os.getenv("RAZORPAY_KEY_ID")
    })

@app.route('/api/verify-and-generate', methods=['POST'])
def verify_and_generate():

    data = request.json

    try:
        razorpay_client.utility.verify_payment_signature({
            "razorpay_order_id": data["razorpay_order_id"],
            "razorpay_payment_id": data["razorpay_payment_id"],
            "razorpay_signature": data["razorpay_signature"]
        })
    except Exception:
        return jsonify({
            "success": False,
            "message": "Payment verification failed."
        }), 400

    experience = data["experience"]
    job_description = data["job_description"]

    prompt = f"""Write a professional cover letter for someone with this experience:

{experience}

Applying for this job:

{job_description}

Write only the cover letter, no extra commentary."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return jsonify({
        "success": True,
        "letter": response.choices[0].message.content
    })

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)