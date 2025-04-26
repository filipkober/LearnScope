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
    handoffs=[science_agent, human_agent],
    )

client = OpenAI()

async def upload_text_api(text):
    client = OpenAI()
    response = await Runner.run(
        triage_agent,
        input = text + """
        Napisz zadania dla poniższych tematów i podaj odpowiedzi oraz możliwe rozwiązanie w formacie JSON.Podawaj tylko tyle zadań ile jest tematów. Podaj punktacje odpowiadającą poziomowi trudości. Nie podawaj mi żadnych innych informacji. Nie używaj polskich znaków. Wypisz tylko klucz i wartość. Kluczami mają być numery zadań, a wartościami mają być zadania.
        Na przykład:
        {
        "id": 1,
        "punktacja": 1,
        "exercise_text": "Podaj miejsca zerowe funkcji x^2 - 4",
        "odpowiedz": "2 i -2",
        "resolution": "x^2 = 4 \n x = sqrt(4) i x = -sqrt(4) \n x = 2 i x = -2"
        }
        """,
        )
    return json.loads(response.final_output)
asyncio.run(upload_text_api("Równanie kwadratowe, dodawanie, mnożenie"))