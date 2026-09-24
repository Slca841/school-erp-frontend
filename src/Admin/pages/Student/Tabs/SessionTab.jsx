import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../../../../Context/config.js";
import "./SessionTab.css"

const EMPTY_FORM = {
  yearlyFee: "",
  examFee: "",
  admissionFee: "",
  smartClassFee: "",
  annualFunctionFee: "",
  diaryFee: "",
  identityCardFee: "",
  panalty: "",
  otherCharges: "",
  transportationFee: "",
  discount: "",
  paidAmount: "",
};

const SessionTab = ({ student, studentId, reload }) => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
const [isSelectedSessionCurrent, setIsSelectedSessionCurrent] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const [previousYearFee, setPreviousYearFee] = useState(0);

  const [loadingSessions, setLoadingSessions] =
    useState(false);

  const [saving, setSaving] = useState(false);

  // SESSION TAB KA APNA EDIT MODE
  const [editMode, setEditMode] = useState(false);

  // =====================================================
  // LOAD SESSIONS
  // =====================================================

  const loadSessions = async () => {
    try {
      setLoadingSessions(true);

      const res = await axios.get(
        API_URLS.ACADEMIC_SESSION
      );

      setSessions(res.data?.sessions || []);
    } catch (error) {
      console.error(
        "❌ Load academic sessions error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to load academic sessions"
      );
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // =====================================================
  // NUMBER
  // =====================================================

  const number = (value) =>
    Number(value || 0);

  // =====================================================
  // SESSION SNAPSHOT
  // =====================================================

  const getSessionSnapshot = (sessionId) => {
    return (
      student?.fees?.sessionWiseFees?.find(
        (item) =>
          item.sessionId?.toString() ===
          sessionId?.toString()
      ) || null
    );
  };

  // =====================================================
  // PREVIOUS SESSION
  // =====================================================

  const getPreviousSession = (sessionId) => {
    const currentSession = sessions.find(
      (session) =>
        session._id?.toString() ===
        sessionId?.toString()
    );

    if (!currentSession) return null;

    const previousSessions = sessions
      .filter(
        (session) =>
          Number(session.startYear) <
          Number(currentSession.startYear)
      )
      .sort(
        (a, b) =>
          Number(b.startYear) -
          Number(a.startYear)
      );

    return previousSessions[0] || null;
  };

  // =====================================================
  // PREVIOUS YEAR PENDING
  // =====================================================

  const getPreviousYearFee = (sessionId) => {
    const previousSession =
      getPreviousSession(sessionId);

    if (!previousSession) {
      return 0;
    }

    const previousSnapshot =
      getSessionSnapshot(
        previousSession._id
      );

    return number(
      previousSnapshot?.remainingAmount
    );
  };

  // =====================================================
  // LOAD FORM FOR SESSION
  // =====================================================

  const loadSessionIntoForm = (sessionId) => {
    if (!sessionId) {
      setForm(EMPTY_FORM);
      setPreviousYearFee(0);
      return;
    }

    const snapshot =
      getSessionSnapshot(sessionId);

    const previousFee =
      getPreviousYearFee(sessionId);

    setPreviousYearFee(previousFee);

    if (!snapshot) {
      setForm(EMPTY_FORM);
      return;
    }

    setForm({
      yearlyFee:
        snapshot.yearlyFee ?? "",

      examFee:
        snapshot.examFee ?? "",

      admissionFee:
        snapshot.admissionFee ?? "",

      smartClassFee:
        snapshot.smartClassFee ?? "",

      annualFunctionFee:
        snapshot.annualFunctionFee ?? "",

      diaryFee:
        snapshot.diaryFee ?? "",

      identityCardFee:
        snapshot.identityCardFee ?? "",

      panalty:
        snapshot.panalty ?? "",

      otherCharges:
        snapshot.otherCharges ?? "",

      transportationFee:
        snapshot.transportationFee ?? "",

      discount:
        snapshot.discount ?? "",

      paidAmount:
        snapshot.paidAmount ?? "",
    });
  };

  // =====================================================
  // SESSION CHANGE
  // =====================================================

const handleSessionChange = (sessionId) => {
  setSelectedSession(sessionId);

  const selected = sessions.find(
    (session) =>
      session._id?.toString() === sessionId?.toString()
  );

  setIsSelectedSessionCurrent(
    selected?.isCurrent === true
  );

  loadSessionIntoForm(sessionId);
};
  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // OTHER FEES
  // =====================================================

  const otherFees =
    number(form.examFee) +
    number(form.admissionFee) +
    number(form.smartClassFee) +
    number(form.annualFunctionFee) +
    number(form.diaryFee) +
    number(form.identityCardFee) +
    number(form.panalty) +
    number(form.otherCharges) +
    number(form.transportationFee);

  // =====================================================
  // TOTAL
  // =====================================================

  const totalFee =
    number(form.yearlyFee) +
    previousYearFee +
    otherFees -
    number(form.discount);

  // =====================================================
  // REMAINING
  // =====================================================

  const remainingAmount = Math.max(
    totalFee -
      number(form.paidAmount),
    0
  );

  // =====================================================
  // SAVE SESSION FEE
  // =====================================================

  const handleSave = async () => {
    if (!selectedSession) {
      alert(
        "⚠️ Please select academic session"
      );
      return;
    }

    try {
      setSaving(true);

      await axios.put(
        `${API_URLS.STUDENT_SESSION_FEE}/${studentId}/session-fee/${selectedSession}`,
        {
          yearlyFee:
            number(form.yearlyFee),

          examFee:
            number(form.examFee),

          admissionFee:
            number(form.admissionFee),

          smartClassFee:
            number(form.smartClassFee),

          annualFunctionFee:
            number(form.annualFunctionFee),

          diaryFee:
            number(form.diaryFee),

          identityCardFee:
            number(form.identityCardFee),

          panalty:
            number(form.panalty),

          otherCharges:
            number(form.otherCharges),

          transportationFee:
            number(form.transportationFee),

          discount:
            number(form.discount),

          paidAmount:
            number(form.paidAmount),
        }
      );

      alert(
        "✅ Session fee saved successfully"
      );

      await reload();

      setEditMode(false);

      await loadSessions();

      setSelectedSession("");
      setForm(EMPTY_FORM);
      setPreviousYearFee(0);
    } catch (error) {
      console.error(
        "❌ Save session fee error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to save session fee"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const money = (value) => {
    return `₹${number(value).toLocaleString(
      "en-IN"
    )}`;
  };

  // =====================================================
  // TABLE DATA
  // =====================================================

  const getOtherFeesFromSnapshot = (
    snapshot
  ) => {
    if (!snapshot) return 0;

    return (
      number(snapshot.examFee) +
      number(snapshot.admissionFee) +
      number(snapshot.smartClassFee) +
      number(snapshot.annualFunctionFee) +
      number(snapshot.diaryFee) +
      number(snapshot.identityCardFee) +
      number(snapshot.panalty) +
      number(snapshot.otherCharges) +
      number(snapshot.transportationFee)
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="session-tab">

      {/* =================================================
          HEADER
      ================================================= */}

   <div className="session-tab-header">
        <h2>
          Student Session Fees
        </h2>

        <button
          onClick={() => {
            setEditMode(
              (prev) => !prev
            );

    if (editMode) {
  setSelectedSession("");
  setIsSelectedSessionCurrent(false);
  setForm(EMPTY_FORM);
  setPreviousYearFee(0);
}
          }}
  className={`session-edit-btn ${
  editMode ? "cancel" : ""
}`}
        >
          {editMode
            ? "Cancel Edit"
            : "Edit"}
        </button>
      </div>

      {/* =================================================
          NORMAL VIEW - TABLE
      ================================================= */}

      {!editMode && (
   <div className="session-table-wrapper">
     <table className="session-fee-table">
            <thead>
              <tr>
                <th>Session</th>
                <th>Previous Year</th>
                <th>Yearly Fee</th>
                <th>Other Fees</th>
                <th>Discount</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Remaining</th>
              </tr>
            </thead>

            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    No academic sessions
                    found
                  </td>
                </tr>
              ) : (
                sessions.map(
                  (session) => {
                    const snapshot =
                      getSessionSnapshot(
                        session._id
                      );

                    if (!snapshot) {
                      return (
                        <tr
                          key={session._id}
                        >
                          <td>
                       <span className="session-name">
  {session.name}
</span>

{session.isCurrent && (
  <span className="current-session-badge">
    Current
  </span>
)}
                          </td>

                          <td>
                            ₹0
                          </td>

                          <td>
                            ₹0
                          </td>

                          <td>
                            ₹0
                          </td>

                          <td>
                            ₹0
                          </td>

                          <td>
                            ₹0
                          </td>

                          <td>
                            ₹0
                          </td>

                          <td>
                            ₹0
                          </td>
                        </tr>
                      );
                    }

                    const otherFees =
                      getOtherFeesFromSnapshot(
                        snapshot
                      );

                    return (
                      <tr
                        key={session._id}
                      >
                        <td>
                          <strong>
                            {
                              session.name
                            }
                          </strong>

                          {session.isCurrent && (
                            <span
                              style={{
                                marginLeft:
                                  "6px",
                              }}
                            >
                              (Current)
                            </span>
                          )}
                        </td>

                        <td>
                          {money(
                            snapshot.previousYearFee
                          )}
                        </td>

                        <td>
                          {money(
                            snapshot.yearlyFee
                          )}
                        </td>

                        <td>
                          {money(
                            otherFees
                          )}
                        </td>

                        <td>
                          {money(
                            snapshot.discount
                          )}
                        </td>

                        <td>
                          <strong>
                            {money(
                              snapshot.totalFee
                            )}
                          </strong>
                        </td>

                        <td>
                          {money(
                            snapshot.paidAmount
                          )}
                        </td>

                        <td>
                          <strong>
                            {money(
                              snapshot.remainingAmount
                            )}
                          </strong>
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* =================================================
          EDIT VIEW
      ================================================= */}

      {editMode && (
        <>
          {/* SESSION SELECT */}

          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <label>
              <strong>
                Academic Session
              </strong>
            </label>

            <select
              value={selectedSession}
              onChange={(e) =>
                handleSessionChange(
                  e.target.value
                )
              }
              disabled={
                loadingSessions
              }
              style={{
                display: "block",
                width: "100%",
                maxWidth: "450px",
                padding: "10px",
                marginTop: "8px",
              }}
            >
              <option value="">
                {loadingSessions
                  ? "Loading sessions..."
                  : "Select Academic Session"}
              </option>

              {sessions.map(
                (session) => (
                  <option
                    key={session._id}
                    value={session._id}
                  >
                    {session.name}

                    {session.isCurrent
                      ? " (Current)"
                      : ""}
                  </option>
                )
              )}
            </select>
          </div>

          {/* FORM */}

          {selectedSession && (
            <>
              {/* PREVIOUS YEAR */}

              <div
                style={{
                  marginBottom: "20px",
                  padding: "15px",
                  background:
                    "#f5f5f5",
                  borderRadius: "8px",
                }}
              >
                <strong>
                  Previous Year Fee
                </strong>

                <div
                  style={{
                    fontSize: "22px",
                    fontWeight:
                      "bold",
                    marginTop: "5px",
                  }}
                >
                  {money(
                    previousYearFee
                  )}
                </div>

                <small>
                  Automatically taken
                  from previous
                  session remaining
                  amount.
                </small>
              </div>

              {/* INPUTS */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "15px",
                }}
              >
                <FeeInput
                  label="Yearly Fee"
                  name="yearlyFee"
                  value={
                    form.yearlyFee
                  }
                  onChange={
                    handleChange
                  }
                  readOnly={isSelectedSessionCurrent}
                />

                <FeeInput
                  label="Admission Fee"
                  name="admissionFee"
                  value={
                    form.admissionFee
                  }
                  onChange={
                    handleChange
                  }
                  readOnly={isSelectedSessionCurrent}
                />

                <FeeInput
                  label="Exam Fee"
                  name="examFee"
                  value={
                    form.examFee
                  }
                  onChange={
                    handleChange
                  }
                  readOnly={isSelectedSessionCurrent}
                />

                <FeeInput
                  label="Smart Class Fee"
                  name="smartClassFee"
                  value={
                    form.smartClassFee
                  }
                  onChange={
                    handleChange
                  }
                  readOnly={isSelectedSessionCurrent}
                />

                <FeeInput
                  label="Annual Function Fee"
                  name="annualFunctionFee"
                  value={
                    form.annualFunctionFee
                  }
                  onChange={
                    handleChange
                  }
                  readOnly={isSelectedSessionCurrent}
                />

                <FeeInput
                  label="Diary Fee"
                  name="diaryFee"
                  value={
                    form.diaryFee
                  }
                  onChange={
                    handleChange
                  }
                  readOnly={isSelectedSessionCurrent}
                />

                <FeeInput
                  label="Identity Card Fee"
                  name="identityCardFee"
                  value={
                    form.identityCardFee
                  }
                  onChange={
                    handleChange
                  }
                  readOnly={isSelectedSessionCurrent}
                />

                <FeeInput
                  label="Penalty"
                  name="panalty"
                  value={
                    form.panalty
                  }
                  onChange={
                    handleChange
                  }
                  readOnly={isSelectedSessionCurrent}
                />

                <FeeInput
                  label="Other Charges"
                  name="otherCharges"
                  value={
                    form.otherCharges
                  }
                  onChange={
                    handleChange
                  }
                  readOnly={isSelectedSessionCurrent}
                />

                <FeeInput
                  label="Transportation Fee"
                  name="transportationFee"
                  value={
                    form.transportationFee
                  }
                  onChange={
                    handleChange
                  }
                  readOnly={isSelectedSessionCurrent}
                />

                <FeeInput
                  label="Discount"
                  name="discount"
                  value={
                    form.discount
                  }
                  onChange={
                    handleChange
                  }
                  readOnly={isSelectedSessionCurrent}
                />

                <FeeInput
                  label="Paid Amount"
                  name="paidAmount"
                  value={
                    form.paidAmount
                  }
                  onChange={
                    handleChange
                  }
                  readOnly={isSelectedSessionCurrent}
                />
              </div>

              {/* SUMMARY */}

              <div
                style={{
                  marginTop: "25px",
                  padding: "20px",
                  border:
                    "1px solid #ddd",
                  borderRadius: "10px",
                }}
              >
                <h3>
                  Fee Summary
                </h3>

                <p>
                  Previous Year Fee:
                  {" "}
                  {money(
                    previousYearFee
                  )}
                </p>

<p>
  Yearly Fee:
  {" "}
  {money(
    form.yearlyFee
  )}
</p>

                <p>
                  Other Fees:
                  {" "}
                  {money(otherFees)}
                </p>

                <p>
                  <strong>
                    Total Fee:
                    {" "}
                    {money(totalFee)}
                  </strong>
                </p>

                <p>
                  <strong>
                    Paid Amount:
                    {" "}
                    {money(
                      form.paidAmount
                    )}
                  </strong>
                </p>

                <p>
                  <strong>
                    Remaining:
                    {" "}
                    {money(
                      remainingAmount
                    )}
                  </strong>
                </p>
              </div>

              {/* SAVE */}

   {!isSelectedSessionCurrent && (
  <button
    onClick={handleSave}
    disabled={saving}
    style={{
      marginTop: "20px",
      padding: "12px 25px",
      cursor: saving ? "not-allowed" : "pointer",
    }}
  >
    {saving
      ? "Saving..."
      : "Save Session Fee"}
  </button>
)}
            </>
          )}
        </>
      )}
    </div>
  );
};

// =======================================================
// FEE INPUT
// =======================================================

const FeeInput = ({
  label,
  name,
  value,
  onChange,
  readOnly = false,
}) => {
  return (
    <div>
      <label>
        <strong>
          {label}
        </strong>
      </label>

<input
  type="number"
  name={name}
  value={value}
  onChange={onChange}
  min="0"
  readOnly={readOnly}
  style={{
    display: "block",
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    boxSizing: "border-box",
    backgroundColor: readOnly ? "#f5f5f5" : "white",
    cursor: readOnly ? "not-allowed" : "text",
  }}
/>
    </div>
  );
};

export default SessionTab;