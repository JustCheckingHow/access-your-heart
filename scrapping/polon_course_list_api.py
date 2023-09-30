import json
import time
from typing import Any

import requests

"""
Examples:
BASE_URL = 'https://radon.nauka.gov.pl/opendata/polon/courses'
BASE_URL = "https://radon.nauka.gov.pl/opendata/polon/specializedEducations"
"""


def request_radon_page(
    subpage: str, n_results: int = 10, token: str = None
) -> dict[str, Any]:
    headers = {
        "accept": "application/json",
    }
    params = {"resultNumbers": n_results}
    if token:
        params["token"] = token
    response = requests.get(
        f"https://radon.nauka.gov.pl/opendata/polon/{subpage}",
        params=params,
        headers=headers,
    )
    if response.ok:
        return response.json()

    return None


def parse_spec_course(json_results: dict[str, Any]) -> list[dict[str, Any]]:
    keys_to_save = [
        "institutionName",
        "certificateName",
        "specializedEducationName",
    ]
    res = [
        {k: result.get(k, "UNKNOWN") for k in keys_to_save} for result in json_results
    ]
    return res


def parse_generic_course(json_results: dict[str, Any]) -> list[dict[str, Any]]:
    main_keys = [
        "mainInstitutionName",
        "mainInstitutionKind",
        "levelName",
        "courseName",
        "leadingInstitutionCity",
        "mainInstitutionKind",
    ]

    tags = []
    results = []
    for res in json_results:
        for disc in res.get("disciplines", []):
            tags.append(disc["disciplineName"])
        sub_result = {k: res.get(k, "UNKNOWN") for k in main_keys}
        sub_result["tags"] = tags
        results.append(sub_result)
    return results


def perpetual_parser(subpage: str, n_results: int = 10):
    parsing_fn = get_parse_fn(subpage)
    token = None
    big_json = []
    while True:
        response_json = request_radon_page(subpage, n_results, token)
        if response_json is None:
            break
        token = response_json.get("pagination", None)
        if token is not None:
            token = token["token"]
        parsed = parsing_fn(response_json["results"])
        big_json.extend(parsed)
        # snapshot
        json.dump(big_json, open(f"../data/{subpage}.json", "w"))
        if token is None:
            break
        time.sleep(0.2)
        print(f"Parsed so far {len(big_json)}...")


def get_parse_fn(subpage: str):
    parser_fn_map = {
        "specializedEducations": parse_spec_course,
        "courses": parse_generic_course,
    }
    return parser_fn_map[subpage]


if __name__ == "__main__":
    perpetual_parser("courses", 10)
