require 'json'
require 'yaml'
require 'set'

class SignalWireML
  attr_accessor :_content, :_voice, :_swaig, :_params, :_prompt, :_postPrompt, :_hints, :_languages, :_pronounce
  def initialize(args = {})
    @_content = {
      version: args[:version] || '1.0.0',
      engine: args[:engine] || 'gcloud'
    }
    @_voice = args[:voice]
    @_swaig = {
      functions: [],
      defaults: {},
      includes: [],
      native_functions: []
    }
    @_params = {}
    @_prompt = {}
    @_postPrompt = {}
    @_pronounce = []
    @_languages = []
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
      :swaig,
      :pronounce
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
    args = {}

    [
      :end_of_speech_timeout,
      :attention_timeout,
      :outbound_attention_timeout,
      :background_file_loops,
      :background_file_volume,
      :digit_timeout,
      :energy_level
    ].each do |data|
      instance_var = "@_#{data}"
      args[data] = instance_variable_get(instance_var) if instance_variable_defined?(instance_var)
    end
    
    params.each do |k, v|
      args[k.to_sym] = v
    end
    
    @_params.merge!(args)
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

  def add_aiswaigdefaults(swaig)
    @_swaig[:defaults].merge!(swaig)
  end

  def add_aiswaigfunction(swaig)
    @_swaig[:functions].push(swaig)
  end

  def set_aipronounce(pronounce_options)
    @_pronounce = [pronounce_options]
  end

  def add_aipronounce(pronounce_options)
    @_pronounce ||= []
    @_pronounce.push(pronounce_options)
  end
  
  def set_ailanguage(language)
    @_languages = [language]
  end

  def add_ailanguage(language)
    @_languages ||= []
    @_languages.push(language) unless SignalWireML.table_contains(@_languages, language)
  end

  def add_aiinclude(include)
    @_swaig ||= {}
    @_swaig[:includes] << include
  end
  
  def add_ainativefunction(native_functions)
    @_swaig ||= {}
    @_swaig[:native_functions] << native_functions
  end  
  
  def set_aipost_prompt(post_prompt)
    @_postPrompt.merge!(post_prompt)
  end


  def set_aiprompt(prompt)
    @_prompt.merge!(prompt)
  end

  def swaig_response(response)
    return response
  end

  def swaig_response_json(response)
    json = JSON.pretty_generate(response)
    return json
  end

  def render
    return @_content
  end

  def render_json
    json = JSON.pretty_generate(@_content)
    return json
  end

  def render_yaml
    yaml = YAML.dump(@_content)
    return yaml
  end
end
