import cv2
import numpy as np
import os
import json

def test_fine_grid(image_path):
    print(f"Testing fine grid on {image_path}")
    if not os.path.exists(image_path):
        print("Not found")
        return

    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 15, -2)
    img_h, img_w = thresh.shape
    
    h_kernel_len = max(img_w // 20, 20)
    v_kernel_len = max(img_h // 20, 20)
    h_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (h_kernel_len, 1))
    v_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, v_kernel_len))
    
    horizontal = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, h_kernel, iterations=2)
    vertical = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, v_kernel, iterations=2)
    
    table_mask = cv2.addWeighted(horizontal, 1.0, vertical, 1.0, 0.0)
    _, table_mask = cv2.threshold(table_mask, 50, 255, cv2.THRESH_BINARY)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    table_mask = cv2.morphologyEx(table_mask, cv2.MORPH_CLOSE, kernel)
    
    contours, _ = cv2.findContours(table_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    boxes = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        if w > 10 and h > 10 and w < img_w * 0.95 and h < img_h * 0.95:
            boxes.append((x, y, w, h))
            
    print(f"Found {len(boxes)} valid cells.")
    
    # Extract unique X and Y boundaries
    xs = []
    ys = []
    for (x, y, w, h) in boxes:
        xs.extend([x, x+w])
        ys.extend([y, y+h])
        
    def cluster_coords(coords, tol=15):
        if not coords: return []
        coords = sorted(coords)
        clusters = []
        curr = [coords[0]]
        for val in coords[1:]:
            if val - curr[-1] <= tol:
                curr.append(val)
            else:
                clusters.append(int(np.mean(curr)))
                curr = [val]
        clusters.append(int(np.mean(curr)))
        return clusters

    col_bounds = cluster_coords(xs, tol=15)
    row_bounds = cluster_coords(ys, tol=15)
    
    # Add image boundaries just in case
    if col_bounds and col_bounds[0] > 10: col_bounds.insert(0, 0)
    if row_bounds and row_bounds[0] > 10: row_bounds.insert(0, 0)
    if col_bounds and col_bounds[-1] < img_w - 10: col_bounds.append(img_w)
    if row_bounds and row_bounds[-1] < img_h - 10: row_bounds.append(img_h)
    
    print(f"Row boundaries ({len(row_bounds)}): {row_bounds}")
    print(f"Col boundaries ({len(col_bounds)}): {col_bounds}")
    
    # Draw grid
    debug_arr = np.zeros((img_h, img_w, 3), dtype=np.uint8)
    for c in col_bounds:
        cv2.line(debug_arr, (c, 0), (c, img_h), (0, 255, 0), 1)
    for r in row_bounds:
        cv2.line(debug_arr, (0, r), (img_w, r), (0, 0, 255), 1)
        
    cv2.imwrite("debug_fine_grid.png", debug_arr)

test_fine_grid("uploads/scanned.jpeg")
