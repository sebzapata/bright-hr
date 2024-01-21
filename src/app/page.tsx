import styles from "./page.module.css";
import DataTable from "@/components/dataTable";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 style={{ marginBottom: "1em" }}>List of absences</h1>
      <DataTable />
    </main>
  );
}
