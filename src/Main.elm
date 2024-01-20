module Main exposing (..)

import Browser
import Browser.Navigation as Nav
import Html exposing (Html, node, main_, section, div, hr, br, h2, h3, p, footer, text)
import Html.Attributes exposing (..)

import Http
import Url
import Url.Parser as UrlP exposing (..)
import Url.Parser.Query as UrlQ

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
            [ --Nav.pushUrl model.key new_url
            fetch model.baseurl new_url
            ]
    else fetch model.baseurl new_url

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

get_path url =
    Maybe.withDefault "" ( UrlP.parse ( UrlP.s url.path </> string ) url )

fetch baseurl url =
    let
        path = ( String.concat [ baseurl, "/pages", url, ".txt" ] )
    in
    if url /= "/footnote" then
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
        fix_domain = ( String.replace "/src/Main.elm" "" ( get_base url ))
        baseurl = ( String.replace ".io/" ".io" fix_domain )
        _ = Debug.log "stirng" baseurl
        bad = url.fragment
    in
    case bad of
        Just res ->
            if ( String.startsWith "badurl_" res ) then
                let
                    failed = String.replace "badurl_" "/" res
                in
                ( Model key res baseurl ( div [] [ text "failed to load homepage :c" ] ) ( div [] [ text "failed to load the footer :c" ] )
                , Cmd.batch
                    [ Nav.pushUrl key (String.concat [ baseurl, failed ] )
                    , fetch baseurl res
                    , fetch baseurl "/footnote"
                    ]
                )
            else
                ( Model key "/home" baseurl ( div [] [ text "failed to load homepage :c" ] ) ( div [] [ text "failed to load the footer :c" ] )
                , Cmd.batch
                    [ Nav.pushUrl key baseurl
                    , fetch baseurl "/footnote"
                    ]
                )
        Nothing ->
            ( Model key "/home" baseurl ( div [] [ text "failed to load homepage :c" ] ) ( div [] [ text "failed to load the footer :c" ] )
            , Cmd.batch
                [ Nav.pushUrl key (String.concat [ baseurl, "/home" ] )
                , fetch baseurl "/footnote"
                ]
            )

update evnt model =
    case evnt of
        RequestURL urlreq ->
            case urlreq of
                Browser.Internal url ->
                    ( model, mov_url model ( get_path url ))
                Browser.External href ->
                    ( model, Nav.load href )

        LoadNewPage res ->
            case res of
                Ok page ->
                    ( { model | pg_cntt = (render [] page ) }, Cmd.none )
                Err _ ->
                    ( model, fetch model.baseurl "/404" )
        LoadFooter res ->
            case res of
                Ok page ->
                    ( { model | ft_cntt = (render [] page ) }, Cmd.none )
                Err _ ->
                    ( model, Cmd.none )
        UpdateUrl new_url ->
                ( { model | url = new_url.path }, fetch model.baseurl new_url.path )

view model =
    { title = (String.slice 1 (String.length model.url) model.url)
    , body =
        [ main_ []
            [ node "link" [ href titlefont, rel "stylesheet" ] []
            , node "link" [ href body_font, rel "stylesheet" ] []
            , node "link" [ href ( String.concat [ model.baseurl, "/assets/style.css" ] ), rel "stylesheet" ] []
            , model.pg_cntt
            ]
        , footer [] [ model.ft_cntt ]
        ]
    }