/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

#include <nan.h>
#include <spdlog/spdlog.h>
#include "logger.h"

NAN_MODULE_INIT(Init)
{
  // auto console = spdlog::stdout_color_mt("console");
  // console->info("Welcome to spdlog!");
  // console->error("Some error message with arg{}..", 1);

  Nan::Set(target, Nan::New("version").ToLocalChecked(), Nan::New(SPDLOG_VERSION).ToLocalChecked());
  Nan::Set(target, Nan::New("setAsyncMode").ToLocalChecked(), Nan::GetFunction(Nan::New<v8::FunctionTemplate>(setAsyncMode)).ToLocalChecked());

  Logger::Init(target);
}

NODE_MODULE(spdlog, Init)