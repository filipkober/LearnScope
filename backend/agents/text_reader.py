from openai import OpenAI
import json

# Inicjalizuj klienta OpenAI z kluczem API
client = OpenAI()

def extract_tasks_from_text(text):
    """
    Extract tasks from input text using OpenAI's API and return as JSON
    """
    # Craft a prompt that explicitly requests JSON output
    prompt = f"""
    Please analyze the following text and extract all tasks, both explicit and implicit.
    Format your response as a dictionary with the following structure:
    {{
        "
            {{
                "1":"Task description",
            }},
            // more tasks...
    }}
    
    TEXT TO ANALYZE:
    {text}
    """
    
    try:
        # Call the OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that extracts actionable tasks from text and presents them as structured JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            response_format={"type": "json_object"}  # Ensure JSON response
        )
        
        # Extract JSON from the response
        result = response.choices[0].message.content
        
        # Parse JSON to validate it
        tasks_json = json.loads(result)
        
        return tasks_json
    
    except Exception as e:
        error_response = {
            "error": True,
            "message": str(e),
            "tasks": []
        }
        return error_response

# Example usage
if __name__ == "__main__":
    sample_text = """
    We need to prepare for the quarterly meeting next Thursday. 
    Marketing data should be reviewed before then, and someone needs to check if the projector is working.
    Jane mentioned that the slides need updating with the latest numbers.
    It would be good to order lunch for everyone attending.
    """
    
    tasks_json = extract_tasks_from_text(sample_text)
    print("EXTRACTED TASKS (JSON):")
    print(tasks_json)