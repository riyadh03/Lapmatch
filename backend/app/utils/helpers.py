# TODO: generic helpers
from typing import Optional

def ok(data=None):
    return {"success": True, "data": data}

def fail(message: str, *, code: Optional[str] = None):
    payload = {"success": False, "error": {"message": message}}
    if code:
        payload["error"]["code"] = code
    return payload
