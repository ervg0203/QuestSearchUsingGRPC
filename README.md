# QuestSearchUsingGRPC
QuestSearch is a search application that allows users to explore a database of questions with real-time search and seamless pagination. Built with React, Node.js, gRPC, and MongoDB, it offers a responsive design optimized for all devices, ensuring efficient navigation and performance for question exploration and management.


## Features  

- **Real-time Search**: Instant results with autocomplete suggestions as you type.    
- **Pagination**: Easily navigate through large datasets with next/previous buttons.  
- **Responsive Design**: Fully optimized for all device sizes.  

---

## Technologies Used  

- **Frontend**: React
- **Backend**: Node.js  
- **Communication**: gRPC  
- **Database**: MongoDB  
- **API Documentation**: Protocol Buffers, gRPC-web  

---

## Requirements  

- **Node.js**: v14.0.0 or higher  
- **MongoDB**: A running MongoDB instance  
- **Docker**: Optional for local testing with gRPC  

---

## Setup Instructions  

### 1. Clone the Repository and Unzip the file  

```bash  
git clone https://github.com/ervg0203/QuestSearchUsingGRPC.git 
cd QuestSearchUsingGRPC
```

### 2. Backend Setup (Node.js)

-   Navigate to the backend directory and install dependencies:

#### For Node.js:

``` bash
cd backend
npm install
nodemon src\app.js
```

### 3. Frontend Setup (React)

-   Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
npm start
```

### 4. Running the Project with Docker

To run the entire project using Docker, follow these steps:

1. Ensure you have Docker installed on your machine.

2. Build and start the container in the root folder:

    ```bash
    docker build -t envoy-server .
    docker run -d --name envoy-server -p 8000:8000 -p 6000:6000 envoy-server
    ```
    
### 5. Setting up MongoDB

- Make a MongoDB database name as questsearch and import the questions json file into the database and then you are good to go.

### 6. Enhancements & Unique Features

1. Search Functionality
   The frontend provides a search bar for querying questions based on titles. Results are dynamically displayed with pagination and filtering based on question types.

2. Pagination
   The result page supports pagination with next and previous buttons, making it easier to browse through large datasets.


### 7. UI Images

![Screenshot 2025-01-26 225053](https://github.com/user-attachments/assets/e9736e5b-237c-4e4f-8a61-89c39b2e0977)

![Screenshot 2025-01-26 225146](https://github.com/user-attachments/assets/a4ca21f3-9124-4586-8321-ae878f22b0b6)

![Screenshot 2025-01-26 225233](https://github.com/user-attachments/assets/b28f7ea4-8546-4f42-ac77-f1fb5d8a6672)

![Screenshot 2025-01-26 225308](https://github.com/user-attachments/assets/e45b2bca-59d3-490f-b83b-0be97053bea8)
