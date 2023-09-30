import os

from elasticsearch import Elasticsearch

from app.models import FacetedQueryBody

SYLLABUS_INDX = "syllabus"
COURSE_INDX = "courses"
INDEX = COURSE_INDX


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

    results = es.search(index=INDEX, body=query)
    return results["hits"]["hits"]


def faceted_search(es: Elasticsearch, body: FacetedQueryBody):
    query = {
        "query": {
            "query_string": {
                "query": " OR ".join([f"({q})" for q in body.skills]),
                "fields": ["syllabus"],
            }
        },
        "highlight": {"fields": {"syllabus": {}}},  # highlight here
    }
    results = es.search(index=INDEX, body=query)
    return results["hits"]["hits"]
