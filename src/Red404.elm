module Red404 exposing (..)

import Browser
import Browser.Navigation as Nav
import Html exposing (Html)

import Url
import Url.Parser as UrlP exposing (..)

type alias Model = {}

type Event
  = RequestURL Browser.UrlRequest
  | UpdateUrl Url.Url

get_path url =
    Maybe.withDefault "" ( UrlP.parse ( UrlP.s url.path </> string ) url )

get_base url =
    let
        full = String.replace "https://" "" (Url.toString url)
        remv = Maybe.withDefault "" ( UrlP.parse ( UrlP.s full </> string ) url )
        _ = Debug.log "string" remv
    in
    if remv == "" then full
    else
        case Url.fromString ( String.replace remv "" full ) of
            Just nxt -> get_base nxt
            Nothing -> "/404"

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

init _ url _ =
    let
        size = String.length url.path
        path = String.slice 1 ( size + 1 ) url.path
        dest = String.concat [ url.host, "&badurl=", path ]
    in
    ( Model, Nav.load dest )

update _ model = ( model, Cmd.none )

view _ =
    { title = "404"
    , body = []
    }