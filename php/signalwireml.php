<?php

class SignalWireML {
    private $_content;
    private $_voice;
    private $_SWAIG;
    private $_params;
    private $_hints;
    private $_languages;
    private $_pronounce;
    private $_postPrompt;
    private $_prompt;

    public function __construct($args = []) {
        $this->_content = [
            'version' => $args['version'] ?? '1.0.0',
            'sections' => [],
            'engine' => $args['engine'] ?? 'gcloud',
        ];
        $this->_voice = $args['voice'] ?? null;
        $this->_languages = [];
        $this->_pronounce = [];
        $this->_SWAIG = [
            'includes' => [],
            'functions' => [],
            'native_functions' => [],
            'defaults' => [],
        ];
        $this->_params = [];
        $this->_prompt = [];
        $this->_postPrompt = [];
        $this->_hints = [];
    }

    public function add_aiapplication($section) {
        $app = 'ai';
        $args = [];

        $dataFields = ["post_prompt", "voice", "engine", "post_prompt_url", "post_prompt_auth_user",
                       "post_prompt_auth_password", "languages", "hints", "params", "prompt", "SWAIG", "pronounce"];

        foreach ($dataFields as $data) {
            if (isset($this->{"_" . $data})) {
                $args[$data] = $this->{"_" . $data};
            }
        }

        $this->_content['sections'][$section][] = [$app => $args];
    }

    public function add_application($section, $app, $args) {
        $this->_content['sections'][$section][] = [$app => $args];
    }

    public function set_aipost_prompt_url($postprompt) {
        foreach ($postprompt as $k => $v) {
            $this->{"_" . $k} = $v;
        }
    }

    public function set_aiparams($params) {
        $this->_params = $params;
    }

    public function add_aiparams($params) {
        $keys = ["end_of_speech_timeout", "attention_timeout", "outbound_attention_timeout", "background_file_loops",
                 "background_file_volume", "digit_timeout", "energy_level"];

        foreach ($params as $k => $v) {
            if (in_array($k, $keys)) {
                $this->_params[$k] = is_numeric($v) ? (float) $v : 0;
            } else {
                $this->_params[$k] = $v;
            }
        }
    }

    public function set_aihints(...$hints) {
        $this->_hints = $hints;
    }

    public function add_aihints(...$hints) {
        $this->_hints = array_merge($this->_hints, array_diff($hints, $this->_hints));
    }

    public function add_aiswaigdefaults($SWAIG) {
        $this->_SWAIG['defaults'] = array_merge($this->_SWAIG['defaults'], $SWAIG);
    }

    public function add_aiswaigfunction($SWAIG) {
        $this->_SWAIG['functions'][] = $SWAIG;
    }

    public function set_aipronounce($pronounce) {
        $this->_pronounce = $pronounce;
    }

    public function add_aipronounce($pronounce) {
        $this->_pronounce[] = $pronounce;
    }

    public function set_ailanguage($language) {
        $this->_languages = $language;
    }

    public function add_ailanguage($language) {
        $this->_languages[] = $language;
    }

    public function add_aiinclude($include) {
        $this->_SWAIG['includes'][] = $include;
    }

    public function add_ainativefunction($native) {
        $this->_SWAIG['native_functions'][] = $native;
    }

    public function set_aipost_prompt($postprompt) {
        $keys = ["confidence", "barge_confidence", "top_p", "temperature", "frequency_penalty", "presence_penalty"];

        foreach ($postprompt as $k => $v) {
            if (in_array($k, $keys)) {
                $this->_postPrompt[$k] = is_numeric($v) ? (float) $v : 0;
            } else {
                $this->_postPrompt[$k] = $v;
            }
        }
    }

    public function set_aiprompt($prompt) {
        $keys = ["confidence", "barge_confidence", "top_p", "temperature", "frequency_penalty", "presence_penalty"];

        foreach ($prompt as $k => $v) {
            if (in_array($k, $keys)) {
                $this->_prompt[$k] = is_numeric($v) ? (float) $v : 0;
            } else {
                $this->_prompt[$k] = $v;
            }
        }
    }

    public function render_json() {
        return json_encode($this->_content, JSON_PRETTY_PRINT);
    }

    public function render_yaml() {
        // Ensure yaml extension is installed and loaded
        if (function_exists('yaml_emit')) {
            return yaml_emit($this->_content, YAML_UTF8_ENCODING);
        } else {
            return "Error: PHP YAML extension is not installed.";
        }
    }

    public function render() {
        return $this->_content;
    }
}

?>
