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
                    '/sdl',
					'/W3',
					'/w34146',
					'/w34244',
                    '/w34267',
					'/ZH:SHA_256'
				]
			},
			'VCLinkerTool': {
				'AdditionalOptions': [
                    '/DYNAMICBASE',
					'/guard:cf'
				]
			}
		},
		'conditions': [
			['OS=="win"', {
				'defines': [
					'SPDLOG_WCHAR_FILENAMES'
				]
			}, {
                'cflags': [
                    '-O2',
                    '-D_FORTIFY_SOURCE=2'
                ]
			}]
		]
	}]
}
