from openai import OpenAI
client = OpenAI()

x = input("Enter the text or image URL: ")

response = client.responses.create(
    model="o3",
    input=[
        {
            "role": "user",
            "content": f"""Please analyze the picture or text of a task that 
            user will give you and based on that explain to him whats the answer and why.
            If the user will be interested please generate task for him that will be in the 
            same theme as the task that he gave you.""" + x
        }
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

print(response.output_text)