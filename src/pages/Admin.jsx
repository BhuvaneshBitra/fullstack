import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

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

function AdminDashboard() {
  const [materials, setMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [formDefaultType, setFormDefaultType] = useState("Educational Resource");
  const [viewedFeedback, setViewedFeedback] = useState(null);
  const navigate = useNavigate();

  // Load from localStorage
  useEffect(() => {
    const storedMaterials = localStorage.getItem("materials");
    // Migrate old textbooks/resources if needed or just use current storage
    if (storedMaterials) {
      const parsed = JSON.parse(storedMaterials);
      const missingMocks = mockMaterials.filter(mock => !parsed.some(p => p.id === mock.id));
      setMaterials([...parsed, ...missingMocks]);
    } else {
      setMaterials(mockMaterials);
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") navigate("/");
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("materials", JSON.stringify(materials));
  }, [materials]);

  const handleEdit = (material) => {
    setCurrentMaterial(material);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const file = data.get("file");
    const link = data.get("link");

    let fileData = link;
    let fileName = "";

    if (file && file.size > 0) {
      const getBase64 = (f) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
      try {
        fileData = await getBase64(file);
        fileName = file.name;
      } catch (err) {
        console.error("Error reading file", err);
        alert("Failed to read file.");
        return;
      }
    }

    const material = {
      id: formMode === "add" ? Date.now() : currentMaterial.id,
      title: data.get("title"),
      type: data.get("type"),
      description: data.get("description"),
      link: fileData,
      fileName: fileName,
      feedbacks: formMode === "add" ? [] : currentMaterial.feedbacks || [],
    };

    if (formMode === "add") setMaterials([...materials, material]);
    else setMaterials(materials.map((m) => (m.id === material.id ? material : m)));

    setShowForm(false);
    setCurrentMaterial(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const viewFeedback = (material) => {
    setViewedFeedback(material);
  };

  return (
    <div className="admin-fullpage">
      <nav className="admin-navbar">
        <h1>
          {/* Colorful Shield/Admin Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="45" height="45">
            <defs>
              <linearGradient id="adminGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <path d="M32 6L10 14v16c0 14.2 9.4 27.2 22 32 12.6-4.8 22-17.8 22-32V14L32 6z" fill="url(#adminGrad)" opacity="0.8" />
            <path d="M32 12v38c-8.8-4-15-13.8-15-24V18.2L32 12z" fill="#fff" opacity="0.4" />
            <circle cx="32" cy="26" r="6" fill="#fff" />
            <path d="M42 42c0-5.5-4.5-10-10-10s-10 4.5-10 10v2h20v-2z" fill="#fff" />
          </svg>
          Admin Dashboard
        </h1>
        <button onClick={handleLogout} className="logout-btn">Sign Out</button>
      </nav>

      <div className="admin-content">
        {['Educational Resource', 'Textbook', 'Study Guide', 'Research Paper'].map(category => {
          const categoryMaterials = materials.filter(m => (m.type || 'Educational Resource') === category);
          return (
            <section className="webinars" key={category}>
              <div className="section-header">
                <h2>Manage {category === 'Educational Resource' ? 'Educational Resources' : category + 's'}</h2>
                <button
                  className="add-btn"
                  onClick={() => {
                    setFormMode("add");
                    setFormDefaultType(category);
                    setShowForm(true);
                  }}
                >
                  + Add {category}
                </button>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Link / File</th>
                    <th>Feedback</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryMaterials.map((material) => (
                    <tr key={material.id}>
                      <td>{material.title}</td>
                      <td><span className={`badge badge-${material.type?.replace(/\s+/g, '-').toLowerCase()}`}>{material.type || 'Educational Resource'}</span></td>
                      <td>{material.description}</td>
                      <td>
                        {material.link ? (
                          material.link.startsWith("data:") ? (
                            <a href={material.link} className="webinar-link" download={material.fileName || "download"}>
                              Download File
                            </a>
                          ) : (
                            <a href={material.link} target="_blank" rel="noreferrer" className="webinar-link">
                              Open Link
                            </a>
                          )
                        ) : (
                          <em>No link</em>
                        )}
                      </td>
                      <td>
                        <button className="feedback-view-btn" onClick={() => viewFeedback(material)}>
                          View ({material.feedbacks?.length || 0})
                        </button>
                      </td>
                      <td className="actions-cell">
                        <button className="edit-btn" onClick={() => handleEdit(material)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(material.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {categoryMaterials.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>No {category.toLowerCase()}s found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          );
        })}

        {showForm && (
          <div className="form-modal">
            <div className="form-box">
              <h3>{formMode === "add" ? "Add Resource" : "Edit Resource"}</h3>
              <form onSubmit={handleFormSubmit}>
                <input type="text" name="title" defaultValue={currentMaterial?.title || ""} placeholder="Resource Title" required />

                <select name="type" defaultValue={currentMaterial?.type || formDefaultType} required>
                  <option value="Educational Resource">Educational Resource</option>
                  <option value="Textbook">Textbook</option>
                  <option value="Research Paper">Research Paper</option>
                  <option value="Study Guide">Study Guide</option>
                </select>

                <input type="text" name="description" defaultValue={currentMaterial?.description || ""} placeholder="Description" required />

                <div className="file-or-link">
                  <p>Provide a URL OR Upload a File (Research Papers)</p>
                  <input type="url" name="link" defaultValue={currentMaterial?.link || ""} placeholder="https://..." />
                  <input type="file" name="file" accept=".pdf,.doc,.docx" />
                </div>

                <div className="form-buttons">
                  <button type="submit" className="save-btn">{formMode === "add" ? "Save" : "Update"}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {viewedFeedback && (
          <div className="form-modal">
            <div className="form-box feedback-box">
              <h3>Feedback for: {viewedFeedback.title}</h3>
              <div className="feedback-list">
                {viewedFeedback.feedbacks && viewedFeedback.feedbacks.length > 0 ? (
                  viewedFeedback.feedbacks.map((fb, idx) => (
                    <div key={idx} className="feedback-item">
                      <p><strong>{fb.username || "Anonymous"}:</strong> {fb.text}</p>
                      <small>{fb.date}</small>
                    </div>
                  ))
                ) : (
                  <p>No feedback provided yet.</p>
                )}
              </div>
              <button type="button" onClick={() => setViewedFeedback(null)} className="cancel-btn">Close</button>
            </div>
          </div>
        )}

        {/* Registered/Downloaded Students */}
        <section className="webinars">
          <h2>Student Access Logs</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Student Username</th>
                <th>Accessed At</th>
              </tr>
            </thead>
            <tbody>
              {(JSON.parse(localStorage.getItem("materialAccessLogs")) || []).map(
                (entry, index) => (
                  <tr key={index}>
                    <td>{entry.materialTitle}</td>
                    <td>{entry.username}</td>
                    <td>{entry.time}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </section>

      </div>
    </div>
  );
}

export default AdminDashboard;
