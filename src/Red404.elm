module Red404 exposing (..)

import Browser
import Browser.Navigation as Nav

import Url

type alias Model = {}

type Event
  = RequestURL Browser.UrlRequest
  | UpdateUrl Url.Url

main : Program () Model Event
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = \ _ -> Sub.none
        , onUrlChange = UpdateUrl
        , onUrlRequest = RequestURL
        }

init : a -> Url.Url -> b -> (Model, Cmd Event)
init _ url _ =
    let
        size = String.length url.path
        path = String.slice 1 ( size + 1 ) url.path
        dest = String.concat [ "https://", url.host, "?badurl=", path ]
    in
    ( Model, Nav.load dest )

update _ model = ( model, Cmd.none )

view _ =
    { title = "404"
    , body = []
    }