/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

#include <nan.h>
#include "logger.h"

Nan::Persistent<v8::Function> Logger::constructor;

NAN_MODULE_INIT(Logger::Init)
{
	v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
	tpl->SetClassName(Nan::New("Logger").ToLocalChecked());
	tpl->InstanceTemplate()->SetInternalFieldCount(1);

	// Nan::SetPrototypeMethod(tpl, "release", Logger::Release);
	// Nan::SetPrototypeMethod(tpl, "isActive", Logger::IsActive);

	constructor.Reset(Nan::GetFunction(tpl).ToLocalChecked());
	Nan::Set(target, Nan::New("Logger").ToLocalChecked(), Nan::GetFunction(tpl).ToLocalChecked());
}

Logger::Logger(std::shared_ptr<spdlog::logger> logger) : logger_(logger)
{
}

Logger::~Logger()
{
	// if (mutex_ != NULL)
	// {
	// 	CloseHandle(mutex_);
	// }
}

NAN_METHOD(Logger::New)
{
	if (info.IsConstructCall())
	{
		if (!info[0]->IsString())
		{
			return Nan::ThrowError(Nan::Error("Provide a logger name"));
		}

		const char *name = *Nan::Utf8String(info[0]);
		auto logger = spdlog::stdout_logger_mt(name);

		Logger *obj = new Logger(logger);
		obj->Wrap(info.This());
		info.GetReturnValue().Set(info.This());
	}
	else
	{
		const int argc = 1;
		v8::Local<v8::Value> argv[argc] = {info[0]};
		v8::Local<v8::Function> cons = Nan::New(constructor);
		info.GetReturnValue().Set(cons->NewInstance(argc, argv));
	}
}

// NAN_METHOD(Logger::Release)
// {
// 	Stdout *obj = Nan::ObjectWrap::Unwrap<Stdout>(info.This());

// 	if (!obj->mutex_)
// 	{
// 		info.GetReturnValue().Set(FALSE);
// 		return;
// 	}

// 	CloseHandle(obj->mutex_);
// 	obj->mutex_ = NULL;
// 	info.GetReturnValue().Set(TRUE);
// }

// NAN_METHOD(Logger::IsActive)
// {
// 	Mutex *obj = Nan::ObjectWrap::Unwrap<Mutex>(info.This());

// 	info.GetReturnValue().Set(obj->mutex_ != NULL);
// }
