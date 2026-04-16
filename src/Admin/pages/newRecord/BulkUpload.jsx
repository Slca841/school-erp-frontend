import React from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { API_URLS } from "../../../Context/config.js";
import "./BulkUpload.css";

const excelDateToJS = (excelDate) => {
  if (!excelDate) return "";
  if (typeof excelDate === "number") {
    const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
    return jsDate.toISOString().slice(0, 10);
  }
  return excelDate.toString().slice(0, 10);
};

const BulkUpload = () => {
  const handleBulkUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return alert("Please select a file!");

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        let workbook;
        if (file.name.toLowerCase().endsWith(".csv")) {
          workbook = XLSX.read(event.target.result, { type: "string" });
        } else {
          workbook = XLSX.read(event.target.result, { type: "binary" });
        }

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        if (!sheet) return alert("❌ No sheet found!");

        const rawData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        const cleanedData = rawData.map((row) => {
          const newRow = {};
          Object.keys(row).forEach((key) => {
            const lower = key.trim().toLowerCase();
            let value = row[key];

            if (["dateofbirth", "dateofadmission"].includes(lower)) {
              value = excelDateToJS(value);
            }

            newRow[lower] = value;
          });
          return newRow;
        });

        const res = await axios.post(`${API_URLS.LOGIN}/bulk-register`, {
          records: cleanedData,
        });

        if (res.data.success) {
          alert(`✅ ${cleanedData.length} records uploaded successfully!`);
        } else {
          alert("⚠️ Upload failed: " + res.data.message);
        }
      } catch (err) {
        console.error("❌ Bulk Upload Error:", err);
        alert("❌ Failed to upload file!");
      }
    };

    if (file.name.toLowerCase().endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div className="bulk-upload-container">
      <h2>📤 Bulk Upload Users</h2>

      <label htmlFor="excelUpload" className="upload-btn">
        📁 Choose Excel File
      </label>
      <input
        id="excelUpload"
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleBulkUpload}
        hidden
      />

      <div className="format-example">
  <p><b>Format Example (Excel Table Format):</b></p>

  <table className="excel-format-table">
    <thead>
      <tr>
        <th>name</th>
        <th>email</th>
        <th>password</th>
        <th>role</th>
        <th>fullname</th>
        <th>studentfathername</th>
        <th>studentmothername</th>
        <th>studentclass</th>
        <th>rollno</th>
        <th>gender</th>
        <th>religion</th>
        <th>category</th>
        <th>contact1</th>
        <th>contact2</th>
        <th>dateofbirth</th>
        <th>dateofadmission</th>
        <th>scholarno</th>
        <th>aadharno</th>
        <th>samagraid</th>
        <th>penno</th>
        <th>apaarid</th>
        <th>address</th>
     
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>Nitesh</td>
        <td>n@gmail.com</td>
        <td>1234</td>
        <td>student</td>
        <td>Nitesh Kumar</td>
        <td>Rajesh Kumar</td>
        <td>Sita Devi</td>
        <td>10-A</td>
        <td>23</td>
        <td>Male</td>
        <td>Hindu</td>
        <td>OBC</td>
        <td>9876543210</td>
        <td>9876501234</td>
        <td>2008-05-14</td>
        <td>2022-04-05</td>
        <td>10235</td>
        <td>556677889900</td>
        <td>12345678</td>
        <td>PN12345</td>
        <td>AP998877</td>
        <td>Indore, MP</td>

      </tr>
    </tbody>
  </table>
</div>

    </div>
  );
};

export default BulkUpload;
