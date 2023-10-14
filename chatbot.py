from flask import Flask, request, render_template, g
import spacy
import sqlite3

app = Flask(__name__, template_folder='templates')  # Specify the template folder

# Load the spaCy language model
nlp = spacy.load("en_core_web_sm")

# Define a function to get the database connection
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect("educational_content.db")
    return g.db

# Close the database connection at the end of a request
@app.teardown_appcontext
def close_db(e):
    db = g.pop('db', None)
    if db is not None:
        db.close()

@app.route("/")
def home():
    return render_template("janavi.html")

@app.route("/ask", methods=["POST"])
def ask():
    user_message = request.form.get("user_message")
    
    # Process user message with spaCy
    user_doc = nlp(user_message)
    
    # Retrieve relevant educational content from the database
    db = get_db()
    db_cursor = db.cursor()
    db_cursor.execute("SELECT answer FROM content WHERE question LIKE ?", ("%" + user_message + "%",))
    response = db_cursor.fetchone()
    
    if response:
        return response[0]
    else:
        return "I'm sorry, I don't have an answer for that question."

if __name__ == "__main__":
    # Create the database and insert educational content
    import sqlite3
    import os

    # Get the absolute path to the new database file
    db_file = os.path.abspath("educational_content.db")

    # Connect to the new database (or create it if it doesn't exist)
    db_connection = sqlite3.connect(db_file)
    db_cursor = db_connection.cursor()

    # Create a table to store educational content if it doesn't exist
    db_cursor.execute('''
        CREATE TABLE IF NOT EXISTS content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT,
            answer TEXT
        )
    ''')

    # Insert educational content into the database
    def insert_content(question, answer):
        db_cursor.execute("INSERT INTO content (question, answer) VALUES (?, ?)", (question, answer))
        db_connection.commit()

    # Example: Inserting data into the database
    insert_content("What is Python?", "Python is a high-level, interpreted programming language.")
    insert_content("How do you declare a variable in Python?", "In Python, you can declare a variable like this: `variable_name = value`.")

    app.run(debug=True)
