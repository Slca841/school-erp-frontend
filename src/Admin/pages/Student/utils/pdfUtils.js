import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toWords } from "number-to-words";
import logo from "../../../../../public/logo.png";
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

export const generateTC = (student, autoPrint = false) => {

getCurrentSession();
  const doc = new jsPDF();
const drawField = (sr, label, value, y) => {
  const question = `${sr}. ${label}`;
  const text = String(value || "N.A.");

  // Question
  doc.text(question, 20, y);

  // Question ke baad 10px gap
  const answerX = 20 + doc.getTextWidth(question) + 10;

  // Answer
  doc.text(text, answerX, y);

  // Dotted line sirf answer ke niche
  const textWidth = doc.getTextWidth(text);

  doc.setLineDash([1, 1], 0);
  doc.line(
    answerX,
    y + 2,
    190,
    y + 2
  );
  doc.setLineDash([], 0);

  return 10;
};


doc.addImage(logo, "PNG", 15, 8, 40, 25);
  /* ================= SCHOOL NAME ================= */
 doc.setFontSize(16);
doc.setFont(undefined, "bold");
doc.text("ST. LAXMAN CHAITANYA ACADEMY", 105, 15, {
  align: "center",
});

doc.setFontSize(10);
doc.setFont(undefined, "normal");

doc.text(
  "Harsud Road, Nehalda, Khandwa (M.P.)",
  105,
  22,
  { align: "center" }
);
doc.text(
  "Email : santlaxmanchaitanya.slca@gmail.com",
  105,
  27,
  { align: "center" }
);

doc.text(
  "Phone : +917879809028",
  105,
  34,
  { align: "center" }
);

doc.line(10, 40, 195, 40);
  /* ================= BIG TITLE ================= */
  doc.setFontSize(22);
  doc.setFont(undefined, "bold");
  doc.text("TRANSFER CERTIFICATE", 105, 50, { align: "center" });

  /* ================= BASIC DETAILS ================= */
  doc.setFontSize(11);
  doc.setFont(undefined, "normal");

  let y = 70;
let x = 150;
let l = 60;

  // doc.text(`TC Number : ${student.tcNumber}`, 20, l);
  doc.text(`Date : ${new Date().toLocaleDateString()}`, x, l);


drawField(1, "This is to certify that the student :-", student.fullName, y);
y += 10;

drawField(2, "Mother's Name :-", student.studentMotherName, y);
y += 10;

drawField(3, "Father's Name :-", student.studentFatherName, y);
y += 10;

drawField(4, "Whether the candidate belongs to Schedule Caste or Schedule Tribe or OBC :-", student.category, y);

y += 10;

drawField(5, "Class in which the student last studied :-", student.studentclass, y);
y += 10;


drawField(6, "Month up to which the pupil has paid school dues :-", "PAID", y);
y += 10;

drawField(7, "Any fee concession availed of, if so, the nature of such concession :-", "PAID", y);
y += 10;

drawField(8, "General Conduct :-", "GOOD", y);

y += 10;

drawField(9, "Total No. of working days :-", student.totalWorkingDays, y);

y += 10;
drawField(10, "Total No. of days present :-", student.overallPresent, y);

y += 10;
drawField(11, "Total No. of days Absent :-", student.overallAbsent, y);

y += 10;
drawField(12, "Total Percentage of Attendance :-",  student.attendancePercentage != null
    ? `${student.attendancePercentage}%`
    :"N.A", y);
y += 10;
drawField(8, "Date of Admission :-",student.dateOfAdmission
    ? new Date(student.dateOfAdmission).toLocaleDateString()
    : "N.A", y);

y += 10;
drawField(13, "Date of Leaving :-", student.dateOfLeaving
    ? new Date(student.dateOfLeaving).toLocaleDateString()
    : "N.A", y);
    
y += 10;
doc.text("14.", 20, y);
doc.text("Nationality", 30, y);
doc.text(":", 55, y);
doc.text("INDIAN"|| "N.A", 60, y);

doc.setLineDash([1, 1], 0);
doc.line(60, y + 2, 100, y + 2);

doc.text("15.", 105, y);
doc.text("Religion", 115, y);
doc.text(":", 140, y);
doc.text(student.religion|| "N.A", 145, y);

doc.line(145, y + 2, 190, y + 2);
doc.setLineDash([], 0);

y += 10;

doc.text("16.", 20, y);
doc.text("Date of Birth", 30, y);
doc.text(":", 55, y);
doc.text( student.dateOfBirth
    ? new Date(student.dateOfBirth).toLocaleDateString()
    : "N.A", 60, y);

doc.setLineDash([1, 1], 0);
doc.line(60, y + 2, 100, y + 2);

doc.text("17.", 105, y);
doc.text("Medium", 115, y);
doc.text(":", 140, y);
doc.text("ENGLISH" || "N.A", 145, y);

doc.line(145, y + 2, 190, y + 2);
doc.setLineDash([], 0);
y += 10;

doc.text("18.", 20, y);
doc.text("Student PEN", 30, y);
doc.text(":", 55, y);
doc.text(student.penNo|| "N.A", 60, y);

doc.setLineDash([1, 1], 0);
doc.line(60, y + 2, 100, y + 2);

doc.text("19.", 105, y);
doc.text("APAAR ID", 115, y);
doc.text(":", 140, y);
doc.text(student.apaarId|| "N.A", 145, y);

doc.line(145, y + 2, 190, y + 2);
doc.setLineDash([], 0);
y += 10;

doc.text("20.", 20, y);
doc.text("Gender", 30, y);
doc.text(":", 55, y);
doc.text(student.gender|| "N.A", 60, y);

doc.setLineDash([1, 1], 0);
doc.line(60, y + 2, 100, y + 2);

y += 10;


drawField(
  21,
  "Reason for Leaving",
  student.reason || "On Request",
  y
);
y += 25;
doc.line(145, y + 2, 190, y + 2);
doc.setLineDash([], 0);
doc.text("Principle", 160, y + 10);


  /* ================= SAVE ================= */
if (autoPrint) {
  doc.autoPrint();

  const blobUrl = doc.output("bloburl");

  const printWindow = window.open(blobUrl, "_blank");

  if (printWindow) {
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }
} else {
  doc.save(`TC_${student.fullName}.pdf`);
}
};


