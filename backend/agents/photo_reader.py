from openai import OpenAI
from agents import Agent, Runner
import base64
import asyncio
import json
from pydantic import BaseModel
from pydantic import BaseModel, Field


class Zagadnienie(BaseModel):
    id: int = Field(..., description="Numer zadania")
    description: str = Field(..., description="Zagadnienie zadania")
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

client = OpenAI()

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

async def upload_image_api(image_path: str) -> dict:
    base64_image = encode_image(image_path)
    response = await Runner.run(
        triage_agent,
        input=[{
            "role": "user",
            "content": [
                { "type": "input_text", "text": "Daj mi listę zagadnień wykorzystanych we wszystkich zadaniach w tym pliku. Nie podawaj mi żadnych innych informacji. Nie używaj polskich znaków. Wypisz tylko klucz i wartość. Kluczami mają być numery zadań, a wartościami mają być zagadnienia. Np:"+"{'id':'1','description':'mnożenie'}W" },
                {
                    "type": "input_image",
                    "image_url": f"data:image/jpeg;base64,{base64_image}",
                },
            ],
        }
    ],
    )
    return response.final_output.json()

print(asyncio.run(upload_image_api("C:/Users/huber/Downloads/zad.png")))