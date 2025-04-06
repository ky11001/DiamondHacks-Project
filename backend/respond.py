import json
import re
import google.generativeai as genai
import time

FILENAME = 'ncb_java_en.jsonl' #choose either java or python problem set
OUTPUT_FILENAME = 'data/responses/ai_responses.json' #temp file to hold responses

# Initialize Gemini client
# TODO: GET TS OUTTA HERE
genai.configure(api_key="AIzaSyCfHTrNkgzxlF3Ua3O3rWFe-RG6Os9evJ8")

# Read the JSONL data
with open(f'data/problems/{FILENAME}', 'r', encoding='utf-8') as f:
    data = [json.loads(line) for line in f]

# Store responses
ai_outputs = []

# Process and send prompts to Gemini
model = genai.GenerativeModel("gemini-2.0-flash")

for item in data[:30]:
    problem_id = item.get("_id")
    prompt = item.get("prompt", "")
    problem_description = item.get("problem", "")
    
    full_prompt = f"{prompt.strip()}\n\n{problem_description.strip()}"
    
    try:
        response = model.generate_content(full_prompt)
        ai_outputs.append({
            "id": str(problem_id),
            "AI response": response.text.strip()
        })
        time.sleep(2)
    except Exception as e:
        print(f"Error processing problem ID {problem_id}: {e}")
        ai_outputs.append({
            "id": str(problem_id),
            "AI response": f"ERROR: {e}"
        })


# Save responses to JSON file
with open(OUTPUT_FILENAME, 'w', encoding='utf-8') as f:
    json.dump(ai_outputs, f, indent=2, ensure_ascii=False)

print(f"Saved {len(ai_outputs)} AI responses to {OUTPUT_FILENAME}")
