from openai import OpenAI
client = OpenAI()
import json

response = client.responses.create(
  model="o4-mini",
  input=[
        "role":"user",
        "content":
    ],
    text={
        "format": {
        "type": "text"
        }
    },
    reasoning={
        "effort": "medium",
        "summary": "auto"
    },
    tools=[],
    store=True
)