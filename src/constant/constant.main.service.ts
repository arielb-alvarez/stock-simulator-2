import mainCandleService from "@/services/dev-coin-user/main/services.main.candles";
import mainTrendlineService from "@/services/dev-coin-user/main/services.main.trendlines";

// Export all services as a grouped object
const MAIN_SERVICES = {
    mainCandleService,
    mainTrendlineService
};

export default MAIN_SERVICES;