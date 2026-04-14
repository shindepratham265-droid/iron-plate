# app.py — IronPlate Backend (Flask + Groq API)
# Upgraded: better muscle-growth prompting, new /api/muscle-tips endpoint

import os
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["*"])

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL   = "llama-3.3-70b-versatile"


def build_diet_prompt(data):
    age        = data.get("age", 25)
    weight     = data.get("weight", 70)
    height     = data.get("height", 175)
    sex        = data.get("sex", "male")
    goal       = data.get("goal", "gain")
    activity   = data.get("activityLevel", "moderate")
    prefs      = ", ".join(data.get("preferences", ["veg"])) or "no specific preference"
    target_cal = data.get("targetCal", 0)

    activity_map = {
        "sedentary": "sedentary (desk job, no exercise)",
        "light":     "lightly active (1-3 days/week)",
        "moderate":  "moderately active (3-5 days/week)",
        "very":      "very active (6-7 days/week)",
        "extra":     "extra active (athlete / 2x daily training)"
    }
    goal_map = {
        "lose":     "fat loss / weight reduction",
        "gain":     "muscle gain / hypertrophy - high protein, caloric surplus",
        "maintain": "weight maintenance",
        "bulk":     "clean bulk (mass gain with muscle focus) - high protein & carbs",
        "cut":      "cutting (lean out while preserving muscle) - high protein, moderate deficit",
        "athletic": "athletic performance & endurance",
        "muscle":   "maximum muscle growth / bodybuilding - prioritise protein synthesis"
    }

    cal_hint = f" Target approximately {target_cal} kcal/day." if target_cal else ""

    muscle_focus = ""
    if goal in ("gain", "bulk", "muscle"):
        muscle_focus = """
MUSCLE GROWTH FOCUS:
- Set protein at minimum 2.0g per kg bodyweight (ideally 2.2-2.4g/kg)
- Include a caloric surplus of 200-400 kcal above TDEE
- Emphasise leucine-rich foods: chicken, eggs, Greek yoghurt, cottage cheese, whey
- Include fast carbs post-workout (banana, white rice, oats) for insulin spike
- Schedule higher-calorie meals around training windows
"""

    return f"""You are a professional sports nutritionist specialising in muscle hypertrophy. Create a precise, science-backed daily meal plan:

- Age: {age} years | Weight: {weight} kg | Height: {height} cm | Sex: {sex}
- Goal: {goal_map.get(goal, goal)}
- Activity: {activity_map.get(activity, activity)}
- Dietary preferences: {prefs}{cal_hint}
{muscle_focus}
Return ONLY valid JSON:
{{
  "dailyCalories": <integer>,
  "protein": <integer in grams>,
  "carbs": <integer in grams>,
  "fat": <integer in grams>,
  "meals": [
    {{"name":"Breakfast","time":"7:00 - 8:00 AM","icon":"🌅","items":[{{"name":"<food>","qty":"<amount>","calories":<int>,"protein":<int>,"carbs":<int>,"fat":<int>}}]}},
    {{"name":"Lunch","time":"12:30 - 1:30 PM","icon":"☀️","items":[...]}},
    {{"name":"Snack","time":"4:00 - 5:00 PM","icon":"🌆","items":[...]}},
    {{"name":"Dinner","time":"7:30 - 8:30 PM","icon":"🌙","items":[...]}}
  ]
}}

Rules: Each meal 3-5 items. Realistic macros. Respect dietary preferences. High protein for goal. Return ONLY JSON."""


def build_muscle_tips_prompt(data):
    muscle = data.get("muscle", "chest")
    age    = data.get("age", 25)
    weight = data.get("weight", 70)
    goal   = data.get("goal", "gain")
    return f"""Expert trainer advice for {muscle} muscle, {age}yo {weight}kg, goal: {goal}.
Return ONLY valid JSON:
{{"muscle":"{muscle}","quickTip":"<science tip>","weeklyVolume":"<sets/week>","recoveryTime":"<hours>","topFood":"<best food>","commonMistake":"<mistake>"}}"""


def call_groq(system_msg, user_msg, temperature=0.6, max_tokens=2048):
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not configured on the server.")
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_msg},
            {"role": "user",   "content": user_msg}
        ],
        "temperature": temperature,
        "max_tokens":  max_tokens,
        "response_format": {"type": "json_object"}
    }
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    resp = requests.post(GROQ_URL, json=payload, headers=headers, timeout=30)
    resp.raise_for_status()
    content = resp.json()["choices"][0]["message"]["content"]
    return json.loads(content)


@app.route("/api/generate-diet", methods=["POST"])
def generate_diet():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON body"}), 400
    try:
        diet_plan = call_groq(
            "You are a professional nutritionist. Respond ONLY with valid JSON.",
            build_diet_prompt(data)
        )
        return jsonify(diet_plan), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 500
    except requests.exceptions.Timeout:
        return jsonify({"error": "Groq API timed out. Please try again."}), 504
    except requests.exceptions.HTTPError as e:
        return jsonify({"error": f"Groq API error: {e.response.status_code}"}), 502
    except json.JSONDecodeError:
        return jsonify({"error": "AI returned invalid JSON"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/muscle-tips", methods=["POST"])
def muscle_tips():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON body"}), 400
    try:
        tips = call_groq(
            "You are an expert personal trainer. Respond ONLY with valid JSON.",
            build_muscle_tips_prompt(data),
            temperature=0.5, max_tokens=512
        )
        return jsonify(tips), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": GROQ_MODEL}), 200


if __name__ == "__main__":
    print("=" * 56)
    print("  IronPlate Backend — http://localhost:5000")
    print("  Powered by Groq LLaMA 3 70B")
    print("=" * 56)
    app.run(host="0.0.0.0", port=5000, debug=True)
