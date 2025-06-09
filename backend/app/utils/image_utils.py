import cv2
import dlib
import numpy as np
from fastapi import UploadFile

PROFILE_SIZE = (500, 500)
PADDING_RATIO = 1.0  # 100% padding around the face

detector = dlib.get_frontal_face_detector()


async def crop_image_smart_dlib(file: UploadFile) -> bytes:
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Invalid image file")

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Detect faces
        faces = detector(gray)
        if not faces:
            raise ValueError("No face detected in the image")

        # Use the first detected face
        face = faces[0]
        left, top, right, bottom = face.left(), face.top(), face.right(), face.bottom()

        # Compute face center and size
        face_center_x = (left + right) // 2
        face_center_y = (top + bottom) // 2
        face_width = right - left
        face_height = bottom - top
        face_size = max(face_width, face_height)

        # Add padding around the face
        padding = int(face_size * PADDING_RATIO)
        crop_size = face_size + (2 * padding)

        # Ensure square crop coordinates
        crop_left = max(face_center_x - crop_size // 2, 0)
        crop_top = max(face_center_y - crop_size // 2, 0)
        crop_right = min(crop_left + crop_size, img.shape[1])
        crop_bottom = min(crop_top + crop_size, img.shape[0])

        # Crop and resize
        cropped = img[crop_top:crop_bottom, crop_left:crop_right]
        resized = cv2.resize(cropped, PROFILE_SIZE, interpolation=cv2.INTER_LANCZOS4)

        # Encode the final image to PNG bytes
        _, encoded_img = cv2.imencode(".png", resized)
        return encoded_img.tobytes()

    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")
