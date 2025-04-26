from fastapi import FastAPI, UploadFile, File
import json
from create_template import create_template
from upload_file_api import upload_file_api
from upload_text_api import upload_text_api
from upload_image_api import upload_image_api

app = FastAPI()

async def process_text(text: str) -> list[str]:
    """
    Process plain text, call upload_text_api and generate templates.
    Returns a list of generated templates.
    """
    slownik = await upload_text_api(text)
    slownik = json.loads(slownik)
    templates: list[str] = []
    for item in slownik.get("ListaZagadnien", []):
        tpl = create_template(item["przedmiot"], item["description"], 1)
        templates.append(tpl)
    return templates

async def process_file(file: UploadFile) -> list[str]:
    """
    Process uploaded file, call upload_file_api and generate templates.
    Returns a list of generated templates.
    """
    slownik = await upload_file_api(file)
    slownik = json.loads(slownik)
    templates: list[str] = []
    for item in slownik.get("ListaZagadnien", []):
        tpl = create_template(item["przedmiot"], item["description"], 1)
        templates.append(tpl)
    return templates

async def process_image(file: UploadFile) -> list[str]:
    """
    Process uploaded image, call upload_image_api and generate templates.
    Returns a list of generated templates.
    """
    slownik = await upload_image_api(file)
    slownik = json.loads(slownik)
    templates: list[str] = []
    for item in slownik.get("ListaZagadnien", []):
        tpl = create_template(item["przedmiot"], item["description"], 1)
        templates.append(tpl)
    return templates

@app.post("/text_endpoint")
async def text_endpoint(text: str):
    templates = await process_text(text)
    return {"templates": templates}

@app.post("/file_endpoint")
async def file_endpoint(file: UploadFile = File(...)):
    templates = await process_file(file)
    return {"templates": templates}

@app.post("/image_endpoint")
async def image_endpoint(file: UploadFile = File(...)):
    templates = await process_image(file)
    return {"templates": templates}

@app.get("/")
def root():
    return {"message": "Hello, World"}
