# API Endpoints

> Martin documents this before William starts connecting frontend to backend.

## Auth
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/users/login` | All | Login, returns JWT token |
| GET | `/api/users/me` | All | Get current user profile |

## Visits
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/visits/` | Doorknocker, Admin | Log a visit |
| GET | `/api/visits/mine` | Doorknocker | My visit history |
| GET | `/api/visits/?household_id=` | Admin, Coordinator | Visits for a household |

## Households
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/households/` | All | List all households |
| GET | `/api/households/{id}` | All | Household detail |
| POST | `/api/households/import` | Admin | Import CSV |
| PATCH | `/api/households/{id}` | Admin, Coordinator | Update status |

## Tasks
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks/` | All | List tasks |
| GET | `/api/tasks/mine` | Doorknocker | My assigned tasks |
| POST | `/api/tasks/` | Admin, Coordinator | Create task |
| PATCH | `/api/tasks/{id}` | Admin, Coordinator | Update task |

## Sync (Offline)
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/sync/` | Doorknocker | Batch submit offline actions |

## Response Format
All responses follow this shape:
```json
{ "data": { ... } }
```
Errors:
```json
{ "detail": "Error message" }
```
