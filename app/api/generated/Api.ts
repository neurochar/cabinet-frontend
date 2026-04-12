/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** @default "TECHNIQUE_ITEM_TYPE_UNSPECIFIED" */
export enum V1TechniqueItemType {
  TECHNIQUE_ITEM_TYPE_UNSPECIFIED = "TECHNIQUE_ITEM_TYPE_UNSPECIFIED",
  TECHNIQUE_ITEM_TYPE_QUESTION_WITH_VARIANTS_SINGLE_ANSWER = "TECHNIQUE_ITEM_TYPE_QUESTION_WITH_VARIANTS_SINGLE_ANSWER",
}

/** @default "ROOM_STATUS_UNSPECIFIED" */
export enum V1RoomStatus {
  ROOM_STATUS_UNSPECIFIED = "ROOM_STATUS_UNSPECIFIED",
  ROOM_STATUS_NOT_STARTED = "ROOM_STATUS_NOT_STARTED",
  ROOM_STATUS_FINISHED = "ROOM_STATUS_FINISHED",
}

/** @default "PERSONALITY_TRAIT_TYPE_UNSPECIFIED" */
export enum V1PersonalityTraitType {
  PERSONALITY_TRAIT_TYPE_UNSPECIFIED = "PERSONALITY_TRAIT_TYPE_UNSPECIFIED",
  PERSONALITY_TRAIT_TYPE_BIPOLAR = "PERSONALITY_TRAIT_TYPE_BIPOLAR",
}

/** @default "PRESONALITY_TRAIT_PRIORITY_NONE" */
export enum V1PersonalityTraitPriority {
  PRESONALITY_TRAIT_PRIORITY_NONE = "PRESONALITY_TRAIT_PRIORITY_NONE",
  PRESONALITY_TRAIT_PRIORITY_LOW = "PRESONALITY_TRAIT_PRIORITY_LOW",
  PRESONALITY_TRAIT_PRIORITY_MEDIUM = "PRESONALITY_TRAIT_PRIORITY_MEDIUM",
  PRESONALITY_TRAIT_PRIORITY_HIGH = "PRESONALITY_TRAIT_PRIORITY_HIGH",
}

/** @default "LIST_ROOM_SORT_UNSPECIFIED" */
export enum V1ListRoomsSort {
  LIST_ROOM_SORT_UNSPECIFIED = "LIST_ROOM_SORT_UNSPECIFIED",
  LIST_ROOM_SORT_CREATED_AT = "LIST_ROOM_SORT_CREATED_AT",
  LIST_ROOM_SORT_FINISHED_AT = "LIST_ROOM_SORT_FINISHED_AT",
  LIST_ROOM_SORT_RESULT_INDEX = "LIST_ROOM_SORT_RESULT_INDEX",
}

/** @default "GENDER_UNSPECIFIED" */
export enum V1Gender {
  GENDER_UNSPECIFIED = "GENDER_UNSPECIFIED",
  GENDER_MALE = "GENDER_MALE",
  GENDER_FEMALE = "GENDER_FEMALE",
}

export interface CrmPublicServicePatchCandidateBody {
  payload?: V1PatchCandidateRequestPayload;
  skipVersionCheck?: boolean;
  /** @format int64 */
  version?: string;
}

export interface RoomsPublicServiceFinishRoomBody {
  payload?: V1FinishRoomRequestPayload;
}

export interface TenantPublicServicePatchTenantBody {
  payload?: V1PatchTenantRequestPayload;
  skipVersionCheck?: boolean;
  /** @format int64 */
  version?: string;
}

export interface TestingPublicServicePatchProfileBody {
  payload?: V1PatchProfileRequestPayload;
  skipVersionCheck?: boolean;
  /** @format int64 */
  version?: string;
}

export interface UsersTenantPublicServicePatchAccountBody {
  payload?: V1PatchAccountRequestPayload;
  skipVersionCheck?: boolean;
  /** @format int64 */
  version?: string;
}

