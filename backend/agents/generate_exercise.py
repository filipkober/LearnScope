from openai import OpenAI
import json
def generate_exercise(example:json) -> dict:
    client = OpenAI()

    response = client.responses.create(
        model="gpt-4.1",
        input = json.dumps(example) + """
        Napisz zadania dla poniższych tematów i podaj odpowiedzi oraz możliwe rozwiązanie w formacie JSON.Podawaj tylko tyle zadań ile jest tematów. Nie podawaj mi żadnych innych informacji. Nie używaj polskich znaków. Wypisz tylko klucz i wartość. Kluczami mają być numery zadań, a wartościami mają być zadania.
        Na przykład:
        {
        "id": 1,
        "exercise_text": "Podaj miejsca zerowe funkcji x^2 - 4",
        "odpowiedz": "2 i -2",
        "resolution": "x^2 = 4 \n x = sqrt(4) i x = -sqrt(4) \n x = 2 i x = -2"
        }
        """
    )

    return json.loads(response.output_text)

# print(json.dumps(generate_exercise({"1": "Dodawanie 4 liczb", "2": "Mnożenie 4 liczb", "3": "Dodawanie 2 liczb"})))