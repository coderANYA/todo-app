import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import Toast from "./Toast";
import axios from "axios";

export default function Home() {
  const [prevTodos, setPrevTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  
  const handleNewTitle = (event) => {
    setNewTitle(event.target.value);
  };

  const handleNewDescription = (event) => {
    setNewDescription(event.target.value);
  };

  // 🗑️ Delete todo from server : COMMENT ADDED
  const handleDeleteTodo = async (index) => {
    try {
      const todo = prevTodos[index];
      await axios.delete(`http://localhost:8000/tasks/${todo.id}`);
      const updated = prevTodos.filter((_, i) => i !== index);
      setPrevTodos(updated);
      triggerToast("🗑️ Todo deleted successfully"); 
    }
    catch (err) {
      console.error(err);
      triggerToast("⚠️ Failed to delete todo");
    }
  };

  // ✏️ Start editing : COMMENT ADDED
  const handleOnEdit = (index) => {
    const todo = prevTodos[index];
    setNewTitle(todo.title);
    setNewDescription(todo.description);
    setIsEditing(true);
    setEditingIndex(index);

    const updated = [...prevTodos];
    updated[index].visible = false;
    setPrevTodos(updated);
  };

  // 💾 Save edit : COMMENT ADDED
  const handleSaveEdit = async () => {
    const trimmedTitle = newTitle.trim();
    const trimmedDescription = newDescription.trim();

    if (!trimmedTitle || !trimmedDescription) {
      triggerToast("🔔 Title and/or description fields can't be empty")
      return;
    }
    
    const hasAlphabets = /[a-zA-Z]/;
    if (
      !hasAlphabets.test(trimmedTitle) ||
      !hasAlphabets.test(trimmedDescription)) {
        triggerToast("🔔 Use at least one alphabet in your title & description")
        return;
    };
    
    const now = new Date();
    const editedAt = now.toLocaleString();

    const updatedTodos = [...prevTodos];
    const updatedTodo = {
      ...updatedTodos[editingIndex],
      title: trimmedTitle,
      description: trimmedDescription,
      timestamp: editedAt,
      isEdited: true,
      visible: true,
      priority: updatedTodos[editingIndex].priority || "",   // comment added
    };

    try {
      await axios.patch(
        `http://localhost:8000/tasks/${updatedTodo.id}`,
        updatedTodo
      );
      updatedTodos[editingIndex] = updatedTodo;
      setPrevTodos(updatedTodos);
      triggerToast("✏️ Todo edited successfully");
    }
    catch (err) {
      console.error(err);
      triggerToast("⚠️ Failed to update todo");
    }

    setNewTitle("");
    setNewDescription("");
    setIsEditing(false);
    setEditingIndex(null);

    // Auto-hide again after 15 seconds
    setTimeout (async () => {
      const hiddenAgain = [...updatedTodos];
      hiddenAgain[editingIndex].visible = false;
      setPrevTodos(hiddenAgain);
      
      // Persist to JSON server
      try {
        await axios.patch(
          `http://localhost:8000/tasks/${hiddenAgain[editingIndex].id}`,
          { visible: false }
        );
      }
      catch (err) {
        console.error("⚠️ Failed to auto-hide todo", err);
      }
    }, 15000);
  };

  // ❌ Cancel editing : COMMENT ADDED
  const handleCancelEdit = () => {
    setNewTitle("");
    setNewDescription("");
    setIsEditing(false);

    const index = editingIndex;
    // Temporarily show the todo again
    const updated = [...prevTodos];
    updated[index].visible = true;
    setPrevTodos(updated);
    setEditingIndex(null);

    setTimeout (async () => {
      const hiddenAgain = [...updated];
      hiddenAgain[index].visible = false;
      setPrevTodos(hiddenAgain);
      
      try {
        await axios.patch(
          `http://localhost:8000/tasks/${hiddenAgain[index].id}`,
          { visible: false }
        );
      }
      catch (err) {
        console.error("⚠️ Failed to auto-hide todo", err);
      }
    }, 15000);
  };

  // 🚦 Change priority : COMMENT ADDED
  const handlePriorityChange = async (index, level) => {
    const updated = [...prevTodos];
    if (updated[index]) {
      updated[index].priority = level;
      try {
        await axios.patch(
          `http://localhost:8000/tasks/${updated[index].id}`,
          { priority: level }
        );
        setPrevTodos(updated);
      }
      catch (err) {
        console.error(err);
        triggerToast("⚠️ Failed to update priority");
      }
    }
  };

  // ➕ Add todo : COMMENT ADDED
  const handleAddTodo = async () => {
    // Trim input values first
    const trimmedTitle = newTitle.trim();
    const trimmedDescription = newDescription.trim();

    // Block empty or whitespace-only input
    if (!trimmedTitle || !trimmedDescription) {
      triggerToast("🔔 Title and/or description fields can't be empty");
      return;
    }

    // ✅ Block inputs with only numbers or special characters (no alphabets)
    const hasAlphabets = /[a-zA-Z]/;
    if (
      !hasAlphabets.test(trimmedTitle) ||
      !hasAlphabets.test(trimmedDescription)) {
        triggerToast("🔔 Use at least one alphabet in your title & description")
        return;
    };

    const now = new Date();
    const createdAt = now.toLocaleString();
    // ✅ Format: "7/29/2025, 6:45:12 PM"

    const user = JSON.parse(localStorage.getItem("user_login"));

    // Create the new todo object
    const newTodoItem = {
      title: trimmedTitle,
      description: trimmedDescription,
      timestamp: createdAt,
      isEdited: false,
      visible: true,
      priority: "",     // Empty or null means no priority yet
      userId: user.id,
    };

    // Check for duplicate based on title & description content  (case-insensitive)
    const isDuplicate = prevTodos.some(
      (todo) =>
        todo.title.toLowerCase() === newTodoItem.title.toLowerCase() &&
        todo.description.toLowerCase() === newTodoItem.description.toLowerCase()
    );

    if (isDuplicate) {
      triggerToast("❗Todo already exists");
      return;
    }

    // If not duplicate, add it
    try {
      const res = await axios.post("http://localhost:8000/tasks", newTodoItem);
      const updatedTodoArray = [...prevTodos, res.data];
      setPrevTodos(updatedTodoArray);
      triggerToast(
      <>
        😊 Todo created successfully. Check{" "}
        <Link to="/all" className="link-blue">
          MyTasks
        </Link>
      </>
      );

      setTimeout (async () => {
        const hidden = [...updatedTodoArray];
        const lastTodo = hidden[hidden.length - 1];
        lastTodo.visible = false;
        setPrevTodos(hidden);
      
        try {
          await axios.patch(
          `http://localhost:8000/tasks/${lastTodo.id}`,
          { visible: false }
          );
        }
        catch (err) {
          console.error("⚠️ Failed to auto-hide todo", err);
        }
      }, 15000);
    }
    catch (err) {
      console.error(err);
      triggerToast("⚠️ Failed to create todo");
    }

    setNewTitle("");
    setNewDescription("");
  };

  const triggerToast = (message) => {
    setToastMsg(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);    // Hide the toast after showing it for 5 seconds
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">
        Create your task for today.
      </h1>

      <div className="todo-wrapper overflow-x-hidden overflow-y-auto">
        <TodoForm
          newTitle={newTitle}
          newDescription={newDescription}
          isEditing={isEditing}
          handleNewTitle={handleNewTitle}
          handleNewDescription={handleNewDescription}
          handleAddTodo={handleAddTodo}
          handleSaveEdit={handleSaveEdit}
          handleCancelEdit={handleCancelEdit}
        />
        <TodoList
          todos={prevTodos}
          handleDeleteTodo={handleDeleteTodo}
          handleOnEdit={handleOnEdit}
          handlePriorityChange={handlePriorityChange}
        />
      </div>

      <Toast message={toastMsg} show={showToast} />
    </div>
  );
}

