
import json
import urllib.request
import sys

base_url = "https://saasanalytic.fleetcostcare.com/"

def fetch_all_data():
    try:
        # Login
        print("Attempting login...")
        login_url = base_url + "api/auth/login"
        login_data = json.dumps({
            "username": "demo",
            "password": "demo1234"
        }).encode('utf-8')
        
        req = urllib.request.Request(login_url, data=login_data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode())
            token = res_data['data']['token']
            print("Login successful.")

        # Fetch all datasets list
        print("Fetching full datasets list...")
        list_url = f"{base_url}api/bi/datasets"
        req = urllib.request.Request(list_url, headers={'Authorization': f'Bearer {token}'})
        with urllib.request.urlopen(req) as response:
            all_datasets_res = json.loads(response.read().decode())
            all_datasets = all_datasets_res.get('data', {}).get('datasets', [])
            print(f"Found {len(all_datasets)} datasets.")

        # For each dataset, fetch its specific details (segments AND metrics)
        full_results = {}
        for ds in all_datasets:
            name = ds['name']
            print(f"Fetching details for {name}... ", end='', flush=True)
            try:
                # The /api/bi/datasets/{name} endpoint
                url = f"{base_url}api/bi/datasets/{name}"
                req = urllib.request.Request(url, headers={'Authorization': f'Bearer {token}'})
                with urllib.request.urlopen(req) as response:
                    detail_res = json.loads(response.read().decode())
                    # Check where metrics are. The app says response.data.data.metrics
                    full_results[name] = detail_res.get('data', {})
                    print("Done")
            except Exception as e:
                print(f"Failed: {e}")

        # Save to file
        with open('full_real_metadata.json', 'w') as f:
            json.dump(full_results, f, indent=2)
        print("All results saved to full_real_metadata.json")

    except Exception as e:
        print(f"Fatal error: {e}")

if __name__ == "__main__":
    fetch_all_data()