/**
 * `Any` contains an arbitrary serialized protocol buffer message along with a
 * URL that describes the type of the serialized message.
 *
 * Protobuf library provides support to pack/unpack Any values in the form
 * of utility functions or additional generated methods of the Any type.
 *
 * Example 1: Pack and unpack a message in C++.
 *
 *     Foo foo = ...;
 *     Any any;
 *     any.PackFrom(foo);
 *     ...
 *     if (any.UnpackTo(&foo)) {
 *       ...
 *     }
 *
 * Example 2: Pack and unpack a message in Java.
 *
 *     Foo foo = ...;
 *     Any any = Any.pack(foo);
 *     ...
 *     if (any.is(Foo.class)) {
 *       foo = any.unpack(Foo.class);
 *     }
 *     // or ...
 *     if (any.isSameTypeAs(Foo.getDefaultInstance())) {
 *       foo = any.unpack(Foo.getDefaultInstance());
 *     }
 *
 *  Example 3: Pack and unpack a message in Python.
 *
 *     foo = Foo(...)
 *     any = Any()
 *     any.Pack(foo)
 *     ...
 *     if any.Is(Foo.DESCRIPTOR):
 *       any.Unpack(foo)
 *       ...
 *
 *  Example 4: Pack and unpack a message in Go
 *
 *      foo := &pb.Foo{...}
 *      any, err := anypb.New(foo)
 *      if err != nil {
 *        ...
 *      }
 *      ...
 *      foo := &pb.Foo{}
 *      if err := any.UnmarshalTo(foo); err != nil {
 *        ...
 *      }
 *
 * The pack methods provided by protobuf library will by default use
 * 'type.googleapis.com/full.type.name' as the type URL and the unpack
 * methods only use the fully qualified type name after the last '/'
 * in the type URL, for example "foo.bar.com/x/y.z" will yield type
 * name "y.z".
 *
 * JSON
 * ====
 * The JSON representation of an `Any` value uses the regular
 * representation of the deserialized, embedded message, with an
 * additional field `@type` which contains the type URL. Example:
 *
 *     package google.profile;
 *     message Person {
 *       string first_name = 1;
 *       string last_name = 2;
 *     }
 *
 *     {
 *       "@type": "type.googleapis.com/google.profile.Person",
 *       "firstName": <string>,
 *       "lastName": <string>
 *     }
 *
 * If the embedded message type is well-known and has a custom JSON
 * representation, that representation will be embedded adding a field
 * `value` which holds the custom JSON in addition to the `@type`
 * field. Example (for message [google.protobuf.Duration][]):
 *
 *     {
 *       "@type": "type.googleapis.com/google.protobuf.Duration",
 *       "value": "1.212s"
 *     }
 */
export interface ProtobufAny {
  /**
   * A URL/resource name that uniquely identifies the type of the serialized
   * protocol buffer message. This string must contain at least
   * one "/" character. The last segment of the URL's path must represent
   * the fully qualified name of the type (as in
   * `path/google.protobuf.Duration`). The name should be in a canonical form
   * (e.g., leading "." is not accepted).
   *
   * In practice, teams usually precompile into the binary all types that they
   * expect it to use in the context of Any. However, for URLs which use the
   * scheme `http`, `https`, or no scheme, one can optionally set up a type
   * server that maps type URLs to message definitions as follows:
   *
   * * If no scheme is provided, `https` is assumed.
   * * An HTTP GET on the URL must yield a [google.protobuf.Type][]
   *   value in binary format, or produce an error.
   * * Applications are allowed to cache lookup results based on the
   *   URL, or have them precompiled into a binary to avoid any
   *   lookup. Therefore, binary compatibility needs to be preserved
   *   on changes to types. (Use versioned type names to manage
   *   breaking changes.)
   *
   * Note: this functionality is not currently available in the official
   * protobuf release, and it is not used for type URLs beginning with
   * type.googleapis.com. As of May 2023, there are no widely used type server
   * implementations and no plans to implement one.
   *
   * Schemes other than `http`, `https` (or the empty scheme) might be
   * used with implementation specific semantics.
   */
  "@type"?: string;
  [key: string]: any;
}

export interface RoomsV1GetRoomResponse {
  room: V1Room;
}

export interface RpcStatus {
  /** @format int32 */
  code?: number;
  details?: ProtobufAny[];
  message?: string;
}

export interface TestingV1GetRoomResponse {
  item: V1TestingRoom;
}

/**
 * Represents a whole or partial calendar date, such as a birthday. The time of
 * day and time zone are either specified elsewhere or are insignificant. The
 * date is relative to the Gregorian Calendar. This can represent one of the
 * following:
 * * A full date, with non-zero year, month, and day values
 * * A month and day value, with a zero year, such as an anniversary
 * * A year on its own, with zero month and day values
 * * A year and month value, with a zero day, such as a credit card expiration
 * date
 *
 * Related types are [google.type.TimeOfDay][google.type.TimeOfDay] and
 * `google.protobuf.Timestamp`.
 */
export interface TypeDate {
  /**
   * Day of a month. Must be from 1 to 31 and valid for the year and month, or 0
   * to specify a year by itself or a year and month where the day isn't
   * significant.
   * @format int32
   */
  day: number;
  /**
   * Month of a year. Must be from 1 to 12, or 0 to specify a year without a
   * month and day.
   * @format int32
   */
  month: number;
  /**
   * Year of the date. Must be from 1 to 9999, or 0 to specify a date without
   * a year.
   * @format int32
   */
  year: number;
}

export interface V1AccountTenant {
  email: string;
  id: string;
  isBlocked: boolean;
  isConfirmed: boolean;
  isEmailVerified: boolean;
  /** @format date-time */
  lastLoginAt?: string;
  /** @format date-time */
  lastRequestAt?: string;
  profileName: string;
  profilePhotos?: V1AccountTenantPhotoFiles;
  profileSurname: string;
  /** @format uint64 */
  roleId: string;
  tenantId: string;
  /** @format int64 */
  version: string;
}

export interface V1AccountTenantPhotoFiles {
  originalFile?: V1File;
  s100x100File?: V1File;
}

export interface V1AccountVerifyEmailRequest {
  code: string;
  codeId: string;
}

