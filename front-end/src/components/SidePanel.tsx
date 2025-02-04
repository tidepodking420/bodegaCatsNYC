import type { LngLatWithID } from "./Map"

export function SidePanel({isPanelExpanded2, currentLngLat}, {isPanelExpanded2: boolean, currentLngLat: LngLatWithID}) {
    return (
        <div style={{
            position: 'absolute',
            width: '97%',
            bottom: '0px',
            height: isPanelExpanded2 ?'40%' : '0%',
            right: '3px',
            background: 'white',
            borderWidth: '1px',
            borderColor: 'black',
            borderStyle: 'solid'
          }}>
            <div>
                {`${currentLngLat.lng} ${currentLngLat.lat}`}
            </div>
        </div>
    )
}