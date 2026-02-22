import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    setTableData(data.data);
  };

  const handleDownload = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: tableData })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend Error:", errorText);
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "output.xlsx";
    a.click();

  } catch (error) {
    console.error("Fetch failed:", error);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Scan to Excel</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload & Process</button>

      <br /><br />

      {tableData.length > 0 && (
        <>
          <table border="1">
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <br />
          <button onClick={handleDownload}>Download Excel</button>
        </>
      )}
    </div>
  );
}

export default App;