// Copyright 2019 CryptoGarage
/**
 * @file cfdjs_internal.h
 *
 * @brief cfd_apiの内部定義ヘッダ.
 */
#ifndef CFD_JS_SRC_CFDJS_INTERNAL_H_
#define CFD_JS_SRC_CFDJS_INTERNAL_H_

#include <string>

#include "cfd/cfd_common.h"
#include "cfdcore/cfdcore_bytedata.h"
#include "cfdcore/cfdcore_exception.h"
#include "cfdcore/cfdcore_logger.h"
#include "cfdjs/cfdjs_struct.h"

namespace cfd {
namespace js {
namespace api {

using cfd::core::ByteData256;
using cfd::core::CfdException;
using cfd::core::logger::warn;

/**
 * @brief CfdExceptionをInnerErrorResponseStructに変換する.
 * @param cfde CfdException object
 * @return ErrorResponse object
 */
InnerErrorResponseStruct ConvertCfdExceptionToStruct(const CfdException& cfde);

/**
 * @brief Return a ByteData256 object from a string and hash it before if requested
 *
 * @param input the message as a string
 * @param is_hashed whether to has the message
 * @return ByteData256
 */
ByteData256 GetMessage(std::string input, bool is_hashed);

/**
 * @brief 構造体指定処理の共通部テンプレート関数.
 * @param[in] request         要求値
 * @param[in] call_function   実行関数定義
 * @param[in] fuction_name    実行元関数名
 * @return Response object
 */
template <typename RequestStructType, typename ResponseStructType>
ResponseStructType ExecuteStructApi(
    const RequestStructType& request,
    std::function<ResponseStructType(const RequestStructType&)> call_function,
    std::string fuction_name) {
  ResponseStructType response;
  try {
    cfd::Initialize();

    response = call_function(request);
  } catch (const CfdException& cfde) {
    warn(
        CFD_LOG_SOURCE,
        "Failed to {}. CfdException occurred:  code={}, message={}",
        fuction_name, cfde.GetErrorCode(), cfde.what());
    response.error = cfd::js::api::ConvertCfdExceptionToStruct(cfde);
  } catch (const std::exception& except) {
    warn(
        CFD_LOG_SOURCE, "Failed to {}. Exception occurred: message={}",
        fuction_name, except.what());
    response.error = cfd::js::api::ConvertCfdExceptionToStruct(CfdException());
  } catch (...) {
    warn(
        CFD_LOG_SOURCE, "Failed to {}. Unknown exception occurred.",
        fuction_name);
    response.error = cfd::js::api::ConvertCfdExceptionToStruct(CfdException());
  }
  return response;
}

/**
 * @brief 構造体指定処理の共通部テンプレート関数.
 * @param[in] call_function   実行関数定義
 * @param[in] fuction_name    実行元関数名
 * @return Response object
 */
template <typename ResponseStructType>
ResponseStructType ExecuteResponseStructApi(
    std::function<ResponseStructType()> call_function,
    std::string fuction_name) {
  ResponseStructType response;
  try {
    cfd::Initialize();

    response = call_function();
  } catch (const CfdException& cfde) {
    warn(
        CFD_LOG_SOURCE,
        "Failed to {}. CfdException occurred:  code={}, message={}",
        fuction_name, cfde.GetErrorCode(), cfde.what());
    response.error = cfd::js::api::ConvertCfdExceptionToStruct(cfde);
  } catch (const std::exception& except) {
    warn(
        CFD_LOG_SOURCE, "Failed to {}. Exception occurred: message={}",
        fuction_name, except.what());
    response.error = cfd::js::api::ConvertCfdExceptionToStruct(CfdException());
  } catch (...) {
    warn(
        CFD_LOG_SOURCE, "Failed to {}. Unknown exception occurred.",
        fuction_name);
    response.error = cfd::js::api::ConvertCfdExceptionToStruct(CfdException());
  }
  return response;
}

}  // namespace api
}  // namespace js
}  // namespace cfd

#endif  // CFD_JS_SRC_CFDJS_INTERNAL_H_
