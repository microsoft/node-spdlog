/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for
 *  license information.
 *--------------------------------------------------------------------------------------------*/

#include <napi.h>

// Prevent child processes from inheriting the file handles
#define SPDLOG_PREVENT_CHILD_FD

#include <spdlog/spdlog.h>


class Logger : public Napi::ObjectWrap<Logger> {
 public:
  static Napi::Object Init(Napi::Env env, Napi::Object exports);
  explicit Logger(const Napi::CallbackInfo& info);

 private:
  friend class Napi::ObjectWrap<Logger>;
  ~Logger();

  template<spdlog::level::level_enum level>
  void Log(const Napi::CallbackInfo& info);

  Napi::Value GetLevel(const Napi::CallbackInfo& info);
  void SetLevel(const Napi::CallbackInfo& info);
  void Flush(const Napi::CallbackInfo& info);
  void Drop(const Napi::CallbackInfo& info);
  void SetPattern(const Napi::CallbackInfo& info);
  void ClearFormatters(const Napi::CallbackInfo& info);

  std::shared_ptr<spdlog::logger> logger_;
};

class VoidFormatter : public spdlog::formatter {
  void format(const spdlog::details::log_msg &msg, spdlog::memory_buf_t &dest) override {
    spdlog::details::fmt_helper::append_string_view(msg.payload, dest);
  }

  std::unique_ptr<spdlog::formatter> clone() const override {
    return spdlog::details::make_unique<VoidFormatter>();
  }
};
