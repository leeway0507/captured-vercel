import json
from pprint import pprint

with open("./x.json", "r") as f:
    entities = json.load(f)

x = []
for entity in entities:
    y = {}
    for value in entity:
        label = value["label"]
        text = value["text"]
        if label == "ID":
            y.update({"product_id": text})
        if label == "COLOR":
            color = y.get("color")
            if color:
                y.update({"color": "/".join([text, color])})
            else:
                y.update({"color": text})
    x.append(y)


pprint(x)
print("Done")