export const generateReceipt = (student, autoPrint = false) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5",
  });

  // ================= WATERMARK =================
  doc.setFontSize(25);
  doc.setTextColor(220, 220, 220);

  doc.text(
    "SANT LAXMAN CHAITANYA ACADEMY",
    18,
    145,
    {
      angle: 45,
    }
  );

  doc.setTextColor(0, 0, 0);

  // ================= HEADER =================
  const img = new Image();
img.src = logo;
  doc.addImage(
  img,
  "PNG",
  4, // x
  8, // y
  32, // width
  20  // height
);
  doc.setFontSize(13);
  doc.setFont(undefined, "bold");

  doc.text(
    "SANT LAXMAN CHAITANYA ACADEMY",
    74,
    15,
    {
      align: "center",
    }
  );

  doc.setFontSize(9);
  doc.setFont(undefined, "normal");

  doc.text(
    "Harsud Road, Nehalda, Khandwa (M.P.)",
    74,
    21,
    {
      align: "center",
    }
  );

  doc.text(
    `Session : ${getCurrentSession()}`,
    74,
    27,
    {
      align: "center",
    }
  );

  doc.setFont(undefined, "bold");

  doc.text(
    "FEE RECEIPT",
    74,
    35,
    {
      align: "center",
    }
  );

  // ================= STUDENT BOX =================
  doc.rect(10, 42, 128, 35);
  doc.line(74, 42, 74, 77);

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");

  const name = doc.splitTextToSize(
    `Name : ${student.fullName || "-"}`,
    55
  );

  doc.text(name, 13, 50);

  const father = doc.splitTextToSize(
    `Father Name : ${student.studentFatherName || "-"}`,
    55
  );

  doc.text(father, 13, 58);

  doc.text(
    `Class : ${student.studentclass || "-"}`,
    13,
    66
  );

  const mother = doc.splitTextToSize(
    `Mother Name : ${student.studentMotherName || "-"}`,
    58
  );

  doc.text(mother, 77, 50);

  doc.text(
    `Phone : ${student.contact1 || "-"}`,
    77,
    58
  );

  doc.text(
    `Receipt Issue Date : ${new Date().toLocaleDateString()}`,
    77,
    66
  );

  // ================= TABLE DATA =================
  const tableData =
    student.monthlyPayments?.map((p, i) => [
      i + 1,
      p.installment || "Fee Payment",
      `${Number(
        p.paidAmount
      ).toLocaleString("en-IN")}`,
    ]) || [];

  const totalSubmitted =
    student.monthlyPayments?.reduce(
      (sum, p) => sum + p.paidAmount,
      0
    ) || 0;

  // ================= PAYMENT TABLE =================
  autoTable(doc, {
    startY: 80,

    head: [
      [
        "S.No",
        "Particular",
        "Amount",
      ],
    ],

    body: [
      ...tableData,
      [
        "",
        "Total",
        `${totalSubmitted.toLocaleString(
          "en-IN"
        )}`,
      ],
    ],

    theme: "grid",

    styles: {
      fontSize: 11,
      cellPadding: 4,
      valign: "middle",
      lineWidth: 0.2,
    },

    headStyles: {
      fillColor: [240, 240, 240],
      textColor: 0,
      fontStyle: "bold",
      fontSize: 11,
      halign: "center",
    },

    bodyStyles: {
      fontSize: 11,
    },

    columnStyles: {
      0: {
        cellWidth: 22,
        halign: "center",
      },
      1: {
        cellWidth: 72,
        halign: "center",
      },
      2: {
        cellWidth: 32,
        halign: "center",
      },
    },

    didParseCell: (data) => {
      if (data.column.index === 2) {
        data.cell.styles.halign =
          "center";
      }

      // Total Row Bold
      if (
        data.row.index ===
        tableData.length
      ) {
        data.cell.styles.fontStyle =
          "bold";
      }
    },
  });

  const finalY =
    doc.lastAutoTable?.finalY || 120;

  // ================= AMOUNT IN WORDS =================
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");

  doc.rect(
    10,
    finalY + 5,
    128,
    12
  );

  const words = doc.splitTextToSize(
    `Amount in Words : ${toWords(
      totalSubmitted
    ).toUpperCase()} ONLY`,
    118
  );

  doc.text(
    words,
    13,
    finalY + 10
  );
 doc.rect(
    10,
    finalY + 20,
    128,
    12
  );
  // ================= FEES PAID FOR =================
  const paidFor =
    student.monthlyPayments
      ?.map(
        (p) => p.installment
      )
      .join(", ") || "-";

  doc.text(
    `Fees Paid For : ${paidFor}`,
    13,
    finalY + 27
  );


  // ================= SAVE / PRINT =================
  if (autoPrint) {
    doc.autoPrint();

    const blobUrl =
      doc.output("bloburl");

    const win =
      window.open(blobUrl);

    if (win) {
      win.onload = () =>
        win.print();
    }
  } else {
    doc.save(
      `${student.fullName}_receipt.pdf`
    );
  }
};



