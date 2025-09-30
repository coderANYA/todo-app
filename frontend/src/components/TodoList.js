import React from "react";
import TodoItem from "./TodoItem";

export default function TodoList({
  todos,
  handleDeleteTodo,
  handleOnEdit,
  handlePriorityChange,
}) 
{
  return (
    <div className="todo-list">
      {todos.map((todo, index) => (
        <TodoItem
          key={index}
          todo={todo}
          index={index}
          handleDeleteTodo={handleDeleteTodo}
          handleOnEdit={handleOnEdit}
          handlePriorityChange={handlePriorityChange}
        />
      ))}
    </div>
  );
}
