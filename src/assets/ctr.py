import requests
import json

def fetch_countries():
    url = "https://restcountries.com/v3.1/all"
    response = requests.get(url)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch countries. Status code: {response.status_code}")
        return None

def generate_countries_json():
    countries = fetch_countries()

    if countries:
        # Sort countries alphabetically by name
        sorted_countries = sorted(countries, key=lambda x: x["name"]["common"])

        # Create a list of dictionaries with country names and codes
        country_list = [{"name": country["name"]["common"], "code": country["cca2"]} for country in sorted_countries]

        # Save the data to a JSON file
        with open("countries.json", "w", encoding="utf-8") as json_file:
            json.dump(country_list, json_file, ensure_ascii=False, indent=4)
        print("countries.json file created successfully.")
    else:
        print("Failed to generate countries.json.")

if __name__ == "__main__":
    generate_countries_json()
