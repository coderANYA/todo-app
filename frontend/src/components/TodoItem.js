import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

export default function TodoItem({
  todo,
  index,
  handleDeleteTodo,
  handleOnEdit,
  handlePriorityChange,
}) {
  if (!todo.visible) return null;

  return (
    <div
      className={`todo-list-item position-relative ${
        todo.priority ? `${todo.priority.toLowerCase()}-bg` : ""
      }`}
      key={index}>

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
                  onClick = {() => handlePriorityChange(index, level)}>
                    {level}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
