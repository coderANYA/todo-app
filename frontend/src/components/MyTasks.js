import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Toast from "./Toast";
import "./MyTasks.css";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import AlertClearOneTask from "./AlertClearOneTask";
import AlertClearAll from "./AlertClearAll";
import JSConfetti from "js-confetti";      // COMMENT ADDED
import axios from "axios";

export default function MyTasks() {
  const [prevTodos, setPrevTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);
  const [showClearAllAlert, setShowClearAllAlert] = useState(false);

  const jsConfetti = useRef(null);         // COMMENT ADDED

  // ✅ get logged-in user id (assuming user stored in 
  // localStorage/sessionStorage)
  const user = JSON.parse(localStorage.getItem("user_login")); 
  const userId = user?.id;

  const handleNewTitle = (event) => {
    setNewTitle(event.target.value);
  };

  const handleNewDescription = (event) => {
    setNewDescription(event.target.value);
  };

  // comment added for this function
  const handleDeleteTodo = (index) => {
    setPendingDeleteIndex(index);
    setShowAlert(true);
  };

  // comment added for this function
  const confirmDelete = async () => {
    const todoToDelete = prevTodos[pendingDeleteIndex];

    try {
      await axios.delete(`http://localhost:8000/tasks/${todoToDelete.id}`);
      const removedTodo = prevTodos.filter((_, i) => i !== pendingDeleteIndex);
      setPrevTodos(removedTodo);
      triggerToast("🗑️ Todo deleted successfully");
    } 
    catch (err) {
      console.error("Todo deletion failed", err);
    }

    setShowAlert(false);
    setPendingDeleteIndex(null);
  };

  // comment added for this function
  const cancelDelete = () => {
    setShowAlert(false);
    setPendingDeleteIndex(null);
  };

  // comment added for this function
  const confirmClearAll = async () => {
    try {
      await Promise.all(
        prevTodos.map((todo) =>
          axios.delete(`http://localhost:8000/tasks/${todo.id}`)
        )
      );
    setPrevTodos([]);
    triggerToast("🧹 All tasks cleared successfully!");
    } 
    catch (err) {
      console.error("Failed to clear all tasks", err);
    }

    setShowClearAllAlert(false);
  };

  // comment added for this function
  const cancelClearAll = () => {
    setShowClearAllAlert(false);
  };

  const handleOnEdit = (index) => {
    const todo = prevTodos[index];
    setNewTitle(todo.title);
    setNewDescription(todo.description);
    setIsEditing(true);
    setEditingIndex(index);
  };

  // comment added for this function
  const handleSaveEdit = async () => {
    const trimmedTitle = newTitle.trim();
    const trimmedDescription = newDescription.trim();

    if (!trimmedTitle || !trimmedDescription) {
      triggerToast("🔔 Title and/or description fields can't be empty");
      return;
    }

    const hasAlphabets = /[a-zA-Z]/;
    if (
      !hasAlphabets.test(trimmedTitle) ||
      !hasAlphabets.test(trimmedDescription)
    ) {
      triggerToast("🔔 Use at least one alphabet in your title & description");
      return;
    }

    const updatedTodos = [...prevTodos];
    const todo = updatedTodos[editingIndex];

    const updatedTodo = {
      ...todo,
      title: trimmedTitle,
      description: trimmedDescription,
      timestamp: new Date().toLocaleString(),
      isEdited: true,
      priority: todo.priority || "",    
    };

    try {
      await axios.put(`http://localhost:8000/tasks/${todo.id}`, updatedTodo);
      updatedTodos[editingIndex] = updatedTodo;
      setPrevTodos(updatedTodos);
      triggerToast("✏️ Todo edited successfully");
    }
    catch (err) {
      console.error("Editing of to-do failed", err);
    }

    setNewTitle("");
    setNewDescription("");
    setIsEditing(false);
    setEditingIndex(null);
  };

  // comment added for this function
  const handleCancelEdit = () => {
    setNewTitle("");
    setNewDescription("");
    setIsEditing(false);
    setEditingIndex(null);
  };

  // comment added for this function
  const handlePriorityChange = async (index, level) => {
    const updated = [...prevTodos];
    if (updated[index]) {
      updated[index].priority = level;
      setPrevTodos(updated);
      try {
        await axios.patch(`http://localhost:8000/tasks/${updated[index].id}`, {
          priority: level,
        });
      } 
      catch (err) {
        console.error("Change of task priority failed", err);
      }
    }
  };
    
  // comment added for this function
  const handleToggleComplete = async (index) => {
    const updatedTodos = [...prevTodos];
    updatedTodos[index].isComplete = !updatedTodos[index].isComplete;
    setPrevTodos(updatedTodos);
    
    try {
      await axios.patch(`http://localhost:8000/tasks/${updatedTodos[index].id}`, {
        isComplete: updatedTodos[index].isComplete,
      });
    } 
    catch (err) {
      console.error("Failed to show task completion", err);
    }

    if (updatedTodos[index].isComplete) {
      jsConfetti.current?.addConfetti();      // comment added
      triggerToast("✅🎉 Task completed!");
    }
  };

  // fetch tasks from backend for the logged-in user
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!userId) return;       // no user logged in
        const response = await axios.get(
          `http://localhost:8000/tasks?userId=${userId}`
        );
        const enrichedTodos = response.data.map((todo) => ({
        ...todo,
        isComplete: todo.isComplete || false,     
      }));
      setPrevTodos(enrichedTodos);
      }
      catch (err) {
        console.error("Fetching tasks failed", err);
      }
    };
    fetchTasks();
  }, [userId]);

  // comment added
  useEffect(() => {
    jsConfetti.current = new JSConfetti();
  }, []);

  const triggerToast = (message) => {
    setToastMsg(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  return (
    <div className="container my-5">
      <div className="todo-list">
        {prevTodos.map((todo, index) => (
          <div
            className={`todo-list-items position-relative ${
              todo.priority ? `${todo.priority.toLowerCase()}-bg` : ""
            }`}
            key={index}>
            {editingIndex === index ? (
              <>
              <div className="todo-edit-rows">
                <div className="todo-input-items">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Edit your task's Title"
                    value={newTitle}
                    onChange={handleNewTitle}
                  />
                </div>

                <div className="todo-input-items">
                  <label>Description</label>
                  <input
                    type="text"
                    placeholder="Edit your task's Description"
                    value={newDescription}
                    onChange={handleNewDescription}
                  />
                </div>
              </div>

                <div className="edit-buttons mt-3">
                  <button className="btn btn-success" onClick={handleSaveEdit}>
                    Save
                  </button>
                  <button
                    className="btn btn-secondary ms-2"
                    onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {todo.isComplete && (
                  <span className="position-absolute badge rounded-pill">
                    Completed!
                  </span>
                )}

                <div>
                  <h3>{todo.title}</h3>
                  <p>{todo.description}</p>
                  <small className="timestamp">
                    {todo.isEdited
                      ? `Edited on: ${todo.timestamp}`
                      : `Created on: ${todo.timestamp}`}
                  </small>
                </div>

                <div className="task-actions">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch" 
                      id={`switchCheck-${index}`}   // comment added
                      checked={todo.isComplete}    // comment added
                      onChange={() => handleToggleComplete(index)}
                      // comment added
                    />
                  </div>

                  <MdDeleteOutline
                    className="icon"
                    onClick={() => handleDeleteTodo(index)}
                  />
                  <FaRegEdit
                    className="edit-icon"
                    onClick={() => handleOnEdit(index)}
                  />

                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      Priority
                    </button>
                    <ul className="dropdown-menu dropdown-menu-dark">
                      {["Low", "Medium", "High"].map((level) => (
                        <li key={level}>
                          <button
                            type="button"
                            className={`dropdown-item ${level.toLowerCase()}-priority`}
                            onClick={() => handlePriorityChange(index, level)}>
                            {level}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

    <AlertClearOneTask
        show={showAlert}
        title={
          pendingDeleteIndex !== null
            ? prevTodos[pendingDeleteIndex]?.title
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <AlertClearAll
        show={showClearAllAlert}
        onConfirm={confirmClearAll}
        onCancel={cancelClearAll}
      />

      {prevTodos.length > 0 ? (
        <button
          className="clear-all-btn"
          onClick={() => setShowClearAllAlert(true)}>
            Clear All
        </button>
        ) : (
        <div className="no-tasks-message">
            <h2>No Tasks Available</h2>
            <h3>Go to <Link to="/home">Home</Link> page</h3>
          </div>
        )
      }

      <Toast message={toastMsg} show={showToast} />
    </div>
  );
}
