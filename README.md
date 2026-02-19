Campus Life Planner

Campus Life Planner is a web application that helps students organize their campus life by managing tasks, tracking study duration, and using tags to organize activities. It also supports weekly study caps and allows display in minutes or hours.

Features

Add, view, and delete tasks – manage all your study tasks in one place.

Input validation – ensures task titles, dates, durations, and tags are correctly formatted.

Regex-supported task search – quickly find tasks by title, tag, or due date.

Dashboard – displays total tasks, total study duration, and top tag.

Weekly study cap notifications – warns when study duration exceeds the set weekly limit.

Duration display units – switch between minutes and hours.

How to Run Locally

Clone the repository:

git clone https://github.com/UN-Bonasse/campus-life-planner.git


Enter the project folder:

cd campus-life-planner


Install serve if not installed:

npm install -g serve


Start a local server:

npx serve .


Open the URL shown in your browser to start using the app.

File Structure
campus-life-planner/
│
├─ index.html          - Main HTML file
├─ scripts/
│   └─ main.js         - JavaScript for tasks, validation, search, and stats
├─ styles/
│   ├─ base.css        - Base styling
│   ├─ layout.css      - Layout styling
│   └─ components.css  - Components styling (forms, tables, buttons)
├─ seed.json           - Optional sample data
└─ README.md           - Project information

Submission Notes

Task input validation follows the rubric:

Title: 3–50 letters/numbers

Due date: required

Duration: positive number

Tag: 2–20 letters

Regex search is implemented for title, tag, and due date.

Dashboard updates in real time for total tasks, total study duration, and top tag.

Weekly study cap message updates dynamically based on total study duration.

Display units can switch between minutes and hours.

License

Free to use and modify.

Author

GitHub: UN-Bonasse
Email: b.ndekezi@alustudent.com