import { GetServerSideProps } from 'next';
import { createPool, Pool, PoolConnection } from 'mysql2/promise';

interface Admin {
  id: number;
  name: string;
  email: string;
  universityName: string;
  created: string;
}

interface Props {
  admins: Admin[];
}

export default function MyPage(props: Props) {
  return (
    <div>
      {props.admins.map((admin) => (
        <div key={admin.id}>
          <h2>{admin.name}</h2>
          <p>{admin.email}</p>
          <p>Affiliated University: {admin.universityName}</p>
          <p>Created: {admin.created}</p>
        </div>
      ))}
    </div>
  );
}

const pool: Pool = createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'eventwebsite',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const connection: PoolConnection = await pool.getConnection();

  try {
    const [rows] = await connection.query<Admin[]>(
      'SELECT sa.id, sa.name, sa.email, sa.created_at as created, u.name as universityName FROM super_admins sa JOIN universities u ON sa.university_id = u.id'
    );
    const admins: Admin[] = rows.map((row) => ({
      ...row,
      created: row.created.toISOString(),
    }));
    return { props: { admins } };
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};
