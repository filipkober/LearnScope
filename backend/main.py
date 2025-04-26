from fastapi import FastAPI, UploadFile, File
import asyncio
import json
from create_template import create_template
from upload_file_api import upload_file_api
from upload_text_api import upload_text_api
from upload_image_api import upload_image_api

app = FastAPI()

async def process_text(text: str) -> None:
    slownik = await upload_text_api(text)
    slownik = json.loads(slownik)
    for i in slownik["ListaZagadnien"]:
        create_template(i["przedmiot"], i["description"], 1)

async def process_file(file: UploadFile) -> None:
    slownik = await upload_file_api(file)
    slownik = json.loads(slownik)
    for i in slownik["ListaZagadnien"]:
        create_template(i["przedmiot"], i["description"], 1)

async def process_image(file: UploadFile) -> None:
    slownik = await upload_image_api(file)
    slownik = json.loads(slownik)
    for i in slownik["ListaZagadnien"]:
        create_template(i["przedmiot"], i["description"], 1)

@app.post("/text_endpoint")
async def text_endpoint(text: str):
    await process_text(text)
    return {"status": "Text processed"}

@app.post("/file_endpoint")
async def file_endpoint(file: UploadFile = File(...)):
    await process_file(file)
    return {"status": "File processed"}

@app.post("/image_endpoint")
async def image_endpoint(file: UploadFile = File(...)):
    await process_image(file)
    return {"status": "Image processed"}

@app.get("/")
def root():
    return {"message": "Hello, World"}
