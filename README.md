# CivicConnect Municipality Complaint Portal

CivicConnect is a responsive municipality complaint portal where citizens can report city problems and track the status of their tickets. It is built as a practical civic service interface for issues that come under a city municipality.

## Features

- Citizen complaint form with category, ward, priority, contact, location, and issue details
- Automatic municipal ticket generation
- Ticket tracking with department assignment, response date, and progress timeline
- Municipal staff queue for reviewing complaints and moving tickets through statuses
- Service directory for water, roads, sanitation, street lights, drainage, parks, stray animals, and public safety
- Help desk section with citizen guidance and support contacts
- Local browser storage for demo complaint data
- Responsive design for desktop and mobile

## Tech Stack

- Next.js / Vinext
- React
- TypeScript
- Tailwind CSS
- Shadcn UI components
- Lucide React icons

## Run Locally

```bash
npm install
npm run dev
```

Then open the local development URL shown in your terminal.

## Build

```bash
npm run build
```

## Notes

This version is a working frontend demo. For a real municipality deployment, connect the complaint form to a database, add citizen/staff authentication, replace sample wards and contacts with official city data, and add file/photo uploads for issue evidence.
