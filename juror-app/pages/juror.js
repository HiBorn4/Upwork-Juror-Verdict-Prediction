// /pages/juror.js
import { useEffect, useState } from "react";
import Papa from "papaparse";
import { useRouter } from "next/router";


function ShapPlot({ juror }) {
  const [open, setOpen] = useState(false);

  // Mock SHAP values (these can be anything for now)
  const mockShap = [
    { feature: "Age", value: 0.12 },
    { feature: "Race", value: -0.25 },
    { feature: "Sex", value: 0.18 },
    { feature: "Trust HR", value: -0.30 },
    { feature: "Layoff Experience", value: 0.22 },
  ];

  return (
    <div style={{ marginTop: 10, borderTop: "1px solid #eee", paddingTop: 10 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: "6px 12px",
          background: "#f1f1f1",
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      >
        {open ? "Hide SHAP Plot" : "View SHAP Plot"}
      </button>

      {open && (
        <div style={{ marginTop: 12 }}>
          <h4>Mock SHAP Explanation for Juror {juror}</h4>

          {mockShap.map((s, idx) => {
            const barWidth = Math.min(Math.abs(s.value) * 200, 200);
            const color = s.value >= 0 ? "#ff9999" : "#99b3ff"; // red = plaintiff, blue = defense

            return (
              <div key={idx} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 14, marginBottom: 4 }}>{s.feature}</div>
                <div
                  style={{
                    height: 12,
                    width: barWidth,
                    background: color,
                    borderRadius: 6,
                  }}
                ></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


export default function Juror() {
  const router = useRouter();
  const queryRow =
    typeof router.query.row !== "undefined"
      ? parseInt(router.query.row, 10)
      : null;

  const [data, setData] = useState([]);
  const [rowIndex, setRowIndex] = useState(queryRow ?? 1);
  const [choices, setChoices] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [imageUrl, setImageUrl] = useState("");   
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatReply, setChatReply] = useState("");

  // LOAD CSV ONCE
  useEffect(() => {
    Papa.parse("/data.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        setData(res.data);
        setLoading(false);

        if (queryRow !== null) {
          const clamp = Math.max(1, Math.min(res.data.length - 1, queryRow));
          setRowIndex(clamp);
        }
      },
    });
  }, [queryRow, router.query.row]);

  // SCROLL TO TOP when row changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [rowIndex]);

  // Move all hooks above any conditional returns
  // Columns
  const allCols = data.length > 0 ? Object.keys(data[0]) : [];
  const questionCols = allCols.slice(1, -2);

  const row = data[rowIndex] || {};

  // Extract demographics
  const age = row["What is your age?"];
  const sex = row["What is your sex?"];
  const race = row["Which of the following best matches your race?"];

  // --- AI IMAGE GENERATION MOCK (Replace with API later)
  useEffect(() => {
    if (!age || !sex || !race) return;
    async function fetchImage() {
      // For now use a placeholder avatar
      const prompt = `portrait photo of a ${age}-year-old ${race} ${sex}, professional neutral background realistic`;
      console.log("AI prompt:", prompt);

      // placeholder:
      setImageUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${rowIndex}`);
    }
    fetchImage();
  }, [rowIndex, age, sex, race]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (data.length === 0) return <div style={{ padding: 20 }}>Empty CSV.</div>;

  // --- CHAT HANDLERS
  const openChat = () => setChatOpen(true);
  const closeChat = () => setChatOpen(false);

  const sendChatMessage = () => {
    // first version: static response
    const reply = `I am juror #${rowIndex}. Based on my answers, I lean in a '${choices[rowIndex] ?? "Undecided"}' direction.`;
    setChatReply(reply);
  };

  // USER SELECTION
  const handleSelect = (value) => {
    setChoices((prev) => ({ ...prev, [rowIndex]: value }));
  };

  const goTo = (idx) => {
    const clamp = Math.max(1, Math.min(data.length - 1, idx));
    setRowIndex(clamp);
    router.replace(
      { pathname: router.pathname, query: { row: clamp } },
      undefined,
      { shallow: true }
    );
  };

  const goNext = () => goTo(rowIndex + 1);
  const goPrev = () => goTo(rowIndex - 1);

  const skipJuror = () => {
    setChoices((prev) => ({ ...prev, [rowIndex]: "Skipped" }));
    if (rowIndex < data.length - 1) goNext();
  };

  // --- SUBMIT AND SCORING
  const normalizeActual = (raw) => {
    if (!raw) return "Unknown";
    const r = raw.toLowerCase();
    if (r.includes("plaintiff")) return "Plaintiff";
    if (r.includes("defendant")) return "Defendant";
    if (r.includes("undecid")) return "Undecided";
    return "Unknown";
  };

  const submitAll = () => {
    setSubmitted(true);
    setChatOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const computeResults = () => {
    const verdictCol = allCols[allCols.length - 2];
    let score = 0;
    const rows = [];

    for (let i = 1; i < data.length; i++) {
      const actual = normalizeActual(data[i][verdictCol]);
      const userPick = choices[i] ?? "Skipped";
      const correct =
        userPick === actual &&
        (actual === "Plaintiff" || actual === "Defendant");
      if (correct) score++;

      rows.push({ juror: i, actual, userPick, correct });
    }
    return { rows, score, total: rows.length };
  };

  if (submitted) {
    const { rows, score, total } = computeResults();

    return (
      <div style={{ padding: 24, maxWidth: 900, margin: "auto" }}>
        <h1>📊 Final Score</h1>
        <p>
          Score: <b>{score}</b> / {total}
        </p>

        <table border={1} style={{ width: "100%", marginTop: 20 }}>
          <thead>
            <tr>
              <th>Juror</th>
              <th>Actual</th>
              <th>Your Pick</th>
              <th>Correct</th>
            </tr>
          </thead>
          <tbody>
  {rows.map((r) => (
    <>
      <tr key={r.juror}>
        <td>
          <a
            href={`/juror?row=${r.juror}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Juror {r.juror}
          </a>
        </td>
        <td>{r.actual}</td>
        <td>{r.userPick}</td>
        <td>{r.correct ? "✅" : "❌"}</td>
      </tr>

      {/* SHAP ROW */}
      <tr>
        <td colSpan={4} style={{ padding: "12px 20px" }}>
          <ShapPlot juror={r.juror} />
        </td>
      </tr>
    </>
  ))}
</tbody>


        </table>

        <button style={{ marginTop: 20 }} onClick={() => { setSubmitted(false); goTo(1); }}>
          Review Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "auto" }}>
      <h1>Juror {rowIndex}</h1>
      <p>
        Showing juror {rowIndex} of {data.length - 1}
      </p>

      {/* IMAGE SECTION */}
      <div style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}>
        <img
          src={imageUrl}
          alt="juror"
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            border: "3px solid #ccc",
            objectFit: "cover",
          }}
        />
        <br />
        <button onClick={openChat} style={{ marginTop: 10 }}>
          💬 Chat with Juror
        </button>
      </div>

      {/* CHAT MODAL */}
      {chatOpen && (
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 8,
            boxShadow: "0px 0px 15px rgba(0,0,0,0.2)",
            marginBottom: 20,
          }}
        >
          <h3>Chat with Juror {rowIndex}</h3>

          <input
            type="text"
            value={chatInput}
            placeholder="Ask something..."
            onChange={(e) => setChatInput(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 10,
              borderRadius: 6,
            }}
          />

          <button onClick={sendChatMessage}>Send</button>
          <button onClick={closeChat} style={{ marginLeft: 10 }}>
            Close
          </button>

          {chatReply && (
            <div style={{ marginTop: 15, background: "#f1f1f1", padding: 12 }}>
              <b>Juror:</b> {chatReply}
            </div>
          )}
        </div>
      )}

      <ol style={{ paddingLeft: 20 }}>
  {questionCols.map((q, i) => (
    <li key={i} style={{ marginBottom: 24 }}>
      <h3 style={{ margin: "8px 0" }}>{q}</h3>
      <div
        style={{
          background: "#f0fdf4",      /* soft green highlight */
          borderLeft: "4px solid #22c55e",
          padding: "12px 16px",
          borderRadius: 6,
          fontSize: 15,
          lineHeight: 1.6,
        }}
      >
        {row[q]}
      </div>
    </li>
  ))}
</ol>

      <h3>Who does this juror lean toward?</h3>

      <div style={{ marginBottom: 16 }}>
        {["Plaintiff", "Defendant", "Undecided"].map((v) => (
          <label key={v} style={{ marginRight: 20 }}>
            <input
              type="radio"
              name={`choice_${rowIndex}`}
              value={v}
              checked={choices[rowIndex] === v}
              onChange={() => handleSelect(v)}
            />
            <span style={{ marginLeft: 6 }}>{v}</span>
          </label>
        ))}
      </div>

      {/* BUTTONS */}
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={goPrev} disabled={rowIndex === 1}>
          ⬅ Previous
        </button>
        <button onClick={skipJuror} style={{ background: "#ffdede" }}>
          Skip (wrong)
        </button>
        {rowIndex < data.length - 1 ? (
          <button onClick={goNext}>Next ➜</button>
        ) : (
          <button onClick={submitAll} style={{ background: "#d0ffd0" }}>
            Submit ✔️
          </button>
        )}
      </div>
    </div>
  );
}