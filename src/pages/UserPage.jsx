import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserPage.css";

const mockMaterials = [
  { id: 1, title: "React Basics", type: "Textbook", description: "Intro to React", link: "https://react.dev", feedbacks: ["Great start!"] },
  { id: 2, title: "MongoDB Workshop", type: "Study Guide", description: "Learn MongoDB", link: "https://www.mongodb.com", feedbacks: [] },
  { id: 3, title: "A Cyber Bridge Experiment", type: "Research Paper", description: "Journal of The Colloquium for Information Systems Security Education", link: "https://cisse.info/journal/index.php/cisse/article/view/192/192", feedbacks: [] },
  { id: 4, title: "Java Programming Notes", type: "Educational Resource", description: "Introduction to Computing with Java", link: "https://www.iitk.ac.in/esc101/share/downloads/javanotes5.pdf", feedbacks: [] },
  { id: 5, title: "Full Stack Web Development", type: "Textbook", description: "Comprehensive Guide to Full Stack Web Development", link: "https://cdn.chools.in/DIG_LIB/E-Book/Full-stack-web-development.pdf", feedbacks: [] },
  { id: 6, title: "Cloud Computing Digital Notes", type: "Study Guide", description: "Malla Reddy College of Engineering & Technology Digital Notes", link: "https://mrcet.com/downloads/digital_notes/IT/CLOUD%20COMPUTING%20DIGITAL%20NOTES%20(R18A0523).pdf", feedbacks: [] },
  { id: 7, title: "Data Structures Digital Notes", type: "Educational Resource", description: "Malla Reddy College of Engineering & Technology Digital Notes for Data Structures", link: "https://mrcet.com/downloads/digital_notes/CSE/II%20Year/DATA%20STRUCTURES%20DIGITAL%20NOTES.pdf", feedbacks: [] },
  { id: 8, title: "Design and Analysis of Algorithms Reconsidered", type: "Research Paper", description: "ResearchGate Publication", link: "https://www.researchgate.net/publication/221538468_Design_and_analysis_of_algorithms_reconsidered", feedbacks: [] },
  { id: 9, title: "Probability and Statistics", type: "Research Paper", description: "MCA Semester II Study Material - Mumbai University", link: "https://archive.mu.ac.in/myweb_test/MCA%20study%20material/M.C.A.%20(Sem%20-%20II)%20Probability%20and%20Statistics.pdf", feedbacks: [] }
];