export type V1AccountVerifyEmailResponse = object;

export interface V1AnswerValue {
  boolValue?: boolean;
  /** @format double */
  doubleValue?: number;
  /** @format int64 */
  intValue?: string;
  stringValue?: string;
}

export interface V1Answers {
  data?: Record<string, V1AnswerValue>;
}

export interface V1Candidate {
  /**
   * * A full date, with non-zero year, month, and day values
   * * A month and day value, with a zero year, such as an anniversary
   * * A year on its own, with zero month and day values
   * * A year and month value, with a zero day, such as a credit card expiration
   * date
   *
   * Related types are [google.type.TimeOfDay][google.type.TimeOfDay] and
   * `google.protobuf.Timestamp`.
   */
  birthday?: TypeDate;
  gender: V1Gender;
  id: string;
  name: string;
  resumeFile?: V1File;
  surname: string;
  tenantId: string;
  /** @format int64 */
  version: string;
}

export interface V1CheckAccountCodeRequest {
  code: string;
  id: string;
}

export type V1CheckAccountCodeResponse = object;

export type V1CheckRegistrationResponse = object;

export interface V1CreateAccountRequest {
  payload: V1CreateAccountRequestPayload;
}

export interface V1CreateAccountRequestPayload {
  email: string;
  password: string;
  profileName: string;
  profilePhotos?: V1CreateAccountRequestPayloadPhotoFiles;
  profileSurname: string;
  /** @format uint64 */
  roleId: string;
}

export interface V1CreateAccountRequestPayloadPhotoFiles {
  originalFileId?: string;
  s100x100FileId?: string;
}

export interface V1CreateAccountResponse {
  item: V1AccountTenant;
}

export interface V1CreateCandidateRequest {
  payload: V1CreateCandidateRequestPayload;
}

export interface V1CreateCandidateRequestPayload {
  birthday: V1OptionalDate;
  gender: V1Gender;
  name: string;
  resumeFiles?: V1CreateCandidateRequestPayloadResumeFiles;
  surname: string;
}

export interface V1CreateCandidateRequestPayloadResumeFiles {
  fileId?: string;
}

export interface V1CreateCandidateResponse {
  item: V1Candidate;
}

export interface V1CreateProfileRequest {
  payload: V1CreateProfileRequestPayload;
}

export interface V1CreateProfileRequestPayload {
  description: string;
  name: string;
  personalityTraits: V1ProfilePersonalityTraitsMap;
}

export interface V1CreateProfileResponse {
  item: V1TestingProfile;
}

export interface V1CreateRoomRequest {
  payload: V1CreateRoomRequestPayload;
}

export interface V1CreateRoomRequestPayload {
  candidateId: string;
  profileId: string;
}

export interface V1CreateRoomResponse {
  item: V1TestingRoom;
}

export type V1DeleteCandidateResponse = object;

export type V1DeleteProfileResponse = object;

export type V1DeleteRoomResponse = object;

export interface V1File {
  filename?: string;
  id?: string;
  url: string;
}

export interface V1FilesMap {
  map?: Record<string, V1File>;
}

export interface V1FinishRegistrationRequest {
  id: string;
  payload: V1FinishRegistrationRequestPayload;
}

export interface V1FinishRegistrationRequestPayload {
  profileName: string;
  profileSurname: string;
  tenantTextId: string;
}

export interface V1FinishRegistrationResponse {
  id: string;
  textId: string;
  url: string;
}

export interface V1FinishRoomRequestPayload {
  answers: V1Answers;
}

export type V1FinishRoomResponse = object;

export interface V1GenerateProfileDescriptionByNameResponse {
  description: string;
}

export interface V1GenerateProfileTraitsMapByDescriptionResponse {
  traits: V1ProfilePersonalityTraitsMap;
}

export interface V1GetAccountResponse {
  item: V1AccountTenant;
}

export interface V1GetCandidateResponse {
  item: V1Candidate;
}

export interface V1GetPersonalityTraitsResponse {
  items?: V1PersonalityTrait[];
}

export interface V1GetProfileResponse {
  item: V1TestingProfile;
}

export type V1IsExistsResponse = object;

export interface V1ListAccountsResponse {
  items?: V1AccountTenant[];
  /** @format int32 */
  total: number;
}

export interface V1ListCandidate {
  /**
   * * A full date, with non-zero year, month, and day values
   * * A month and day value, with a zero year, such as an anniversary
   * * A year on its own, with zero month and day values
   * * A year and month value, with a zero day, such as a credit card expiration
   * date
   *
   * Related types are [google.type.TimeOfDay][google.type.TimeOfDay] and
   * `google.protobuf.Timestamp`.
   */
  birthday?: TypeDate;
  gender: V1Gender;
  id: string;
  name: string;
  surname: string;
  tenantId: string;
  /** @format int64 */
  version: string;
}

export interface V1ListCandidatesResponse {
  items?: V1ListCandidate[];
  /** @format int32 */
  total: number;
}

export interface V1ListProfilesResponse {
  items?: V1TestingListProfile[];
  /** @format int32 */
  total: number;
}

