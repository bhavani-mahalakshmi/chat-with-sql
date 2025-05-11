# Chat with SQL

Chat with SQL is a project that enables users to interact with SQL databases using natural language queries. It translates user input into SQL commands, executes them on the connected database, and returns the results in a user-friendly format. The application is designed to simplify database interactions for users without requiring SQL expertise.

## Project Overview

### Core Features
- **Natural Language to SQL Translation**: Converts user queries into optimized SQL commands.
- **Multi-Database Support**: Compatible with various database types, including MySQL, PostgreSQL, and SQLite.
- **Data Visualization**: Presents query results in tables, charts, or text formats.
- **Modular Design**: Easily extendable to support additional NLP models or database types.

### Tech Stack
- **Backend**: Python (Flask) for handling API requests and database interactions.
- **Frontend**: Next.js with Tailwind CSS for a modern and responsive UI.
- **Database**: Supports multiple SQL databases (e.g., SQLite, PostgreSQL).
- **NLP**: Custom AI models for query understanding and SQL generation.

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- `pip` package manager
- Node.js (v20 or higher)
- A supported SQL database (e.g., MySQL, PostgreSQL, SQLite)

### Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/chat-with-sql.git
    cd chat-with-sql
    ```

2. **Backend Setup**:
    - Create and activate a virtual environment:
      ```bash
      python3 -m venv venv
      source venv/bin/activate  # On Windows: venv\Scripts\activate
      ```
    - Install Python dependencies:
      ```bash
      pip install -r requirements.txt
      ```
    - Configure the database connection in the [config.json](http://_vscodecontentref_/0) file:
      ```json
      {
           "database": {
                "type": "sqlite",
                "host": "localhost",
                "port": 5432,
                "username": "your-username",
                "password": "your-password",
                "database_name": "your-database"
           }
      }
      ```

3. **Frontend Setup**:
    - Install Node.js dependencies:
      ```bash
      npm install
      ```

4. **Environment Variables** (Optional):
    - You can override [config.json](http://_vscodecontentref_/1) settings using environment variables:
      ```bash
      export DB_TYPE=sqlite
      export DB_HOST=localhost
      export DB_PORT=5432
      export DB_USERNAME=your-username
      export DB_PASSWORD=your-password
      export DB_NAME=your-database
      ```

## Running the Application

1. **Start the Backend**:
    ```bash
    python app.py
    ```

2. **Start the Frontend**:
    ```bash
    npm run dev
    ```

3. **Test the Database Connection**:
    Run the following script to verify the database connection:
    ```bash
    python test_connection.py
    ```

4. **Interact with the Application**:
    Open the application in your browser and type natural language queries to interact with your database.

## Project Logic Overview

1. **Input Parsing**: The user provides a natural language query through the web interface.
2. **Natural Language Processing (NLP)**: The query is analyzed using an NLP model to extract intent and key information.
3. **SQL Generation**: Based on the extracted information, the application generates an SQL query.
4. **Database Interaction**: The generated SQL query is executed on the connected database.
5. **Result Formatting**: The results from the database are formatted and presented back to the user in a readable format.

The modular design ensures that the application can be easily extended to support additional features or integrations.


## Copyright

© 2025 Bhavani Mahalakshmi Gowri Sankar. All rights reserved.

Connect with me on [LinkedIn](https://www.linkedin.com/in/bhavani-mahalakshmi-gowri-sankar-6b6a54119/) 
