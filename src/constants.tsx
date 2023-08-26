export const UNION_ST_STATION_ID = "R32N"
export const API_KEY = "S6z7gtwCc51QJprQw7t685ksgqgkSAan6SVAx6Rm"
export const YELLOW_TRAIN_API_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw"
export const ORANGE_TRAIN_API_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm"
export const EBIKE_API_URL = "https://gbfs.lyft.com/gbfs/1.1/bkn/en/ebikes_at_stations.json"
export const REFRESH_INTERVAL_MS = 30 * 1000
export const CARROLL_ST_STATION_ID = "motivate_BKN_66de1fe7-0aca-11e7-82f6-3863bb44ef7c"
export const FIFTH_AVE_AND_THIRD_ST_STATION_ID = "motivate_BKN_66de2199-0aca-11e7-82f6-3863bb44ef7c";
export const FIRST_ST_AND_SIXTH_AVE_STATION_ID = "motivate_BKN_8066575c-f8e9-4e14-95ea-8d25ceeae2ca"
export const CARROLL_ST_AND_SIXTH_AVE_STATION_ID = "motivate_BKN_66de1ea2-0aca-11e7-82f6-3863bb44ef7c"
export const PRESIDENT_AVE_AND_FOURTH_AVE = "motivate_BKN_bca594e5-779f-4866-bd6b-818871f97d38"
export const UNION_ST_AND_FOURTH_AVE = "motivate_BKN_66de0d91-0aca-11e7-82f6-3863bb44ef7c"
export const NEARBY_STATIONS = [
    CARROLL_ST_STATION_ID ,
    FIFTH_AVE_AND_THIRD_ST_STATION_ID,
    FIRST_ST_AND_SIXTH_AVE_STATION_ID,
    CARROLL_ST_AND_SIXTH_AVE_STATION_ID,
    PRESIDENT_AVE_AND_FOURTH_AVE,
    UNION_ST_AND_FOURTH_AVE
]

const BUS_API_KEY = "9d2945dc-6f2e-4261-8c21-ecce7301f909"
const FIFTH_AVE_AND_GARFIELD_PL_STOP_ID = "308208"
export const BUS_API_BASE_URL = `https://bustime.mta.info/api/siri/stop-monitoring.json?key=${BUS_API_KEY}&OperatorRef=MTA&MonitoringRef=${FIFTH_AVE_AND_GARFIELD_PL_STOP_ID}&LineRef=MTA%20NYCT_B63`
