from openai import OpenAI
from agents import Agent, Runner
import asyncio
import json
from pydantic import BaseModel, Field


class Question(BaseModel):
    id: int = Field(..., description="Id pytania")
    type: str = Field(..., description="Typ pytania(zamkniete, otwarte)")
    options: list[str] = Field(..., description="Jeśli pytanie zamknięte, to podaj możliwe odpowiedzi")  # Specify list of strings
    points: int = Field(..., description="Punktacja pytania")
    topic: str = Field(..., description="Tekst pytania")
    answer: str = Field(..., description="Odpowiedź na pytanie")
    solution: str = Field(..., description="Rozwiązanie pytania")
    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "type": "otwarte",
                "options": ["A", "B", "C"],  # Example options as a list of strings
                "points": 5,
                "topic": "Jakie są zasady mnożenia liczb całkowitych?",
                "answer": "Zasady mnożenia liczb całkowitych to: a*b = b*a, (a*b)*c = a*(b*c), a*(b+c) = a*b + a*c.",
                "solution": "Mnożenie liczb całkowitych jest przemienne i łączne.",
            }
        }

class Exam(BaseModel):
    id: int = Field(..., description="Id egzaminu")
    template: str = Field(..., description="Przedmiot egzaminu słownie (matematyka, fizyka, chemia, itp.)")
    questions: list[Question] = Field(..., description="Lista pytań")

human_agent = Agent(
    name="human agent",
    instructions="Jesteś wysokiej rangi profesorem humanistyki. Twoim zadaniem jest odpowiadać na pytania dotyczące nauk humanistycznych.",
    output_type=Exam,
    )
science_agent = Agent(
    name="science agent",
    instructions="Jesteś wysokiej rangi profesorem fizyki, matematyki i innych nauk ścisłych. Twoim zadaniem jest odpowiadać na pytania dotyczące nauk ścisłych.",
    output_type=Exam,
    )

triage_agent = Agent(
    name="triage agent",
    instructions="Jesteś wysokiej rangi profesorem. Twoim zadaniem jest odpowiadać na pytania dotyczące nauk humanistycznych i ścisłych. Podziel pytania na 2 kategorie: humanistyka i nauki ścisłe.",
    handoffs=[human_agent, science_agent],
    output_type=Exam,
    )
    
async def generate_exercise(example:json, template) -> dict:
    client = OpenAI()
    response = await Runner.run(
        triage_agent,
        input = json.dumps(example) + """
        Napisz zadania dla poniższych tematów i podaj odpowiedzi oraz możliwe rozwiązanie w formacie JSON.Podawaj tylko tyle zadań ile jest tematów. Podaj punktacje odpowiadającą poziomowi trudości. Nie podawaj mi żadnych innych informacji. Nie używaj polskich znaków. Wypisz tylko klucz i wartość. Kluczami mają być numery zadań, a wartościami mają być zadania.
        """
    )

    return response.final_output.json()

# print(asyncio.run(generate_exercise({"1": "Dodawanie 4 liczb", "2": "Mnożenie 4 liczb", "3": "Dodawanie 2 liczb"},1)))