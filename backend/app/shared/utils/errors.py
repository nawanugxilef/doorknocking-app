from fastapi import HTTPException

def not_found(resource: str):
    raise HTTPException(status_code=404, detail=f"{resource} not found")

def forbidden():
    raise HTTPException(status_code=403, detail="Access denied")
