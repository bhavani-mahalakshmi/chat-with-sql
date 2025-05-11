from flask import Flask, request, jsonify

# Assuming src/ai is in your Python path
# You might need to adjust the import based on your project structure
# For example, if src is at the root:
# from src.ai.understand_query import understand_query
# If the ai folder is directly accessible:
from ai.understand_query import understand_query

from ai.generate_sql import generate_sql
from ai.get_database_schema import get_database_schema
app = Flask(__name__)

@app.route('/understand_query', methods=['POST'])
def handle_understand_query():
    """
    Handles POST requests to the /understand_query endpoint.
    Expects JSON data with a 'query' field.
    Calls the understand_query function and returns the result as JSON.
    """
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({"error": "Invalid request body. 'query' field is required."}), 400

    user_query = data['query']
    result = understand_query(user_query)

    return jsonify(result)

@app.route('/generate_sql', methods=['POST'])
def handle_generate_sql():
 """
 Handles POST requests to the /generate_sql endpoint.
 Expects JSON data with 'question' and 'databaseSchema' fields.
 Calls the generate_sql function and returns the result as JSON.
 """
 data = request.get_json()
 if not data or 'question' not in data or 'databaseSchema' not in data:
 return jsonify({"error": "Invalid request body. 'question' and 'databaseSchema' fields are required."}), 400

 result = generate_sql(data)

 return jsonify(result)

@app.route('/get_database_schema', methods=['POST'])
def handle_get_database_schema():
 """
 Handles POST requests to the /get_database_schema endpoint.
 Expects JSON data with a 'uri' field.
 Calls the get_database_schema function and returns the result as JSON.
 """
 data = request.get_json()
 if not data or 'uri' not in data:
 return jsonify({"error": "Invalid request body. 'uri' field is required."}), 400

 result = get_database_schema(data)

 return jsonify(result)

if __name__ == '__main__':
    # Run the Flask development server
    # In a production environment, use a production-ready server like Gunicorn or uWSGI
    app.run(debug=True)