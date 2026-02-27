# ISE backend

## Prerequisites

* Docker instance

## Run project

```bash
git clone ...
```

Create `.env` file accordingly to `.env.example`.

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

**Example Body:**

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

* **URL:** `/university-parking-assistant/fetch_db`
* **Method:** `GET`

**Example Response:**

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

#### 3. Get current config json parameters

Returns the current config of he backend instance.

* **URL:** `/university-parking-assistant/fetch_config`
* **Method:** `GET`

**Example Response:**

```json
{
    "rest": {
        "basePath": "/university-parking-assistant",
        "subpaths": {
            "read_db": "/db",
            "run_navigation-session": "/navigation-session",
            "read_config": "/read_config",
            "set_config": "/set_config"
        }
    },
    "mqtt": {
        "sensorTopic": "sensors/"
    }
}
```

#### 4. Get user's time table

Mocks a SQL SELECT call to return the user's time table.

* **URL:** `/university-parking-assistant/fetch_time_table`
* **Method:** `GET`

**Body**

```json
{
  "session-id": "8be4df61-93ca-11d2-aa0d-00e098032b8c",
  "timestamp": 1771352675.3088448,
  "user-id": "xyz-123"
}
```

**Example Response:**

```json
{
    "session-id": "8be4df61-93ca-11d2-aa0d-00e098032b8c",
    "timestamp": 1772212481.657,
    "status": "success",
    "user-id": "xyz-123",
    "result": {
        "time_table": [
            {
                "day": "Tuesday",
                "subject": "Advanced Topics in Algorithm",
                "room": "LE-1.410",
                "time": "15:45 - 17:20"
            },
            {
                "day": "Wednesday",
                "subject": "Management and Business Administration",
                "room": "LE-1.375",
                "time": "08:00 - 11:20"
            },
            {
                "day": "Thursday",
                "subject": "Scientific Methods and Writing",
                "room": "LE-1.204",
                "time": "15:45 - 17:20"
            },
            {
                "day": "Friday",
                "subject": "Industrial Software Engineering",
                "room": "LE-1.149",
                "time": "09:45 - 13:05"
            }
        ]
    }
}
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
