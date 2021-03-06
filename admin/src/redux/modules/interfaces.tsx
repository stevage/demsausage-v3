export { IStore } from "./reducer"
export { IEALGISApiClient, IHttpResponse, ICartoAPIResponse } from "../../shared/api/EALGISApiClient"
export { IModule as IAppModule, eAppEnv } from "./app"
export { IModule as IUserModule, ISelf, IUser } from "./user"
export { IModule as ISnackbarsModule } from "./snackbars"
export { IModule as IElectionsModule, IElection } from "./elections"
export {
    IModule as IPollingPlacesModule,
    IMapPollingPlace,
    IPollingPlace,
    IPollingPlaceLoaderResponse,
    PollingPlaceLoaderResponseMessageStatus,
    IPollingPlaceLoaderResponseMessage,
} from "./polling_places"
export { IModule as IStallModule, IStallLocationInfo, IStallPollingPlacInfo, StallStatus, IStall } from "./stalls"

export interface IEnvVars {
    NODE_ENV: string // development, test, production
    REACT_APP_GOOGLE_MAPS_API_KEY: string
    REACT_APP_GOOGLE_ANALYTICS_UA: string
    REACT_APP_CARTO_DB_API_KEY: string
}

export interface IConfig {
    GOOGLE_ANALYTICS_UA: string
    GOOGLE_MAPS_API_KEY: string
    MAPBOX_API_KEY: string
    RAVEN_URL: string
}

/* Material UI muiThemeable palette object */
export interface IMUIThemePalette extends __MaterialUI.Styles.ThemePalette {}

export interface IMUITheme {
    palette: IMUIThemePalette
}

export interface IMUIThemeProps {
    muiTheme: IMUITheme
}
