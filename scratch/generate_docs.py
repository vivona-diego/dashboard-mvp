
import json
import os

def generate_docs():
    try:
        with open('full_real_metadata.json', 'r') as f:
            data = json.load(f)
        
        os.makedirs('docs/datasets', exist_ok=True)
        
        for name, d in data.items():
            dataset = d.get('dataset', {})
            # Fix segment extraction from the nested structure
            segments_raw = d.get('segments', [])
            segments = []
            for s in segments_raw:
                if 'segment' in s and 'segmentName' in s['segment']:
                    segments.append(s['segment']['segmentName'])
                elif 'segmentName' in s:
                    segments.append(s['segmentName'])
            
            metrics = [m['metricName'] for m in d.get('metrics', [])]
            desc = dataset.get('description', '')
            sql = dataset.get('baseSQL', 'N/A')
            
            content = f"# Dataset: {name}\n"
            content += f"{desc}\n\n"
            content += "## SQL Base\n"
            content += "```sql\n"
            content += f"{sql}\n"
            content += "```\n\n"
            content += "## Segments\n"
            for s in segments:
                content += f"- {s}\n"
            
            content += "\n## Metrics\n"
            for m in metrics:
                content += f"- {m}\n"
            
            file_path = f"docs/datasets/{name}.md"
            with open(file_path, 'w') as f:
                f.write(content)
            print(f"Regenerated {file_path}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    generate_docs()
