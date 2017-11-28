/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

#include <nan.h>

NAN_MODULE_INIT(Init)
{
  // Nan::Set(target, Nan::New("isActive").ToLocalChecked(), Nan::GetFunction(Nan::New<v8::FunctionTemplate>(isActive)).ToLocalChecked());
  // Mutex::Init(target);
}

NODE_MODULE(spdlog, Init)