import os

from elasticsearch import Elasticsearch

SYLLABUS_INDX = "syllabus"


def create_es_instance(use_pass: bool = False) -> Elasticsearch:
    if use_pass:
        from python_dotenv import find_dotenv, load_dotenv

        load_dotenv(find_dotenv())
        user = os.environ.get("USER")
        password = os.environ.get("PASS")
        addr = os.environ.get("ADDR")
        es = Elasticsearch(hosts=[f"http://{user}:{password}@{addr}:9200"])
    else:
        es = Elasticsearch(hosts=["http://206.189.56.21:9200"])
    return es


def simple_query(es: Elasticsearch, query_input: str):
    query = {
        "query": {
            "simple_query_string": {"query": query_input, "fields": ["syllabus"]}
        },
        "highlight": {"fields": {"syllabus": {}}},  # highlight here
    }

    results = es.search(index=SYLLABUS_INDX, body=query)
    return results["hits"]["hits"]
