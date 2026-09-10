import csv
import os

folder = "/Users/JALAT/GIT/data-hub/app/assets/csv/prescribing"

for filename in os.listdir(folder):
    if filename.endswith(".csv"):
        filepath = os.path.join(folder, filename)

        with open(filepath, "r", newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            fieldnames = reader.fieldnames

        if "oracle_dashboard_link" in fieldnames:
            for row in rows:
                row["oracle_dashboard_link"] = "#"

            with open(filepath, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(rows)

            print(f"Updated {filename}")
        else:
            print(f"Skipped {filename} (column not found)")