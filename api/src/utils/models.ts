
export class DataModel extends Model {
  static tableName = 'your_table';

  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vector: {
      type: DataTypes.JSONB, // Assuming vector embeddings are stored as JSONB
      allowNull: false,
    },
  };
}
