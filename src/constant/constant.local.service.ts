import localCandleService from "@/services/dev-coin-user/local/services.local.candles";
import localTrendlineService from "@/services/dev-coin-user/local/services.local.trendlines";

// Export all services as a grouped object
const LOCAL_SERVICES = {
    localCandleService,
    localTrendlineService
};

export default LOCAL_SERVICES;