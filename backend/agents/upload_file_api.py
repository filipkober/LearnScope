from fastapi import UploadFile
from openai import OpenAI
from agents import Agent, Runner
from pydantic import BaseModel, Field
import asyncio
import json
import tempfile

# === Twój kod z agentami tutaj ===

async def upload_file_api(file: UploadFile) -> dict:
    client = OpenAI()
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    openai_file = client.files.create(
        file=open(tmp_path, "rb"),
        purpose="user_data"
    )

    response = await Runner.run(
        triage_agent,
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_file",
                        "file_id": openai_file.id,
                    },
                    {
                        "type": "input_text",
                        "text": "Daj mi listę zagadnień wykorzystanych we wszystkich zadaniach w tym pliku. Podaj wyniki w jsonie. Nie podawaj mi żadnych innych informacji. Nie używaj polskich znaków. Wypisz tylko klucz i wartość. Kluczami mają być numery zadań, a wartościami mają być zagadnienia.",
                    },
                ]
            }
        ]
    )

    # Jeśli final_output to dict, zwróć od razu
    return response.final_output

# print(asyncio.run(upload_file_api(UploadFile("C:/Users/huber/Downloads/maturka.pdf"))))