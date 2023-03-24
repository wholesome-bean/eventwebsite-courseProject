import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import styles from "../styles/Home.module.css";

export default function Home()
{
  return(
    /* adding the classname here applies the container styling to this specific div */
    <div>
      <h1 className={styles.title}>Homepage</h1>
      <p className={styles.text}>pppppppp</p>
      <p className={styles.text}>pppppppp</p>
    </div>
  )
}
