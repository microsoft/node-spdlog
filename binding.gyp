{
	"targets": [{
		"target_name": "spdlog",
		'dependencies': [
      		"<!(node -p \"require('node-addon-api').targets\"):node_addon_api_except",
		],
		"sources": [
			"src/main.cc",
			"src/logger.cc"
		],
		"include_dirs": [
			"<!(node -p \"require('node-addon-api').include_dir\")",
			"deps/spdlog/include"
		],
		"defines": [ "NODE_API_SWALLOW_UNTHROWABLE_EXCEPTIONS" ],
		'msvs_configuration_attributes': {
			'SpectreMitigation': 'Spectre'
		},
		'msvs_settings': {
			'VCCLCompilerTool': {
				'ExceptionHandling': 1,
				'AdditionalOptions': [
					'/guard:cf',
					'/w34244',
					'/we4267',
					'/ZH:SHA_256'
				]
			},
			'VCLinkerTool': {
				'AdditionalOptions': [
					'/guard:cf'
				]
			}
		},
		'conditions': [
			['OS=="win"', {
				'defines': [
					'SPDLOG_WCHAR_FILENAMES'
				]
			}]
		]
	}]
}
