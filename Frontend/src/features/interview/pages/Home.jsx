import React from "react";
import "../styles/home.scss";
import { useState ,useRef} from "react";
import { useNavigate } from "react-router";
import { useInterview} from "../hooks/useInterview";
import {useAuth} from "../../auth/hooks/useAuth"

const Home = () => {
    const {handleLogout} = useAuth()
    const { loading, generateReport ,reports} = useInterview()
    const navigate = useNavigate()
    const [jobDescription,setJobDescription] = useState("")
    const [selfDescription, setSelfDescription ] = useState("");
    const resumeInputref = useRef()

    const handleGenerateReport = (async()=>{
        const data = await generateReport({resume:resumeInputref.current.files[0],jobDescription,selfDescription})
        navigate(`/interview/${data._id}`)
    })

    const [pdfPreview, setPdfPreview] = useState(null);

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type === "application/pdf") {
        // Create a temporary URL for the selected file
        const previewUrl = URL.createObjectURL(file);
        setPdfPreview(previewUrl);
      }
    };

    const Logout = (async()=>{
       await handleLogout()
    })
        if(loading){
            return (
              <main className="loading-screen">
                <h1>Loading</h1>
              </main>
            );
        }

  return (
    <div className="home-page">
      <header className="page-header">
        <h1>
          Create Your Custom <span className="highlight">Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy.
        </p>
      </header>

      <div className="interview-card">
        <div className="interview-card__body">
          <div className="panel panel--left">
            <div className="panel__header">
              <span className="panel__icon">💼</span>
              <h2>Target Job Description</h2>
              <span className="badge badge--required">Required</span>
            </div>

            <textarea
              onChange={(e) => {
                setJobDescription(e.target.value);
              }}
              className="panel__textarea"
              placeholder="Paste the full job description here..."
              maxLength={5000}
            />

            <div className="char-counter">
              {jobDescription.length} / 5000 chars
            </div>
          </div>

          <div className="panel-divider" />

          <div className="panel panel--right">
            <div className="panel__header">
              <span className="panel__icon">👤</span>
              <h2>Your Profile</h2>
            </div>

            <div className="upload-section">
              <label className="section-label">
                Upload Resume
                <span className="badge badge--best">Best Results</span>
              </label>

              <label className="dropzone" htmlFor="resume">
                {pdfPreview ? (
                  <div className="pdf-preview-container">
                    {/* This renders the actual PDF as an image/object */}
                    <embed
                      src={pdfPreview}
                      type="application/pdf"
                      className="pdf-thumbnail"
                    />
                    <div className="pdf-overlay">
                      <span>Change File</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="dropzone__icon">☁️</span>
                    <p className="dropzone__title">
                      Click to upload or drag &amp; drop
                    </p>
                    <p className="dropzone__subtitle">PDF or DOCX (Max 5MB)</p>
                  </>
                )}

                <input
                  ref={resumeInputref}
                  hidden
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="or-divider">
              <span>OR</span>
            </div>

            <div className="self-description">
              <label className="section-label" htmlFor="selfDescription">
                Quick Self-Description
              </label>

              <textarea
                onChange={(e) => {
                  setSelfDescription(e.target.value);
                }}
                id="selfDescription"
                name="selfDescription"
                className="panel__textarea panel__textarea--short"
                placeholder="Briefly describe your experience, key skills, and years of experience..."
              />
            </div>

            <div className="info-box">
              <span className="info-box__icon">i</span>
              <p>
                Either a <strong>Resume</strong> or a{" "}
                <strong>Self Description</strong> is required to generate a
                personalized plan.
              </p>
            </div>
          </div>
        </div>

        <div className="interview-card__footer">
          <span className="footer-info">
            AI-Powered Strategy Generation &bull; Approx 30s
          </span>

          <button onClick={handleGenerateReport} className="generate-btn">
            Generate My Interview Strategy
          </button>
        </div>
      </div>

      <section className="recent-reports">
        <h2>My Recent Interview Plans</h2>

        <ul className="reports-list">
          {reports.map((report) => (
            <li
              key={report._id}
              className="report-item"
              onClick={() => navigate(`/interview/${report._id}`)}
            >
              <h3>{report.title || "Untitled"}</h3>
              <p className="report-meta">
                Generated on {new Date(report.createdAt).toLocaleDateString()}
              </p>
              <p
                className={`match-score ${report.matchScore >= 80 ? "score--high" : report.matchScore >= 60 ? "score--mid" : "score--low"}`}
              >
                Match Score: {report.matchScore}%
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="logout-section">
        <button className="logout-btn" onClick={Logout}>
          Logout
        </button>
      </div>

      <footer className="page-footer">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Help Center</a>
      </footer>
    </div>
  );
};

export default Home;
