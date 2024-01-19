module Red404 exposing (..)

import Browser
import Browser.Navigation as Nav
import Html exposing (Html)

import Http
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
        full = (Url.toString url)
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
        fix_domain =  ( String.replace "/src/Main.elm" "" ( get_base url ) )
        fix_slash = ( String.replace ".io/" ".io" fix_domain ) -- funny workaround for a elm bug
        baseurl = ( String.replace "/404.html" "" fix_slash )
        path = get_path url
        _ = Debug.log "string" path
    in
    if (String.length (Url.toString url)) < 64 then
        ( Model, Nav.load (String.concat [ baseurl, "?badurl=", path ] ))
    else
        ( Model, Cmd.none)

update _ model = ( model, Cmd.none )

view _ =
    { title = "404"
    , body = []
    }