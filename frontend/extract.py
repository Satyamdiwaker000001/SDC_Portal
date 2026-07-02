import json
import re

transcript_path = r'C:\Users\Admin1\.gemini\antigravity-ide\brain\ea5df906-c9f2-4dc1-b456-2450121aa517\.system_generated\logs\transcript_full.jsonl'

found = False
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            content = data.get('content', '')
            if 'const ProfileCard =' in content or 'const ProfileCard = ' in content:
                print("FOUND IN STEP:", data.get('step_index'))
                
                # Extract just the ProfileCard code block if it is inside a markdown block or just print the raw content
                # Try to find the exact component text.
                print(content[:5000]) # Print first 5k characters to inspect.
                found = True
                break
        except Exception as e:
            pass

if not found:
    print("Not found.")
