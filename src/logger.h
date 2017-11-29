/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

#ifndef CONSOLE_H
#define CONSOLE_H

#include <nan.h>
#include <spdlog/spdlog.h>

class Logger : public Nan::ObjectWrap
{
public:
	static NAN_MODULE_INIT(Init);

private:
	explicit Logger(/* const char *name,  */ std::shared_ptr<spdlog::logger> logger);
	~Logger();

	static NAN_METHOD(New);
	// static NAN_METHOD(Release);
	// static NAN_METHOD(IsActive);
	static Nan::Persistent<v8::Function> constructor;

	// const char *name_;
	std::shared_ptr<spdlog::logger> logger_;
};

#endif // !CONSOLE_H