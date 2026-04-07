# Chat UI

A small static chat interface built with plain HTML, CSS, and JavaScript.

## Overview

This project renders a realistic messaging layout with:

- a conversation sidebar
- an active chat panel
- seeded sample threads and messages
- a send form with simulated replies
- responsive styling for desktop and mobile screens

## Project Structure

```text
chat_ui/
|-- README.md
`-- src/
    |-- index.html
    |-- styles.css
    `-- app.js
```

## Run Locally

Because this is a static frontend project, you can open it directly in a browser:

1. Open `src/index.html`

If you prefer serving it locally with a simple HTTP server, from the project root run:

```powershell
python -m http.server 8000 --directory src
```

Then visit `http://localhost:8000`.

## Files

- `src/index.html` sets up the app shell
- `src/styles.css` contains the full UI styling
- `src/app.js` renders chat threads, messages, and reply behavior

## Notes

- No build step or package installation is required
- Data is currently mocked in `src/app.js`
- Messages are not persisted after refresh
