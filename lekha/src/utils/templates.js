export const noteTemplates = [
  {
    id: 'daily-routine',
    title: 'Daily Routine',
    content: `<h2>Morning Routine</h2>
<ul>
  <li>Wake up time: </li>
  <li>Exercise: </li>
  <li>Breakfast: </li>
  <li>Priority tasks: </li>
</ul>

<h2>Afternoon</h2>
<ul>
  <li>Lunch: </li>
  <li>Main work tasks: </li>
  <li>Breaks: </li>
</ul>

<h2>Evening Routine</h2>
<ul>
  <li>Dinner: </li>
  <li>Relaxation: </li>
  <li>Tomorrow's prep: </li>
  <li>Bedtime: </li>
</ul>`,
    tags: ['routine', 'daily'],
  },
  {
    id: 'meeting-notes',
    title: 'Meeting Notes',
    content: `<h2>Meeting Details</h2>
<p><strong>Date:</strong> </p>
<p><strong>Attendees:</strong> </p>
<p><strong>Agenda:</strong> </p>

<h2>Key Discussion Points</h2>
<ul>
  <li></li>
  <li></li>
  <li></li>
</ul>

<h2>Action Items</h2>
<ul>
  <li>[ ] Task 1 - Assigned to: </li>
  <li>[ ] Task 2 - Assigned to: </li>
</ul>

<h2>Next Steps</h2>
<p></p>`,
    tags: ['meeting', 'work'],
  },
  {
    id: 'to-do-list',
    title: 'To-Do List',
    content: `<h2>Priority Tasks</h2>
<ul>
  <li>[ ] </li>
  <li>[ ] </li>
  <li>[ ] </li>
</ul>

<h2>Secondary Tasks</h2>
<ul>
  <li>[ ] </li>
  <li>[ ] </li>
</ul>

<h2>Future Tasks</h2>
<ul>
  <li>[ ] </li>
  <li>[ ] </li>
</ul>

<h2>Completed</h2>
<ul>
  <li>[x] </li>
</ul>`,
    tags: ['tasks', 'productivity'],
  },
  {
    id: 'project-planning',
    title: 'Project Planning',
    content: `<h2>Project Overview</h2>
<p><strong>Project Name:</strong> </p>
<p><strong>Start Date:</strong> </p>
<p><strong>Deadline:</strong> </p>
<p><strong>Team Members:</strong> </p>

<h2>Goals & Objectives</h2>
<ul>
  <li></li>
  <li></li>
</ul>

<h2>Milestones</h2>
<ol>
  <li></li>
  <li></li>
  <li></li>
</ol>

<h2>Resources Needed</h2>
<ul>
  <li></li>
  <li></li>
</ul>

<h2>Potential Risks</h2>
<ul>
  <li></li>
</ul>`,
    tags: ['project', 'planning'],
  },
  {
    id: 'study-notes',
    title: 'Study Notes',
    content: `<h2>Topic: </h2>
<p><strong>Date:</strong> </p>
<p><strong>Source:</strong> </p>

<h2>Key Concepts</h2>
<ul>
  <li><strong>Concept 1:</strong> </li>
  <li><strong>Concept 2:</strong> </li>
  <li><strong>Concept 3:</strong> </li>
</ul>

<h2>Important Points</h2>
<ul>
  <li></li>
  <li></li>
</ul>

<h2>Questions to Review</h2>
<ul>
  <li></li>
  <li></li>
</ul>

<h2>Summary</h2>
<p></p>`,
    tags: ['study', 'education'],
  },
  {
    id: 'workout-log',
    title: 'Workout Log',
    content: `<h2>Workout Details</h2>
<p><strong>Date:</strong> </p>
<p><strong>Duration:</strong> </p>
<p><strong>Type:</strong> </p>

<h2>Warm-up</h2>
<ul>
  <li></li>
</ul>

<h2>Main Workout</h2>
<ul>
  <li><strong>Exercise 1:</strong> Sets x Reps - Weight</li>
  <li><strong>Exercise 2:</strong> Sets x Reps - Weight</li>
  <li><strong>Exercise 3:</strong> Sets x Reps - Weight</li>
</ul>

<h2>Cool Down</h2>
<ul>
  <li></li>
</ul>

<h2>Notes</h2>
<p>How did you feel? Any improvements or adjustments needed?</p>`,
    tags: ['fitness', 'health'],
  },
  {
    id: 'journal-entry',
    title: 'Journal Entry',
    content: `<h2>Date: </h2>

<h2>Today's Highlights</h2>
<ul>
  <li></li>
  <li></li>
</ul>

<h2>Gratitude</h2>
<p>Three things I'm grateful for today:</p>
<ol>
  <li></li>
  <li></li>
  <li></li>
</ol>

<h2>Reflections</h2>
<p></p>

<h2>Tomorrow's Goals</h2>
<ul>
  <li></li>
  <li></li>
</ul>

<h2>Mood: </h2>`,
    tags: ['journal', 'personal'],
  },
  {
    id: 'recipe',
    title: 'Recipe',
    content: `<h2>Recipe Name: </h2>
<p><strong>Prep Time:</strong> </p>
<p><strong>Cook Time:</strong> </p>
<p><strong>Servings:</strong> </p>

<h2>Ingredients</h2>
<ul>
  <li></li>
  <li></li>
  <li></li>
</ul>

<h2>Instructions</h2>
<ol>
  <li></li>
  <li></li>
  <li></li>
</ol>

<h2>Notes & Tips</h2>
<p></p>`,
    tags: ['recipe', 'cooking'],
  },
];