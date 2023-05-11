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

function SignalWireML:addAIApplication(section)
   local app = "ai"
   local args = {}
   
   for _, data in ipairs({"postPrompt", "voice", "engine", "postPromptURL", "postPromptAuthUser",
			  "postPromptAuthPassword", "languages", "hints", "params", "prompt", "SWAIG"}) do
      if self["_" .. data] then
	 args[data] = self["_" .. data]
      end
   end
   
   self._content.sections = self._content.sections or {}
   self._content.sections[section] = self._content.sections[section] or {}
   table.insert(self._content.sections[section], {[app] = args})
end

function SignalWireML:addApplication(section, app, args)
   self._content.sections = self._content.sections or {}
   self._content.sections[section] = self._content.sections[section] or {}
   table.insert(self._content.sections[section], {[app] = args})
end

function SignalWireML:setAIpostPromptURL(postPrompt)
   for k, v in pairs(postPrompt) do
      self["_" .. k] = v
   end
end

function SignalWireML:setAIparams(params)
   self._params = params
end

function SignalWireML:addAIparams(params)
   for k, v in pairs(params) do
      self._params[k] = v
   end
end

function SignalWireML:setAIhints(...)
   self._hints = {...}
end

function SignalWireML:addAIhints(...)
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

function SignalWireML:addAISWAIGdefaults(SWAIG)
   for k, v in pairs(SWAIG) do
      self._SWAIG.defaults[k] = v
   end
end

function SignalWireML:addAISWAIGfunction(SWAIG)
   table.insert(self._SWAIG.functions, SWAIG)
end

function SignalWireML:addAIlanguage(language)
   self._languages = self._languages or {}
   if not table_contains(self._languages, language) then
      table.insert(self._languages, language)
   end
end

function SignalWireML:setAIlanguage(language)
   self._languages = {language}
end

function SignalWireML:setAIpostPrompt(postPrompt)
   for k, v in pairs(postPrompt) do
      self._postPrompt[k] = v
   end
end

function SignalWireML:setAIprompt(prompt)
   for k, v in pairs(prompt) do
      self._prompt[k] = v
   end
end

function SWAIGResponse(self, response)
   local jsonEncoder = json.encode

   if self._content.sections then
      response.SWML = self._content
   end

   return json.encode(response, {indent = true})
end

function SignalWireML:renderJSON()
   return json.encode(self._content, {indent = true})
end

function SignalWireML:renderYAML()
   return yaml.dump({self._content})
end

return SignalWireML
