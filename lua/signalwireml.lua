local function table_find(tbl, value)
    for _, v in ipairs(tbl) do
	if v == value then
	    return true
	end
    end
    return false
end

local SignalWireML = {}
SignalWireML.__index = SignalWireML

-- Load dependencies
local json = require("json")
local yaml = require("yaml")

-- Constructor for SignalWireML
function SignalWireML.new(args)
    local self = setmetatable({}, SignalWireML)

    self._content = {
       version  = args.version or '1.0.0',
       sections = {},
       engine   = args.engine or 'gcloud',
    }
    self._voice = args.voice or nil
    self._languages = {}
    self._pronounce = {}
    self._SWAIG = {
	includes = {},
	functions = {},
	native_functions = {},
	defaults = {}
    }
    self._params = {}       -- Initialize _params as an empty table
    self._prompt = {}       -- Initialize _prompt as an empty table
    self._post_prompt = {}  -- Initialize _post_prompt as an empty table
    self._hints = {}        -- Initialize _hints as an empty table
    return self
end


function SignalWireML:add_aiapplication(section)
   local app = "ai"
   local args = {}

   for _, data in ipairs({"post_prompt", "voice", "engine", "post_prompt_url", "post_prompt_auth_user",
			  "post_prompt_auth_password", "languages", "hints", "params", "prompt", "SWAIG", "pronounce"}) do
      if self["_" .. data] then
	 args[data] = self["_" .. data]
      end
   end
   
   self._content.sections = self._content.sections or {}
   self._content.sections[section] = self._content.sections[section] or {}
   table.insert(self._content.sections[section], {[app] = args})
end

function SignalWireML:add_application(section, app, args)
   self._content.sections = self._content.sections or {}
   self._content.sections[section] = self._content.sections[section] or {}
   table.insert(self._content.sections[section], {[app] = args})
end

function SignalWireML:set_aipost_prompt_url(postprompt)
    for k, v in pairs(postprompt) do
	self["_" .. k] = postprompt[k]
    end
end

function SignalWireML:set_aiparams(params)
    self._params = params
end

function SignalWireML:add_aiparams(params)
    local keys = {"end_of_speech_timeout", "attention_timeout", "outbound_attention_timeout", "background_file_loops",
		  "background_file_volume", "digit_timeout", "energy_level"}

    for k, v in pairs(params) do
	if table_find(keys, k) then
	    self._params[k] = tonumber(v) or 0
	else
	    self._params[k] = v
	end
    end
end

function SignalWireML:set_aihints(...)
    self._hints = {...}
end

function SignalWireML:add_aihints(...)
   local hints = {...}
   local seen = {}
   for _, hint in ipairs(self._hints or {}) do
      seen[hint] = true
   end
   for _, hint in ipairs(hints) do
      if not seen[hint] then
	 table.insert(self._hints, hint)
	 seen[hint] = true
      end
   end
end

function SignalWireML:add_aiswaigdefaults(SWAIG)
    for k, v in pairs(SWAIG) do
	self._SWAIG.defaults[k] = v
    end
end

function SignalWireML:add_aiswaigfunction(SWAIG)
    table.insert(self._SWAIG.functions, SWAIG)
end

function SignalWireML:set_aipronounce(pronounce)
    self._pronounce = pronounce
end

function SignalWireML:add_aipronounce(pronounce)
    table.insert(self._pronounce, pronounce)
end

function SignalWireML:set_ailanguage(language)
    self._languages = language
end

function SignalWireML:add_ailanguage(language)
    table.insert(self._languages, language)
end

function SignalWireML:add_aiinclude(include)
    table.insert(self._SWAIG.includes, include)
end

function SignalWireML:add_ainativefunction(native)
    table.insert(self._SWAIG.native_functions, native)
end

function SignalWireML:set_aipost_prompt(postprompt)
    local keys = {"confidence", "barge_confidence", "top_p", "temperature", "frequency_penalty", "presence_penalty"}

    for k, v in pairs(postprompt) do
	if table_find(keys, k) then
	    self._post_prompt[k] = tonumber(v) or 0
	else
	    self._post_prompt[k] = v
	end
    end
end

function SignalWireML:set_aiprompt(prompt)
    local keys = {"confidence", "barge_confidence", "top_p", "temperature", "frequency_penalty", "presence_penalty"}

    for k, v in pairs(prompt) do
	if table_find(keys, k) then
	    self._prompt[k] = tonumber(v) or 0
	else
	    self._prompt[k] = v
	end
    end
end

function SignalWireML:swaig_response(response)
    return response
end

function SignalWireML:swaig_response_json(response)
    local json_str = json.encode(response, {pretty = true})
    return json_str
end

function SignalWireML:render()
    return self._content
end

function SignalWireML:render_json()
    return json.encode(self._content, {pretty = true})
end

function SignalWireML:render_yaml()
    return yaml.dump(self._content)
end

return SignalWireML
