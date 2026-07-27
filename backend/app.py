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
    # Exact 11 ticks matching Image 2: £0.0M, £2.4M, £4.8M, £7.2M, £9.6M, £12.0M, £14.4M, £16.8M, £19.2M, £21.6M, £24.0M
    ticks = [i * 2400000 for i in range(11)]
    
    s_max = 8500000.0
    k = 0.00000013
    
    for x in ticks:
        inc_sales = s_max * (1 - math.exp(-k * x))
        if x > 0:
            roi_val = min(3.6, max(0.5, 2.1 + 1.55 * math.sin(math.pi * x / max_investment)))
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
    brand_shares = {
        "Felix": 14.3,
        "Gourmet": 14.3,
        "Purina One": 14.3,
        "Pro Plan": 14.3,
        "Bakers": 14.3,
        "Winalot": 14.3,
        "Dentalife": 14.2
    }
    curve = generate_saturation_curve()

    return jsonify({
        "metrics": metrics,
        "brandShares": brand_shares,
        "saturationCurve": curve
    })

@app.route('/api/optimize', methods=['POST'])
def optimize():
    data = request.json or {}
    target_val = float(data.get('targetValue', 15000000))
    target_mode = data.get('targetMode', 'budget') # 'budget' or 'target'
    objective = data.get('objective', 'Maximize Sales')

    base_budget = 12000000.0
    if target_mode == 'budget':
        new_budget = target_val
    else:
        new_budget = target_val * 0.45 # inverse calculation proxy for target sales

    budget_diff = new_budget - base_budget
    budget_pct_change = (budget_diff / base_budget) * 100

    # Sales response curve
    new_sales = 25200000.0 + (new_budget - base_budget) * 1.35
    sales_pct_change = ((new_sales - 25200000.0) / 25200000.0) * 100

    new_volume = int(960000 + (new_budget - base_budget) * 0.055)
    volume_pct_change = ((new_volume - 960000) / 960000) * 100

    new_nns = 16800000.0 + (new_budget - base_budget) * 0.90
    nns_pct_change = ((new_nns - 16800000.0) / 16800000.0) * 100

    new_roi = (new_sales - 25200000.0 + 25200000.0 * 0.6) / new_budget if new_budget > 0 else 2.1
    roi_pct_change = ((new_roi - 2.1) / 2.1) * 100

    optimized_metrics = {
        "budget": round(new_budget, 2),
        "budgetChangePct": round(budget_pct_change, 1),
        "volume": new_volume,
        "volumeChangePct": round(volume_pct_change, 1),
        "sales": round(new_sales, 2),
        "salesChangePct": round(sales_pct_change, 1),
        "nns": round(new_nns, 2),
        "nnsChangePct": round(nns_pct_change, 1),
        "roi": round(new_roi, 2),
        "roiChangePct": round(roi_pct_change, 1)
    }

    waterfall = [
        {"name": "Last Year Budget", "value": base_budget},
        {"name": "Budget Change", "value": budget_diff},
        {"name": "New Budget", "value": new_budget}
    ]

    spend_comparison = [
        {"brand": "Felix", "lastYear": 1714285, "newBudget": 2142857},
        {"brand": "Gourmet", "lastYear": 1714285, "newBudget": 2142857},
        {"brand": "Purina One", "lastYear": 1714285, "newBudget": 2142857},
        {"brand": "Pro Plan", "lastYear": 1714285, "newBudget": 2142857},
        {"brand": "Bakers", "lastYear": 1714285, "newBudget": 2142857},
        {"brand": "Dentalife", "lastYear": 1714285, "newBudget": 2142857}
    ]

    sales_comparison = [
        {"brand": "Felix", "lastYear": 3600000, "newBudget": 4381101},
        {"brand": "Gourmet", "lastYear": 3600000, "newBudget": 4381101},
        {"brand": "Purina One", "lastYear": 3600000, "newBudget": 4381101},
        {"brand": "Pro Plan", "lastYear": 3600000, "newBudget": 4381101},
        {"brand": "Bakers", "lastYear": 3600000, "newBudget": 4381101},
        {"brand": "Dentalife", "lastYear": 3600000, "newBudget": 4381101}
    ]

    granular_spend = [
        {"tactic": "Total Search", "value": (new_budget - base_budget) * 0.55},
        {"tactic": "Total Display", "value": (new_budget - base_budget) * 0.45}
    ]

    granular_sales = [
        {"tactic": "Total Search", "value": (new_sales - 25200000.0) * 0.60},
        {"tactic": "Total Display", "value": (new_sales - 25200000.0) * 0.40}
    ]

    deep_dive = [
        {
            "brand": "Felix",
            "searchLastBudget": 857143,
            "searchNewBudget": 1071429,
            "searchPctChange": 25.0,
            "searchLastSales": 1800000,
            "searchNewSales": 2190551,
            "searchSalesPctChange": 21.7,
            "displayLastBudget": 857143,
            "displayNewBudget": 1071429,
            "displayPctChange": 25.0,
            "displayLastSales": 1800000,
            "displayNewSales": 2190551,
            "displaySalesPctChange": 21.7
        },
        {
            "brand": "Gourmet",
            "searchLastBudget": 857143,
            "searchNewBudget": 1071429,
            "searchPctChange": 25.0,
            "searchLastSales": 1800000,
            "searchNewSales": 2190551,
            "searchSalesPctChange": 21.7,
            "displayLastBudget": 857143,
            "displayNewBudget": 1071429,
            "displayPctChange": 25.0,
            "displayLastSales": 1800000,
            "displayNewSales": 2190551,
            "displaySalesPctChange": 21.7
        },
        {
            "brand": "Purina One",
            "searchLastBudget": 857143,
            "searchNewBudget": 1071429,
            "searchPctChange": 25.0,
            "searchLastSales": 1800000,
            "searchNewSales": 2190551,
            "searchSalesPctChange": 21.7,
            "displayLastBudget": 857143,
            "displayNewBudget": 1071429,
            "displayPctChange": 25.0,
            "displayLastSales": 1800000,
            "displayNewSales": 2190551,
            "displaySalesPctChange": 21.7
        },
        {
            "brand": "Pro Plan",
            "searchLastBudget": 857143,
            "searchNewBudget": 1071429,
            "searchPctChange": 25.0,
            "searchLastSales": 1800000,
            "searchNewSales": 2190551,
            "searchSalesPctChange": 21.7,
            "displayLastBudget": 857143,
            "displayNewBudget": 1071429,
            "displayPctChange": 25.0,
            "displayLastSales": 1800000,
            "displayNewSales": 2190551,
            "displaySalesPctChange": 21.7
        },
        {
            "brand": "Bakers",
            "searchLastBudget": 857143,
            "searchNewBudget": 1071429,
            "searchPctChange": 25.0,
            "searchLastSales": 1800000,
            "searchNewSales": 2190551,
            "searchSalesPctChange": 21.7,
            "displayLastBudget": 857143,
            "displayNewBudget": 1071429,
            "displayPctChange": 25.0,
            "displayLastSales": 1800000,
            "displayNewSales": 2190551,
            "displaySalesPctChange": 21.7
        },
        {
            "brand": "Winalot",
            "searchLastBudget": 857143,
            "searchNewBudget": 1071429,
            "searchPctChange": 25.0,
            "searchLastSales": 1800000,
            "searchNewSales": 2190551,
            "searchSalesPctChange": 21.7,
            "displayLastBudget": 857143,
            "displayNewBudget": 1071429,
            "displayPctChange": 25.0,
            "displayLastSales": 1800000,
            "displayNewSales": 2190551,
            "displaySalesPctChange": 21.7
        },
        {
            "brand": "Dentalife",
            "searchLastBudget": 857143,
            "searchNewBudget": 1071429,
            "searchPctChange": 25.0,
            "searchLastSales": 1800000,
            "searchNewSales": 2190551,
            "searchSalesPctChange": 21.7,
            "displayLastBudget": 857143,
            "displayNewBudget": 1071429,
            "displayPctChange": 25.0,
            "displayLastSales": 1800000,
            "displayNewSales": 2190551,
            "displaySalesPctChange": 21.7
        }
    ]

    return jsonify({
        "metrics": optimized_metrics,
        "waterfall": waterfall,
        "spendComparison": spend_comparison,
        "salesComparison": sales_comparison,
        "granularSpend": granular_spend,
        "granularSales": granular_sales,
        "deepDive": deep_dive
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
