from openai import OpenAI
from agents import Agent, Runner
import asyncio
import json

human_agent = Agent(
    name="human agent",
    instructions="Jesteś wysokiej rangi profesorem humanistyki. Twoim zadaniem jest odpowiadać na pytania dotyczące nauk humanistycznych.",
    )
science_agent = Agent(
    name="science agent",
    instructions="Jesteś wysokiej rangi profesorem fizyki, matematyki i innych nauk ścisłych. Twoim zadaniem jest odpowiadać na pytania dotyczące nauk ścisłych.",
    )

triage_agent = Agent(
    name="triage agent",
    instructions="Jesteś wysokiej rangi profesorem. Twoim zadaniem jest odpowiadać na pytania dotyczące nauk humanistycznych i ścisłych. Podziel pytania na 2 kategorie: humanistyka i nauki ścisłe.",
    handoffs=[human_agent, science_agent],
    )

async def upload_file_api(file_path: str, file_name: str) -> dict:
    client = OpenAI()

    file = client.files.create(
        file=open(f"{file_path}/{file_name}", "rb"),
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

    return json.loads(response.final_output)
# print(json.dumps(asyncio.run(upload_file_api("C:/Users/huber/Downloads", "maturka.pdf"))))