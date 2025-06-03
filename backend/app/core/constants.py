# User update validation constants
VALID_JOB_SEARCH_PHASES = {
    "actively_looking",
    "open_to_opportunities",
    "not_looking",
    "recently_hired",
}

VALID_CAREER_STAGES = {"entry", "mid", "senior", "expert"}

VALID_NOTIFICATION_FREQUENCIES = {"immediate", "daily", "weekly", "monthly", "never"}

# Error messages
error_messages = {
    # ...existing error messages...
    "invalid_job_search_phase": "Invalid job search phase",
    "invalid_career_stage": "Invalid career stage",
    "invalid_notification_freq": "Invalid notification frequency",
    "invalid_scoring_weights": "Candidate scoring weights must sum to 100",
    "invalid_url_format": "Invalid URL format",
    "invalid_time_slot": "Invalid time slot format. Use HH:MM-HH:MM",
    "invalid_notification_keys": "Invalid notification preference keys",
    "negative_hiring_capacity": "Hiring capacity must be a positive integer",
}
