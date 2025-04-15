import pool from "../server.js";

// Get all therapists
export const getTherapists = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM therapist_therapists");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching therapists:", error);
    res.status(500).json({ error: "Failed to fetch therapists" });
  }
};

// Add a new therapist
export const addTherapist = async (req, res) => {
  const { title, name, email, location, experience, availability } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO therapist_therapists (title, name, email, location, experience, availability)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, name, email, location, experience, availability]
    );
    res.status(201).json({ id: result.insertId, message: "Therapist added successfully" });
  } catch (error) {
    console.error("Error adding therapist:", error);
    res.status(500).json({ error: "Failed to add therapist" });
  }
};

// Delete a therapist by ID
export const deleteTherapist = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM therapist_therapists WHERE id = ?", [id]);
    res.json({ message: "Therapist deleted successfully" });
  } catch (error) {
    console.error("Error deleting therapist:", error);
    res.status(500).json({ error: "Failed to delete therapist" });
  }
};

// Update an existing therapist by I
export const updateTherapist = async (req, res) => {
  const { id } = req.params;
  const { title, name, email, location, experience, availability } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE therapist_therapists
       SET title = ?, name = ?, email = ?, location = ?, experience = ?, availability = ?
       WHERE id = ?`,
      [title, name, email, location, experience, availability, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Therapist not found" });
    }

    // Fetch updated therapist
    const [updatedTherapistRows] = await pool.query(
      "SELECT * FROM therapist_therapists WHERE id = ?",
      [id]
    );

    res.json(updatedTherapistRows[0]); // Send the updated therapist back
  } catch (error) {
    console.error("Error updating therapist:", error);
    res.status(500).json({ error: "Failed to update therapist" });
  }
};
