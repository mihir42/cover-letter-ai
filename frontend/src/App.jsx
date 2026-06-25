import { useState } from "react"

function App() {
    let [experience, setExperience] = useState("")
    let [jobDescription, setJobDescription] = useState("")
    let [letter, setLetter] = useState("")
    let [loading, setLoading] = useState(false)

    async function generateLetter() {
        setLoading(true)
        let response = await fetch("http://127.0.0.1:5000/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ experience, job_description: jobDescription })
        })
        let data = await response.json()
        setLetter(data.letter)
        setLoading(false)
    }

    return (
        <div>
            <h1>Cover Letter Generator</h1>
            <textarea
                placeholder="Paste your experience / CV"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                rows={8}
                cols={60}
            />
            <br />
            <textarea
                placeholder="Paste the job description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                cols={60}
            />
            <br />
            <button onClick={generateLetter} disabled={loading}>
                {loading ? "Generating..." : "Generate Cover Letter"}
            </button>
            {letter && (
                <div>
                    <h2>Your Cover Letter</h2>
                    <p>{letter}</p>
                </div>
            )}
        </div>
    )
}

export default App