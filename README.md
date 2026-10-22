# Milestones App

This project uses pnpm

# Planning

User can add random exercise data, open a session of on-the-go exercises, or follow a planned weekly routine.

session_data copies in routine exercises and updates data according to how the user completes the session.

Routines

Each routine has 7 days, each day has one template or rest days

Routine data is stored in routine_data_metadata and routine_exercise_data. Routine data is not tied to days, it is tied to the routine, which makes it easier to get the data for any routine and show it's usage to the user.

Data rendering
Weekly view: If our weekday is behind the routine's (our weekday index - (.getDay - 2) is a negative number), then display whether the routine was completed on this day (our .getDate - the calculated negative number, this let's us access the date from a previous weekday, to check if the routine's date matches).
