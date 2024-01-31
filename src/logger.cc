/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for
 *  license information.
 *--------------------------------------------------------------------------------------------*/

#include <chrono>
#include <spdlog/async.h>
#include <spdlog/sinks/rotating_file_sink.h>
#include <spdlog/sinks/stdout_sinks.h>

#include "logger.h"

#if defined(_WIN32)
#include <Windows.h>
#endif

Napi::Object Logger::Init(Napi::Env env, Napi::Object exports) {
  Napi::FunctionReference* constructor = new Napi::FunctionReference();
  Napi::Function definition = DefineClass(env, "Logger", {
    InstanceMethod<&Logger::GetLevel>("getLevel"),
    InstanceMethod<&Logger::SetLevel>("setLevel"),
    InstanceMethod<&Logger::Flush>("flush"),
    InstanceMethod<&Logger::Drop>("drop"),
    InstanceMethod<&Logger::SetPattern>("setPattern"),
    InstanceMethod<&Logger::ClearFormatters>("clearFormatters"),
    InstanceMethod<&Logger::Log<spdlog::level::level_enum::critical>>("critical"),
    InstanceMethod<&Logger::Log<spdlog::level::level_enum::err>>("error"),
    InstanceMethod<&Logger::Log<spdlog::level::level_enum::warn>>("warn"),
    InstanceMethod<&Logger::Log<spdlog::level::level_enum::info>>("info"),
    InstanceMethod<&Logger::Log<spdlog::level::level_enum::debug>>("debug"),
    InstanceMethod<&Logger::Log<spdlog::level::level_enum::trace>>("trace"),
  });
  *constructor = Napi::Persistent(definition);
  exports.Set("Logger", definition);
  env.SetInstanceData<Napi::FunctionReference>(constructor);
  return exports;
}

Logger::Logger(const Napi::CallbackInfo& info)
    : Napi::ObjectWrap<Logger>(info) {
  Napi::Env env(info.Env());

  if (!info[0].IsString()) {
    throw Napi::Error::New(env, "Provide a logger name");
  }

  const std::string name = info[0].As<Napi::String>();

  if (name == "rotating" || name == "rotating_async") {
    if (!info[1].IsString() || !info[2].IsString()) {
      throw Napi::Error::New(env, "Provide the log name and file name");
    }
    if (!info[3].IsNumber() || !info[4].IsNumber()) {
      throw Napi::Error::New(env, "Provide the max size and max files");
    }
    const std::string logName = info[1].As<Napi::String>();
    logger_ = spdlog::get(logName);

    if (!logger_) {
#if defined(_WIN32)
      const std::string utf8Filename = info[2].As<Napi::String>();
      const int bufferLen = MultiByteToWideChar(
          CP_UTF8, 0, utf8Filename.c_str(),
          static_cast<int>(utf8Filename.size()), NULL, 0);
      if (!bufferLen) {
        throw Napi::Error::New(env, "Failed to determine buffer length for converting filename to wstring");
      }
      std::wstring fileName(bufferLen, 0);
      const int status = MultiByteToWideChar(
          CP_UTF8, 0, utf8Filename.c_str(),
          static_cast<int>(utf8Filename.size()), &fileName[0], bufferLen);
      if (!status) {
        throw Napi::Error::New(env, "Failed to convert filename to wstring");
      }
#else
      const std::string fileName = info[2].As<Napi::String>();
#endif
      if (logName == "rotating_async") {
        logger_ = spdlog::rotating_logger_st<spdlog::async_factory>(
            logName, fileName, static_cast<size_t>(info[3].As<Napi::Number>().Int64Value()),
            static_cast<size_t>(info[4].As<Napi::Number>().Int64Value()));
      } else {
        logger_ = spdlog::rotating_logger_st(
            logName, fileName, static_cast<size_t>(info[3].As<Napi::Number>().Int64Value()),
            static_cast<size_t>(info[4].As<Napi::Number>().Int64Value()));
      }
    }
  } else {
    logger_ = spdlog::stdout_logger_st<spdlog::async_factory>(name);
  }
}

Logger::~Logger() {
  try {
    if (logger_)
      spdlog::drop(logger_->name());
  } catch (...) {
    // noop
  }
}

template<spdlog::level::level_enum level>
void Logger::Log(const Napi::CallbackInfo& info) {
  Napi::Env env(info.Env());

  if (!info[0].IsString()) {
    throw Napi::Error::New(env, "Provide a message to log");
  }

  if (logger_) {
    std::string message = info[0].As<Napi::String>();
    switch(level) {
      case spdlog::level::level_enum::critical:
        logger_->critical(message);
        break;
      case spdlog::level::level_enum::err:
        logger_->error(message);
        break;
      case spdlog::level::level_enum::warn:
        logger_->warn(message);
        break;
      case spdlog::level::level_enum::info:
        logger_->info(message);
        break;
      case spdlog::level::level_enum::debug:
        logger_->debug(message);
        break;
      case spdlog::level::level_enum::trace:
        logger_->trace(message);
        break;
    }
  }
}

Napi::Value Logger::GetLevel(const Napi::CallbackInfo& info) {
  Napi::Env env(info.Env());

  if (logger_) {
    return Napi::Number::New(env, logger_->level());
  }
  return Napi::Number::New(env, 2);
}

void Logger::SetLevel(const Napi::CallbackInfo& info) {
  Napi::Env env(info.Env());

  if (!info[0].IsNumber()) {
    throw Napi::Error::New(env, "Provide level");
  }

  if (logger_) {
    const int64_t levelNumber = info[0].As<Napi::Number>().Int64Value();
    if (levelNumber >= spdlog::level::n_levels || levelNumber < spdlog::level::trace) {
      throw Napi::Error::New(env, "Invalid level");
    }
    auto level = static_cast<spdlog::level::level_enum>(levelNumber);
    logger_->set_level(level);
  }
}

void Logger::Flush(const Napi::CallbackInfo& info) {
  if (logger_) {
    logger_->flush();
  }
}

void Logger::Drop(const Napi::CallbackInfo& info) {
  if (logger_) {
    const std::string name = logger_->name();
    logger_.reset();
    spdlog::drop(name);
  }
}

void Logger::SetPattern(const Napi::CallbackInfo& info) {
  Napi::Env env(info.Env());

  if (!info[0].IsString()) {
    throw Napi::Error::New(env, "Provide pattern");
  }

  const std::string pattern = info[0].As<Napi::String>();
  if (logger_) {
    logger_->set_pattern(pattern);
  }
}

void Logger::ClearFormatters(const Napi::CallbackInfo& info) {
  if (logger_) {
    logger_->set_formatter(
        std::unique_ptr<VoidFormatter>(new VoidFormatter()));
  }
}
