import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { API_URLS } from "../../../Context/config.js";
import "./EventCalendar.css";

const EventCalendar = ({ isAdmin }) => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [formData, setFormData] = useState({ title: "", type: "event" });
  const [editEventId, setEditEventId] = useState(null);

  // 🟢 Fetch all events from backend
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URLS.EVENT}/all`);
      const mapped = res.data.events.map((e) => {
        let color = "#34d399"; // default green
        if (e.type === "holiday") color = "#ef4444"; // red
        else if (e.type === "exam") color = "#3b82f6"; // blue
        else if (e.type === "meeting") color = "#eab308"; // yellow

        return {
          id: e._id,
          title: e.title,
          date: e.date,
          backgroundColor: color,
          borderColor: color,
          textColor: "#fff",
          extendedProps: e,
        };
      });

      setEvents(mapped);
    } catch (err) {
      console.error("❌ Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 🟢 Handle Add Event
  const handleDateClick = (info) => {
    if (!isAdmin) return;
    setSelectedDate(info.dateStr);
    setFormData({ title: "", type: "event" });
    setEditEventId(null);
    setShowModal(true);
  };

  // 🟡 Handle Edit Event
  const handleEventClick = (info) => {
    if (!isAdmin) return;
    const e = info.event.extendedProps;
    setEditEventId(e._id);
    setFormData({ title: e.title, type: e.type });
    setSelectedDate(e.date);
    setShowModal(true);
  };

  // 🟠 Save Event (Add/Edit)
  const handleSave = async () => {
    try {
      if (!formData.title) return alert("Please enter a title");

      if (editEventId) {
        await axios.put(`${API_URLS.EVENT}/update/${editEventId}`, {
          ...formData,
          date: selectedDate,
        });
        alert("✅ Event updated successfully!");
      } else {
        await axios.post(`${API_URLS.EVENT}/create`, {
          ...formData,
          date: selectedDate,
        });
        alert("✅ Event created successfully!");
      }

      setShowModal(false);
      fetchEvents();
    } catch (err) {
      console.error("❌ Error saving event:", err);
      alert("Error saving event");
    }
  };

  // 🔴 Delete Event
  const handleDelete = async () => {
    if (!editEventId) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    await axios.delete(`${API_URLS.EVENT}/delete/${editEventId}`);
    alert("🗑️ Event deleted!");
    setShowModal(false);
    fetchEvents();
  };

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">📅 SLCA Event Calendar</h2>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
        eventContent={(arg) => (
          <div
            style={{
              backgroundColor: arg.event.backgroundColor,
              color: "black",
              borderRadius: "6px",
              padding: "3px 5px",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {arg.event.title}
          </div>
        )}
      />

      {/* 🔵 Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{editEventId ? "✏️ Edit Event" : "➕ Add New Event"}</h3>

            <input
              type="text"
              placeholder="Event title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="event">General Event</option>
              <option value="holiday">Holiday</option>
              <option value="exam">Exam</option>
              <option value="meeting">Meeting</option>
            </select>

            <div className="modal-actions">
              <button onClick={handleSave}>💾 Save</button>
              {editEventId && <button onClick={handleDelete}>🗑️ Delete</button>}
              <button onClick={() => setShowModal(false)}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="event-legend">
        <span style={{ background: "#ef4444" }}>Holiday</span>
        <span style={{ background: "#3b82f6" }}>Exam</span>
        <span style={{ background: "#eab308" }}>Meeting</span>
        <span style={{ background: "#34d399" }}>Event</span>
      </div>
    </div>
  );
};

export default EventCalendar;
