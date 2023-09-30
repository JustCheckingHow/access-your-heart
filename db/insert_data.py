import os

import pandas as pd
import ujson as json
from dotenv import load_dotenv
from dotenv.main import find_dotenv
from elasticsearch import Elasticsearch
from elasticsearch.helpers import streaming_bulk

COURSE_INDX = "courses"
SYLLABUS_INDX = "syllabus"


def str_replacer(x, repls):
    for repl in repls:
        x = x.replace(repl, "")
    return x


additional_stopwords_list = []


def create_course_indx(es: Elasticsearch, indx_name: str = COURSE_INDX):
    """Create index"""
    dense_funds = {
        "settings": {
            "analysis": {
                "analyzer": {
                    "pl_analyzer": {
                        "type": "custom",
                        "tokenizer": "whitespace",
                        "filter": [
                            "lowercase",
                            "polish_stop_filter",
                            "polish_stem",
                            "polish_stop_filter",
                        ],
                        "char_filter": ["html_strip"],
                    },
                },
                "filter": {
                    "polish_stop_filter": {
                        "type": "stop",
                        "ignore_case": True,
                        # plugin required
                        "stopwords": ["_polish_", *additional_stopwords_list],
                    }
                },
            },
        },
        "mappings": {
            "properties": {
                # "description": {
                #     "type": "text",
                #     "analyzer": "pl_analyzer"
                # },
                "mainInstitutionName": {
                    "type": "keyword",
                    #  "analyzer": "pl_analyzer"
                },
                "mainInstitutionKind": {
                    "type": "keyword",
                    #  "analyzer": "pl_analyzer"
                },
                "courseName": {"type": "text", "analyzer": "pl_analyzer"},
                "leadingInstitutionCity": {
                    "type": "keyword",
                    #  "analyzer": "pl_analyzer"
                },
                "tags": {
                    "type": "keyword",
                    #  "analyzer": "pl_analyzer"
                },
            }
        },
    }
    es.indices.delete(indx_name, ignore=[400, 404])
    es.indices.create(index=indx_name, body=dense_funds)


def create_syllabus_indx(es: Elasticsearch, indx_name: str = SYLLABUS_INDX):
    """Create index"""
    dense_funds = {
        "settings": {
            "analysis": {
                "analyzer": {
                    "pl_analyzer": {
                        "type": "custom",
                        "tokenizer": "whitespace",
                        "filter": [
                            "lowercase",
                            "polish_stop_filter",
                            "polish_stem",
                            "polish_stop_filter",
                        ],
                        "char_filter": ["html_strip"],
                    },
                },
                "filter": {
                    "polish_stop_filter": {
                        "type": "stop",
                        "ignore_case": True,
                        # plugin required
                        "stopwords": ["_polish_", *additional_stopwords_list],
                    }
                },
            },
        },
        "mappings": {
            "properties": {
                "syllabus": {"type": "text", "analyzer": "pl_analyzer"},
                "kierunek": {
                    "type": "keyword",
                },
                "przedmiot": {
                    "type": "keyword",
                },
            }
        },
    }
    es.indices.delete(indx_name, ignore=[400, 404])
    es.indices.create(index=indx_name, body=dense_funds)


def upload_courses(es: Elasticsearch):
    def stream_record(course_file: str):
        course_records = json.load(open(course_file))
        for record in course_records:
            yield {"_index": COURSE_INDX, "_source": {**record}}

    stream = stream_record(course_file="data/courses.json")
    for ok, response in streaming_bulk(es, actions=stream):
        if not ok:
            print(response)


def upload_syllabus(es: Elasticsearch):
    def stream_record(syllabus_file: str):
        syllabuses = pd.read_csv(syllabus_file, sep=",")
        for record in syllabuses.to_dict(orient="records"):
            yield {"_index": SYLLABUS_INDX, "_source": {**record}}

    stream = stream_record(syllabus_file="data/syllabus_full.csv")
    for ok, response in streaming_bulk(es, actions=stream):
        if not ok:
            print(response)


def create_es_instance(use_pass: bool = False) -> Elasticsearch:
    if use_pass:
        load_dotenv(find_dotenv())
        user = os.environ.get("USER")
        password = os.environ.get("PASS")
        addr = os.environ.get("ADDR")
        es = Elasticsearch(hosts=[f"http://{user}:{password}@{addr}:9200"])
    else:
        es = Elasticsearch(hosts=["http://localhost:9200"])
    return es


def multiple_term_search(es: Elasticsearch, terms: list[str]):
    query = {
        "query": {
            "query_string": {
                "query": " OR ".join([f"({q})" for q in terms]),
                # "fields": ["description"]
            }
        },
        "highlight": {
            # "fields": {
            # "description": {}  # highlight here
            # }
        },
    }

    results = es.search(index="funds", body=query)
    return results["hits"]["hits"]


def simple_query(es: Elasticsearch, query_input: str):
    query = {
        "query": {
            "simple_query_string": {
                "query": query_input,
                # "fields": ["description"]
            }
        },
        "highlight": {"fields": {"tags": {}}},  # highlight here
    }

    results = es.search(index=COURSE_INDX, body=query)
    return results["hits"]["hits"]


if __name__ == "__main__":
    es = create_es_instance()
    # create_course_indx(es)
    # upload_courses(es)

    create_syllabus_indx(es, SYLLABUS_INDX)
    upload_syllabus(es)
