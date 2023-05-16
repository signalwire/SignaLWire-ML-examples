local json = require("dkjson")
local yaml = require("lyaml")

local function table_contains(tbl, value)
   for _, v in ipairs(tbl) do
      if v == value then
	 return true
      end
   end
   return false
end

local SignalWireML = {}
SignalWireML.__index = SignalWireML


function SignalWireML.new(args)
   local self = setmetatable({}, SignalWireML)
   args = args or {}
   self._content = {
      version = args.version or "1.0.0",
      engine  = args.engine  or "gcloud"
   }
   self._voice = args.voice
   self._voice = args.voice
   self._SWAIG = {
      functions = {},
      defaults  = {}
   }
   self._params = {}
   self._prompt = {}
   self._postPrompt = {}
   self._hints = {}
   return self
end

function SignalWireML:add_aiapplication(section)
   local app = "ai"
   local args = {}
   
   for _, data in ipairs({"post_prompt", "voice", "engine", "post_prompt_url", "post_prompt_auth_user",
			  "post_prompt_auth_password", "languages", "hints", "params", "prompt", "SWAIG"}) do
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

function SignalWireML:set_aipost_prompt_url(post_prompt)
   for k, v in pairs(post_prompt) do
      self["_" .. k] = v
   end
end

function SignalWireML:set_aiparams(params)
   self._params = params
end

function SignalWireML:add_aiparams(params)
   for k, v in pairs(params) do
      self._params[k] = v
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

function SignalWireML:add_ailanguage(language)
   self._languages = self._languages or {}
   if not table_contains(self._languages, language) then
      table.insert(self._languages, language)
   end
end

function SignalWireML:set_ailanguage(language)
   self._languages = {language}
end

function SignalWireML:set_aipost_prompt(post_prompt)
   for k, v in pairs(post_prompt) do
      self._postPrompt[k] = v
   end
end

function SignalWireML:set_aiprompt(prompt)
   for k, v in pairs(prompt) do
      self._prompt[k] = v
   end
end

function swaig_response(self, response)
   local json_encoder = json.encode

   if self._content.sections then
      response.SWML = self._content
   end

   return json.encode(response, {indent = true})
end

function SignalWireML:render_json()
   return json.encode(self._content, {indent = true})
end

function SignalWireML:render_yaml()
   return yaml.dump({self._content})
end

return SignalWireML