export const generatePaymentReceipt = (
  student,
  payment,
  autoPrint = false
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5",
  });
  const img = new Image();
img.src = logo;
  doc.addImage(
  img,
  "PNG",
  4, // x
  8, // y
  32, // width
  20  // height
);
  // Watermark
doc.setFontSize(25);
doc.setTextColor(220, 220, 220);

doc.text(
  "SANT LAXMAN CHAITANYA ACADEMY",
  18,
  145,
  {
    angle: 45,
  }
);

// Text color wapas black
doc.setTextColor(0, 0, 0);
  const getCurrentSession = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    return month >= 3
      ? `${year}-${year + 1}`
      : `${year - 1}-${year}`;
  };

  // Header
  doc.setFontSize(13);
  doc.setFont(undefined, "bold");
  doc.text(
    "SANT LAXMAN CHAITANYA ACADEMY",
    74,
    15,
    {
      align: "center",
    }
  );

  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.text(
    "Harsud Road, Nehalda, Khandwa (M.P.)",
    74,
    21,
    {
      align: "center",
    }
  );

  doc.text(
    `Session : ${getCurrentSession()}`,
    74,
    27,
    {
      align: "center",
    }
  );

  doc.setFont(undefined, "bold");
  doc.text("FEE RECEIPT", 74, 35, {
    align: "center",
  });

  // Student Box
