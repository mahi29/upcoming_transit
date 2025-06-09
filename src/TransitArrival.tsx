import d_logo from './img/d_logo.svg'
import f_logo from './img/d_logo.svg'
import n_logo from './img/n_logo.svg'
import r_logo from './img/r_logo.svg'
import default_mta_logo from './img/default_mta_logo.svg'

import './TransitArrival.css';

interface Props {
    transit_route: string
    minutes_to_arrival: number
}
function TransitArrival(props: Props) {
    if (props.minutes_to_arrival <= 0 || props.minutes_to_arrival > 30) {
        return null;
    }

    function getLogo(transit_route: string) {
        switch (transit_route) {
            case "N":
                return n_logo
            case "R":
                return r_logo
            case "F":
                return f_logo
            case "D":
                return d_logo
            default:
                return default_mta_logo
        }
    }

    function getDepartureLimits(transit_route: string) {
        switch (transit_route) {
            case "Bus":
                return {"warning": 4, "too_late": 2}
            default:
                return {"warning": 10, "too_late": 6}
        }
    }
    const logo = getLogo(props.transit_route)
    let cssClassForDisplay = "transitArrival-displayString"
    const departurelimits = getDepartureLimits(props.transit_route)
    if (props.minutes_to_arrival < departurelimits.too_late) {
        cssClassForDisplay += " transitArrival-tooLate"
    } else if (props.minutes_to_arrival < departurelimits.warning) {
        cssClassForDisplay = " transitArrival-warning"
    }
    return (
        <div className={"transitArrival-row"}>
            <img className={"transitArrival-logo"} src={logo} alt="Trasit Route Logo"/>
            <div className={cssClassForDisplay}>{`${props.minutes_to_arrival} min`}</div>
        </div>
    )
}

export default TransitArrival