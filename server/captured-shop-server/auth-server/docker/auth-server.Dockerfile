# temp stage
FROM python:3.10-slim as builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && \
	apt-get install -y --no-install-recommends gcc

COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt


# final stage
FROM python:3.10-slim
ENV PATH="/home/myuser/venv/bin:$PATH"

WORKDIR /app

COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt .

RUN useradd --create-home myuser
USER myuser

RUN pip install --no-cache /wheels/*

RUN mkdir /home/myuser/code
WORKDIR /home/myuser/code
COPY --chown=myuser:myuser . .


EXPOSE 8000

# make sure all messages always reach console
ENV PYTHONUNBUFFERED=1

# activate virtual environment
ENV VIRTUAL_ENV=/home/myuser/venv
ENV PATH="/home/myuser/venv/bin:$PATH"
ENV ProductionLevel=True


CMD ["python","main.py"]