doc.rect(10, 42, 128, 35);
doc.line(74, 42, 74, 77);

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");

const name = doc.splitTextToSize(
  `Name : ${student.fullName || "-"}`,
  55
);

doc.text(name, 13, 50);

const father = doc.splitTextToSize(
  `Father Name : ${student.studentFatherName || "-"}`,
  55
);

doc.text(father, 13, 58);

  doc.text(
    `Class : ${
      student.studentclass || "-"
    }`,
    13,
    66
  );
const mother = doc.splitTextToSize(
  `Mother Name : ${student.studentMotherName || "-"}`,
  58
);

doc.text(mother, 77, 50);
  doc.text(
    `Phone : ${student.contact1 || "-"}`,
    77,
    58
  );

  doc.text(
    `Receipt Issue Date : ${new Date(
      payment.date
    ).toLocaleDateString()}`,
    77,
    66
  );


  // Table
autoTable(doc, {
  startY: 80,

  head: [["S.No", "Particular", "Amount"]],

  body: [
    [
      "1",
      payment.installment || "Fee Payment",
      `${payment.paidAmount.toLocaleString(
          "en-IN"
        )}`,
    ],
    [
       "",
      "Total",
      `${payment.paidAmount.toLocaleString(
          "en-IN"
        )}`,
    ]
  ],

  theme: "grid",

  styles: {
    fontSize: 11,       // 9 se 11
    cellPadding: 4,     // thodi spacing
    valign: "middle",
    lineWidth: 0.2,
  },

  headStyles: {
    fillColor: [240, 240, 240],
    textColor: 0,
    fontStyle: "bold",
    fontSize: 11,
    halign: "center",
  },

  bodyStyles: {
    fontSize: 11,
    fontStyle: "bold",   // Installment bold dikhega
  },

  columnStyles: {
    0: {
      cellWidth: 22,
      halign: "center",
    },
    1: {
      cellWidth: 72,
      halign: "center",
    },
    2: {
      cellWidth: 32,
      halign: "center",
    },
  },
});

  const finalY =
    doc.lastAutoTable?.finalY || 100;

  // Amount in Words
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
const words = doc.splitTextToSize(
  `Amount in Words : ${toWords(
    payment.paidAmount
  ).toUpperCase()} ONLY`,
  118
);

doc.rect(
  10,
  finalY + 5,
  128,
  12
);

doc.text(
  words,
  13,
  finalY + 10
);
 doc.rect(
    10,
    finalY + 20,
    128,
    12
  );
 const paidFor =
    student.monthlyPayments
      ?.map(
        (p) => p.installment
      )
      .join(", ") || "-";

  doc.text(
    `Fees Paid For : ${paidFor}`,
    13,
    finalY + 27
  );

  if (autoPrint) {
    doc.autoPrint();

    const blobUrl =
      doc.output("bloburl");

    const win =
      window.open(blobUrl);

    if (win) {
      win.onload = () => {
        win.print();
      };
    }
  } else {
    doc.save(
      `${student.fullName}_${payment.installment}.pdf`
    );
  }
};