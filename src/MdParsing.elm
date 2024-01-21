module MdParsing exposing (render)

{-
    Original code from elm-markdown example found in https://github.com/dillonkearns/elm-markdown/
    accessed on 07/12/2023 used under BSD 3-Clause "New" or "Revised" License
-}

import Html exposing (span, text)
import Markdown.Parser as Markdown
import Markdown.Renderer

render data =
    case
        data
        |> Markdown.parse
        |> Result.mapError errtostr
        |> Result.andThen (\ast -> Markdown.Renderer.render Markdown.Renderer.defaultHtmlRenderer ast)
        of
            Ok rendered ->
                span [] rendered

            Err errors ->
                text errors

errtostr err =
    err
        |> List.map Markdown.deadEndToString
        |> String.join "\n"