import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';

function SessionPage() {
  const [sessions, setSessions] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [clients, setClients] = useState([]);

  const [newSession, setNewSession] = useState({
    id: null,
    therapist_id: "",
    client_id: "",
    date: "",
    length: "",
    notes: "",
  });

  const API_URL = "http://localhost:5000/sessions";

  useEffect(() => {
    fetchSessions();
    fetchTherapists();
    fetchClients();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.get(API_URL);
      setSessions(res.data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  const fetchTherapists = async () => {
    try {
      const res = await axios.get("http://localhost:5000/therapists");
      setTherapists(res.data);
    } catch (err) {
      console.error("Error fetching therapists:", err);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/clients");
      setClients(res.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  // Format date & time in Irish local timezone
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    
    // Format the date in the 'DD MMM YYYY' format (e.g., 06 Apr 2025)
    const formattedDate = date.toLocaleDateString("en-IE", {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    
    // Format the time in 'HH:mm' format (e.g., 16:00)
    const formattedTime = date.toLocaleTimeString("en-IE", {
      hour: '2-digit',
      minute: '2-digit',
    });
    
    return { formattedDate: `${formattedDate},`, formattedTime };
  };
  

  // Convert ISO to input-friendly local datetime (for datetime-local)
  const toDateTimeLocal = (isoDateStr) => {
    const date = new Date(isoDateStr);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const handleInputChange = (e) => {
    setNewSession({ ...newSession, [e.target.name]: e.target.value });
  };

  const addOrEditSession = async () => {
    if (!newSession.therapist_id || !newSession.client_id || !newSession.date || !newSession.length) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      if (newSession.id === null) {
        const res = await axios.post(API_URL, newSession);
        setSessions([...sessions, res.data]);
      } else {
        await axios.put(`${API_URL}/${newSession.id}`, newSession);
        setSessions(sessions.map((session) =>
          session.id === newSession.id ? newSession : session
        ));
      }

      fetchSessions();

      setNewSession({
        id: null,
        therapist_id: "",
        client_id: "",
        date: "",
        length: "",
        notes: "",
      });
    } catch (err) {
      console.error("Error saving session:", err);
    }
  };

  const deleteSession = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSessions(sessions.filter((session) => session.id !== id));
    } catch (err) {
      console.error("Error deleting session:", err);
    }
  };

  const editSession = (id) => {
    const sessionToEdit = sessions.find((session) => session.id === id);
    const formattedDate = toDateTimeLocal(sessionToEdit.date);

    setNewSession({
      ...sessionToEdit,
      date: formattedDate,
    });
  };

  return (
    <div>
      <h2>Sessions List</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Therapist</th>
            <th>Client</th>
            <th>Date & Time</th>
            <th>Length</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => {
            const { formattedDate, formattedTime } = formatDateTime(session.date);
            return (
              <tr key={session.id}>
                <td>{session.therapist_name}</td>
                <td>{session.client_name}</td>
                <td>{formattedDate} {formattedTime}</td>
                <td>{session.length} mins</td>
                <td>{session.notes}</td>
                <td>
                  <button onClick={() => editSession(session.id)}>Edit</button>
                  <button onClick={() => deleteSession(session.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3>{newSession.id ? "Edit Session" : "Add a New Session"}</h3>

      <select
        name="therapist_id"
        value={newSession.therapist_id}
        onChange={handleInputChange}
      >
        <option value="">Select Therapist</option>
        {therapists.map((therapist) => (
          <option key={therapist.id} value={therapist.id}>
            {therapist.name}
          </option>
        ))}
      </select>

      <select
        name="client_id"
        value={newSession.client_id}
        onChange={handleInputChange}
      >
        <option value="">Select Client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>

      <input
        type="datetime-local"
        name="date"
        value={newSession.date}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="length"
        placeholder="Session Length (mins)"
        value={newSession.length}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="notes"
        placeholder="Notes"
        value={newSession.notes}
        onChange={handleInputChange}
      />

      <button onClick={addOrEditSession}>
        {newSession.id ? "Save Changes" : "Add Session"}
      </button>
    </div>
  );
}

export default SessionPage;
