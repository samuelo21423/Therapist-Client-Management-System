import pool from "../server.js";

// GET all clients
export const getClients = async (req, res) => {
    try {
      const [clients] = await pool.query("SELECT * FROM therapist_clients");
      res.json(clients);
    } catch (err) {
      console.error("Error getting clients:", err);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  };
  
  // ADD new client
  export const addClient = async (req, res) => {
    const { name, email, phone, frequency } = req.body;
    if (!name || !email || !phone || !frequency) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const [result] = await pool.query(
        "INSERT INTO therapist_clients (name, email, phone, frequency) VALUES (?, ?, ?, ?)",
        [name, email, phone, frequency]
      );
      res.status(201).json({ id: result.insertId, name, email, phone, frequency });
    } catch (err) {
      console.error("Error adding client:", err);
      res.status(500).json({ error: "Failed to add client" });
    }
  };
  
  // UPDATE client
  export const updateClient = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, frequency } = req.body;
  
    try {
      await pool.query(
        "UPDATE therapist_clients SET name = ?, email = ?, phone = ?, frequency = ? WHERE id = ?",
        [name, email, phone, frequency, id]
      );
      res.status(200).json({ id, name, email, phone, frequency });
    } catch (err) {
      console.error("Error updating client:", err);
      res.status(500).json({ error: "Failed to update client" });
    }
  };
  
  // DELETE client
  export const deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM therapist_clients WHERE id = ?", [id]);
      res.status(200).json({ message: "Client deleted successfully" });
    } catch (err) {
      console.error("Error deleting client:", err);
      res.status(500).json({ error: "Failed to delete client" });
    }
  };
  