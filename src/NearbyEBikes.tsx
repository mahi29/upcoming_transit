import React from 'react';
import './NearbyEbikes.css';
import bolt_icon from './img/bolt.svg'

import {
    CARROLL_ST_STATION_ID,
    EBIKE_API_URL,
    FIFTH_AVE_AND_THIRD_ST_STATION_ID,
    FIRST_ST_AND_SIXTH_AVE_STATION_ID, NEARBY_STATIONS
} from "./constants";

type StationInformation = {
    station_name: string
    easyRiders: number
    cosmo: number
}

type GBFSEBikeDetails = {
    battery_charge_percentage: number
    displayed_number: number
    docking_capability: number
    is_lbs_internal_rideable: boolean
    make_and_model: "lyft_bike_cosmo" | "motivate_bike_easy_rider"
    range_estimate: any
    rideable_id: string
}

type GBFSStationInformation = {
    ebikes: GBFSEBikeDetails[],
    station_id: string
}

function NearbyEBikes() {
    const [stationsInformation, setStationsInformation] = React.useState<StationInformation[]>([])
    const [lastUpdatedAt, setLastUpdatedAt] = React.useState(0)

    function mergeEbikeInfoPerStation(nearby_stations: GBFSStationInformation[]) {
        const mergedEbikeInfoPerStation: Map<string, GBFSEBikeDetails[]> = new Map()
        nearby_stations.forEach(function (nearby_station: GBFSStationInformation) {
            const ebikesSeen: GBFSEBikeDetails[] = mergedEbikeInfoPerStation.get(nearby_station.station_id) ?? []
            const newEbikesSeen = nearby_station.ebikes.filter(ebike => !ebikesSeen.map(e => e.rideable_id).includes(ebike.rideable_id))

            if (mergedEbikeInfoPerStation.has(nearby_station.station_id)) {
                ebikesSeen.push(...newEbikesSeen)
            } else {
                mergedEbikeInfoPerStation.set(nearby_station.station_id, newEbikesSeen)
            }
        })
        return mergedEbikeInfoPerStation
    }
    function parseEbikeData(response: any): {stationInformation: StationInformation[], lastUpdatedAt: number} {
        const station_data: GBFSStationInformation[] = response.data.stations
        const nearby_stations = station_data.filter(s => NEARBY_STATIONS.includes(s.station_id))
        const mergedEbikeInfoPerStation = mergeEbikeInfoPerStation(nearby_stations)
        const ebikeCountPerStation: Map<string, StationInformation> = new Map()
        mergedEbikeInfoPerStation.forEach(function (ebikes, station_id) {
            let station_name = ""
            switch(station_id) {
                case FIRST_ST_AND_SIXTH_AVE_STATION_ID:
                    station_name = "1st St & 6 Ave"
                    break;
                case CARROLL_ST_STATION_ID:
                    station_name = "Carroll St & 5 Ave"
                    break;
                case FIFTH_AVE_AND_THIRD_ST_STATION_ID:
                    station_name = "5 Ave & 3 St"
                    break
            }

            const info: StationInformation = {
                station_name: station_name,
                easyRiders: ebikes.filter(ebike => ebike.make_and_model === "motivate_bike_easy_rider").length,
                cosmo: ebikes.filter(ebike => ebike.make_and_model === "lyft_bike_cosmo").length,
            }

            ebikeCountPerStation.set(station_id, info)
        })
        // last_updated is in seconds
        return {stationInformation: Array.from(ebikeCountPerStation.values()), lastUpdatedAt: response.last_updated}
    }
    async function fetchEBikeData() {
        try {
            const json_response = await fetch(EBIKE_API_URL)
            const response = await json_response.json()
            return parseEbikeData(response)
        } catch (error) {
            console.log(error);
            return {stationInformation: [], lastUpdatedAt: Date.now()}
        }
    }

    React.useEffect(() => {
        const interval = setInterval(() => {
            (async () => {
                const gbfsData = await fetchEBikeData()
                setStationsInformation(gbfsData.stationInformation)
                setLastUpdatedAt(gbfsData.lastUpdatedAt)
            })();
        }, 1000);

        // this now gets called when the component unmounts
        return () => {
            clearInterval(interval)
        };
    })
//  <img className={"trainArrival-logo"} src={logo} alt="Subway Logo"/>
    return (

        <div className={"NearbyEbikes-container"}>
            <div className={"NearbyEbikes-titleRow"}>
                <img className={"NearbyEbikes-logo"} src={bolt_icon} alt="Ebike" />
                <div className={"NearbyEbikes-title"}> Nearby E-Bikes </div>
                <img className={"NearbyEbikes-logo"} src={bolt_icon} alt="Ebike" />

            </div>
            {stationsInformation.map(function(stationInfo) {
                return <div className={"NearbyEbikes-row"}>
                        <div className={"NearbyEbikes-location"}>{stationInfo.station_name}</div>
                        <div className={"NearbyEbikes-count"}>{stationInfo.cosmo + stationInfo.easyRiders}</div>
                    </div>
            })}
        </div>

    )
}

export default NearbyEBikes;