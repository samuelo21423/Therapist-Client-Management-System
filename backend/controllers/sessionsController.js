import pool from "../server.js";

// GET all sessions with therapist and client names
export const getSessions = async (req, res) => {
    try {
      const [sessions] = await pool.query(`
        SELECT 
          ts.id, 
          ts.therapist_id, 
          t.name AS therapist_name,  -- Alias therapist's name
          ts.client_id, 
          c.name AS client_name,     -- Alias client's name
          ts.date, 
          ts.length, 
          ts.notes
        FROM 
          therapist_sessions ts
        JOIN 
          therapist_therapists t ON ts.therapist_id = t.id  -- Join with therapist_therapists
        JOIN 
          therapist_clients c ON ts.client_id = c.id  -- Join with therapist_clients
      `);          
      console.log(sessions); // Log sessions to verify data
      res.json(sessions);
    } catch (err) {
      console.error("Error getting sessions:", err);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  };
  

  

// ADD new session
export const addSession = async (req, res) => {
  const { therapist_id, client_id, date, length, notes } = req.body;
  if (!therapist_id || !client_id || !date || !length) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO therapist_sessions (therapist_id, client_id, date, length, notes) VALUES (?, ?, ?, ?, ?)", // Ensure correct table name here as well
      [therapist_id, client_id, date, length, notes]
    );
    res.status(201).json({ id: result.insertId, therapist_id, client_id, date, length, notes });
  } catch (err) {
    console.error("Error adding session:", err);
    res.status(500).json({ error: "Failed to add session" });
  }
};

// UPDATE session
export const updateSession = async (req, res) => {
  const { id } = req.params;
  const { therapist_id, client_id, date, length, notes } = req.body;

  try {
    await pool.query(
      "UPDATE therapist_sessions SET therapist_id = ?, client_id = ?, date = ?, length = ?, notes = ? WHERE id = ?", // Correct table name
      [therapist_id, client_id, date, length, notes, id]
    );
    res.status(200).json({ id, therapist_id, client_id, date, length, notes });
  } catch (err) {
    console.error("Error updating session:", err);
    res.status(500).json({ error: "Failed to update session" });
  }
};

// DELETE session
export const deleteSession = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM therapist_sessions WHERE id = ?", [id]); // Correct table name here too
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (err) {
    console.error("Error deleting session:", err);
    res.status(500).json({ error: "Failed to delete session" });
  }
};
