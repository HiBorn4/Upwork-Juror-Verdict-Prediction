import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h1>📘 Case Summary: Carter v. QuantumTech Solutions, Inc.</h1>

      <h2>Jurisdiction: U.S. District Court, State of Franklin</h2>
      <h3>Case Type: <b>Wrongful Termination – Alleged Racial Discrimination</b></h3>

      <p>
        <b>Jamal Carter</b>, a 42-year-old African American software engineer, worked
        at QuantumTech Solutions, Inc. for eight years before being laid off as
        part of a company-wide reduction in force (RIF)...
      </p>

      {/* --- Background --- */}
      <hr />
      <h2>📌 Background Facts</h2>
      <ul>
        <li>Mid-sized AI analytics company</li>
        <li>250 employees, 15% African American</li>
        <li>Consistently exceeded performance expectations</li>
        <li>Laid off during budget cuts in 2024</li>
      </ul>

      {/* --- Plaintiff Case --- */}
      <hr />
      <h2>🧑‍⚖️ Plaintiff’s Case</h2>
      <ul>
        <li>Top performer yet terminated</li>
        <li>Less qualified white engineers retained</li>
        <li>40% of laid-off staff were Black</li>
        <li>Supervisor made racially insensitive remarks</li>
      </ul>

      {/* --- Defendant Case --- */}
      <hr />
      <h2>🏢 Defendant’s Case</h2>
      <ul>
        <li>Layoffs based purely on business needs</li>
        <li>Random selection within teams</li>
        <li>No racial factor in termination decisions</li>
      </ul>

      {/* --- Witnesses --- */}
      <hr />
      <h2>🗣️ Witness Testimony Summaries</h2>

      <h3>📍 Plaintiff Witnesses</h3>
      <ul>
        <li>Jamal Carter – top performer, discriminatory culture</li>
        <li>Dr. Lisa Greene – statistical evidence of disparity</li>
        <li>Monica Alvarez – HR culture biased against diversity</li>
      </ul>

      <h3>📍 Defendant Witnesses</h3>
      <ul>
        <li>Mark Donovan – layoffs business-driven</li>
        <li>Ashley Reed – Carter performance good but irrelevant to RIF</li>
        <li>Dr. Ellis – disparities explained by job skill profiles</li>
      </ul>

      <hr />
      <Link href="/juror">
        <button style={{ padding: "10px 20px", marginTop: "20px" }}>
          Next ➡️
        </button>
      </Link>
    </div>
  );
}
