import n_logo from './img/n_logo.svg'
import r_logo from './img/r_logo.svg'
import './TrainArrival.css';

interface Props {
    subway_line: string
    display_string: string
}
function TrainArrival(props: Props) {
    const logo = props.subway_line === "N" ? n_logo : r_logo
    return (
        <div className={"trainArrival-row"}>
            <img className={"trainArrival-logo"} src={logo} alt="Subway Logo"/>
            <div className={"trainArrival-displayString"}>{props.display_string}</div>
        </div>
    )
}

export default TrainArrival