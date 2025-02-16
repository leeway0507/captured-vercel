from pipe.utils import load_raw_file, save_inference_data
from typing import List, Dict
import os

test_current_path = __file__.rsplit("/", 1)[0]
test_store = "harresoe"
test_file_name = "240320T134823.json"


### start Test ###
def test_load_raw_file():
    # When
    f = load_raw_file(test_store, "list", test_file_name)
    assert len(f) > 0


def test_save_inference_data():
    f = load_raw_file(test_store, "list", test_file_name)

    curr_path = os.path.join(test_current_path, "data", "inference")
    save_inference_data(f, test_store, "list", test_file_name, curr_path)

    test_path = os.path.join(curr_path, test_store, "list", test_file_name)
    assert os.path.exists(test_path)


def test_save_inference_data_2():
    f = load_raw_file(test_store, "list", test_file_name)

    curr_path = os.path.join(test_current_path, "data", "inference")
    save_inference_data(f, test_store, "list", test_file_name)

    test_path = os.path.join(curr_path, test_store, "list", test_file_name)
    assert os.path.exists(test_path)
