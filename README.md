# Silent Crisis Reporting System (SCRS)

A privacy-first, anonymous, web-based application for a college environment that allows students or employees to report any kind of issue without login and without revealing their identity.

## Features

- **Anonymous Reporting**: Submit reports with category, description, and optional images without any user identity (no name, email, IP storage).
- **Rule-Based Severity**: Automatic classification of issues (LOW, MEDIUM, HIGH, CRITICAL) based on transparent keyword rules.
- **Privacy-First**: No user data stored. Images are stripped of metadata. Rate limiting uses hashed IPs.
- **Public Feed**: View and upvote issues.
- **Admin Dashboard**: Read-only view for authorities to see reports sorted by severity or priority.

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Image Processing**: Sharp

## Project Structure

- `server/`: Backend API and logic.
- `client/`: Frontend React application.

## How to Run

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or a URI)

### Backend

1. Navigate to `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:4000`.

### Frontend

1. Navigate to `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:3000`.

## Privacy & Ethics

- **No Identity Storage**: We do not store names, emails, or user IDs.
- **Hashed IP Rate Limiting**: IPs are hashed immediately for rate limiting and never stored in plain text.
- **Metadata Stripping**: All uploaded images are re-encoded to remove EXIF data (location, device info).
