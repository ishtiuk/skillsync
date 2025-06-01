import cv2
import numpy as np
from fastapi import UploadFile


async def resize_image(file: UploadFile, max_size: int = 800) -> bytes:
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    height, width = img.shape[:2]

    if height > width:
        dim = (int(width * (max_size / height)), max_size)
    else:
        dim = (max_size, int(height * (max_size / width)))

    resized = cv2.resize(img, dim, interpolation=cv2.INTER_AREA)

    # Encode as PNG instead of JPG
    _, encoded_img = cv2.imencode(".png", resized)

    return encoded_img.tobytes()
