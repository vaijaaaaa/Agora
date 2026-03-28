# Agora — Civic Issue Mapping Platform

## Overview

Agora is a map-based platform for reporting and tracking urban infrastructure issues such as potholes, garbage, drainage problems, broken roads, and damaged public spaces.

It creates a centralized, location-based record of civic problems using user-submitted reports with images and geolocation.

---
 
## Problem

Urban issues often remain unresolved because:

* reports lack precise location
* no visual proof is provided
* complaints are scattered
* there is no public visibility or tracking

---

## Solution

Agora provides a map-first system where users can:

* report issues with image and location
* view issues on a map
* track status of reported problems
* validate issues through community interaction

---

## Features

* Interactive map with issue markers
* Report issue with image and geolocation
* Categories (pothole, garbage, drainage, footpath, streetlight, etc.)
* Status tracking (reported, in progress, resolved)
* Community validation (upvotes)
* Area-based issue visualization (planned)

---

## Tech Stack

Frontend:

* Next.js
* TypeScript
* Tailwind CSS
* Mapbox GL / Leaflet

Backend:

* Next.js API routes
* Prisma ORM

Database:

* PostgreSQL

Storage:

* Cloudinary / AWS S3

Authentication:

* NextAuth

---

## Project Structure

/app
/components
/lib
/app/api

---

## Getting Started

```bash
git clone https://github.com/your-username/agora
cd agora
npm install
npm run dev
```

Create a `.env` file:

```
DATABASE_URL=
NEXTAUTH_SECRET=
CLOUDINARY_URL=
MAPBOX_TOKEN=
```

---

## MVP Scope

* Map with markers
* Issue reporting
* Image upload
* Issue display
* Status field

---

## Goal

Build a system where civic issues are visible, documented, and trackable through a public map.
