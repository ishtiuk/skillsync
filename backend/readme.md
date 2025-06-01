# Running Tests for Pathways Backend

## Prerequisites

- Python 3.11.11 installed
- pip package manager
- Environment setup (.env.example file)

## Project Structure

```
backend/
├── app/
│   └── tests/
│       ├── apis/
│       │   └── test_user_api.py
│       ├── services/
│       │   └── test_user_service.py
│       ├── assets/
│       │   └── mock_data.json
│       └── conftest.py
├── pytest.ini
└── requirements_test.txt
```

## Test Configuration Files

### pytest.ini
- Configures test discovery and execution
- Sets coverage reporting options
- Defines test paths and patterns

### .env.example
- Contains test environment variables
- Used for test configuration
- Mock credentials for external services

## Running Tests

### Simple test execution

```bash
# Install test requirements
pip install -r requirements_test.txt

# Run all tests with coverage
pytest
```

The test execution will:
1. Create temporary test databases automatically
2. Run tests with coverage reporting
3. Clean up test resources
4. Generate coverage reports

## Test Structure

### API Tests (test_user_api.py)
- Tests HTTP endpoints
- Validates request/response data
- Checks authentication and authorization
- Tests error handling

### Service Tests (test_user_service.py)
- Tests business logic
- Database operations
- Data validation
- Error cases

### Test Fixtures (conftest.py)
- In-memory database setup with pytest-postgresql
- Test data setup
- Authentication mocking
- Request state handling

## Mock Data

Mock data is stored in `app/tests/assets/mock_data.json` and includes:
- User test data
- Experience test data
- Valid and invalid test cases

## Coverage Reports

Test coverage report shows:
- Lines executed
- Missing lines
- Branch coverage
- Module-wise coverage

View the coverage report in:
- Terminal output
- HTML format at `app/tests/coverage/index.html`

## Troubleshooting

1. Clear pytest cache:
```bash
pytest --cache-clear
```

2. Run tests with verbose output:
```bash
pytest -v -s
```

3. Run specific test file:
```bash
pytest app/tests/apis/test_user_api.py -v
```

## Adding New Tests

1. Create test file in appropriate directory:
   - API tests in `app/tests/apis/`
   - Service tests in `app/tests/services/`

2. Update mock data if needed in `mock_data.json`

3. Add fixtures in `conftest.py` if required

4. Run tests to verify:
```bash
pytest
```
