// src/CreateGroupTest.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateGroupTest = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch courses and users when component mounts
  useEffect(() => {
    axios
      .get("https://petrox-dashboard-backend.onrender.com/api/courses/")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });

    axios
      .get("https://petrox-dashboard-backend.onrender.com/api/users/all/")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleFriendSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedFriends(selectedOptions);
  };

  const handleCreateGroupTest = () => {
    setLoading(true);
    // Generate a dummy test link – replace with your unique test link logic.
    const inviter = localStorage.getItem("username") || "A user";
    const testLink = "https://petrox-test-frontend.onrender.com/test/unique-test-id";
    axios
      .post("https://petrox-dashboard-backend.onrender.com/api/create-group-test/", {
        course: selectedCourse,
        date: selectedDate,
        time: selectedTime,
        invited_users: selectedFriends,
        test_link: testLink,
      })
      .then((response) => {
        alert("Group test created and invites sent.");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error creating group test:", error);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <h1 style={{ color: "white", fontWeight: "bold" }}>Loading...</h1>
        </div>
      )}
      <h2>Create Group Test</h2>
      <div>
        <label>Course:</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.name}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      <div>
        <label>Time:</label>
        <input
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        />
      </div>
      <div>
        <label>Invite Friends:</label>
        <select multiple value={selectedFriends} onChange={handleFriendSelection}>
          {users.map((user) => (
            <option key={user.id} value={user.username}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleCreateGroupTest}>Create Group Test</button>
    </div>
  );
};

export default CreateGroupTest;

