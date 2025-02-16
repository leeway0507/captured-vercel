from pipe.inference import ProductInference
import argparse
import dotenv
from datetime import datetime
import os

if __name__ == "__main__":

    s = datetime.now()
    dotenv.load_dotenv()
    parser = argparse.ArgumentParser(description="main")
    parser.add_argument("--store_name", help="storeName")
    parser.add_argument("--search_type", help="searchType")
    parser.add_argument("--file_name", help="fileName")
    args = parser.parse_args()

    store_name: str = args.store_name
    search_type: str = args.search_type
    file_name: str = args.file_name

    if not store_name:
        raise ValueError("store_name does not exist")

    if not search_type:
        raise ValueError("search_type does not exist")

    if not file_name:
        raise ValueError("file_name does not exist")

    print("THRESHOLD : ", os.getenv("THRESHOLD"))
    prodInferImpl = ProductInference(float(os.getenv("THRESHOLD")))
    prodInferImpl.exec(store_name, search_type, file_name)
    e = datetime.now()

    print("Inference 처리시간 : ", e - s)
