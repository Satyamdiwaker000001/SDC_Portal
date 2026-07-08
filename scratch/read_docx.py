import zipfile
import xml.etree.ElementTree as ET
import os

docx_path = r"a:\New project\SDC_Portal\backend\SDC_Master_API_Inventory.docx"
output_path = r"a:\New project\SDC_Portal\scratch\api_inventory.txt"

def docx_to_text(path):
    namespaces = {
        'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
    }
    
    if not os.path.exists(path):
        return f"File not found: {path}"
        
    try:
        with zipfile.ZipFile(path) as docx:
            tree = ET.parse(docx.open('word/document.xml'))
            root = tree.getroot()
            
            paragraphs = []
            for para in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                text = ''.join(node.text for node in para.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text)
                if text:
                    paragraphs.append(text)
            return '\n'.join(paragraphs)
    except Exception as e:
        return f"Error: {e}"

text = docx_to_text(docx_path)
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(text)

print(f"Extracted {len(text)} characters to {output_path}")
