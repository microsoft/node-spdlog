/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for
 *  license information.
 *--------------------------------------------------------------------------------------------*/

#include <napi.h>
#include "logger.h"

void SetLevel(const Napi::CallbackInfo& info) {
  Napi::Env env(info.Env());

  if (!info[0].IsNumber()) {
    throw Napi::Error::New(env, "Provide level");
  }

  const int64_t levelNumber = info[0].As<Napi::Number>().Int64Value();
  if (levelNumber >= spdlog::level::n_levels || levelNumber < spdlog::level::trace) {
    throw Napi::Error::New(env, "Invalid level");
  }
  auto level = static_cast<spdlog::level::level_enum>(levelNumber);

  spdlog::set_level(level);
}

void SetFlushOn(const Napi::CallbackInfo& info) {
  Napi::Env env(info.Env());

  if (!info[0].IsNumber()) {
    throw Napi::Error::New(env, "Provide flush level");
  }

  const int64_t levelNumber = info[0].As<Napi::Number>().Int64Value();
  if (levelNumber >= spdlog::level::n_levels || levelNumber < spdlog::level::trace) {
    throw Napi::Error::New(env, "Invalid level");
  }
  auto level = static_cast<spdlog::level::level_enum>(levelNumber);

  spdlog::flush_on(level);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("version", Napi::Number::New(env, SPDLOG_VERSION));
  exports.Set("setLevel", Napi::Function::New(env, SetLevel));
  exports.Set("setFlushOn", Napi::Function::New(env, SetFlushOn));

  Logger::Init(env, exports);
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);
