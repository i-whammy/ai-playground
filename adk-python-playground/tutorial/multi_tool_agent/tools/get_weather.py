def get_weather(city: str) -> dict:
    """Retrieves the current weather report for a specified city.

    Args:
        city (str): The name of the city (e.g., "New York", "London", "Paris", "Tokyo")

    Returns:
        dict: A dictionary with the status and the weather report.
        Include a 'status' key with the value 'success' or 'error'.
        If status is 'success', include a 'report' key with the weather report.
        If status is 'error', include an 'error_message' key with the error message.
    """

    print(f"--- Tool: get_weather called for city: {city} ---")
    city_normalized = city.lower().replace(" ", "")

    mock_weather_db = {
        "newyork": {"status": "success", "report": "The weather in New York is sunny with a temperature of 25 degrees celsius."},
        "london": {"status": "success", "report": "It's cloudy in London with a temperature of 18 degrees celsius."},
        "paris": {"status": "success", "report": "It's sunny in Paris with a temperature of 22 degrees celsius."},
        "tokyo": {"status": "success", "report": "It's rainy in Tokyo with a temperature of 28 degrees celsius."},
    }

    if city_normalized in mock_weather_db:
        return mock_weather_db[city_normalized]
    else:
        return {
            "status": "error",
            "error_message": f"Weather information for '{city}' is not available.",
        }

