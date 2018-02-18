import * as React from "react"
import { connect } from "react-redux"

import { IStore, IElection, IGoogleGeocodeResult, IGoogleAddressSearchResult } from "../../../redux/modules/interfaces"

import GoogleMapLoader from "react-google-maps-loader"
import GooglePlacesAutocomplete from "./GooglePlacesAutocomplete"
import { List, ListItem } from "material-ui/List"
import Avatar from "material-ui/Avatar"
import MapsPlace from "material-ui/svg-icons/maps/place"

export interface IProps {
    onChoosePlace: Function
    // From SearchBar via GooglePlacesAutocomplete
    componentRestrictions: object
    hintText: string
    onRequestSearch?: Function
}
export interface IStoreProps {
    currentElection: IElection
}

export interface IDispatchProps {
    fetchGeocodedPlace: Function
}

export interface IStateProps {
    addressSearchResults: Array<IGoogleAddressSearchResult>
}

interface IOwnProps {}

export class GooglePlacesAutocompleteList extends React.PureComponent<IProps & IStoreProps & IDispatchProps, IStateProps> {
    constructor(props: any) {
        super(props)
        this.state = { addressSearchResults: [] }

        this.onReceiveAddressSearchResults = this.onReceiveAddressSearchResults.bind(this)
        this.onPlaceChosen = this.onPlaceChosen.bind(this)
    }

    onReceiveAddressSearchResults(results: Array<IGoogleAddressSearchResult>) {
        this.setState({
            addressSearchResults: results,
        })
    }

    onPlaceChosen() {
        this.setState({ addressSearchResults: [] })
    }

    render() {
        const { onChoosePlace, fetchGeocodedPlace, componentRestrictions, hintText, onRequestSearch } = this.props
        const { addressSearchResults } = this.state

        return (
            <div>
                <GoogleMapLoader
                    params={{
                        key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
                        libraries: "places",
                    }}
                    render={(googleMaps: any) =>
                        googleMaps && (
                            <GooglePlacesAutocomplete
                                onReceiveSearchResults={this.onReceiveAddressSearchResults}
                                componentRestrictions={componentRestrictions}
                                hintText={hintText}
                                // tslint:disable-next-line:no-empty
                                onRequestSearch={onRequestSearch === undefined ? () => {} : onRequestSearch}
                            />
                        )
                    }
                />

                {addressSearchResults.length > 0 && (
                    <List>
                        {addressSearchResults.map((value: IGoogleAddressSearchResult, index: number) => (
                            <ListItem
                                key={value.place_id}
                                leftAvatar={<Avatar icon={<MapsPlace />} />}
                                primaryText={value.structured_formatting.main_text}
                                secondaryText={value.structured_formatting.secondary_text}
                                onClick={(event: any) => {
                                    fetchGeocodedPlace(onChoosePlace, value, this.onPlaceChosen)
                                }}
                            />
                        ))}
                    </List>
                )}
            </div>
        )
    }
}

const mapStateToProps = (state: IStore, ownProps: IOwnProps): IStoreProps => {
    const { elections } = state

    return {
        currentElection: elections.elections[elections.current_election_id],
    }
}

const mapDispatchToProps = (dispatch: Function): IDispatchProps => {
    return {
        fetchGeocodedPlace: function(onChoosePlace: Function, addressResult: IGoogleAddressSearchResult, onPlaceChosen: Function) {
            const google = window.google
            const geocoder = new google.maps.Geocoder()
            geocoder.geocode({ placeId: addressResult.place_id }, (results: Array<IGoogleGeocodeResult>, status: string) => {
                if (results.length > 0) {
                    onPlaceChosen()
                    onChoosePlace(addressResult, results[0])
                }
            })
        },
    }
}

const GooglePlacesAutocompleteListWrapped = connect(mapStateToProps, mapDispatchToProps)(GooglePlacesAutocompleteList)

export default GooglePlacesAutocompleteListWrapped as any