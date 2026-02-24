import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const mockWebinars = [
  { id: 1, title: "React Basics", date: "2026-2-22", description: "Intro to React", link: "https://react.dev" },
  { id: 2, title: "MongoDB Workshop", date: "2026-2-23", description: "Learn MongoDB", link: "https://www.mongodb.com" }
];

function AdminDashboard() {
  const [webinars, setWebinars] = useState([]);
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [currentWebinar, setCurrentWebinar] = useState(null);
  const navigate = useNavigate();

  // Load from localStorage
  useEffect(() => {
    const storedWebinars = localStorage.getItem("Textbooks");
    setWebinars(storedWebinars ? JSON.parse(storedWebinars) : mockWebinars);

    const storedResources = localStorage.getItem("resources");
    if (storedResources) setResources(JSON.parse(storedResources));

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") navigate("/");
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("webinars", JSON.stringify(webinars));
  }, [webinars]);

  useEffect(() => {
    localStorage.setItem("resources", JSON.stringify(resources));
  }, [resources]);

  const handleEdit = (webinar) => {
    setCurrentWebinar(webinar);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setWebinars(webinars.filter((w) => w.id !== id));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const webinar = {
      id: formMode === "add" ? Date.now() : currentWebinar.id,
      title: data.get("title"),
      date: data.get("date"),
      description: data.get("description"),
      link: data.get("link"),
    };

    if (formMode === "add") setWebinars([...webinars, webinar]);
    else setWebinars(webinars.map((w) => (w.id === webinar.id ? webinar : w)));

    setShowForm(false);
    setCurrentWebinar(null);
  };

  const handleResourceUpload = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const file = data.get("resource");
    const desc = data.get("desc");
    if (!file) return alert("Please select a file!");

    const fileURL = URL.createObjectURL(file);
    const newResource = { id: Date.now(), name: file.name, desc, fileURL };
    setResources([...resources, newResource]);
    e.target.reset();
    alert("Resource uploaded successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="admin-fullpage">
      <nav className="admin-navbar">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>

      <div className="admin-content">
        {/* Webinars */}
        <section className="webinars">
          <div className="section-header">
            <h2>Manage TextBooks</h2>
            <button
              className="add-btn"
              onClick={() => {
                setFormMode("add");
                setShowForm(true);
              }}
            >
              + Add Text Books
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Description</th>
                <th>Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {webinars.map((webinar) => (
                <tr key={webinar.id}>
                  <td>{webinar.title}</td>
                  <td>{webinar.date}</td>
                  <td>{webinar.description}</td>
                  <td>
                    {webinar.link ? (
                      <a href={webinar.link} target="_blank" rel="noreferrer" className="webinar-link">
                        View
                      </a>
                    ) : (
                      <em>No link</em>
                    )}
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(webinar)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(webinar.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showForm && (
            <div className="form-modal">
              <div className="form-box">
                <h3>{formMode === "add" ? "Add Webinar" : "Edit Webinar"}</h3>
                <form onSubmit={handleFormSubmit}>
                  <input type="text" name="title" defaultValue={currentWebinar?.title || ""} placeholder="Title" required />
                  <input type="date" name="date" defaultValue={currentWebinar?.date || ""} required />
                  <input type="text" name="description" defaultValue={currentWebinar?.description || ""} placeholder="Description" required />
                  <input type="url" name="link" defaultValue={currentWebinar?.link || ""} placeholder="Streaming Link" />
                  <div className="form-buttons">
                    <button type="submit" className="save-btn">{formMode === "add" ? "Create" : "Update"}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>

        {/* Resources */}
        <section className="resources">
          <h2>Upload Research Papers</h2>
          <form onSubmit={handleResourceUpload} className="upload-form">
            <input type="file" name="resource" required />
            <input type="text" name="desc" placeholder="Description" required />
            <button type="submit" className="upload-btn">Upload</button>
          </form>

          <div className="resource-list">
            <h3>Uploaded Files</h3>
            <ul>
              {resources.length > 0 ? (
                resources.map((res) => (
                  <li key={res.id}>
                    <strong>{res.name}</strong> — {res.desc} —{" "}
                    <a href={res.fileURL} download>Download</a>
                  </li>
                ))
              ) : (
                <p>No resources uploaded yet.</p>
              )}
            </ul>
          </div>
        </section>


        

        {/* Registered Students */}
        <section className="webinars">
          <h2>Registered Students</h2>

          <table className="data-table">
            <thead>
              <tr>
                <th>Resources</th>
                <th>Student Username</th>
                <th>Registered At</th>
              </tr>
            </thead>

            <tbody>
              {(JSON.parse(localStorage.getItem("webinarRegisteredUsers")) || []).map(
                (entry, index) => (
                  <tr key={index}>
                    <td>{entry.webinarTitle}</td>
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
