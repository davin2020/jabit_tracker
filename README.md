# jabit_tracker

## About
This is the API repo for Jabit Tracker, a Job Habit Tracker, created for the Troopl Hackathon in Feb 2022

The UI for this repo is here - https://github.com/davin2020/jabit_tracker_ui

The idea behind this app is to keep track of job-seeking habits that you can control eg how many applications you submit, or interviews that you attend

## Live Demo
Theres a demo available online at - https://jabit-tracker-ui.herokuapp.com/

## Current Features
- Register a new account
- Login an existing account
- View your personal details on the Dashboard page
![User Dashboard](jabit_tracker_dashboard.png)

## Coming Soon Features
- View your goals on the dashboard
- Add a new goal
- Mark a goal as commpleted
- Delete a goal
- Better styling and layout

## Tech Stack
- Mongo Altas Cloud DB
- Node
- Express
- React
- GraphQL API

## Install Locally
1) Firstly clone this repo locally
2) Run `npm install` to install the project dependencies
3) Run `nodemon index.js` to start the API

You should then be able to access the GraphiQL console by visting [http://localhost:4033/graphql](http://localhost:4033/graphql)

## Some Example GraphQL Queries and Mutations

### Get User with Email Address Specified
#### Query
```
query {
   	user (email: "marty@example.com"){
      _id
      email
      fullname
      password
      dream_job
    	motivation
    	total_points
   	}
}
```

#### Response
```
{
  "data": {
    "user": {
      "_id": "61fc511f67cde45b3477dfd9",
      "email": "marty@example.com",
      "fullname": "Marty McFly",
      "password": "$2b$10$1C30PmU34JHbvnziO7xYUOwRgP1uvcMLFovK0QlkytYmA7KgPwN9q",
      "dream_job": "Timetravelling DeLorean Racecar Driver",
      "motivation": "Going back to the Future. Time travel rocks!",
      "total_points": "88"
    }
  }
}
```

### Get Goals for Userid Specified
#### Query
```
query {
  goalsByUserid(userid: "61fc511f67cde45b3477dfd9") {
    name
    target_amount_goal
    target_unit
    target_amount_completed
    points
  }
}
```

#### Response
```
{
  "data": {
    "goalsByUserid": [
      {
        "name": "Apply for jobs as Racecar Driver",
        "target_amount_goal": 10,
        "target_unit": "Jobs",
        "target_amount_completed": 15,
        "points": 5
      },
      {
        "name": "Attend Race Car Driving Tests",
        "target_amount_goal": 10,
        "target_unit": "Tests",
        "target_amount_completed": 2,
        "points": 10
      }
    ]
  }
}
```

### Login a User witih Email and Password
#### Mutation
```
mutation {
    loginEmailAddress (email: "marty@example.com", password: "FAKE_PASSWORD") {
			_id
    	fullname
    	email
    	access_token
    	total_points
    }
}
```

#### Response
```
{
  "data": {
    "loginEmailAddress": {
      "_id": "61fc511f67cde45b3477dfd9",
      "fullname": "Marty McFly",
      "email": "marty@example.com",
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MWZjNTExZjY3Y2RlNDViMzQ3N2RmZDkiLCJlbWFpbCI6Im1hcnR5QGV4YW1wbGUuY29tIiwiaWF0IjoxNjQ0MTUyNTEzLCJleHAiOjE2NDQxNjMzMTN9.JAyMGffi2g0UwLQlp6PpE81aLdZlk2fgDpTuTqwoCkQ",
      "total_points": "88"
    }
  }
}
```

### Register a New User
#### Mutation
```
mutation {
    addUser (email: "docbrown@example.com", 
    fullname: "Doc Brown", 
    password: "FAKE_PASSWORD", 
    dream_job: "Time Travller",
  	motivation: "Going back to the future with Clara")
    {
        _id
      	fullname
        password
      	total_points
        access_token
    }
}
```

#### Response
```
{
  "data": {
    "addUser": {
      "_id": "61ffc83f28f64948746b1d09",
      "fullname": "Doc Brown",
      "password": "$2b$10$cN0aZREXJZfmIMW6tpDWeOJlnMCkgfVKh8BB5cb0z9KbkBN337d5W",
      "total_points": "0",
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MWZmYzgzZjI4ZjY0OTQ4NzQ2YjFkMDkiLCJlbWFpbCI6ImRvY2Jyb3duQGV4YW1wbGUuY29tIiwiaWF0IjoxNjQ0MTUyODk1LCJleHAiOjE2NDQxNjM2OTV9.jnACCwyDQLFtQIr8Pe644F8Oj5vstkCY6PEwxcYRdGo"
    }
  }
}
```

### Add a New Goal
#### Mutation
```
mutation {
    addGoalForUser (
      userid: "61fc511f67cde45b3477dfd9",
      name: "Attending Race Car Driver Interviews", 
      is_target_type: false, 
      target_amount_goal: 15,
      target_unit: "Interviews",
      target_amount_completed: 0,
      points: 5)
      {
          _id
          name
      }
}
```

#### Response
```
{
  "data": {
    "addGoalForUser": {
      "_id": "61ffc77028f64948746b1d07",
      "name": "Attending Race Car Driver Interviews"
    }
  }
}
```