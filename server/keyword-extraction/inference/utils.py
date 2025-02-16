import json
import os
from uu import Error
from typing import List, Dict
from components.local_file import FileManager
import inference.custom_data_class as d
import dotenv

dotenv.load_dotenv()


def load_raw_file(store_name: str, search_type: str, file_name: str) -> List[d.Product]:
    raw_path = os.getenv("RAW")

    if not raw_path:
        raise Error("env file is not loaded")

    file_path = os.path.join(raw_path, store_name, search_type, file_name)

    with open(file_path, "r") as f:
        j_raw = json.load(f)

    x = []
    for j in j_raw:
        x.append(d.Product(**j))

    return x


def save_inference_data(
    f: List[d.Product],
    store_name: str,
    search_type: str,
    file_name: str,
    default_path=None,
):
    if not default_path:
        default_path = os.getenv("PIPELINE_INFERENCE")
        if not default_path:
            raise Error("env file is not loaded")

    folder_path = os.path.join(default_path, store_name, search_type)
    FileManager.create_folder(folder_path)
    print("folder_path : ", folder_path)

    file_path = os.path.join(folder_path, file_name)
    with open(file_path, "w") as file_obj:
        json.dump([product.to_dict() for product in f], file_obj, ensure_ascii=False)
