from openai import OpenAI
import asyncio
import json
from pydantic import BaseModel, Field
from agents import (
    Agent,
    Runner,
)

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

# Define a function to create agents dynamically by Type
def create_agent_by_type(name: str, instructions: str, output_type: BaseModel) -> Agent:
    return Agent(
        name=name,
        instructions=instructions,
        output_type=output_type,
    )

# Create agents using the Type model
human_agent = create_agent_by_type(
    name="human agent",
    instructions="Jesteś wysokiej rangi profesorem humanistyki. Twoim zadaniem jest odpowiadać na pytania dotyczące nauk humanistycznych.",
    output_type=ListaZagadnien,
)

science_agent = create_agent_by_type(
    name="science agent",
    instructions="Jesteś wysokiej rangi profesorem fizyki, matematyki i innych nauk ścisłych. Twoim zadaniem jest odpowiadać na pytania dotyczące nauk ścisłych.",
    output_type=ListaZagadnien,
)

triage_agent = create_agent_by_type(
    name="triage agent",
    instructions="Jesteś wysokiej rangi profesorem. Twoim zadaniem jest odpowiadać na pytania dotyczące nauk humanistycznych i ścisłych. Podziel pytania na 2 kategorie: humanistyka i nauki ścisłe.",
    output_type=ListaZagadnien,
)

client = OpenAI()

async def upload_text_api(text):
    client = OpenAI()
    response = await Runner.run(
        triage_agent,
        input=text + "Daj mi listę zagadnień wykorzystanych we wszystkich zadaniach podanych. Podaj wyniki w jsonie. Nie podawaj mi żadnych innych informacji. Nie używaj polskich znaków. Wypisz tylko klucz i wartość. Kluczami mają być numery zadań, a wartościami mają być zagadnienia.",
    )
    return response.final_output.json()

#print(asyncio.run(upload_text_api("2+2,2*2,2x+3-0=2")))