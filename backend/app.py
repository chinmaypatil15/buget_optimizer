import math
from flask import Flask, request, jsonify

app = Flask(__name__)

# Native CORS handling for Flask
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Default baseline dataset (UK / AMAZON / PETCARE)
BRANDS = [
    "Felix",
    "Gourmet",
    "Purina One",
    "Pro Plan",
    "Bakers",
    "Winalot",
    "Dentalife"
]

MARKETS = ["UK", "US", "GERMANY", "FRANCE"]
RETAILERS = ["AMAZON", "TESCO", "WALMART", "TARGET"]
CATEGORIES = ["PETCARE", "BEVERAGES", "SNACKS", "BEAUTY"]
MEDIA_LEVERS = ["ALL", "Search", "Display", "Video", "Social"]

def get_base_metrics(market, retailer, category):
    mult = 1.0
    if market == "US":
        mult = 1.8
    elif market == "GERMANY":
        mult = 1.2
    elif market == "FRANCE":
        mult = 0.9

    base_budget = 12000000.0 * mult
    base_volume = int(960000 * mult)
    base_sales = 25200000.0 * mult
    base_nns = 16800000.0 * mult
    base_roi = 2.10

    return {
        "budget": base_budget,
        "volume": base_volume,
        "sales": base_sales,
        "nns": base_nns,
        "roi": base_roi
    }

def generate_saturation_curve(max_investment=24000000):
    points = []
    num_steps = 25
    step_size = max_investment / (num_steps - 1)
    
    s_max = 9500000.0
    k = 0.00000012
    
    for i in range(num_steps):
        x = i * step_size
        inc_sales = s_max * (1 - math.exp(-k * x))
        if x > 0:
            roi_val = min(3.6, max(0.5, 2.1 + 1.5 * math.sin(math.pi * x / max_investment)))
        else:
            roi_val = 2.1
        
        points.append({
            "investment": round(x, 2),
            "investmentM": f"£{x/1000000:.1f}M",
            "incrementalSales": round(inc_sales, 2),
            "incrementalSalesM": f"£{inc_sales/1000000:.1f}M",
            "roi": round(roi_val, 2)
        })
    return points

@app.route('/api/filters', methods=['GET'])
def get_filters():
    return jsonify({
        "markets": MARKETS,
        "retailers": RETAILERS,
        "categories": CATEGORIES,
        "brands": ["ALL"] + BRANDS,
        "mediaLevers": MEDIA_LEVERS
    })

@app.route('/api/baseline', methods=['GET'])
def get_baseline():
    market = request.args.get('market', 'UK')
    retailer = request.args.get('retailer', 'AMAZON')
    category = request.args.get('category', 'PETCARE')

    metrics = get_base_metrics(market, retailer, category)
    brand_share_percent = 100.0 / len(BRANDS)
    brand_shares = [
        {
            "name": brand,
            "percentage": round(brand_share_percent, 2),
            "spend": round(metrics["budget"] / len(BRANDS), 2)
        }
        for brand in BRANDS
    ]

    return jsonify({
        "metrics": metrics,
        "brandShares": brand_shares,
        "saturationCurve": generate_saturation_curve(metrics["budget"] * 2)
    })

