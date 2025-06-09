import React from "react";
import bolt_icon from "./img/bolt.svg";

interface GridContainerProps {
    titleComponent: React.ReactNode;
    contentComponent: React.ReactNode;
    footerComponent: React.ReactNode;
}

function GridContainer({titleComponent, contentComponent, footerComponent}: GridContainerProps) {
    return (
        <div className={"GridContainer-container"}>
            <div className={"GridContainer-titleRow"}>
                {titleComponent}
            </div>
            <div>
                {contentComponent}
            </div>
            <div className={"GridContainer-footer"}>{footerComponent}</div>
        </div>

    )
}

export default GridContainer