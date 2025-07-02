import pandas as pd
import json

# Load your CSV (replace with actual file path)
csv_path = "src/questions/charts5.csv"
df = pd.read_csv(csv_path)

# Forward-fill Question Text if it's only specified on the first row per question
df["Question Text"] = df["Question Text"].fillna(method="ffill")

# Group answers under each question
questions = []
for qid, group in df.groupby("Question ID"):
    question_text = group["Question Text"].iloc[0]
    answers = group[["Answer Text", "Score: Love", "Score: Duty", "Score: Honor", "Score: Reason"]]
    answer_list = [
        {
            "text": row["Answer Text"],
            "scores": {
                "Love": row["Score: Love"],
                "Duty": row["Score: Duty"],
                "Honor": row["Score: Honor"],
                "Reason": row["Score: Reason"]
            }
        }
        for _, row in answers.iterrows()
    ]
    questions.append({
        "id": int(qid),  # Ensure ID is an integer
        "text": question_text,
        "answers": answer_list
    })

# Save to JSON
json_path = "src/questions/lovehonor.json"
with open(json_path, "w") as f:
    json.dump(questions, f, indent=2)

print(f"Saved to {json_path}")
