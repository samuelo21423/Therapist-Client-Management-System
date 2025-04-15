import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';

function ClientPage() {
  // State for clients list
  const [clients, setClients] = useState([]);

  // State for new client or editing an existing one
  const [newClient, setNewClient] = useState({
    id: null, 
    name: "",
    email: "",
    phone: "",
    frequency: "WEEKLY",
  });

  const API_URL = "http://localhost:5000/clients"; // your backend base route

  // Fetch clients from backend on page load
  useEffect(() => {
    fetchClients();
  }, []);

  // Fetch all clients
  const fetchClients = async () => {
    try {
      const res = await axios.get(API_URL);
      setClients(res.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  // Add or edit client
  const addOrEditClient = async () => {
    if (!newClient.name || !newClient.email || !newClient.phone) {
      alert("Please fill all fields.");
      return;
    }

    try {
      if (newClient.id === null) {
        // Add new client
        const res = await axios.post(API_URL, newClient);
        setClients([...clients, res.data]);
      } else {
        // Update existing client
        await axios.put(`${API_URL}/${newClient.id}`, newClient);
        setClients(clients.map((client) => 
          client.id === newClient.id ? newClient : client
        ));
      }

      // Reset form
      setNewClient({ id: null, name: "", email: "", phone: "", frequency: "WEEKLY" });

    } catch (err) {
      console.error("Error saving client:", err);
    }
  };

  // Delete client
  const deleteClient = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setClients(clients.filter((client) => client.id !== id));
    } catch (err) {
      console.error("Error deleting client:", err);
    }
  };

  // Edit client
  const editClient = (id) => {
    const clientToEdit = clients.find((client) => client.id === id);
    setNewClient(clientToEdit);
  };

  return (
    <div>
      <h2>Clients List</h2>

      {/* Clients Table */}
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Appointment Frequency</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              <td>{client.frequency}</td>
              <td>
                <button onClick={() => editClient(client.id)}>Edit</button>
                <button onClick={() => deleteClient(client.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form to Add/Edit Client */}
      <h3>{newClient.id ? "Edit Client" : "Add a New Client"}</h3>

      <input 
        type="text" 
        name="name" 
        placeholder="Name" 
        value={newClient.name} 
        onChange={handleInputChange} 
      />
      <input 
        type="email" 
        name="email" 
        placeholder="Email" 
        value={newClient.email} 
        onChange={handleInputChange} 
      />
      <input 
        type="text" 
        name="phone" 
        placeholder="Phone" 
        value={newClient.phone} 
        onChange={handleInputChange} 
      />

      {/* Dropdown for Appointment Frequency */}
      <select name="frequency" value={newClient.frequency} onChange={handleInputChange}>
        <option value="WEEKLY">WEEKLY</option>
        <option value="MONTHLY">MONTHLY</option>
      </select>

      {/* Add or Update Button */}
      <button onClick={addOrEditClient}>{newClient.id ? "Save Changes" : "Add Client"}</button>
    </div>
  );
}

export default ClientPage;
