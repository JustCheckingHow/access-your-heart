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


def create_courses_indx(es: Elasticsearch, indx_name: str = COURSE_INDX):
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
                "institution": {
                    "type": "keyword",
                },
                "institutionKind": {
                    "type": "keyword",
                },
                "course": {"type": "keyword"},
                "leadingInstitutionCity": {
                    "type": "keyword",
                },
                "city": {"type": "keyword"},
                "name": {
                    "type": "keyword",
                },
                "tags": {
                    "type": "keyword",
                },
                "syllabus": {"type": "text", "analyzer": "pl_analyzer"},
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

    stream = stream_record(
        course_file="/Users/jm/repos/acces-your-heart/data/full_join.json"
    )
    for ok, response in streaming_bulk(es, actions=stream):
        if not ok:
            print(response)


def upload_syllabus(es: Elasticsearch):
    def stream_record(syllabus_file: str):
        syllabuses = pd.read_csv(syllabus_file, sep=",")
        for record in syllabuses.to_dict(orient="records"):
            yield {"_index": SYLLABUS_INDX, "_source": {**record}}

    stream = stream_record(
        syllabus_file="/Users/jm/repos/acces-your-heart/data/syllabus_full.csv"
    )
    for ok, response in streaming_bulk(es, actions=stream):
        if not ok:
            print(response)


def create_es_instance(
    use_pass: bool = False, host="http://localhost:9200"
) -> Elasticsearch:
    if use_pass:
        load_dotenv(find_dotenv())
        user = os.environ.get("USER")
        password = os.environ.get("PASS")
        addr = os.environ.get("ADDR")
        es = Elasticsearch(hosts=[f"http://{user}:{password}@{addr}:9200"])
    else:
        es = Elasticsearch(hosts=[host])
    return es


if __name__ == "__main__":
    es = create_es_instance(host="206.189.56.21:9200")

    create_courses_indx(es, SYLLABUS_INDX)
    upload_courses(es)
