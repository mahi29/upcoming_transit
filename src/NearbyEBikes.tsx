import React from 'react';
import './NearbyEbikes.css';
import bolt_icon from './img/bolt.svg'

import {
    CARROLL_ST_STATION_ID,
    EBIKE_API_URL,
    FIFTH_AVE_AND_THIRD_ST_STATION_ID,
    FIRST_ST_AND_SIXTH_AVE_STATION_ID, NEARBY_STATIONS
} from "./constants";
import {getDuration} from "./helpers";

type StationInformation = {
    station_label: string
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
    const [lastUpdatedAt, setLastUpdatedAt] = React.useState(Date.now() / 1000)

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
                    station_name = "Blank Street Coffee"
                    break;
                case CARROLL_ST_STATION_ID:
                    station_name = "al di la "
                    break;
                case FIFTH_AVE_AND_THIRD_ST_STATION_ID:
                    station_name = "Playground"
                    break
            }

            const info: StationInformation = {
                station_label: station_name,
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
    const timeSinceUpdate = getDuration(Date.now(), lastUpdatedAt * 1000)
    const title = stationsInformation.length > 0 ? "Nearby E-Bikes" : "No E-Bikes Nearby"
    const titleClass = stationsInformation.length > 0 ? "NearbyEbikes-title" : "NearbyEbikes-title-noBikes"
    return (

        <div className={"NearbyEbikes-container"}>
            <div className={"NearbyEbikes-titleRow"}>
                <img className={"NearbyEbikes-logo"} src={bolt_icon} alt="Ebike" />
                <div className={titleClass}> {title} </div>
                <img className={"NearbyEbikes-logo"} src={bolt_icon} alt="Ebike" />

            </div>
            {
                stationsInformation.map(function(stationInfo) {
                return <div className={"NearbyEbikes-row"}>
                        <div className={"NearbyEbikes-location"}>{stationInfo.station_label}</div>
                        <div className={"NearbyEbikes-count"}>{stationInfo.cosmo + stationInfo.easyRiders}</div>
                    </div>
            })
            }
            <div className={"NearbyEbikes-footer"}>{`Last updated ${timeSinceUpdate} min ago`}</div>
        </div>

    )
}

export default NearbyEBikes;