export interface V1ListRoomsResponse {
  items?: V1TestingListRoom[];
  /** @format int32 */
  total: number;
}

export interface V1LoginRequest {
  email: string;
  password: string;
  tenantTextId: string;
}

export interface V1LoginResponse {
  account: V1AccountTenant;
  tenant: V1Tenant;
  tokens: V1Tokens;
}

export type V1LogoutRequest = object;

export type V1LogoutResponse = object;

export interface V1OptionalDate {
  /**
   * * A full date, with non-zero year, month, and day values
   * * A month and day value, with a zero year, such as an anniversary
   * * A year on its own, with zero month and day values
   * * A year and month value, with a zero day, such as a credit card expiration
   * date
   *
   * Related types are [google.type.TimeOfDay][google.type.TimeOfDay] and
   * `google.protobuf.Timestamp`.
   */
  date?: TypeDate;
}

export interface V1PatchAccountRequestPayload {
  isBlocked?: boolean;
  password?: string;
  profileName?: string;
  profilePhotos?: V1PatchAccountRequestPayloadPhotoFiles;
  profilePhotosClear?: boolean;
  profileSurname?: string;
  /** @format uint64 */
  roleId?: string;
}

export interface V1PatchAccountRequestPayloadPhotoFiles {
  originalFileId?: string;
  s100x100FileId?: string;
}

export type V1PatchAccountResponse = object;

export interface V1PatchCandidateRequestPayload {
  birthday?: V1OptionalDate;
  gender?: V1Gender;
  name?: string;
  resumeFiles?: V1PatchCandidateRequestPayloadResumeFiles;
  resumeFilesClear?: boolean;
  surname?: string;
}

export interface V1PatchCandidateRequestPayloadResumeFiles {
  fileId?: string;
}

export type V1PatchCandidateResponse = object;

export interface V1PatchProfileRequestPayload {
  description?: string;
  name?: string;
  personalityTraits?: V1ProfilePersonalityTraitsMap;
}

export type V1PatchProfileResponse = object;

export interface V1PatchTenantRequestPayload {
  name?: string;
}

export type V1PatchTenantResponse = object;

export interface V1PersonalityTrait {
  description: string;
  /** @format uint64 */
  id: string;
  leftStateName: string;
  name: string;
  rightStateName: string;
  type: V1PersonalityTraitType;
}

export interface V1ProfilePersonalityTraitsMap {
  map?: Record<string, V1ProfilePersonalityTraitsMapItem>;
}

export interface V1ProfilePersonalityTraitsMapItem {
  priority: V1PersonalityTraitPriority;
  /** @format int32 */
  target: number;
}

export interface V1RefreshRequest {
  refreshToken: string;
}

export interface V1RefreshResponse {
  tokens: V1Tokens;
}

export interface V1RequestPasswordRecoveryRequest {
  email: string;
  tenantTextId: string;
}

export interface V1RequestPasswordRecoveryResponse {
  codeId: string;
}

export interface V1Room {
  candidate: V1RoomCandidate;
  id: string;
  status: V1RoomStatus;
  techniqueData?: V1RoomTechniqueItem[];
  tenantName: string;
}

export interface V1RoomCandidate {
  candidateName: string;
}

export interface V1RoomTechniqueItem {
  question: string;
  type: V1TechniqueItemType;
  variants?: string[];
}

export interface V1StartRegistrationRequest {
  email: string;
}

export type V1StartRegistrationResponse = object;

export interface V1Tenant {
  id: string;
  name: string;
  textId: string;
  /** @format int64 */
  version: string;
}

export interface V1TestingListProfile {
  id: string;
  name: string;
  tenantId: string;
  /** @format int64 */
  version: string;
}

export interface V1TestingListRoom {
  candidate?: V1TestingRoomCandidate;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  finishedAt?: string;
  id: string;
  profile?: V1TestingRoomProfile;
  /** @format int32 */
  resultIndex?: number;
  status: V1RoomStatus;
  tenantId: string;
  /** @format int64 */
  version: string;
}

export interface V1TestingProfile {
  description: string;
  id: string;
  name: string;
  personalityTraits: V1ProfilePersonalityTraitsMap;
  tenantId: string;
  /** @format int64 */
  version: string;
}

export interface V1TestingRoom {
  candidate?: V1TestingRoomCandidate;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  finishedAt?: string;
  id: string;
  personalityTraits: V1ProfilePersonalityTraitsMap;
  profile?: V1TestingRoomProfile;
  result?: V1TestingRoomResult;
  /** @format int32 */
  resultIndex?: number;
  status: V1RoomStatus;
  tenantId: string;
  /** @format int64 */
  version: string;
}

export interface V1TestingRoomCandidate {
  id: string;
  name: string;
  surname: string;
}

export interface V1TestingRoomProfile {
  id: string;
  name: string;
}

export interface V1TestingRoomResult {
  /** @format float */
  totalMatch: number;
  totalMatchTip: string;
  traits?: Record<string, V1TestingRoomResultTrait>;
}

export interface V1TestingRoomResultTrait {
  /** @format float */
  match: number;
  tip: string;
}