@app.route('/api/optimize', methods=['POST', 'OPTIONS'])
def optimize():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"})

    data = request.json or {}
    
    market = data.get('market', 'UK')
    retailer = data.get('retailer', 'AMAZON')
    category = data.get('category', 'PETCARE')
    
    objective = data.get('objective', 'Maximize Sales')
    target_mode = data.get('targetMode', 'budget')
    target_value = float(data.get('targetValue', 15000000))
    use_guardrails = data.get('useGuardrails', False)

    base = get_base_metrics(market, retailer, category)
    base_budget = base["budget"]

    if target_mode == 'target':
        ratio = target_value / base["sales"]
        new_budget = base_budget * math.pow(ratio, 0.95)
    else:
        new_budget = target_value

    budget_change = new_budget - base_budget
    pct_budget_change = (budget_change / base_budget) * 100.0

    if objective == 'Maximize Sales':
        elasticity_sales = 0.88
        elasticity_vol = 0.72
        elasticity_nns = 0.60
    else:
        elasticity_sales = 0.75
        elasticity_vol = 0.65
        elasticity_nns = 0.55

    if use_guardrails:
        elasticity_sales *= 0.96

    pct_sales_change = (math.pow(1.0 + (pct_budget_change / 100.0), elasticity_sales) - 1.0) * 100.0
    pct_vol_change = (math.pow(1.0 + (pct_budget_change / 100.0), elasticity_vol) - 1.0) * 100.0
    pct_nns_change = (math.pow(1.0 + (pct_budget_change / 100.0), elasticity_nns) - 1.0) * 100.0

    new_sales = base["sales"] * (1.0 + pct_sales_change / 100.0)
    new_vol = int(base["volume"] * (1.0 + pct_vol_change / 100.0))
    new_nns = base["nns"] * (1.0 + pct_nns_change / 100.0)

    new_roi = (new_sales / new_budget) * (2.10 / (base["sales"] / base_budget))
    if objective == 'Maximize ROI':
        new_roi *= 1.04

    pct_roi_change = ((new_roi - base["roi"]) / base["roi"]) * 100.0

    new_metrics = {
        "budget": round(new_budget, 2),
        "pct_budget": round(pct_budget_change, 1),
        "volume": new_vol,
        "pct_volume": round(pct_vol_change, 1),
        "sales": round(new_sales, 2),
        "pct_sales": round(pct_sales_change, 1),
        "nns": round(new_nns, 2),
        "pct_nns": round(pct_nns_change, 1),
        "roi": round(new_roi, 2),
        "pct_roi": round(pct_roi_change, 1)
    }

    waterfall = [
        {"name": "Last Year Budget", "value": round(base_budget, 2)},
        {"name": "Budget Change", "value": round(budget_change, 2)},
        {"name": "New Budget", "value": round(new_budget, 2)}
    ]

    brand_spend_sales = []
    base_brand_budget = base_budget / len(BRANDS)
    new_brand_budget = new_budget / len(BRANDS)
    base_brand_sales = base["sales"] / len(BRANDS)
    new_brand_sales = new_sales / len(BRANDS)

    for brand in BRANDS:
        brand_spend_sales.append({
            "brand": brand,
            "lastYearBudget": round(base_brand_budget, 2),
            "newBudget": round(new_brand_budget, 2),
            "lastYearSales": round(base_brand_sales, 2),
            "newSales": round(new_brand_sales, 2)
        })

    search_spend_change = budget_change * 0.533
    display_spend_change = budget_change * 0.467
    
    search_sales_change = (new_sales - base["sales"]) * 0.65
    display_sales_change = (new_sales - base["sales"]) * 0.35

    granular_spend = [
        {"tactic": "Total Search", "value": round(search_spend_change, 2)},
        {"tactic": "Total Display", "value": round(display_spend_change, 2)}
    ]

    granular_sales = [
        {"tactic": "Total Search", "value": round(search_sales_change, 2)},
        {"tactic": "Total Display", "value": round(display_sales_change, 2)}
    ]

    deep_dive = []
    for brand in BRANDS:
        search_last_b = base_brand_budget * 0.5
        search_new_b = new_brand_budget * 0.5
        search_last_s = base_brand_sales * 0.5
        search_new_s = new_brand_sales * 0.5

        display_last_b = base_brand_budget * 0.5
        display_new_b = new_brand_budget * 0.5
        display_last_s = base_brand_sales * 0.5
        display_new_s = new_brand_sales * 0.5

        deep_dive.append({
            "brand": brand,
            "search_last_budget": round(search_last_b, 0),
            "search_new_budget": round(search_new_b, 0),
            "search_pct_budget": round(pct_budget_change, 1),
            "search_last_sales": round(search_last_s, 0),
            "search_new_sales": round(search_new_s, 0),
            "search_pct_sales": round(pct_sales_change, 1),

            "display_last_budget": round(display_last_b, 0),
            "display_new_budget": round(display_new_b, 0),
            "display_pct_budget": round(pct_budget_change, 1),
            "display_last_sales": round(display_last_s, 0),
            "display_new_sales": round(display_new_s, 0),
            "display_pct_sales": round(pct_sales_change, 1),
        })

    return jsonify({
        "baseline": base,
        "newMetrics": new_metrics,
        "waterfall": waterfall,
        "brandSpendSales": brand_spend_sales,
        "granularSpend": granular_spend,
        "granularSales": granular_sales,
        "deepDive": deep_dive
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
