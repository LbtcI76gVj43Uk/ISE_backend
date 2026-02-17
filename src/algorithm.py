import sys
import json
import os
import time
import random
import requests

def load_config():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    config_path = os.path.join(script_dir, 'config.json')
    
    try:
        with open(config_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return None

def run_algorithm():
    try:
        config = load_config()
    
        if not config:
            print(json.dumps({"error": "config.json not found"}))
            return
    
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No input provided"}))
            return

        raw_input = sys.argv[1]
        data = json.loads(raw_input)
        
        # get current sensor data (only mocked, not used)
        rest = config.get("rest", {})
        subpaths = rest.get("subpaths", {})
        url = (
            f"http://{rest.get('host')}:{rest.get('port')}/api"
            f"{rest.get('basePath')}{subpaths.get('db')}"
        )
        db_response = requests.get(url)

        # determain random area from selected ones
        algorithm_result = get_random_available_area(data.get("config"))
        
        # simulate a small delay for the algorithm running time
        time.sleep(1) 

        result = {
            "session-id": data.get("session-id"),
            "timestamp": time.time(),
            "status": "success",
            "message": {},
            "result": algorithm_result,
        }

        # output the result
        print(json.dumps(result))
    
    except Exception as error_message:
        result = {
            "session-id": data.get("session-id"),
            "timestamp": time.time(),
            "status": "failed",
            "message": str(error_message),
            "result": {},
        }
        print(json.dumps(result))

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
