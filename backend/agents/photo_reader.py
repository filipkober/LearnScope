from openai import OpenAI
import json
import os
import base64
from dotenv import load_dotenv

# Wczytaj zmienne środowiskowe z pliku .env
load_dotenv()

# Pobierz klucz API ze zmiennej środowiskowej
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("Brak klucza API OpenAI w zmiennej środowiskowej OPENAI_API_KEY")

# Inicjalizuj klienta OpenAI z kluczem API
client = OpenAI(api_key=api_key)

def encode_image(image_path):
    """
    Koduje obraz do formatu base64
    """
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def extract_tasks_from_image(image_path):
    """
    Extract tasks from an image using OpenAI's API and return as JSON
    """
    # Koduj obraz
    try:
        base64_image = encode_image(image_path)
    except Exception as e:
        return {
            "error": True,
            "message": str(e),
            "tasks": []
        }

    # Craft a prompt that explicitly requests JSON output
    prompt = """
    Please analyze the provided image and extract all tasks, both explicit (e.g., written text) and implicit (e.g., inferred from visual context).
    Format your response as a dictionary with the following structure:
    {
        "tasks": {
            "1": "Task description",
            "2": "Task description",
            // more tasks...
        }
    }
    
    If no tasks are found, return an empty tasks dictionary.
    """

    try:
        # Call the OpenAI API with image input
        response = client.chat.completions.create(
            model="gpt-4o",  # Używamy modelu obsługującego obrazy
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that extracts actionable tasks from images and presents them as structured JSON."
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{base64_image}"
                            }
                        }
                    ]
                }
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
    # Lista przykładowych obrazów
    sample_image_paths = [
        "zrzut.png"
    ]

    for image_path in sample_image_paths:
        print(f"\nPrzetwarzanie obrazu: {image_path}")
        tasks_json = extract_tasks_from_image(image_path)
        print("EXTRACTED TASKS (JSON):")
        print(json.dumps(tasks_json, indent=2))