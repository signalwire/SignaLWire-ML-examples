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

  def add_aiapplication(section)
    app = 'ai'
    args = {}

    [
      :post_prompt,
      :voice,
      :engine,
      :post_prompt_url,
      :post_prompt_auth_user,
      :post_prompt_auth_password,
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

  def add_application(section, app, args)
    @_content[:sections] ||= {}
    @_content[:sections][section] ||= []
    @_content[:sections][section].push({ app => args })
  end

  def set_aipost_prompt_url(post_prompt)
    post_prompt.each { |k, v| instance_variable_set("@_#{k}", v) }
  end

  def set_aiparams(params)
    @_params = params
  end

  def add_aiparams(params)
    @_params.merge!(params)
  end

  def set_aihints(*hints)
    @_hints = hints
  end

  def add_aihints(*hints)
    seen = Set.new(@_hints)
    hints.each do |hint|
      unless seen.include?(hint)
        @_hints.push(hint)
        seen.add(hint)
      end
    end
  end

  def add_aiswaig_defaults(swaig)
    @_swaig[:defaults].merge!(swaig)
  end

  def add_aiswaig_function(swaig)
    @_swaig[:functions].push(swaig)
  end

  def add_ailanguage(language)
    @_languages ||= []
    @_languages.push(language) unless SignalWireML.table_contains(@_languages, language)
  end

  def set_ailanguage(language)
    @_languages = [language]
  end

  def set_aipost_prompt(post_prompt)
    @_postPrompt.merge!(post_prompt)
  end

  def set_aiprompt(prompt)
    @_prompt.merge!(prompt)
  end

  def swaig_response(response)
    if self['_content']['sections']
      response['SWML'] = self['_content']
    end

    JSON.pretty_generate(response)
  end

  def render_json
    JSON.pretty_generate(@_content)
  end

  def render_yaml
    YAML.dump(@_content)
  end
end
