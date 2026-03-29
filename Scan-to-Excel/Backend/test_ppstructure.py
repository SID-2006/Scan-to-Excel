import os
import time

os.environ["FLAGS_use_mkldnn"] = "0"
os.environ["GLOG_v"] = "0"

from paddleocr import PPStructureV3
import cv2

table_engine = PPStructureV3()

image_path = "uploads/scanned.jpeg"
print(f"Testing PPStructure on {image_path}")
img = cv2.imread(image_path)

start = time.time()
result = table_engine(img)
end = time.time()

print(f"Time taken: {end - start:.2f}s")
for res in result:
    print(res.keys())
    if 'res' in res:
        print("Table HTML:")
        print(res['res']['html'])

# Write to an HTML file to check
with open("test_ppstructure.html", "w", encoding='utf-8') as f:
    f.write("<html><body>\n")
    for res in result:
        if res['type'] == 'table':
            f.write(res['res']['html'])
            f.write("<br/><br/>\n")
    f.write("</body></html>\n")
print("Done!")
