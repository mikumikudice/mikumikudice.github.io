module Main exposing (..)

import Browser
import Browser.Navigation as Nav
import Html exposing (Html, text, node, main_, nav, article, address, section, div, h2, br, footer)
import Html.Attributes exposing (..)

import Http
import Url

import MdParsing exposing (render)
import Html exposing (span)
import Html exposing (address)
import Url exposing (Url)

titlefont = "https://fonts.googleapis.com/css2?family=Rubik"
body_font = "https://fonts.googleapis.com/css2?family=PT+Mono"
code_font = "https://fonts.googleapis.com/css2?family=Space+Mono"

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
    , url : Url.Url
    , page : String
    , pg_cntt : Html Event
    , ft_cntt : Html Event
    , exlinks : Html Event
    }

type Event
  = RequestURL Browser.UrlRequest
  | UpdateUrl Url.Url
  | LoadNewPage (Result Http.Error String)
  | LoadFooter (Result Http.Error String)
  | LoadLinks (Result Http.Error String)

mov_url : Model -> String -> Cmd Event
mov_url model url =
    if url /= model.url.path then
        Cmd.batch
            [ Nav.pushUrl model.key url
            , fetch model.url.host url
            ]
    else fetch model.url.host url

fetch host page =
    let
        path = ( String.concat [ "https://", host, "/pages", page, ".md" ] )
    in
    if page == "/footnote" then
        Http.get
            { url = path
            , expect = Http.expectString LoadFooter
            }
    else if page == "/links" then
        Http.get
            { url = path
            , expect = Http.expectString LoadLinks
            }
    else
        Http.get
            { url = path
            , expect = Http.expectString LoadNewPage
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
        bad = url.query
    in
    case bad of
        Just res ->
            if ( String.startsWith "badurl=" res ) then
                let
                    failed = String.replace "badurl=" "/" res
                in
                ( Model key url failed
                ( div [] [ text "failed to load homepage :c" ] )
                ( div [] [ text "failed to load the footer :c" ] )
                ( div [] [ text "failed to load the external links :c" ] )
                , Cmd.batch
                    [ Nav.pushUrl key failed
                    , fetch url.host failed
                    , fetch url.host "/footnote"
                    , fetch url.host "/links"
                    ]
                )
            else
                ( Model key url "/home"
                ( div [] [ text "failed to load homepage :c" ] )
                ( div [] [ text "failed to load the footer :c" ] )
                ( div [] [ text "failed to load the external links :c" ] )
                , Cmd.batch
                    [ Nav.pushUrl key "/home"
                    , fetch url.host "/home"
                    , fetch url.host "/footnote"
                    , fetch url.host "/links"
                    ]
                )
        Nothing ->
            ( Model key url "/home"
            ( div [] [ text "failed to load homepage :c" ] )
            ( div [] [ text "failed to load the footer :c" ] )
            ( div [] [ text "failed to load the external links :c" ] )
            , Cmd.batch
                [ Nav.pushUrl key "/home"
                , fetch url.host "/home"
                , fetch url.host "/footnote"
                , fetch url.host "/links"
                ]
            )

update evnt model =
    case evnt of
        RequestURL urlreq ->
            case urlreq of
                Browser.Internal url ->
                    if String.endsWith ".txt" url.path then -- special case just for the license
                        ( model, Nav.load (Url.toString url) )
                    else
                        ( model, mov_url model url.path )
                Browser.External href ->
                    ( model, Nav.load href )

        LoadNewPage res ->
            case res of
                Ok page ->
                    ( { model | pg_cntt = (render page ) }, Cmd.none )
                Err _ ->
                    ( model, fetch model.url.host "/404" )
        LoadFooter res ->
            case res of
                Ok page ->
                    ( { model | ft_cntt = (render page ) }, Cmd.none )
                Err _ ->
                    ( model, Cmd.none )
        LoadLinks res ->
            case res of
                Ok page ->
                    ( { model | exlinks = (render page ) }, Cmd.none )
                Err _ ->
                    ( model, Cmd.none )
        UpdateUrl new_url ->
                ( { model | page = new_url.path }, fetch model.url.host new_url.path )

view model =
    let
        size = String.length model.page
        page = ( String.slice 1 ( size + 1 ) model.page ) 
    in
    { title = String.concat [ "siota.ban - ", page ]
    , body =
        [ nav []
            [ h2 [ style "float" "left" ] [ text page ]
            , h2  [ style "float" "right" ] [ text "_ o x" ]
            , div [ style "clear" "both" ] []
            ]
        , span [] [ br [] [] ]
        , main_ []
            [ section []
                [ node "link" [ href titlefont, rel "stylesheet" ] []
                , node "link" [ href body_font, rel "stylesheet" ] []
                , node "link" [ href code_font, rel "stylesheet" ] []
                , node "link" [ href ( String.concat [ "https://", model.url.host, "/css/style.css" ] ), rel "stylesheet" ] []
                ]
            , section []
                [ article [] [ model.pg_cntt ]
                ]
            ]
        , span [] [ br [] [] ]
        , footer []
            [ section [] [ model.ft_cntt ]
            , address [] [ model.exlinks ]
            ]
        ]
    }