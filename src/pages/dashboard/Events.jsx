import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/UseAuth"; // adjust path

export default function Events() {
  const { user, token } = useAuth();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    neighborhood: ""
  });

  // Helper to always get the right token
  const getAuthToken = () => {
    const savedToken = token || localStorage.getItem("access_token");
    return savedToken ? `Bearer ${savedToken}` : null;
  };

  useEffect(() => {
    const authHeader = getAuthToken();
    if (!authHeader) {
      console.warn("No token found — cannot fetch events");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/events/", {
        headers: { Authorization: authHeader },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => {
        console.error("Error fetching events:", err.response?.data || err.message);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
        }
      });
  }, [token]);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const authHeader = getAuthToken();

    if (!authHeader) {
      alert("You must be logged in to create an event.");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/events/", newEvent, {
        headers: { Authorization: authHeader },
      })
      .then((res) => {
        setEvents([...events, res.data]);
        setNewEvent({
          title: "",
          description: "",
          date: "",
          time: "",
          location: "",
          neighborhood: ""
        });
      })
      .catch((err) => {
        console.error("Error creating event:", err.response?.data || err.message);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
        } else {
          alert("Failed to create event. Check your input.");
        }
      });
  };

  return (
    <div className="p-4">
      {user?.role === "admin" && (
        <form onSubmit={handleCreateEvent} className="mb-6 p-4 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-bold mb-2">Create Event</h3>
          <input
            type="text"
            placeholder="Event title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <textarea
            placeholder="Event description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="time"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="text"
            placeholder="Neighborhood"
            value={newEvent.neighborhood}
            onChange={(e) => setNewEvent({ ...newEvent, neighborhood: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Event
          </button>
        </form>
      )}

      <h2 className="text-xl font-bold mb-4">Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((ev) => (
          <div key={ev.id} className="p-4 border rounded shadow-sm bg-white">
            <h3 className="font-semibold">{ev.title}</h3>
            <p className="text-gray-700">{ev.description}</p>
            <p className="text-sm text-gray-500">
              {ev.date} at {ev.time}
            </p>
            <p className="text-sm">{ev.location}</p>
            <p className="text-sm">{ev.neighborhood}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
