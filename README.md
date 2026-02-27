# ISE backend

## Prerequisites

* Docker instance

## Run project

```bash
git clone ...
```

```bash
docker-compose up --build
```

## Stop instance

```bash
docker-compose down -v 
```

## Debugging

List current containers (ise_backend-app, mongo:latest)

```bash
docker ps
```

Show container logs

```bash
docker-compose logs app
```

## REST API

* **Base URL:** `http://localhost:3000/api`
* **Content-Type:** `application/json`
* **Environment:** Python 3.x (venv)

---

### 🛠 Endpoints

#### 1. Navigation Session

Bridges the frontend request to the Python-based allocation logic.

* **URL:** `/university-parking-assistant/navigation-session`
* **Method:** `POST`

**Example Payload:**

```json
{
  "session-id": "8be4df61-93ca-11d2-aa0d-00e098032b8c",
  "timestamp": 1771352675.3088448,
  "user-id": "xyz-123",
  "trigger-radius": 1,
  "config": {
    "parking-lot-1": {
        "area-1": true,
        "area-2": true,
        "area-3": true
    },
    "parking-lot-2": {
        "area-1": true,
        "area-2": true,
        "area-3": true
    },
    "parking-lot-3": {
        "area-1": true,
        "area-2": true,
        "area-3": true
    },
    "parking-lot-4": {
        "area-1": true,
        "area-2": true,
        "area-3": true
    }
  }
}
```

**Example Responses:**

```json
{
    "session-id": "8be4df61-93ca-11d2-aa0d-00e098032b8c",
    "timestamp": 1771356965.5301006,
    "status": "success",
    "message": {},
    "result": {
        "parking_lot": "parking-lot-1",
        "area": "area-2"
    }
}
```

```json
{
    "session-id": "8be4df61-93ca-11d2-aa0d-00e098032b8c",
    "timestamp": 1771356399.4106824,
    "status": "failed",
    "message": "name 'algorithm_result' is not defined",
    "result": {}
}
```

#### 2. Get current sensor data

Bridges the frontend request to the Python-based allocation logic.

* **URL:** `/university-parking-assistant/db`
* **Method:** `GET`

**Example Payload:**

```json
[
    {
        "_id": "699499c3fd1e4e97c10efd2f",
        "topic": "sensors/1",
        "__v": 0,
        "data": {
            "id": 1111,
            "spots-available": 5
        },
        "lastUpdated": "2026-02-17T18:28:57.896Z"
    }
]
```

#### Publish sensor data

Publish sensor data via MQTT.

* **Connection**: `mqtt://localhost:1883/`
* **Topic**:`sensors/<unique_sensor_id>`

**Example Payload**

```json
{
  "id": 1111, 
  "spots-available": 5
} 
```
