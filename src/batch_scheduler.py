import pandas as pd


def create_batch_irrigation_schedule(
    smart_df,
    min_irrigation_event=0.02,
    max_irrigation_event=0.08
):
    """
    Converts frequent small irrigation recommendations into practical batch irrigation events.

    Logic:
    - Accumulate small daily irrigation amounts.
    - Apply irrigation only when accumulated amount crosses min_irrigation_event.
    - Cap each event at max_irrigation_event.
    """

    out = smart_df.copy()

    batch_irrigation = []
    accumulated = 0.0

    for irrigation in out["smart_irrigation"]:
        accumulated += irrigation

        if accumulated >= min_irrigation_event:
            event_amount = min(accumulated, max_irrigation_event)
            batch_irrigation.append(event_amount)
            accumulated = accumulated - event_amount
        else:
            batch_irrigation.append(0.0)

    out["batch_irrigation"] = batch_irrigation

    return out