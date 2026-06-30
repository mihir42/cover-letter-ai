import { useState } from "react"
import "./App.css"

function App() {
    let [experience, setExperience] = useState("")
    let [jobDescription, setJobDescription] = useState("")
    let [letter, setLetter] = useState("")
    let [loading, setLoading] = useState(false)

    async function generateLetter() {
        setLoading(true)
            let response = await fetch("https://cover-letter-ai-production-88c8.up.railway.app/api/generate", {            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ experience, job_description: jobDescription })
        })
        let data = await response.json()
        setLetter(data.letter)
        setLoading(false)
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