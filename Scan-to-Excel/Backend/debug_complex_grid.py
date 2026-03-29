import cv2
import numpy as np
import os
import sys

def debug_contours(image_path):
    print(f"Testing on {image_path}")
    if not os.path.exists(image_path):
        print(f"File not found: {image_path}")
        return

    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Adaptive thresholding might be better for uneven lighting in scans
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 15, -2)
    
    img_h, img_w = thresh.shape
    
    # Identify lines
    h_kernel_len = max(img_w // 20, 20)
    v_kernel_len = max(img_h // 20, 20)
    
    h_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (h_kernel_len, 1))
    v_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, v_kernel_len))
    
    horizontal = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, h_kernel, iterations=2)
    vertical = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, v_kernel, iterations=2)
    
    # Combine
    table_mask = cv2.addWeighted(horizontal, 0.5, vertical, 0.5, 0.0)
    _, table_mask = cv2.threshold(table_mask, 50, 255, cv2.THRESH_BINARY)
    
    # Optional morphological close to connect gaps
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    table_mask = cv2.morphologyEx(table_mask, cv2.MORPH_CLOSE, kernel)
    
    # Find contours
    contours, _ = cv2.findContours(table_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    bounding_boxes = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        
        # Filter out tiny sub-rectangles or the whole image contour
        if w > 20 and h > 10 and w < img_w * 0.95 and h < img_h * 0.95:
            bounding_boxes.append((x, y, w, h))
            
    print(f"Found {len(bounding_boxes)} valid cells.")
    
    # Draw them
    debug_img = img.copy()
    for (x, y, w, h) in bounding_boxes:
        cv2.rectangle(debug_img, (x, y), (x + w, y + h), (0, 255, 0), 2)
        
    cv2.imwrite("debug_contours.png", debug_img)
    cv2.imwrite("debug_table_mask.png", table_mask)

# Using scanned.jpeg assuming it's the complex one 
debug_contours("uploads/IMG-20260223-WA0021.jpg")
debug_contours("uploads/scanned.jpeg")
