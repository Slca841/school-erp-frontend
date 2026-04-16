import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateTC = (student) => {
  const getCurrentSession = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0 = Jan, 3 = April

  // Academic session April se start hota hai
  if (month >= 3) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

  const doc = new jsPDF();

  /* ================= SCHOOL NAME ================= */
  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.text("ST. LAXMAN CHAITANYA ACADEMY", 105, 25, { align: "center" });

  doc.setFontSize(11);
  doc.setFont(undefined, "normal");
  doc.text("Harsud Road, Nehalda, Khandwa (M.P.)", 105, 32, { align: "center" });

  /* ================= BIG TITLE ================= */
  doc.setFontSize(22);
  doc.setFont(undefined, "bold");
  doc.text("TRANSFER CERTIFICATE", 105, 50, { align: "center" });

  /* ================= BASIC DETAILS ================= */
  doc.setFontSize(11);
  doc.setFont(undefined, "normal");

  let y = 70;
let x = 140;
let l = 70;

  doc.text(`Date : ${new Date().toLocaleDateString()}`, x, l);

  y += 12;
  doc.text(`This is to certify that the student : ${student.fullName || "-"}`, 20, y);

  y += 10;
  doc.text(`Father's Name : ${student.studentFatherName || "-"}`, 20, y);

  y += 10;
  doc.text(`Mother's Name : ${student.studentMotherName || "-"}`, 20, y);

  y += 10;
  doc.text(`Class : ${student.studentclass || "-"}`, 20, y);

    y += 10;
  doc.text(
    `Date of Birth : ${
      student.dateOfBirth
        ? new Date(student.dateOfBirth).toLocaleDateString()
        : "-"
    }`,
    20,
    y
  );
  
  
y += 10;
 doc.text(`Gender : ${student.gender || "-"}`, 20, y);

 
 
 y += 10;
 doc.text(`Caste : ${student.category || "-"}`, 20, y);
 
 y += 10;
 doc.text(`Religion : ${student.religion || "-"}`, 20, y);
 
 l += 12;
 doc.text(`Session : ${getCurrentSession()}`, x, l);
 
 l += 10;
 doc.text(`Medium : English`, x, l);
 
 l += 10;
 doc.text(`Mother's Tongue : Hindi`, x, l);

  l += 10;
  doc.text(`Tahsil : Khandwa`, x, l);

  
  l += 10;
  doc.text(`District : Khandwa`, x, l);

  
  l += 10;
  doc.text(`Attendance : Satisfactory`, x, l);
  
  l += 10;
  doc.text(`Performance : Good`, x, l);

  l += 10;
  doc.text(
    `Date of Admission : ${
      student.dateOfLeaving
        ? new Date(student.dateOfAdmission).toLocaleDateString()
        : "-"
    }`,
  x, l);

  l += 10;
  doc.text(
    `Date of Leaving : ${
      student.dateOfLeaving
        ? new Date(student.dateOfLeaving).toLocaleDateString()
        : "-"
    }`,
   x, l);

  y += 10;
  doc.text(
    `Reason : ${student.reason || "On Request"}`,
    20,
    y
  );

  /* ================= BIG CONFIRMATION LINE ================= */
  y += 30;
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text(
    "THIS IS TO CERTIFY THAT THE ABOVE STUDENT HAS BEEN ISSUED",
    105,
    y,
    { align: "center" }
  );

  y += 8;
  doc.text(
    "TRANSFER CERTIFICATE FROM THE SCHOOL",
    105,
    y,
    { align: "center" }
  );

  /* ================= SIGNATURE ================= */
  y += 40;
  doc.setFontSize(11);
  doc.setFont(undefined, "normal");

  doc.text("_________________________", 140, y);
  doc.text("Principal", 155, y + 6);

  /* ================= SAVE ================= */
  doc.save(`TC_${student.fullName}.pdf`);
};


export const generateReceipt = (student) => {
  const doc = new jsPDF();

  // Watermark
  doc.setFontSize(40);
  doc.setTextColor(200, 200, 200);
  doc.text("Sant Laxman Chataniya Academy", 30, 220, { angle: 45 });

  // Title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Sant Laxman Chataniya Academy", 105, 20, { align: "center" });
  doc.text("Fee Receipt", 105, 28, { align: "center" });

  // Student Info
  doc.setFontSize(11);
  doc.text(`Name: ${student.fullName || "-"}`, 20, 40);
  doc.text(`Class: ${student.studentclass || "-"}`, 20, 46);
  doc.text(`Father Name: ${student.studentFatherName || "-"}`, 20, 52);

  // Payment Table
  const tableData = (student.monthlyPayments || []).map((p, idx) => [
    idx + 1,
    new Date(p.date).toLocaleDateString(),
    p.month,
    p.year,
    `Rs. ${p.paidAmount}`,
  ]);

  autoTable(doc, {
    startY: 70,
    head: [["No.", "Date", "Month", "Year", "Amount"]],
    body: tableData,
  });

  // Totals Calculation
  const totalSubmitted =
    student.monthlyPayments?.reduce((acc, p) => acc + p.paidAmount, 0) || 0;

  const totalFee =
    (student.yearlyFee || 0) +
    (student.otherFees || 0) -
    (student.discount || 0);

  const due = totalFee - totalSubmitted;

  // Right side totals
  let finalY = doc.lastAutoTable.finalY || 90;
const pageWidth = doc.internal.pageSize.getWidth();
const rightMargin = 40;

const labelX = pageWidth - 90;   // labels thoda left
const valueX = pageWidth - rightMargin; // prices bilkul right


  doc.setFontSize(10);
  
  doc.text("Yearly Fee:", labelX, finalY + 18);
  doc.text(`Rs. ${student.yearlyFee || 0}`, valueX, finalY + 18, { align: "right" });
  
  
  doc.text("Other Fee:", labelX, finalY + 26);
  doc.text(`Rs. ${student.otherFees || 0}`, valueX, finalY + 26, { align: "right" });
  
  doc.text("Discount:", labelX, finalY + 34);
  doc.text(`Rs. ${student.discount || 0}`, valueX, finalY + 34, { align: "right" });
  
  doc.text("Total Submitted:", labelX, finalY + 10);
  doc.text(`Rs. ${totalSubmitted}`, valueX, finalY + 10, { align: "right" });
  
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("Total Fee:", labelX, finalY + 44);
  doc.text(`Rs. ${totalFee}`, valueX, finalY + 44, { align: "right" });

  doc.setTextColor(200, 0, 0);
  doc.text("Remaining:", labelX, finalY + 52);
  doc.text(`Rs. ${due}`, valueX, finalY + 52, { align: "right" });

  // Save PDF
  doc.save(`${student.fullName}_receipt.pdf`);
};