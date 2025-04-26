from openai import OpenAI
from agents import Agent, Runner
from pydantic import BaseModel, Field
import asyncio
import json

class Zagadnienie(BaseModel):
    id: int = Field(..., description="Numer zadania")
    description: str = Field(..., description="Zagadnienie zadania")
    przedmiot: str = Field(..., description="Przedmiot zadania (matematyka, fizyka, chemia, itp.)")
class ListaZagadnien(BaseModel):
    ListaZagadnien: list[Zagadnienie] = Field(..., description="Lista zadań")
    class Config:
        schema_extra = {
            "example": {
                "lista": [
                    {"id": 1, "description": "mnożenie"},
                    {"id": 2, "description": "dodawanie"},
                ]
            }
        }

human_agent = Agent(
    name="human agent",
    instructions="Jesteś wysokiej rangi profesorem humanistyki. Twoim zadaniem jest odpowiadać na pytania dotyczące nauk humanistycznych.",
    output_type=ListaZagadnien,
    )
science_agent = Agent(
    name="science agent",
    instructions="Jesteś wysokiej rangi profesorem fizyki, matematyki i innych nauk ścisłych. Twoim zadaniem jest odpowiadać na pytania dotyczące nauk ścisłych.",
    output_type=ListaZagadnien,
    )

triage_agent = Agent(
    name="triage agent",
    instructions="Jesteś wysokiej rangi profesorem. Twoim zadaniem jest odpowiadać na pytania dotyczące nauk humanistycznych i ścisłych. Podziel pytania na 2 kategorie: humanistyka i nauki ścisłe.",
    handoffs=[human_agent, science_agent],
    output_type=ListaZagadnien,
    )

async def upload_file_api(file) -> dict:
    client = OpenAI()

    uploaded_file = client.files.create(
        file=file,
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
                        "file_id": uploaded_file.id,
                    },
                    {
                        "type": "input_text",
                        "text": "Daj mi listę zagadnień wykorzystanych we wszystkich zadaniach w tym pliku. Podaj wyniki w jsonie. Nie podawaj mi żadnych innych informacji. Nie używaj polskich znaków. Wypisz tylko klucz i wartość. Kluczami mają być numery zadań, a wartościami mają być zagadnienia.",
                    },
                ]
            }
        ]
    )

    return response.final_output.json()
#print(asyncio.run(upload_file_api("C:/Users/huber/Downloads", "maturka.pdf")))