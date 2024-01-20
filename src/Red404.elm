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
        fix_domain = ( String.replace "/src/Main.elm" "" ( get_base url ))
        baseurl = String.concat [ "https://", ( String.replace ".io/" ".io" fix_domain ) ]
        fix_path = String.replace baseurl "" url.path
        path = String.slice 1 (( String.length fix_path ) + 1 ) fix_path
        ourl = String.concat [ baseurl, "#badurl_", path ]
        _ = Debug.log "string" ourl
    in
    ( Model, Nav.load ourl )

update _ model = ( model, Cmd.none )

view _ =
    { title = "404"
    , body = []
    }