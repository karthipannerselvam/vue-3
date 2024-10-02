# Slot Booking Dashboard

This project is a Vue.js-based web application that allows users to book available slots for events and view their booking history. It also includes a dashboard to visualize the feedback data using `Chart.js`, such as event ratings and remarks.

## Features

- **Slot Booking**: Users can view available slots for different events, select a venue and time slot, and book it.
- **Booking History**: Users can view their previously booked slots, including event name, date, and venue.
- **Feedback Visualization**: A dashboard that visualizes event feedback in the form of bar charts, displaying ratings and remarks for each event.
- **User Authentication**: JWT-based user authentication, ensuring only authorized users can book slots.



## Technologies Used

- **Vue.js**: Frontend framework used to create a responsive UI.
- **Axios**: For making HTTP requests to the backend.
- **Chart.js**: For generating dynamic bar charts to visualize feedback data.
- **Node.js (Backend)**: Handles slot management, authentication, and feedback data. (Backend code not included in this repository.)

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [Vue CLI](https://cli.vuejs.org/) installed globally (`npm install -g @vue/cli`)

### Steps to Run Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/karthipannerselvam/vue-3
   cd myapp
