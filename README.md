# lab7-mvc-crud


COMP305 2025 Lab 7 Assignment
## Goals
The goals of this project is to implement Separation of Concerns, using what we built in the previous lab and make it more maintainable. localStorage() will be added, and implementations of export and import buttons will be created. 

## Project structure

```
lab7-mvc-crud/
├─ LICENSE
├─ README.md
├─ .gitignore
├─  src/
├─  ├─ index.html
├─	├─ styles.css
├─	├─ js/
├─	├─	├─ app.js  # handles initialization aspect of the chatbot
├─	├─	├─ controller.js # handles the user actions, containing the event wiring and import/export logic
├─	├─	├─ model.js      # handles message list and provides CRUD operations
├─	├─	├─ view.js       # Renders messages to the DOM and provides soem small UI Helpers
└─  └─	└─ eliza.js      # Chat bot that responds to users inputs
```
## Process
My plan is to implement the edit, delete, and clear buttons first. Then separate code into model.js, view.js, and controller.js, and app.js. Next, I will implement the export and import function sall while cleaning up localStorage.

## Published page
Published page will be implemented later. Waiting on how to work CloudFlare or Netlify.
## Challenges
Struggled with the localStorage aspect of the chatbot. I was able to figure out an acceptable solution.

Struggled with hte importing of files. Was able to import the text, but wasnt' able to add new messages. I was able to figure out an acceptable solution.
## License
This project is licensed under the MIT License - see LICENSE.md for details.

## Author
Jackson Kelley