from inference.utils import load_raw_file, save_inference_data
import inference.custom_data_class as d
from typing import List, Dict
from gliner import GLiNER


class ProductInference:

    def __init__(self, threshold: float) -> None:
        self.threshold = threshold
        self.model = GLiNER.from_pretrained("urchade/gliner_mediumv2.1")
        self.model.eval()
        self.labels = ["ID", "COLOR"]

    def exec(
        self,
        store_name: str,
        search_type: str,
        file_name: str,
        default_path=None,
    ):
        f = load_raw_file(store_name, search_type, file_name)
        r = self.batch_predict(f)
        save_inference_data(r, store_name, search_type, file_name, default_path)

    def batch_predict(self, products: List[d.Product]) -> List[d.Product]:
        r = []
        for p in products:
            r.append(self.predict_and_merge(p))
        return r

    def predict_and_merge(self, p: d.Product) -> d.Product:
        if not p.color or not p.productId or p.productId == "-":
            raw = self.predict(p)
            if not p.productId or p.productId == "-":
                p.productId = raw.productId

            if not p.color:
                p.color = raw.color
        return p

    def predict(self, d: d.Product) -> d.Inference:
        inference: Dict = self.model.predict_entities(
            d.productName, self.labels, threshold=self.threshold
        )
        return self.preprocess(inference)

    def preprocess(self, inference: Dict) -> d.Inference:
        y = d.Inference()
        y.productId = "-"
        for value in inference:
            label = value["label"]
            text = value["text"]

            if label == "ID":
                y.productId = text

            if label == "COLOR":
                color = y.color
                if color:
                    y.color = "/".join([text, color])
                else:
                    y.color = text

        return y
