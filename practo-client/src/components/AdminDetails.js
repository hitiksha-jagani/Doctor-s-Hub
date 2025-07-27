import React, { useEffect, useState } from "react";
import { API } from "../api/api";
import "../styles/AdminDetails.css";
import { useNavigate } from "react-router-dom";

const AdminDetails = () => {
  const [admins, setAdmins] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedAdmin, setEditedAdmin] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const res = await API.get("/admin/admin-list", { withCredentials: true });
    setAdmins(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      await API.delete(`/admin/${id}`, { withCredentials: true });
      fetchAdmins();
    }
  };

  const handleEdit = (admin) => {
    setEditId(admin.id);
    setEditedAdmin({ ...admin });
  };

  const handleSave = async () => {
    await API.put(`/admin/${editId}`, editedAdmin, { withCredentials: true });
    setEditId(null);
    fetchAdmins();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAdmin({ ...editedAdmin, [name]: value });
  };

  return (
    <div className="admin-list-container">
      <h2>Admin List</h2>
      <div className="admin-grid">
        {admins.map((admin) => (
          <div className="admin-card" key={admin.id}>
            {editId === admin.id ? (
              <>
                <input name="firstName" value={editedAdmin.firstName} onChange={handleChange} />
                <input name="lastName" value={editedAdmin.lastName} onChange={handleChange} />
                <input name="email" readOnly disabled value={editedAdmin.email} onChange={handleChange} />
                <input name="phone"  value={editedAdmin.phone} onChange={handleChange} />
                <select name="gender" value={editedAdmin.gender} onChange={handleChange}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                <div className="actions">
                  <button onClick={handleSave}>Save</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p><strong>First Name:</strong> {admin.firstName} </p>
                <p><strong>Last Name:</strong> {admin.lastName}</p>
                <p><strong>Email:</strong> {admin.email}</p>
                <p><strong>Phone:</strong> {admin.phone}</p>
                <p><strong>Gender:</strong> {admin.gender}</p>
                <div className="actions">
                  <button onClick={() => handleEdit(admin)}>Edit</button>
                  <button onClick={() => handleDelete(admin.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDetails;
