require 'json'
require 'yaml'
require 'set'

class SignalWireML
  attr_accessor :_content, :_voice, :_swaig, :_params, :_prompt, :_postPrompt, :_hints

  def initialize(args = {})
    @_content = {
      version: args[:version] || '1.0.0',
      engine: args[:engine] || 'gcloud'
    }
    @_voice = args[:voice]
    @_swaig = {
      functions: [],
      defaults: {}
    }
    @_params = {}
    @_prompt = {}
    @_postPrompt = {}
    @_hints = []
  end

  def self.table_contains(tbl, value)
    tbl.include?(value)
  end

  def addAIApplication(section)
    app = 'ai'
    args = {}

    [
      :postPrompt,
      :voice,
      :engine,
      :postPromptURL,
      :postPromptAuthUser,
      :postPromptAuthPassword,
      :languages,
      :hints,
      :params,
      :prompt,
      :swaig
    ].each do |data|
      args[data] = instance_variable_get("@_#{data}") if instance_variable_get("@_#{data}")
    end

    @_content[:sections] ||= {}
    @_content[:sections][section] ||= []
    @_content[:sections][section].push({ app => args })
  end

  def addApplication(section, app, args)
    @_content[:sections] ||= {}
    @_content[:sections][section] ||= []
    @_content[:sections][section].push({ app => args })
  end

  def setAIpostPromptURL(post_prompt)
    post_prompt.each { |k, v| instance_variable_set("@_#{k}", v) }
  end

  def setAIparams(params)
    @_params = params
  end

  def addAIparams(params)
    @_params.merge!(params)
  end

  def setAIhints(*hints)
    @_hints = hints
  end

  def addAIhints(*hints)
    seen = Set.new(@_hints)
    hints.each do |hint|
      unless seen.include?(hint)
        @_hints.push(hint)
        seen.add(hint)
      end
    end
  end

  def addAISWAIGdefaults(swaig)
    @_swaig[:defaults].merge!(swaig)
  end

  def addAISWAIGfunction(swaig)
    @_swaig[:functions].push(swaig)
  end

  def addAIlanguage(language)
    @_languages ||= []
    @_languages.push(language) unless SignalWireML.table_contains(@_languages, language)
  end

  def setAIlanguage(language)
    @_languages = [language]
  end

  def setAIpostPrompt(post_prompt)
    @_postPrompt.merge!(post_prompt)
  end

  def setAIprompt(prompt)
    @_prompt.merge!(prompt)
  end

  def renderJSON
    JSON.pretty_generate(@_content)
  end

  def renderYAML
    YAML.dump(@_content)
  end
end
