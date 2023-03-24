import Link from 'next/link';
import styles from '../../styles/Users.module.css'

/* runs on build time not run time */
export const getStaticProps = async () => {

  const res = await fetch('https://jsonplaceholder.typicode.com/users');

  /* makes an array of users from the fetched data */
  const data = await res.json();

  /* returns an object array containing the data */
  return {
    props: {users: data }
  }
}

const Users = ({users}) => {
  return(
    <div>
      <h1>Users</h1>
      {users.map(user => (
        <Link href= {'/users/' + user.id} key = {user.id}> 
          <h3 className={styles.single}>{user.name}</h3>
        </Link>
      ))}
    </div>
  );
}

export default Users;

/*
export default function Users()
{
  return(
    <div>
      <h1>Users</h1>
      <p>pppppppp</p>
      <p>pppppppp</p>
    </div>
  )
}
*/