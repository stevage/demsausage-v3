import * as React from "react"
import PollingPlaceAutocomplete from "./PollingPlaceAutocomplete"
import { connect } from "react-redux"
import { debounce } from "lodash-es"

import { searchPollingPlaces } from "../../redux/modules/polling_places"
import { IStore, IElection, IPollingPlace } from "../../redux/modules/interfaces"

export interface IProps {
    election: IElection
    onPollingPlaceChosen: Function
}

export interface IDispatchProps {
    onPollingPlaceSearch: Function
}

export interface IStateProps {
    searchText: string
    searchResults: Array<IPollingPlace>
}

export class PollingPlaceAutocompleteContainer extends React.PureComponent<IProps & IDispatchProps, IStateProps> {
    onFieldChangeDebounced: Function

    constructor(props: IProps & IDispatchProps) {
        super(props)
        this.state = { searchText: "", searchResults: [] }

        // http://stackoverflow.com/a/24679479/7368493
        this.onFieldChangeDebounced = debounce(function(this: PollingPlaceAutocompleteContainer, searchText: string) {
            this.setState({ ...this.state, searchText: searchText })
        }, 750)
    }

    async componentDidUpdate(prevProps: IProps & IDispatchProps, prevState: IStateProps) {
        if (this.state.searchText !== prevState.searchText) {
            const searchResults = await this.props.onPollingPlaceSearch(this.props.election, this.state.searchText)
            this.setState({ ...this.state, searchResults: searchResults })
        }
    }

    render() {
        const { onPollingPlaceChosen } = this.props
        return (
            <PollingPlaceAutocomplete
                searchText={this.state.searchText}
                pollingPlaces={this.state.searchResults}
                onPollingPlaceAutocompleteSelect={(searchText: string, dataSource: any, params: any) => {
                    if (params.source === "change" && searchText.length >= 3) {
                        this.onFieldChangeDebounced(searchText)
                    }
                }}
                onChoosePollingPlace={(chosenRequest: any, index: number) => {
                    if (index >= 0) {
                        onPollingPlaceChosen(this.state.searchResults[index])
                    }
                }}
            />
        )
    }
}

const mapStateToProps = (state: IStore): any => {
    return {}
}

const mapDispatchToProps = (dispatch: Function): IDispatchProps => {
    return {
        onPollingPlaceSearch: async (election: IElection, searchTerm: string) => {
            return await dispatch(searchPollingPlaces(election, searchTerm))
        },
    }
}

const PollingPlaceAutocompleteContainerWrapped = connect<{}, IDispatchProps, IProps>(mapStateToProps, mapDispatchToProps)(
    PollingPlaceAutocompleteContainer
)

export default PollingPlaceAutocompleteContainerWrapped
