-- Lua implementation of PHP scandir function
function scandir(directory)
    local i = 0
    local t = {}

    local pfile = io.popen('ls -a "'..directory..'"')
    assert(pfile)

    for filename in pfile:lines() do
        i = i + 1
        t[i] = filename
    end
    pfile:close()
    return t
end

local posts = {}
for _, f in pairs(scandir('blog/')) do
    if f:match('.+%.html') then
        posts[#posts + 1] = f:gsub('%.html', '')
        print("added \"" .. f .. "\" to file")
    end
end

local path = {"<ul class = \"fullclick\" id = \"feed\">", "</ul>"}
local item = "\n" .. string.rep(" ", 16) .. "<li id = \"%s\"></li>"
local data = io.open('blog.html', 'r'):read('*all')

local addt = ""
for _, f in pairs(posts) do
    local i = item:format(f)
    addt = addt .. i
end
data = data:gsub(path[1] .. '.*' .. path[2], path[1] .. addt .. path[2])

local file = io.open('index.html', 'w')
assert(file)

file:write(data)
file:close()