import React from "react";

export default function TodoForm({
  newTitle,
  newDescription,
  isEditing,
  handleNewTitle,
  handleNewDescription,
  handleAddTodo,
  handleSaveEdit,
  handleCancelEdit,
}) {
  return (
    <div className="todo-input">
      <div className="todo-input-item">
        <label>Title</label>
        <input
          type="text"
          placeholder="What's your task?"
          value={newTitle}
          onChange={handleNewTitle}
        />
      </div>

      <div className="todo-input-item">
        <label>Description</label>
        <input
          type="text"
          placeholder="Enter your task's description"
          value={newDescription}
          onChange={handleNewDescription}
        />
      </div>

      <div className="todo-input-item">
        <button
          type="button"
          className="primaryBtn"
          onClick={handleAddTodo}
          disabled={isEditing}>
          +
        </button>

        {isEditing && (
          <div className="edit-buttons mt-3">
            <button 
              className="btn btn-success" 
              onClick={handleSaveEdit}>
              Save
            </button>
            <button
              className="btn btn-secondary ms-2"
              onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}