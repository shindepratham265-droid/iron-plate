import urllib.request, json, urllib.error

payload = json.dumps({
    'age': 22, 'weight': 75, 'height': 178, 'sex': 'male',
    'goal': 'gain', 'activityLevel': 'moderate',
    'preferences': ['nonveg'], 'targetCal': 2800
}).encode('utf-8')

req = urllib.request.Request(
    'http://localhost:5000/api/generate-diet',
    data=payload,
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    with urllib.request.urlopen(req, timeout=35) as resp:
        data = json.loads(resp.read().decode())
        print('=== AI DIET PLAN RESPONSE ===')
        print('Daily Calories :', data.get('dailyCalories'), 'kcal')
        print('Protein        :', data.get('protein'), 'g')
        print('Carbs          :', data.get('carbs'), 'g')
        print('Fat            :', data.get('fat'), 'g')
        meals = data.get('meals', [])
        print('Meals returned :', len(meals))
        for meal in meals:
            print(' ', meal.get('icon',''), meal.get('name',''), '—', len(meal.get('items',[])), 'items')
        print()
        print('SUCCESS — Groq AI diet plan generated correctly!')
except urllib.error.HTTPError as e:
    print('HTTP Error:', e.code, e.read().decode())
except Exception as e:
    print('Error:', type(e).__name__, str(e))
