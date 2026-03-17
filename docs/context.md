# Agora — Civic Issue Mapping Platform

## Overview

Agora is a map-based civic reporting platform designed to help citizens identify, document, and track urban infrastructure problems in a transparent and structured way.

The core idea is simple:

Cities have problems (potholes, garbage, broken roads), but those problems remain unresolved because they are either not reported properly, lack proof, or are scattered across disconnected systems.

Agora solves this by creating a **single, map-driven system** where:

* citizens report issues with location + photo
* issues are publicly visible
* communities validate reports
* accountability is enforced through data

---

## Core Problem

Urban infrastructure issues persist because:

* No precise location data
* No visual proof
* No centralized reporting system
* Lack of accountability tracking
* Poor visibility of issue density across areas

Agora addresses all of these by combining **maps + user-generated data + public visibility**.

---

## Core Idea

Agora acts as a **digital public square for civic issues**.

Users interact with a live city map, report issues directly on it, and contribute to a shared dataset of real-world infrastructure problems.

Each issue becomes:

* geo-tagged
* publicly visible
* trackable over time
* verifiable by others

---

## Key Features

### 1. Interactive Map

* Displays city (starting with Bangalore)
* Shows issues as markers
* Supports zoom, pan, clustering
* Filters by category and status

---

### 2. Issue Reporting

Users can:

* click on a map location
* upload an image
* select issue category
* add description
* submit report

Each report includes:

* latitude & longitude
* timestamp
* image evidence
* category
* description

---

### 3. Issue Categories

* Potholes / road damage
* Garbage / sanitation
* Drainage issues
* Broken footpaths
* Streetlight problems
* Water leakage
* Others (extensible)

---

### 4. Issue Status Tracking

Each issue has a lifecycle:

* Reported
* In Progress
* Resolved
* Rejected

Status updates can be handled by admins or authorities.

---

### 5. Community Validation

To prevent fake or low-quality reports:

* users can upvote issues
* confirm if issue exists
* add comments

Higher engagement = higher credibility.

---

### 6. Area-Based Insights

Issues can be grouped by:

* wards
* constituencies
* zones

Enables:

* heatmaps
* issue density visualization
* comparative analysis

---

### 7. Image-Based Reporting

Images are mandatory for credibility.

System stores:

* image URL
* metadata
* linked issue

Future scope:

* AI-based issue detection (potholes, garbage, etc.)

---

### 8. Search and Filters

Users can filter issues by:

* category
* status
* location
* popularity (votes)

---

### 9. Real-Time Updates (Optional Advanced Feature)

* newly reported issues appear instantly
* status updates reflect live

---

### 10. Admin / Authority Dashboard (Future)

* view all issues
* filter by region
* update status
* track resolution metrics

---

## System Architecture

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Mapbox GL JS or Leaflet

### Backend

* Next.js API routes
* Node.js
* Prisma ORM

### Database

* PostgreSQL
* (Optional) PostGIS for geospatial queries

### Storage

* Cloudinary / AWS S3 for images

### Authentication

* NextAuth (Google login)

---

## Data Models

### User

* id
* name
* email
* avatar
* createdAt

---

### Issue

* id
* title
* description
* category
* latitude
* longitude
* status
* createdBy (userId)
* createdAt

---

### Image

* id
* url
* issueId

---

### Vote

* id
* userId
* issueId

---

### Comment (optional)

* id
* userId
* issueId
* content
* createdAt

---

## Folder Structure

/app
/map
/report
/issue/[id]

/components
MapView
IssueMarker
IssueCard
UploadForm
Filters

/lib
prisma
cloudinary
geo

/api
issues
upload
votes
auth

---

## Expected Behavior

* Map loads with clustered issue markers
* Clicking marker shows issue details
* Users can create reports with image + location
* Reports appear on map immediately
* Users can validate and interact with issues
* Data updates dynamically

---

## MVP Scope

Build only:

* map with markers
* issue reporting
* image upload
* basic issue display
* status field

Avoid overbuilding initially.

---

## Future Enhancements

* AI-based issue detection from images
* heatmap visualization
* authority integration
* automated complaint generation
* push notifications
* gamification (points, badges)
* mobile app version

---

## Design Principles

* simple and clean UI
* map-first experience
* minimal friction for reporting
* high data credibility
* scalable architecture

---

## Goal

To create a **public, transparent, and data-driven system** where:

* citizens can report issues easily
* problems are visible to everyone
* authorities can act based on real data

Agora aims to make urban problems **visible, verifiable, and impossible to ignore**.
