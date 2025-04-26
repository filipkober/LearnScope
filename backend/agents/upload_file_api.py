from openai import OpenAI
import json
def upload_file_api(file_path: str, file_name: str) -> dict:
    client = OpenAI()

    file = client.files.create(
        file=open(f"{file_path}/{file_name}", "rb"),
        purpose="user_data"
    )

    response = client.responses.create(
        model="gpt-4.1-nano-2025-04-14",
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_file",
                        "file_id": file.id,
                    },
                    {
                        "type": "input_text",
                        "text": "Daj mi listę zagadnień wykorzystanych we wszystkich zadaniach w tym pliku. Podaj wyniki w jsonie. Nie podawaj mi żadnych innych informacji. Nie używaj polskich znaków. Wypisz tylko klucz i wartość. Kluczami mają być numery zadań, a wartościami mają być zagadnienia.",
                    },
                ]
            }
        ]
    )

    return json.loads(response.output_text)