export interface V1Tokens {
  accessJwt: string;
  refreshJwt: string;
  /** @format int32 */
  refreshLifeSec: number;
}

export interface V1UpdateMyPasswordRequest {
  payload: V1UpdateMyPasswordRequestPayload;
}

export interface V1UpdateMyPasswordRequestPayload {
  currentPassword: string;
  newPassword: string;
  newPassword2: string;
}

export type V1UpdateMyPasswordResponse = object;

export interface V1UpdateMyProfileRequest {
  payload: V1UpdateMyProfileRequestPayload;
  skipVersionCheck: boolean;
  /** @format int64 */
  version: string;
}

export interface V1UpdateMyProfileRequestPayload {
  profileName: string;
  profilePhotos?: V1UpdateMyProfileRequestPayloadPhotoFiles;
  profilePhotosClear?: boolean;
  profileSurname: string;
}

export interface V1UpdateMyProfileRequestPayloadPhotoFiles {
  originalFileId?: string;
  s100x100FileId?: string;
}

export type V1UpdateMyProfileResponse = object;

export interface V1UpdatePasswordByCodeRequest {
  code: string;
  id: string;
  password: string;
  password2: string;
}

export type V1UpdatePasswordByCodeResponse = object;

export interface V1UploadCandidateResumeFileRequest {
  /** @format byte */
  file: Blob;
  filename: string;
}

export interface V1UploadCandidateResumeFileResponse {
  data: V1FilesMap;
}

export interface V1UploadProfilePhotoFileRequest {
  /** @format byte */
  file: Blob;
  filename: string;
}

export interface V1UploadProfilePhotoFileResponse {
  data: V1FilesMap;
}

export interface V1WhoIAmResponse {
  account: V1AccountTenant;
  tenant: V1Tenant;
}

import { ApiError, tryToCatchApiErrors } from "~/shared/errors/errors";

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  secure?: boolean;
  path: string;
  type?: ContentType;
  query?: QueryParamsType;
  format?: ResponseFormat;
  body?: unknown;
  baseUrl?: string;
  cancelToken?: CancelToken;
  fetch?: typeof $fetch;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof $fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> {
  data: D | null;
  error: E | null;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private customFetch: typeof $fetch = (...args: Parameters<typeof $fetch>) =>
    $fetch(...args);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    fetch,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];

    const url = `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`;

    const fetchOptions: Parameters<typeof $fetch>[1] = {
      ...requestParams,
      responseType: "json",
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData
          ? { "Content-Type": type }
          : {}),
      },
      signal: (cancelToken ? requestParams.signal : undefined) || undefined,
      body:
        typeof body === "undefined" || body === null
          ? undefined
          : payloadFormatter(body),
    };

    try {
      const activeFetch = fetch || this.customFetch;
      const data = await activeFetch<T>(url, fetchOptions);

      if (false) throw data; // placeholder for error check
      return { data: data ?? null, error: null };
    } catch (e: any) {
      const err = tryToCatchApiErrors(e);
      if (err instanceof ApiError) {
        return { data: null, error: err };
      }
      throw e;
    }
  };
}

