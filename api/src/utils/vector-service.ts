import { DataModel } from './models';
import pool from './db';

export async function addVectorEmbedding(name: string, vector: number[]) {
  const client = await pool.connect();
  try {
    const query = `INSERT INTO ${DataModel.tableName} (name, vector) VALUES ($1, $2) RETURNING *`;
    const values = [name, JSON.stringify(vector)];
    const res = await client.query(query, values);
    return res.rows[0];
  } finally {
    client.release();
  }
}
