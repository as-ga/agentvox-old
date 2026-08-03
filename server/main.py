from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def index():
    return {"msg": "welcone of agentvox api"}


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "fastapi"}
