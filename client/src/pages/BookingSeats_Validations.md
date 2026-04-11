# BookingSeats Page - Validation Documentation

## Overview

The BookingSeats page (`BookingSeats.jsx`) implements both **client-side** and **server-side** validations to ensure bookings are valid before submission. This document outlines all validation rules enforced across the frontend and backend.

---

## Client-Side Validations (Frontend)

### 1. Authentication Check
- **Rule:** User must be logged in to book a seat.
- **Message:** _"Log in as a student to book a seat."_ (with link to login page)
- **Button State:** Disabled; shows "Login Required"

### 2. Role-Based Access
- **Rule:** Only users with the role `user` (student) can book seats.
- **Message:** _"Only students can book seats. You are logged in as an {role}."_
- **Button State:** Disabled

### 3. Number of Seats Validation
- **Rule:** Number of seats must be at least 1 (no zero or negative values allowed).
- **Input Constraint:** `min={1}`, `max={20}` on the number input field.
- **Message:** _"Number of seats must be at least 1."_
- **Button State:** Disabled when `numSeats <= 0`

### 4. Past Date Validation
- **Rule:** Users cannot select a date in the past.
- **Input Constraint:** `min={defaultDate}` attribute on the date input (today's date).
- **Message:** _"You cannot select a past date."_
- **Button State:** Disabled when `date < defaultDate`

### 5. Time Range Validation (`isTimeValid`)
The `isTimeValid()` function enforces the following rules:
- **Start Time** must not be empty.
- **End Time** must not be empty.
- **End Time** must be strictly after Start Time (`time < endTime`).
- **Start Time** must be at or after `08:00`.
- **End Time** must be at or before `22:00`.
- **Message:** _"Bookings must strictly fall between 08:00 AM and 10:00 PM, and your End Time must be after your Start Time. Please adjust!"_
- **Button State:** Disabled when time is invalid

### 6. Seat Selection Validation
- **Rule:** The user must select exactly the number of seats specified in the "Number of seats" input.
- **Button Text:** Shows _"Select X more seat(s)"_ until sufficient seats are selected.
- **Button State:** Disabled when `selectedSeats.length < numSeats`

### 7. Unavailable Seat Prevention
- **Rule:** Users cannot select seats that are already booked by others during an overlapping time window.
- **Behavior:** Unavailable seats are visually styled differently and are unclickable.
- **Logic:** Fetches existing bookings for the selected area and date, then calculates time-overlap to determine which seats are taken.

### 8. Seat Deselection on Overlap Change
- **Rule:** If a user has selected seats and then changes the time range such that those seats become unavailable, those seats are automatically deselected.

---

## Server-Side Validations (Backend)

### 1. Double-Booking Prevention
- **Route:** `POST /api/bookings`
- **Rule:** Before creating a booking, the server checks all active bookings for the same category, area, and date. It then filters bookings whose time range overlaps with the requested time range. If any of the requested seats are already booked in an overlapping slot, the booking is rejected.
- **Response:** `400 - "One or more seats are already booked for this slot."`

### 2. Required Fields (Mongoose Schema)
The Booking model enforces the following required fields:
| Field      | Type     | Required |
|------------|----------|----------|
| `category` | String   | Yes      |
| `area`     | String   | Yes      |
| `date`     | String   | Yes      |
| `time`     | String   | Yes      |
| `endTime`  | String   | Yes      |
| `seats`    | [String] | Yes      |
| `user`     | ObjectId | No       |
| `status`   | String   | No (defaults to `active`) |

---

## Validation Priority Order (UI)

The validations are displayed in a priority chain. Only the **first failing** validation message is shown at a time:

1. Not logged in → _"Log in as a student"_
2. Wrong role → _"Only students can book seats"_
3. Invalid seat count → _"Number of seats must be at least 1"_
4. Past date → _"You cannot select a past date"_
5. Invalid time range → _"Bookings must strictly fall between 08:00 AM and 10:00 PM..."_

---

## Button Disable Conditions

The "Book your spot" button is disabled when **any** of the following conditions are true:

```
selectedSeats.length < numSeats
|| numSeats <= 0
|| date < defaultDate
|| loading
|| !currentUser
|| currentUser.role !== 'user'
|| !isTimeValid()
```

---

## Default Value Logic

| Field       | Default Value                                                        |
|-------------|----------------------------------------------------------------------|
| `date`      | Today's date (`YYYY-MM-DD`)                                         |
| `time`      | Current time, clamped between `08:00` and `21:00`                   |
| `endTime`   | 1 hour after start time, capped at `22:00`                          |
| `numSeats`  | `1`                                                                  |
