-- Lua implementation of PHP scandir function
function scandir(directory)
    local i = 0
    local t = {}

    local pfile = io.popen('ls -a "'..directory..'"')
    assert(pfile, directory .. ": no such file or directory")

    for filename in pfile:lines() do
        i = i + 1
        t[i] = filename
    end
    pfile:close()
    return t
end

function set_feed(f_path, filename)

    if f_path:sub(-1) ~= '/' then
        f_path = f_path .. '/'
    end

    local posts = {}
    for _, f in pairs(scandir(f_path)) do
        if f:match('.+%.html$') then
            posts[#posts + 1] = f:gsub('%.html$', '')
        end
    end

    -- sort posts by date
    table.sort(posts, function(t1, t2)
        local t1_d = tonumber(t1:sub(-4, -3))
        local t2_d = tonumber(t2:sub(-4, -3))

        local t1_m = tonumber(t1:sub(01, 02))
        local t2_m = tonumber(t2:sub(01, 02))

        local t1_y = tonumber(t1:sub(-2, -1))
        local t2_y = tonumber(t2:sub(-2, -1))

        time1 = t1_y * 10000 + t1_m * 100 + t1_d
        time2 = t2_y * 10000 + t2_m * 100 + t2_d

        return time1 > time2
    end)

    local path = "%<ul id %= \"feed\"%>.*[\n]?%<%/ul%>"
    local blck = {"<ul id = \"feed\">", "</ul>"}
    local item = "\n" .. string.rep(" ", 16) .. "<li id = \"%s\"></li>"
    local file = io.open(filename, 'r')
    assert(file, filename .. ": no such file or directory")

    data = file:read('*all')
    file:close()

    local addt = ""
    for _, f in ipairs(posts) do
        local i = item:format(f)
        print("added \"" .. f .. "\" to " .. filename)
        addt = addt .. i
    end

    if(#posts < 2) then
        addt = addt .. "<li class = \"invisible\" id = \"skip\"></li>"
    end

    local cntt
    data, cntt = data:gsub(path, blck[1] .. addt .. blck[2])

    assert(cntt and cntt > 0)

    file = io.open(filename, 'w')
    assert(file, filename .. ": no such file or directory")

    file:write(data)
    file:close()
end

set_feed('blog/', 'index.html')
set_feed('mmdnight/en/', 'mmdnight/en.html')
set_feed('mmdnight/pt/', 'mmdnight/pt.html')