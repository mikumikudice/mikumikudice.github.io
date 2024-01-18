module Page404 exposing (..)

import Browser
import Browser.Navigation as Nav
import Html exposing (Html, node, main_, section, div, hr, br, h2, h3, p, footer, text)
import Html.Attributes exposing (..)

import Http
import Url
import Url.Parser as UrlP exposing (..)

import Task exposing (..)
import String.Format exposing (..)

import MdParsing exposing (render)
import Debug exposing (log)

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

titlefont = "https://fonts.googleapis.com/css2?family=Rubik"
body_font = "https://fonts.googleapis.com/css2?family=PT+Mono"

maindark = "#1f1a24"
mainlite = "#eeecde"
sidedark = "#2a3a42"
sidelite = "#7895ab"
sidegray = "#4d6476"
win_dark = "#73514d"
win_gray = "#ac8a71"
win_lite = "#decb9f"

footnote =
    """
i used the [radioactive13](https://lospec.com/palette-list/radioactive13) color palette created by [miguel lucero](https://lospec.com/miguel-lucero) on this website.  
this website was entirely build using the [elm](https://elm-lang.org) programming language. [broken](http://localhost:8000/src/ada)
"""
page_404 =
    """
# 808: 404 page not found
just kidding. we could not find your requested page :c

It may be in somewhere else
"""

type alias Model =
    { key : Nav.Key
    , url : String
    , baseurl : String
    , rooturl : String
    , pg_cntt : Html Event
    }

type Event
  = RequestURL Browser.UrlRequest
  | UpdateUrl Url.Url
  | LoadNewPage (Result Http.Error String)

init _ url key =
    let
        baseurl = ( String.replace "Main.elm" "" ( Url.toString url ) )
        rooturl = ( String.replace "Main.elm" "" url.path )
        d_model = { key = key, baseurl = rooturl }
    in
    ( Model key "404" baseurl ( get_path d_model url ) ( div [] [] ), mov_url d_model url.path )

mov_url model url =
    let
        new_url = ( String.concat [ model.baseurl, url ] )
    in
    Cmd.batch
        [ Nav.pushUrl model.key new_url
        , fetch model.baseurl url
        ]

get_base url =
    let
        full = (Url.toString url)
    in
    Maybe.withDefault full ( UrlP.parse ( UrlP.s full </> string ) url )

get_path model url =
    Maybe.withDefault "404" ( UrlP.parse ( UrlP.s model.baseurl </> string ) url )

update evnt model =
    case evnt of
        RequestURL urlreq ->
            case urlreq of
                Browser.Internal url ->
                    ( model, mov_url model ( String.replace "/src/" "" url.path ) )
                Browser.External href ->
                    ( model, Nav.load href )

        LoadNewPage res ->
            case res of
                Ok page ->
                    ( { model | pg_cntt = (render [] page ) }, Cmd.none )
                Err _ ->
                    ( { model | url = "404" }, fetch model.baseurl "404" )
                
        UpdateUrl new_url ->
            let
                ldd_path = ( get_path model new_url )
            in
            if ldd_path == "404" then
                    ( { model | url = "404" }, fetch model.baseurl "404" )
            else
                ( { model | url = ldd_path }, fetch model.baseurl ldd_path )

fetch baseurl url =
    let
        path = ( String.concat [ baseurl, "pages/", url, ".txt" ] )
    in
    Http.get
        { url = path
        , expect = Http.expectString LoadNewPage
        }

view model =
    { title = "blog"
    , body =
        [ main_ []
            [ node "link" [ href titlefont, rel "stylesheet" ] []
            , node "link" [ href body_font, rel "stylesheet" ] []
            , node "link" [ href ( String.concat [ model.baseurl, "assets/style.css" ] ), rel "stylesheet" ] []
            , model.pg_cntt
            ]
        , footer [] [ render [] footnote ]
        ]
    }