export default function UserPage() {
  const [materials, setMaterials] = useState([]);
  const [accessed, setAccessed] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const navigate = useNavigate();

  // Load all data
  useEffect(() => {
    const storedMaterials = localStorage.getItem("materials");
    if (storedMaterials) {
      const parsed = JSON.parse(storedMaterials);
      const missingMocks = mockMaterials.filter(mock => !parsed.some(p => p.id === mock.id));
      const combined = [...parsed, ...missingMocks];
      setMaterials(combined);
      localStorage.setItem("materials", JSON.stringify(combined));
    } else {
      setMaterials(mockMaterials);
      localStorage.setItem("materials", JSON.stringify(mockMaterials));
    }

    const storedAccess = localStorage.getItem("materialAccessLogs");
    if (storedAccess) {
      const logs = JSON.parse(storedAccess);
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        // Find IDs of materials this user has accessed
        const userLogs = logs.filter(l => l.username === currentUser.username);
        setAccessed(userLogs.map(l => l.materialId));
      }
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) navigate("/");
  }, [navigate]);

  // Handle Access / Download
  const handleAccess = (material) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    // Log the access for Admin
    const allAccessLogs = JSON.parse(localStorage.getItem("materialAccessLogs")) || [];

    // Only log if not already logged today (simple duplicate check)
    const alreadyLogged = allAccessLogs.some(
      l => l.materialId === material.id && l.username === currentUser.username
    );

    if (!alreadyLogged) {
      allAccessLogs.push({
        materialId: material.id,
        materialTitle: material.title,
        username: currentUser.username,
        time: new Date().toLocaleString(),
      });
      localStorage.setItem("materialAccessLogs", JSON.stringify(allAccessLogs));
      setAccessed([...accessed, material.id]);
    }

    // Open the material
    if (material.link) {
      if (material.link.startsWith("data:")) {
        const a = document.createElement("a");
        a.href = material.link;
        a.download = material.fileName || "downloaded-material";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        window.open(material.link, "_blank", "noopener,noreferrer");
      }
    }
  };

  // Handle Feedback Submission
  const submitFeedback = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const updatedMaterials = materials.map(m => {
      if (m.id === feedbackModal.id) {
        const newFeedback = {
          username: currentUser?.username || "Student",
          text: feedbackText,
          date: new Date().toLocaleDateString()
        };
        return { ...m, feedbacks: [...(m.feedbacks || []), newFeedback] };
      }
      return m;
    });

    setMaterials(updatedMaterials);
    localStorage.setItem("materials", JSON.stringify(updatedMaterials));
    setFeedbackModal(null);
    setFeedbackText("");
    alert("Thank you for your feedback!");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  // Filter based on search query
  const filteredMaterials = materials.filter(m =>
    m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user-page">
      <div className="header">
        <h1>
          {/* Colorful Book Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="45" height="45">
            <defs>
              <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <path d="M16 12C12 12 8 14 8 18L8 54C8 56.2 9.8 58 12 58L28 58C30.2 58 32 56.2 32 54L32 18C32 14 28 12 24 12L16 12Z" fill="url(#bookGrad)" opacity="0.8" />
            <path d="M48 12C52 12 56 14 56 18L56 54C56 56.2 54.2 58 52 58L36 58C33.8 58 32 56.2 32 54L32 18C32 14 36 12 40 12L48 12Z" fill="url(#bookGrad)" opacity="0.6" />
            <path d="M32 14v42" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 24h8M16 32h8M16 40h8M40 24h8M40 32h8M40 40h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          </svg>
          Digital Library
        </h1>
        <div className="header-actions">
          <input
            type="text"
            className="search-input"
            placeholder="Search resources, topics, types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-logout" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ display: 'none' }}><h2>Library Catalog</h2></div>
      {['Educational Resource', 'Textbook', 'Study Guide', 'Research Paper'].map(category => {
        const catMaterials = filteredMaterials.filter(m => (m.type || 'Educational Resource') === category);

        return (
          <div key={category} className="category-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginTop: '0' }}>{category === 'Educational Resource' ? 'Educational Resources' : category + 's'}</h2>

            {catMaterials.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                {materials.length === 0 ? "The library is currently empty." : `No ${category.toLowerCase()}s found.`}
              </p>
            ) : (
              <div className="webinar-list material-list">
                {catMaterials.map((material) => (
                  <div className="webinar-card material-card" key={material.id}>
                    <div className="card-header">
                      <h3>{material.title}</h3>
                      <span className={`badge badge-${material.type?.replace(/\s+/g, '-').toLowerCase()}`}>
                        {material.type || 'Educational Resource'}
                      </span>
                    </div>

                    <p className="desc">{material.description}</p>

                    <div className="card-actions">
                      <button
                        className="btn btn-register btn-access"
                        onClick={() => handleAccess(material)}
                        disabled={!material.link}
                      >
                        {material.link && material.link.startsWith("data:") ? "Download File" : "Access Material"}
                      </button>

                      <button
                        className="btn btn-feedback"
                        onClick={() => setFeedbackModal(material)}
                      >
                        Provide Feedback
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Provide Feedback for: {feedbackModal.title}</h3>
            <form onSubmit={submitFeedback}>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="What did you think of this material? Was it helpful?"
                required
                rows="4"
              />
              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-secondary" onClick={() => { setFeedbackModal(null); setFeedbackText(""); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
