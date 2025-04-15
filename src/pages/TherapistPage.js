import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';

// Sample data before connecting to backend database
function TherapistPage() {
  const [therapists, setTherapists] = useState([]);
  const [newTherapist, setNewTherapist] = useState({
    id: null, 
    title: "",
    name: "",
    email: "",
    location: "",
    experience: "",
    availability: "TAKING CLIENTS",
  });

  // Fetch all therapists from the backend
  const fetchTherapists = async () => {
    try {
      const response = await axios.get("http://localhost:5000/therapists");
      setTherapists(response.data);  // Update the state with the fetched therapists
    } catch (error) {
      console.error("Error fetching therapists:", error);
    }
  };

  // Fetch therapists when component mounts
  useEffect(() => {
    fetchTherapists();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewTherapist({ ...newTherapist, [e.target.name]: e.target.value });
  };

  // Add or edit a therapist
  const addOrEditTherapist = async () => {
    if (!newTherapist.name || !newTherapist.email || !newTherapist.location || !newTherapist.experience || !newTherapist.title) {
      alert("Please fill all fields.");
      return;
    }
  
    try {
      if (newTherapist.id === null) {
        // POST request to add new therapist
        const res = await axios.post("http://localhost:5000/therapists", newTherapist);
        setTherapists([...therapists, { ...newTherapist, id: res.data.id }]);
      } else {
        // PUT request to update existing therapist
        const res = await axios.put(`http://localhost:5000/therapists/${newTherapist.id}`, newTherapist);
        setTherapists(prev =>
          prev.map(t => (t.id === newTherapist.id ? res.data : t))
        );
      }
  
      setNewTherapist({ id: null, title: "", name: "", email: "", location: "", experience: "", availability: "TAKING CLIENTS" });
    } catch (error) {
      console.error("Error adding/updating therapist:", error);
      alert("Failed to add or update therapist.");
    }
  };
  
  // Delete a therapist
  const deleteTherapist = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/therapists/${id}`);
      fetchTherapists();  // Fetch updated list after deletion
    } catch (error) {
      console.error("Error deleting therapist:", error);
      alert("Failed to delete therapist.");
    }
  };

  // Edit therapist
  const editTherapist = (id) => {
    const therapistToEdit = therapists.find((therapist) => therapist.id === id);
    setNewTherapist(therapistToEdit);  // Populate the form with the selected therapist's details
  };  

  return (
    <div>
      <h2>Therapist Page</h2>

      {/* Therapist Table - Displays all therapists */}
      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Name</th>
            <th>Email</th>
            <th>Location</th>
            <th>Experience</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {therapists.map((therapist) => (
            <tr key={therapist.id}>
              <td>{therapist.title}</td>
              <td>{therapist.name}</td>
              <td>{therapist.email}</td>
              <td>{therapist.location}</td>
              <td>{therapist.experience}</td>
              <td>{therapist.availability}</td>
              <td>
                {/* Edit and Delete Buttons */}
                <button onClick={() => editTherapist(therapist.id)}>Edit</button>
                <button onClick={() => deleteTherapist(therapist.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form to Add/Edit Therapist */}
      <h3>{newTherapist.id ? "Edit Therapist" : "Add a New Therapist"}</h3>

      <input
        type="text"
        name="title"
        placeholder="Title (e.g. Dr., Mr., Ms.)"
        value={newTherapist.title}
        onChange={handleInputChange}
      />

      <input 
        type="text" 
        name="name" 
        placeholder="Name" 
        value={newTherapist.name} 
        onChange={handleInputChange} 
      />
      <input 
        type="email" 
        name="email" 
        placeholder="Email" 
        value={newTherapist.email} 
        onChange={handleInputChange} 
      />
      <input 
        type="text" 
        name="location" 
        placeholder="Location" 
        value={newTherapist.location} 
        onChange={handleInputChange} 
      />
      <input 
        type="number" 
        name="experience" 
        placeholder="Experience (Years)" 
        value={newTherapist.experience} 
        onChange={handleInputChange} 
      />
      
      {/* Dropdown for Availability */}
      <select name="availability" value={newTherapist.availability} onChange={handleInputChange}>
        <option value="TAKING CLIENTS">Taking Clients</option>
        <option value="NOT TAKING CLIENTS">Not Taking Clients</option>
      </select>

      {/* Add or Update Button */}
      <button onClick={addOrEditTherapist}>{newTherapist.id ? "Save Changes" : "Add Therapist"}</button>
    </div>
  );
}

export default TherapistPage;
