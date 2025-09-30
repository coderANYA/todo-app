import React from 'react';
import './About.css';

export default function About() {
  return (
    <div className="container">
      <h2 className="mt-5 mb-5 text-center body-text">
        <strong>About Task It!</strong>
      </h2>
      <div className = "accordion-wrapper">
        <div className="accordion" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne">
                <strong>Plan your tasks</strong>
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              data-bs-parent="#accordionExample">
              <div className="accordion-body">
                Task It! gives you a way to plan and analyze your tasks quickly and efficiently. Be it daily tasks, weekly tasks or monthly tasks, you can write your TO-DOs, describe them in detail & can also categorize them on the basis of priority.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo">
                <strong>Free to Use</strong>
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample">
              <div className="accordion-body">
                Task It! is a free task planner tool that lets you track your tasks and check the status of your TO-DOs whether they are completed, in progress or yet to begin.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree">
                <strong>Browser Compatible</strong>
              </button>
            </h2>
            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample">
              <div className="accordion-body">
                This task planner software works in any web browsers such as Chrome, Firefox, Internet Explorer, Safari, Opera. You can easily use it without any worry.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
