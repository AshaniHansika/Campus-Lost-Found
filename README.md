# Campus Lost & Found + Claim Verification System

A full-stack web application for university students to post **Lost** and **Found** items, discover matching posts through **search + filters**, and safely return items using a **Claim Verification workflow**. The system reduces fake claims by requiring claimants to answer verification questions (and optionally provide evidence) before the finder/owner accepts or rejects the claim.

## Problem

In campus environments, lost items are common, but returning them is inefficient:

* Students post on random social media groups → posts get buried
* Fake claimers can easily pretend an item is theirs
* No standardized process for proof, communication, and closure

## Solution

This project provides a centralized platform with:

* **Structured Lost/Found postings** (category, location, time, photos)
* **Powerful discovery** (filters, search, pagination, sorting)
* A **Claim Verification process** that asks ownership questions before handover
* A clean dashboard for users and moderation tools for admins

---

## Key Features

### 1) Authentication & User Roles

* Secure **JWT-based authentication**
* Roles:

  * **Student**: create posts, claim items, message, report posts
  * **Admin**: moderate posts, review reports, manage abusive content

### 2) Lost & Found Item Management

* Create and manage item posts:

  * Type: `Lost` or `Found`
  * Category (ID card, wallet, phone, keys, bag, etc.)
  * Location (campus places)
  * Date/time lost or found
  * Description + optional photos
* Post states:

  * `Active` → visible and claimable
  * `Claimed` → under review via claim workflow
  * `Returned` → item successfully returned
  * `Removed` / `Pending` (optional moderation)

### 3) Search, Filters, Sorting & Pagination

A real-world listing experience using server-side querying:

* Filters:

  * Lost/Found type
  * Category
  * Location
  * Status
  * Date range
* Keyword search in title/description
* Sorting (newest first, etc.)
* Pagination for performance

### 4) Claim Verification Workflow (Core Feature)

To prevent fake claims, items are returned through a verification process:

**Claim states**

* `Requested` → claimant sends request
* `Awaiting Answers` → verification questions shown
* `Answers Submitted` → claimant provides answers/evidence
* `Accepted` → finder approves, item marked as Returned
* `Rejected` → finder rejects the claim
* `Cancelled` → claimant cancels request

**Verification Questions**
When creating a Found post, the finder can:

* Use **system-generated questions** based on category (recommended)
* Or add **custom questions** (e.g., unique marks, exact contents, lock screen)

Example questions:

* “What is the color of the inner pocket?”
* “What sticker/scratch is on the item?”
* “What is the wallpaper on the phone?”
* “What is written on the first page of the notebook?”

**Decision**
The finder reviews answers and chooses:

* ✅ Accept (marks item as returned and closes claim)
* ❌ Reject (closes claim)
* 🔁 Request more info (optional enhancement)

### 5) Messaging per Claim (Optional / Advanced)

A simple chat thread linked to each claim:

* Only claimant and finder can message
* Keeps all communication tied to the claim case

### 6) Reports & Admin Moderation

* Students can report suspicious posts (spam, scam, misleading info)
* Admin dashboard to:

  * Review reports
  * Remove posts
  * Take action on abusive users (optional)

---

## Tech Stack

### Frontend

* **React** (SPA)
* **Ant Design (AntD)** for UI components (Tables, Forms, Upload, Tags, Tabs)
* **Tailwind CSS** for layout, responsiveness, and custom styling
* Axios (API calls) + optional React Query

### Backend

* **Node.js + Express**
* **MongoDB + Mongoose**
* JWT Authentication + Role-Based Access Control (RBAC)
* Input validation (Zod/Joi) (recommended)
* File uploads via Multer + Cloudinary (or local storage for MVP)

---

## Main Pages (UI)

* **Home / Listings**: Item table/cards with filters + pagination
* **Item Details**: Full item info + claim action
* **Post Item**: Create lost/found post (with image upload)
* **Dashboard**:

  * My Posts
  * Claims I Made
  * Claims on My Items
* **Claim Details**:

  * Verification questions + answer submission
  * Status timeline
  * Messaging (optional)
* **Admin Panel**:

  * Report review
  * Post moderation

---
## MVP Scope (Minimum Viable Product)

* Auth (JWT)
* Item CRUD
* Listing filters + pagination
* Claim request + verification answers
* Accept/reject claim
* User dashboard

## Future Enhancements

* Email / in-app notifications
* Map-based location selection
* Image similarity suggestion for matching lost/found
* Analytics dashboard (most common lost items, average return time)
* Admin user bans and audit logs

---

## Learning Outcomes

This project provides hands-on experience with:

* Full-stack CRUD + REST API design
* MongoDB schema design + query optimization (filters, pagination)
* Authentication, authorization, and protected routes
* Real-world workflow implementation (claim verification states)
* UI/UX building with AntD forms, tables, and responsive Tailwind layouts

---

If you want, I can also generate a **nice README “Project Setup” section** (frontend/backend install commands, env variables, folder structure) based on how you plan to organize the repo (monorepo vs separate folders).
