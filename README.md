# Super Ad Manager Backend

This repository contains the backend server for the Super Ad Manager project. The backend is built with Node.js, Express, and MongoDB, and it provides APIs for managing advertisement campaigns and generating recommendations. The server also utilizes Socket.io for real-time logging and data updates.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Recommendation Logic](#recommendation-logic)
- [Contributing](#contributing)
- [License](#license)

## Features

- API endpoints for managing campaigns
- Real-time logging with Socket.io
- Worker threads for data generation
- MongoDB integration for storing campaign data
- Error handling middleware

## Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- Socket.io
- Worker Threads
- Heroku (for deployment)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/super-ad-manager-backend.git
   cd super-ad-manager-backend
2. Install the dependencies:
    ```bash
    yarn Install
3. Set up environment variables:
Create a .env file in the root directory and add the following variables:

    ```bash
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string

## Usage
To start the server, run:

    yarn start

This will start the server on the port specified in the .env file.

## API Endpoints
- POST /api/initialize-db: Initializes the database with generated data.
-   POST /api/campaign: Processes campaign recommendations based on input parameters.
- GET /api/record-counts: Retrieves the counts of impressions and clicks from the database.

# Recommendation Logic

The recommendation logic is implemented in the `campaignController.js` file. Here's a detailed explanation of how the recommendations are generated:

1. **Receive Campaign Data**: The server receives the campaign data through a POST request to the `/api/campaign` endpoint. The request body contains the banner size, category, and budget.

2. **Data Fetching**: The server fetches impressions and clicks data from the MongoDB database based on the provided banner size and category. This is done using Mongoose queries.

3. **Calculate Metrics**:
    - **Total Impressions and Clicks**: The server calculates the total number of impressions and clicks for the given banner size and category.
    - **Average Clicks per Impression**: This is calculated by dividing the total number of clicks by the total number of impressions.
    - **Unique Users**: The server calculates the number of unique users by using a Set to filter out duplicate user IDs from the impressions data.

4. **Bid Calculations**:
    - **Total Bids**: The server sums up all the bids from the impressions data.
    - **Average Bid**: This is calculated by dividing the total bids by the total number of impressions.
    - **Predicted Impressions**: The predicted number of impressions is calculated by dividing the budget by the average bid.
    - **Predicted Clicks**: The predicted number of clicks is calculated by multiplying the predicted impressions by the average clicks per impression.
    - **Predicted Unique Users**: The predicted number of unique users is calculated by scaling the unique users proportionally to the predicted impressions.
    - **Recommended Bid**: This is calculated by dividing the budget by the predicted impressions.

5. **Return Recommendations**: The server returns the calculated recommendations, including the predicted impressions, clicks, unique users, and recommended bid, to the client.
## Example Response

```json
{
  "impressions": 638,
  "clicks": 130,
  "uniqueUsers": 86,
  "recommendedBid": 5.06
}
