class PrescriptiveService:
    @staticmethod
    def recommend(rainfall_mm: float, active_dumpers: int, blasting_delayed: bool) -> str:
        if rainfall_mm > 40.0:
            return "High flood risk: Deploy dewatering pumps and route dumpers to upper benches."
        if active_dumpers < 6:
            return "Haulage bottleneck: Reallocate 2-3 dumpers from alternate active pits."
        if blasting_delayed:
            return "Blasting backlog: Reschedule blast window to late evening shift to avoid idle shovel time."
        return "Maintain regular dispatch routine."

prescriptive_service = PrescriptiveService()