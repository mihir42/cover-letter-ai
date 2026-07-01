import { useState } from "react"
import "./App.css"

function App() {
    let [experience, setExperience] = useState("")
    let [jobDescription, setJobDescription] = useState("")
    let [letter, setLetter] = useState("")
    let [loading, setLoading] = useState(false)

    async function generateLetter() {

    setLoading(true);

    try {

        // STEP 1 - Create Razorpay Order
        const orderResponse = await fetch(
            "https://cover-letter-ai-30c0.onrender.com/api/create-order",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amount: 29
                })
            }
        );

        const order = await orderResponse.json();

        const options = {
            key: order.key,
            amount: order.amount,
            currency: order.currency,
            order_id: order.order_id,
            name: "Cover Letter AI",
            description: "Generate AI Cover Letter",

            handler: async function (response) {

                const generateResponse = await fetch(
                    "https://cover-letter-ai-30c0.onrender.com/api/verify-and-generate",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({

                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,

                            experience: experience,
                            job_description: jobDescription

                        })
                    }
                );

                const result = await generateResponse.json();

                if (result.success) {
                    setLetter(result.letter);
                } else {
                    alert(result.message);
                }

                setLoading(false);
            },

            theme: {
                color: "#2563eb"
            }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

    } catch (err) {

        console.error(err);
        alert("Something went wrong.");
        setLoading(false);

    }

}

    return (
        <div className="container">
            <h1>Cover Letter Generator</h1>
            <p className="subtitle">Paste your CV and job description — get a tailored cover letter in seconds.</p>
            <div className="inputs">
                <textarea
                    className="input-box"
                    placeholder="Paste your experience / CV"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    rows={10}
                />
                <textarea
                    className="input-box"
                    placeholder="Paste the job description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={10}
                />
            </div>
            <button className="btn" onClick={generateLetter} disabled={loading}>
                {loading ? "Generating..." : "Generate Cover Letter"}
            </button>
            {letter && (
                <div className="result">
                    <h2>Your Cover Letter</h2>
                    <p>{letter}</p>
                </div>
            )}
        </div>
    )
}

export default App