/**
 * @title Backend public API
 * @version 1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  v1 = {
    /**
     * No description
     *
     * @tags CrmPublicService
     * @name CrmPublicServiceListCandidates
     * @summary Список кандидатов
     * @request GET:/v1/crm/candidates
     * @secure
     */
    crmPublicServiceListCandidates: (
      query?: {
        /** @format uint64 */
        limit?: string;
        /** @format uint64 */
        offset?: string;
        searchQuery?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<V1ListCandidatesResponse, ApiError>({
        path: `/v1/crm/candidates`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CrmPublicService
     * @name CrmPublicServiceCreateCandidate
     * @summary Создать кандидата
     * @request POST:/v1/crm/candidates
     * @secure
     */
    crmPublicServiceCreateCandidate: (
      body: V1CreateCandidateRequest,
      params: RequestParams = {},
    ) =>
      this.request<V1CreateCandidateResponse, ApiError>({
        path: `/v1/crm/candidates`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CrmPublicService
     * @name CrmPublicServiceUploadCandidateResumeFile
     * @summary Загрузить файл-резюме кандидата
     * @request POST:/v1/crm/candidates-resume
     * @secure
     */
    crmPublicServiceUploadCandidateResumeFile: (
      data: {
        /**
         * File to upload
         * @format binary
         */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<V1UploadCandidateResumeFileResponse, ApiError>({
        path: `/v1/crm/candidates-resume`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CrmPublicService
     * @name CrmPublicServiceDeleteCandidate
     * @summary Удалить кандидата
     * @request DELETE:/v1/crm/candidates/{id}
     * @secure
     */
    crmPublicServiceDeleteCandidate: (id: string, params: RequestParams = {}) =>
      this.request<V1DeleteCandidateResponse, ApiError>({
        path: `/v1/crm/candidates/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CrmPublicService
     * @name CrmPublicServiceGetCandidate
     * @summary Получить кандидата
     * @request GET:/v1/crm/candidates/{id}
     * @secure
     */
    crmPublicServiceGetCandidate: (id: string, params: RequestParams = {}) =>
      this.request<V1GetCandidateResponse, ApiError>({
        path: `/v1/crm/candidates/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CrmPublicService
     * @name CrmPublicServicePatchCandidate
     * @summary Обновить кандидата
     * @request PATCH:/v1/crm/candidates/{id}
     * @secure
     */
    crmPublicServicePatchCandidate: (
      id: string,
      body: CrmPublicServicePatchCandidateBody,
      params: RequestParams = {},
    ) =>
      this.request<V1PatchCandidateResponse, ApiError>({
        path: `/v1/crm/candidates/${id}`,
        method: "PATCH",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags RegistrationPublicService
     * @name RegistrationPublicServiceFinishRegistration
     * @summary Закончить регистрацию
     * @request POST:/v1/registration/finish
     */
    registrationPublicServiceFinishRegistration: (
      body: V1FinishRegistrationRequest,
      params: RequestParams = {},
    ) =>
      this.request<V1FinishRegistrationResponse, ApiError>({
        path: `/v1/registration/finish`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags RegistrationPublicService
     * @name RegistrationPublicServiceStartRegistration
     * @summary Начать регистрацию
     * @request POST:/v1/registration/start
     */
    registrationPublicServiceStartRegistration: (
      body: V1StartRegistrationRequest,
      params: RequestParams = {},
    ) =>
      this.request<V1StartRegistrationResponse, ApiError>({
        path: `/v1/registration/start`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags RegistrationPublicService
     * @name RegistrationPublicServiceCheckRegistration
     * @summary Проверить регистрацию
     * @request GET:/v1/registration/{id}
     */
    registrationPublicServiceCheckRegistration: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<V1CheckRegistrationResponse, ApiError>({
        path: `/v1/registration/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags RoomsPublicService
     * @name RoomsPublicServiceGetRoom
     * @summary Получить комнату
     * @request GET:/v1/rooms/{id}
     */
    roomsPublicServiceGetRoom: (id: string, params: RequestParams = {}) =>
      this.request<RoomsV1GetRoomResponse, ApiError>({
        path: `/v1/rooms/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags RoomsPublicService
     * @name RoomsPublicServiceFinishRoom
     * @summary Завершить комнату
     * @request POST:/v1/rooms/{id}/finish
     */
    roomsPublicServiceFinishRoom: (
      id: string,
      body: RoomsPublicServiceFinishRoomBody,
      params: RequestParams = {},
    ) =>
      this.request<V1FinishRoomResponse, ApiError>({
        path: `/v1/rooms/${id}/finish`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthTenantPublicService
     * @name AuthTenantPublicServiceCheckAccountCode
     * @summary Проверить код аккаунта
     * @request POST:/v1/tenant/auth/check-code
     */
    authTenantPublicServiceCheckAccountCode: (
      body: V1CheckAccountCodeRequest,
      params: RequestParams = {},
    ) =>
      this.request<V1CheckAccountCodeResponse, ApiError>({
        path: `/v1/tenant/auth/check-code`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthTenantPublicService
     * @name AuthTenantPublicServiceLogin
     * @summary Login
     * @request POST:/v1/tenant/auth/login
     */
    authTenantPublicServiceLogin: (
      body: V1LoginRequest,
      params: RequestParams = {},
    ) =>
      this.request<V1LoginResponse, ApiError>({
        path: `/v1/tenant/auth/login`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthTenantPublicService
     * @name AuthTenantPublicServiceLogout
     * @summary Logout
     * @request POST:/v1/tenant/auth/logout
     * @secure
     */
    authTenantPublicServiceLogout: (
      body: V1LogoutRequest,
      params: RequestParams = {},
    ) =>
      this.request<V1LogoutResponse, ApiError>({
        path: `/v1/tenant/auth/logout`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthTenantPublicService
     * @name AuthTenantPublicServiceUpdatePasswordByCode
     * @summary Обновить пароль по коду
     * @request POST:/v1/tenant/auth/password-by-code
     */
    authTenantPublicServiceUpdatePasswordByCode: (
      body: V1UpdatePasswordByCodeRequest,
      params: RequestParams = {},
    ) =>
      this.request<V1UpdatePasswordByCodeResponse, ApiError>({
        path: `/v1/tenant/auth/password-by-code`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthTenantPublicService
     * @name AuthTenantPublicServiceRequestPasswordRecovery
     * @summary Запрос на восстановление пароля
     * @request POST:/v1/tenant/auth/password-recovery
     */
    authTenantPublicServiceRequestPasswordRecovery: (
      body: V1RequestPasswordRecoveryRequest,
      params: RequestParams = {},
    ) =>
      this.request<V1RequestPasswordRecoveryResponse, ApiError>({
        path: `/v1/tenant/auth/password-recovery`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthTenantPublicService
     * @name AuthTenantPublicServiceRefresh
     * @summary Refresh
     * @request POST:/v1/tenant/auth/refresh
     */
    authTenantPublicServiceRefresh: (
      body: V1RefreshRequest,
      params: RequestParams = {},
    ) =>
      this.request<V1RefreshResponse, ApiError>({
        path: `/v1/tenant/auth/refresh`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthTenantPublicService
     * @name AuthTenantPublicServiceAccountVerifyEmail
     * @summary Верификация аккаунта по емаил
     * @request POST:/v1/tenant/auth/verify-email
     */
    authTenantPublicServiceAccountVerifyEmail: (
      body: V1AccountVerifyEmailRequest,
      params: RequestParams = {},
    ) =>
      this.request<V1AccountVerifyEmailResponse, ApiError>({
        path: `/v1/tenant/auth/verify-email`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthTenantPublicService
     * @name AuthTenantPublicServiceWhoIAm
     * @summary WhoIAm
     * @request GET:/v1/tenant/auth/whoiam
     * @secure
     */
    authTenantPublicServiceWhoIAm: (params: RequestParams = {}) =>
      this.request<V1WhoIAmResponse, ApiError>({
        path: `/v1/tenant/auth/whoiam`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TenantPublicService
     * @name TenantPublicServiceIsExists
     * @summary Проверка на существование
     * @request GET:/v1/tenant/is-exists/{textId}
     */
    tenantPublicServiceIsExists: (textId: string, params: RequestParams = {}) =>
      this.request<V1IsExistsResponse, ApiError>({
        path: `/v1/tenant/is-exists/${textId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UsersTenantPublicService
     * @name UsersTenantPublicServiceListAccounts
     * @summary Список аккаунтов
     * @request GET:/v1/tenant/users
     * @secure
     */
    usersTenantPublicServiceListAccounts: (
      query?: {
        /** @format uint64 */
        limit?: string;
        /** @format uint64 */
        offset?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<V1ListAccountsResponse, ApiError>({
        path: `/v1/tenant/users`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UsersTenantPublicService
     * @name UsersTenantPublicServiceCreateAccount
     * @summary Создать аккаунт
     * @request POST:/v1/tenant/users
     * @secure
     */
    usersTenantPublicServiceCreateAccount: (
      body: V1CreateAccountRequest,
      params: RequestParams = {},
    ) =>
      this.request<V1CreateAccountResponse, ApiError>({
        path: `/v1/tenant/users`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UsersTenantPublicService
     * @name UsersTenantPublicServiceUpdateMyPassword
     * @summary Обновить мой пароль
     * @request PUT:/v1/tenant/users/my-password
     * @secure
     */
    usersTenantPublicServiceUpdateMyPassword: (
      body: V1UpdateMyPasswordRequest,
      params: RequestParams = {},
    ) =>
      this.request<V1UpdateMyPasswordResponse, ApiError>({
        path: `/v1/tenant/users/my-password`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UsersTenantPublicService
     * @name UsersTenantPublicServiceUpdateMyProfile
     * @summary Обновить мой профиль
     * @request PUT:/v1/tenant/users/my-profile
     * @secure
     */
    usersTenantPublicServiceUpdateMyProfile: (
      body: V1UpdateMyProfileRequest,
      params: RequestParams = {},
    ) =>
      this.request<V1UpdateMyProfileResponse, ApiError>({
        path: `/v1/tenant/users/my-profile`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UsersTenantPublicService
     * @name UsersTenantPublicServiceUploadProfilePhotoFile
     * @summary Загрузить фотографию профиля
     * @request POST:/v1/tenant/users/profile-photo
     * @secure
     */
    usersTenantPublicServiceUploadProfilePhotoFile: (
      data: {
        /**
         * File to upload
         * @format binary
         */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<V1UploadProfilePhotoFileResponse, ApiError>({
        path: `/v1/tenant/users/profile-photo`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UsersTenantPublicService
     * @name UsersTenantPublicServiceGetAccount
     * @summary Получить аккаунт
     * @request GET:/v1/tenant/users/{id}
     * @secure
     */
    usersTenantPublicServiceGetAccount: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<V1GetAccountResponse, ApiError>({
        path: `/v1/tenant/users/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UsersTenantPublicService
     * @name UsersTenantPublicServicePatchAccount
     * @summary Обновить аккаунт
     * @request PATCH:/v1/tenant/users/{id}
     * @secure
     */
    usersTenantPublicServicePatchAccount: (
      id: string,
      body: UsersTenantPublicServicePatchAccountBody,
      params: RequestParams = {},
    ) =>
      this.request<V1PatchAccountResponse, ApiError>({
        path: `/v1/tenant/users/${id}`,
        method: "PATCH",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TenantPublicService
     * @name TenantPublicServicePatchTenant
     * @summary Обновление тенанта
     * @request PATCH:/v1/tenant/{id}
     * @secure
     */
    tenantPublicServicePatchTenant: (
      id: string,
      body: TenantPublicServicePatchTenantBody,
      params: RequestParams = {},
    ) =>
      this.request<V1PatchTenantResponse, ApiError>({
        path: `/v1/tenant/${id}`,
        method: "PATCH",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TestingPublicService
     * @name TestingPublicServiceGetPersonalityTraits
     * @summary Получить список метрик
     * @request GET:/v1/testing/personality_traits
     * @secure
     */
    testingPublicServiceGetPersonalityTraits: (params: RequestParams = {}) =>
      this.request<V1GetPersonalityTraitsResponse, ApiError>({
        path: `/v1/testing/personality_traits`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TestingPublicService
     * @name TestingPublicServiceListProfiles
     * @summary Список профилей профессий
     * @request GET:/v1/testing/profiles
     * @secure
     */
    testingPublicServiceListProfiles: (
      query?: {
        /** @format uint64 */
        limit?: string;
        /** @format uint64 */
        offset?: string;
        searchQuery?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<V1ListProfilesResponse, ApiError>({
        path: `/v1/testing/profiles`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TestingPublicService
     * @name TestingPublicServiceCreateProfile
     * @summary Создать профиль профессии
     * @request POST:/v1/testing/profiles
     * @secure
     */
    testingPublicServiceCreateProfile: (
      body: V1CreateProfileRequest,
      params: RequestParams = {},
    ) =>
      this.request<V1CreateProfileResponse, ApiError>({
        path: `/v1/testing/profiles`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TestingPublicService
     * @name TestingPublicServiceGenerateProfileDescriptionByName
     * @request POST:/v1/testing/profiles/generate-profile-description-by-name
     * @secure
     */
    testingPublicServiceGenerateProfileDescriptionByName: (
      query: {
        name: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<V1GenerateProfileDescriptionByNameResponse, ApiError>({
        path: `/v1/testing/profiles/generate-profile-description-by-name`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TestingPublicService
     * @name TestingPublicServiceGenerateProfileTraitsMapByDescription
     * @request POST:/v1/testing/profiles/generate-profile-traits-map-by-description
     * @secure
     */
    testingPublicServiceGenerateProfileTraitsMapByDescription: (
      query: {
        name: string;
        description: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<V1GenerateProfileTraitsMapByDescriptionResponse, ApiError>({
        path: `/v1/testing/profiles/generate-profile-traits-map-by-description`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TestingPublicService
     * @name TestingPublicServiceDeleteProfile
     * @summary Удалить профиль профессии
     * @request DELETE:/v1/testing/profiles/{id}
     * @secure
     */
    testingPublicServiceDeleteProfile: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<V1DeleteProfileResponse, ApiError>({
        path: `/v1/testing/profiles/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TestingPublicService
     * @name TestingPublicServiceGetProfile
     * @summary Получить профиль профессии
     * @request GET:/v1/testing/profiles/{id}
     * @secure
     */
    testingPublicServiceGetProfile: (id: string, params: RequestParams = {}) =>
      this.request<V1GetProfileResponse, ApiError>({
        path: `/v1/testing/profiles/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TestingPublicService
     * @name TestingPublicServicePatchProfile
     * @summary Обновить профиль профессии
     * @request PATCH:/v1/testing/profiles/{id}
     * @secure
     */
    testingPublicServicePatchProfile: (
      id: string,
      body: TestingPublicServicePatchProfileBody,
      params: RequestParams = {},
    ) =>
      this.request<V1PatchProfileResponse, ApiError>({
        path: `/v1/testing/profiles/${id}`,
        method: "PATCH",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TestingPublicService
     * @name TestingPublicServiceListRooms
     * @summary Список комнат
     * @request GET:/v1/testing/rooms
     * @secure
     */
    testingPublicServiceListRooms: (
      query?: {
        /** @format uint64 */
        limit?: string;
        /** @format uint64 */
        offset?: string;
        /** @default "LIST_ROOM_SORT_UNSPECIFIED" */
        sort?:
          | "LIST_ROOM_SORT_UNSPECIFIED"
          | "LIST_ROOM_SORT_CREATED_AT"
          | "LIST_ROOM_SORT_FINISHED_AT"
          | "LIST_ROOM_SORT_RESULT_INDEX";
        filterCandidateId?: string;
        filterProfileId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<V1ListRoomsResponse, ApiError>({
        path: `/v1/testing/rooms`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TestingPublicService
     * @name TestingPublicServiceCreateRoom
     * @summary Создать комнату
     * @request POST:/v1/testing/rooms
     * @secure
     */
    testingPublicServiceCreateRoom: (
      body: V1CreateRoomRequest,
      params: RequestParams = {},
    ) =>
      this.request<V1CreateRoomResponse, ApiError>({
        path: `/v1/testing/rooms`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TestingPublicService
     * @name TestingPublicServiceDeleteRoom
     * @summary Удалить комнату
     * @request DELETE:/v1/testing/rooms/{id}
     * @secure
     */
    testingPublicServiceDeleteRoom: (id: string, params: RequestParams = {}) =>
      this.request<V1DeleteRoomResponse, ApiError>({
        path: `/v1/testing/rooms/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TestingPublicService
     * @name TestingPublicServiceGetRoom
     * @summary Получить комнату
     * @request GET:/v1/testing/rooms/{id}
     * @secure
     */
    testingPublicServiceGetRoom: (id: string, params: RequestParams = {}) =>
      this.request<TestingV1GetRoomResponse, ApiError>({
        path: `/v1/testing/rooms/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
