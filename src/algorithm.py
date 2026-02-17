import sys
import json
import time

def run_algorithm():
    try:
        # 1. Capture input from Node.js
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No input provided"}))
            return

        raw_input = sys.argv[1]
        data = json.loads(raw_input)

        # 2. Dummy Algorithm Logic
        # We take a dummy field 'request_type' and return a decision
        user_msg = data.get("dummy_input", "no data")
        
        # Simulate a small delay for the calculation
        time.sleep(1) 

        result = {
            "status": "completed",
            "decision": f"Algorithm processed: {user_msg}",
            "parking_spot": "Spot-A12",
            "timestamp": time.time()
        }

        # 3. Output the result for Node.js to catch
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    run_algorithm()