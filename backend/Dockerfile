FROM python:3.11.1-slim as base

# Set work directory
WORKDIR /app

# Add a user to run the app
RUN groupadd -r app --gid=1000 \
	&& useradd -r -g app --uid=1000 app \
	&& chown -R app:app /app


# Set env variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Copy requirements
COPY [ \
	"requirements/base.txt", \
	"requirements/test.txt", \
	"requirements/dev.txt", \
	"./" \
]
# Install dependencies
RUN --mount=type=cache,target=/root/.cache \
	pip install -r base.txt

FROM base as test-dev

# Install test and dev dependencies
RUN --mount=type=cache,target=/root/.cache \
	pip install -r dev.txt -r test.txt

# Copy the project
COPY . .

# Set the user
USER app
