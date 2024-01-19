module Main exposing (..)

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

type alias Model =
    { key : Nav.Key
    , url : String
    , baseurl : String
    , pg_cntt : Html Event
    , ft_cntt : Html Event
    }

type Event
  = RequestURL Browser.UrlRequest
  | UpdateUrl Url.Url
  | LoadNewPage (Result Http.Error String)
  | LoadFooter (Result Http.Error String)

mov_url model url =
    let
        new_url = ( String.concat [ model.baseurl, url ] )
    in
    if url /= model.url then
        Cmd.batch
            [ Nav.pushUrl model.key new_url
            , fetch model.baseurl url
            ]
    else Cmd.none

get_base url =
    let
        full = (Url.toString url)
    in
    Maybe.withDefault full ( UrlP.parse ( UrlP.s full </> string ) url )

get_path baseurl url =
    Maybe.withDefault "404" ( UrlP.parse ( UrlP.s baseurl </> string ) url )

fetch baseurl url =
    let
        path = ( String.concat [ baseurl, "pages/", url, ".txt" ] )
    in
    if url /= "footnote" then
        Http.get
            { url = path
            , expect = Http.expectString LoadNewPage
            }
    else
        Http.get
            { url = path
            , expect = Http.expectString LoadFooter
            }

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

init _ url key =
    let
        -- TODO: un-hardcode this path
        baseurl = "mikumikudice.github.io/"
        d_model = { key = key, url = "home", baseurl = baseurl }
    in
    ( Model key "home" baseurl ( div [] [] ) ( div [] [ text "failed to load the footer :c" ] )
    , Cmd.batch
        [ mov_url d_model "home"
        , fetch baseurl "footnote"
        ]
    )

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
                    ( model, fetch model.baseurl "404" )
        LoadFooter res ->
            case res of
                Ok page ->
                    ( { model | ft_cntt = (render [] page ) }, Cmd.none )
                Err _ ->
                    ( model, Cmd.none )
        UpdateUrl new_url ->
            let
                ldd_path = ( get_path model.baseurl new_url )
            in
            if ldd_path == "404" then
                    ( model, fetch model.baseurl "404" )
            else
                ( { model | url = ldd_path }, fetch model.baseurl ldd_path )

view model =
    { title = "blog"
    , body =
        [ main_ []
            [ node "link" [ href titlefont, rel "stylesheet" ] []
            , node "link" [ href body_font, rel "stylesheet" ] []
            , node "link" [ href ( String.concat [ model.baseurl, "assets/style.css" ] ), rel "stylesheet" ] []
            , model.pg_cntt
            ]
        , footer [] [ model.ft_cntt ]
        ]
    }