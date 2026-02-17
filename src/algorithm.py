import sys
import json
import time
import random

def run_algorithm():
    try:
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No input provided"}))
            return

        raw_input = sys.argv[1]
        data = json.loads(raw_input)

        # determain random area from selected ones
        algorithm_result = get_random_available_area(data.get("config"))
        
        # simulate a small delay for the algorithm running time
        time.sleep(1) 

        result = {
            "session-id": data.get("session-id"),
            "timestamp": time.time(),
            "status": "success",
            "result": algorithm_result,
        }

        # output the result
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

def get_random_available_area(config_data):
    available_options = []
    
    # filter for selected areas
    for lot_name, areas in config_data.items():
        for area_name, is_available in areas.items():
            if is_available is True:
                available_options.append((lot_name, area_name))
    
    if not available_options:
        return None
    
    # pick one random tuple
    chosen_lot, chosen_area = random.choice(available_options)
    
    return {
        "parking_lot": chosen_lot,
        "area": chosen_area
    }

if __name__ == "__main__":
    run_algorithm()