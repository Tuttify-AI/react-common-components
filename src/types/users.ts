export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  //eslint-disable-next-line
  DateTime: any;
  //eslint-disable-next-line
  JSONObject: any;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean'];
  after?: Maybe<Scalars['String']>;
};

export type DifficultyLevelType = {
  __typename?: 'DifficultyLevelType';
  level: Scalars['Int'];
  text: Scalars['String'];
};

export type AgeGroupType = {
  __typename?: 'AgeGroupType';
  id: Scalars['Int'];
  name: Scalars['String'];
  min_age: Scalars['Int'];
  max_age: Scalars['Int'];
};

export type FeaturesType = {
  __typename?: 'FeaturesType';
  family_members: Scalars['Boolean'];
  phone_verification: Scalars['Boolean'];
  development: Scalars['Boolean'];
};

export type AppFeaturesType = {
  __typename?: 'AppFeaturesType';
  invite_family_member: Scalars['Boolean'];
  schedule_session: Scalars['Boolean'];
  app_subscription: Scalars['Boolean'];
  payout_for_content: Scalars['Boolean'];
};

export type OrganizationModel = ITimestampModel & {
  __typename?: 'OrganizationModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  status: OrganizationStatus;
  domain: Scalars['String'];
  features?: Maybe<FeaturesType>;
  categories?: Maybe<Array<Scalars['JSONObject']>>;
  difficulty_levels: Array<DifficultyLevelType>;
  age_groups: Array<AgeGroupType>;
  app_features: AppFeaturesType;
  coin_to_usd_rate: Scalars['Float'];
  default_group_session_rate: Scalars['Float'];
  default_private_session_rate: Scalars['Float'];
};

export type ITimestampModel = {
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
};

export enum OrganizationStatus {
  Pending = 'pending',
  Active = 'active',
  Inactive = 'inactive',
}

export type Address = {
  __typename?: 'Address';
  address_line1?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  state?: Maybe<State>;
  zip?: Maybe<Scalars['String']>;
  country?: Maybe<Country>;
};

export enum State {
  Al = 'al',
  Ak = 'ak',
  Az = 'az',
  Ar = 'ar',
  Ca = 'ca',
  Co = 'co',
  Ct = 'ct',
  De = 'de',
  Fl = 'fl',
  Ga = 'ga',
  Hi = 'hi',
  Id = 'id',
  Il = 'il',
  In = 'in',
  Ia = 'ia',
  Ks = 'ks',
  Ky = 'ky',
  La = 'la',
  Me = 'me',
  Md = 'md',
  Ma = 'ma',
  Mi = 'mi',
  Mn = 'mn',
  Ms = 'ms',
  Mo = 'mo',
  Mt = 'mt',
  Ne = 'ne',
  Nv = 'nv',
  Nh = 'nh',
  Nj = 'nj',
  Nm = 'nm',
  Ny = 'ny',
  Nc = 'nc',
  Nd = 'nd',
  Oh = 'oh',
  Ok = 'ok',
  Or = 'or',
  Pa = 'pa',
  Ri = 'ri',
  Sc = 'sc',
  Sd = 'sd',
  Tn = 'tn',
  Tx = 'tx',
  Ut = 'ut',
  Vt = 'vt',
  Va = 'va',
  Wa = 'wa',
  Wv = 'wv',
  Wi = 'wi',
  Wy = 'wy',
}

export enum Country {
  Usa = 'USA',
  Canada = 'Canada',
  China = 'China',
  Russia = 'Russia',
  India = 'India',
  Japan = 'Japan',
  Australia = 'Australia',
  Ukraine = 'Ukraine',
}

export type Member = {
  __typename?: 'Member';
  id: UserModel;
  joined_at: Scalars['DateTime'];
  child_access?: Maybe<Scalars['Boolean']>;
};

export type UserGroupModel = IUserRelationModel & {
  __typename?: 'UserGroupModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  created_by: Scalars['String'];
  last_updated_by?: Maybe<Scalars['String']>;
  org_id?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  room_id?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  image_url?: Maybe<Scalars['String']>;
  group_type: GroupType;
  is_active?: Maybe<Scalars['Boolean']>;
  visibility?: Maybe<Scalars['String']>;
  topic?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Scalars['String']>>;
  tag_text?: Maybe<Array<Scalars['String']>>;
  members: Array<Member>;
  admins: Array<Scalars['String']>;
};

export type IUserRelationModel = {
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  created_by?: Maybe<Scalars['String']>;
  last_updated_by?: Maybe<Scalars['String']>;
  org_id?: Maybe<Scalars['String']>;
};

export enum GroupType {
  Tutor = 'tutor',
  Study = 'study',
  Family = 'family',
  Classroom = 'classroom',
}

export type RoleModel = IUserRelationModel & {
  __typename?: 'RoleModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  created_by?: Maybe<Scalars['String']>;
  last_updated_by?: Maybe<Scalars['String']>;
  org_id?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  default_type?: Maybe<DefaultUserType>;
  permissions?: Maybe<Array<DefaultPermissions>>;
};

export enum DefaultUserType {
  Tutor = 'tutor',
  Student = 'student',
  Admin = 'admin',
  SuperAdmin = 'super_admin',
}

export enum DefaultPermissions {
  SwitchOrganization = 'switch_organization',
  ViewAnyOrganization = 'view_any_organization',
  ViewAllOrganizations = 'view_all_organizations',
  ManageAnyOrganization = 'manage_any_organization',
  AddAdminToMyOrganization = 'add_admin_to_my_organization',
  ManageMyOrganization = 'manage_my_organization',
  ManageTutorInvitations = 'manage_tutor_invitations',
  ViewAnyUser = 'view_any_user',
  ViewAllUsers = 'view_all_users',
  ManageAnyUser = 'manage_any_user',
  UpdateUserRole = 'update_user_role',
  ViewRoles = 'view_roles',
  ManageRole = 'manage_role',
  ManageTag = 'manage_tag',
  ManageTopic = 'manage_topic',
  ManageOthers = 'manage_others_content',
  ManageSceneTemplate = 'manage_scene_template',
  ManageGoal = 'manage_goal',
  ManageLanguage = 'manage_language',
  ManageRelationship = 'manage_relationship',
  ManageEducationLevel = 'manage_education_level',
  ManageExperienceYears = 'manage_experience_years',
  ManageFeedbackQuestions = 'manage_feedback_questions',
  ViewFeedbacks = 'view_feedbacks',
  ManagePrivateMediaContent = 'manage_private_media_content',
  UploadMediaToGlobalCollection = 'upload_media_to_global_collection',
  BlockUnblockMedia = 'block_unblock_media',
  ReviewContent = 'review_content',
  CreateContent = 'create_content',
  ManageContent = 'manage_content',
  ManagePayouts = 'manage_payouts',
  ManagePayoutPolicies = 'manage_payout_policies',
  ViewAllAnalytics = 'view_all_analytics',
  ManageGoogleCalendar = 'manage_google_calendar',
}

export type UserModel = IUser & {
  __typename?: 'UserModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  first_name?: Maybe<Scalars['String']>;
  middle_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  phone_verified?: Maybe<Scalars['Boolean']>;
  phone?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['Boolean']>;
  password_set?: Maybe<Scalars['Boolean']>;
  status: UserStatusType;
  profile_image?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<UserGroupModel>>;
  languages?: Maybe<Array<Scalars['ID']>>;
  dob?: Maybe<Scalars['DateTime']>;
  gender?: Maybe<GenderType>;
  address?: Maybe<Address>;
  timezone?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<RoleModel>>;
  org_id?: Maybe<Scalars['String']>;
  google_user_id?: Maybe<Scalars['String']>;
  user_type?: Maybe<Scalars['String']>;
};

export type IUser = {
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  first_name?: Maybe<Scalars['String']>;
  middle_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  phone_verified?: Maybe<Scalars['Boolean']>;
  phone?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['Boolean']>;
  password_set?: Maybe<Scalars['Boolean']>;
  status: UserStatusType;
  profile_image?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<UserGroupModel>>;
  languages?: Maybe<Array<Scalars['ID']>>;
  dob?: Maybe<Scalars['DateTime']>;
  gender?: Maybe<GenderType>;
  address?: Maybe<Address>;
  timezone?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<RoleModel>>;
  org_id?: Maybe<Scalars['String']>;
  google_user_id?: Maybe<Scalars['String']>;
};

export enum UserStatusType {
  Pending = 'pending',
  Active = 'active',
  Deactivated = 'deactivated',
}

export enum GenderType {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export type SubscriptionFeaturesType = {
  __typename?: 'SubscriptionFeaturesType';
  can_add_family_members: Scalars['Boolean'];
  can_have_children: Scalars['Boolean'];
};

export type PromoCodeType = {
  __typename?: 'PromoCodeType';
  stripe_id: Scalars['String'];
  code: Scalars['String'];
  active: Scalars['Boolean'];
  customer: Scalars['String'];
  created?: Maybe<Scalars['Float']>;
  amount_off?: Maybe<Scalars['Float']>;
  currency?: Maybe<Scalars['String']>;
  duration?: Maybe<PromoCodeDurationEnum>;
  max_redemptions?: Maybe<Scalars['Float']>;
  metadata?: Maybe<Scalars['JSONObject']>;
};

export enum PromoCodeDurationEnum {
  Once = 'once',
  Repeating = 'repeating',
  Forever = 'forever',
}

export type UserSubscriptionModel = IUserRelationModel & {
  __typename?: 'UserSubscriptionModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  created_by: Scalars['String'];
  last_updated_by?: Maybe<Scalars['String']>;
  org_id?: Maybe<Scalars['String']>;
  customer_id?: Maybe<Scalars['String']>;
  status: Scalars['String'];
  features?: Maybe<SubscriptionFeaturesType>;
  subscription_id?: Maybe<Scalars['String']>;
  promo_code_id?: Maybe<Scalars['String']>;
  children_count: Scalars['Float'];
  promo_codes?: Maybe<Array<PromoCodeType>>;
};

export type JoinGroupRequestModel = ITimestampModel & {
  __typename?: 'JoinGroupRequestModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  to: Scalars['String'];
  from: Scalars['String'];
  answered_at?: Maybe<Scalars['DateTime']>;
  group_id: Scalars['String'];
  type: JoinGroupRequestType;
  status?: Maybe<Scalars['String']>;
  org_id?: Maybe<Scalars['String']>;
  child_access?: Maybe<Scalars['Boolean']>;
  relationship_to_children_id?: Maybe<Scalars['String']>;
  relationship_to_me_id?: Maybe<Scalars['String']>;
};

export enum JoinGroupRequestType {
  Invitation = 'invitation',
  Request = 'request',
}

export type RelationshipModel = ITimestampModel & {
  __typename?: 'RelationshipModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
};

export type UserRelationshipModel = IUserRelationModel & {
  __typename?: 'UserRelationshipModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  created_by?: Maybe<Scalars['String']>;
  last_updated_by?: Maybe<Scalars['String']>;
  org_id?: Maybe<Scalars['String']>;
  user_id: Scalars['String'];
  relationship_to_me_id?: Maybe<RelationshipModel>;
  relationship_to_children_id: RelationshipModel;
};

export type EducationLevelModel = ITimestampModel & {
  __typename?: 'EducationLevelModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  value: Scalars['String'];
};

export type ExperienceYearsModel = ITimestampModel & {
  __typename?: 'ExperienceYearsModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  value: Scalars['String'];
};

export type GoalModel = ITimestampModel & {
  __typename?: 'GoalModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  text: Scalars['String'];
  created_by?: Maybe<Scalars['ID']>;
};

export type TutorInvitationModel = {
  __typename?: 'TutorInvitationModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  email: Scalars['String'];
  code: Scalars['String'];
  info?: Maybe<Scalars['JSONObject']>;
  org_id: Scalars['String'];
};

export type UserPayloadType = {
  __typename?: 'UserPayloadType';
  user_id: Scalars['ID'];
  org_id?: Maybe<Scalars['ID']>;
  user_type?: Maybe<UserType>;
  first_name: Scalars['String'];
  last_name: Scalars['String'];
};

export enum UserType {
  Tutor = 'tutor',
  Student = 'student',
}

export type SignInOutput = {
  __typename?: 'SignInOutput';
  payload: UserPayloadType;
};

export type SignUpTutorOutput = {
  __typename?: 'SignUpTutorOutput';
  user: UserModel;
  org_name: Scalars['String'];
};

export type StudentModel = IUser & {
  __typename?: 'StudentModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  first_name?: Maybe<Scalars['String']>;
  middle_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  phone_verified?: Maybe<Scalars['Boolean']>;
  phone?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['Boolean']>;
  password_set?: Maybe<Scalars['Boolean']>;
  status: UserStatusType;
  profile_image?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<UserGroupModel>>;
  languages?: Maybe<Array<Scalars['ID']>>;
  dob?: Maybe<Scalars['DateTime']>;
  gender?: Maybe<GenderType>;
  address?: Maybe<Address>;
  timezone?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<RoleModel>>;
  org_id?: Maybe<Scalars['String']>;
  google_user_id?: Maybe<Scalars['String']>;
  primary_account_id?: Maybe<Scalars['String']>;
  invited_by?: Maybe<Scalars['String']>;
  student_type?: Maybe<StudentType>;
  topics?: Maybe<Array<Scalars['String']>>;
  goals?: Maybe<Array<Scalars['String']>>;
};

export enum StudentType {
  Student = 'student',
  Minor = 'minor',
  Adult = 'adult',
  Parent = 'parent',
  FamilyLead = 'family_lead',
}

export type AssignRoleOutput = {
  __typename?: 'AssignRoleOutput';
  id?: Maybe<Scalars['String']>;
  role_id?: Maybe<Scalars['String']>;
};

export type TutorModel = IUser & {
  __typename?: 'TutorModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  first_name?: Maybe<Scalars['String']>;
  middle_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  phone_verified?: Maybe<Scalars['Boolean']>;
  phone?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['Boolean']>;
  password_set?: Maybe<Scalars['Boolean']>;
  status: UserStatusType;
  profile_image?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<UserGroupModel>>;
  languages?: Maybe<Array<Scalars['ID']>>;
  dob?: Maybe<Scalars['DateTime']>;
  gender?: Maybe<GenderType>;
  address?: Maybe<Address>;
  timezone?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<RoleModel>>;
  org_id?: Maybe<Scalars['String']>;
  google_user_id?: Maybe<Scalars['String']>;
  education_level?: Maybe<EducationLevelModel>;
  experience_years?: Maybe<ExperienceYearsModel>;
  certificate?: Maybe<Array<Scalars['String']>>;
  additional_certificates?: Maybe<Array<Scalars['String']>>;
  current_profession?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  hobbies?: Maybe<Array<Scalars['String']>>;
  is_private?: Maybe<Scalars['Boolean']>;
  conference_sessions_enabled?: Maybe<Scalars['Boolean']>;
  private_session_rate?: Maybe<Scalars['Float']>;
  google_refresh_token?: Maybe<Scalars['String']>;
  google_calendar_id?: Maybe<Scalars['String']>;
  sync_sessions_with_google_calendar?: Maybe<Scalars['Boolean']>;
};

export type FindOrCreateUserByEmailOutput = {
  __typename?: 'FindOrCreateUserByEmailOutput';
  user_id: Scalars['String'];
  is_exist: Scalars['Boolean'];
};

export type ProfileCompletionOutput = {
  __typename?: 'ProfileCompletionOutput';
  fields_to_be_filled: Array<Maybe<Scalars['String']>>;
  fill_percentage: Scalars['Float'];
};

export type UserWithPopulatedGroupsOutput = IUser & {
  __typename?: 'UserWithPopulatedGroupsOutput';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  first_name?: Maybe<Scalars['String']>;
  middle_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  phone_verified?: Maybe<Scalars['Boolean']>;
  phone?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['Boolean']>;
  password_set?: Maybe<Scalars['Boolean']>;
  status: UserStatusType;
  profile_image?: Maybe<Scalars['String']>;
  groups: Array<UserGroupModel>;
  languages?: Maybe<Array<Scalars['ID']>>;
  dob?: Maybe<Scalars['DateTime']>;
  gender?: Maybe<GenderType>;
  address?: Maybe<Address>;
  timezone?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<RoleModel>>;
  org_id?: Maybe<Scalars['String']>;
  google_user_id?: Maybe<Scalars['String']>;
  user_type?: Maybe<Scalars['String']>;
};

export type AttachClassroomGroupOutput = {
  __typename?: 'AttachClassroomGroupOutput';
  user: UserWithPopulatedGroupsOutput;
  unique_id: Scalars['String'];
};

export type VerifyUniqueIdOutput = {
  __typename?: 'VerifyUniqueIdOutput';
  user: StudentTutorUnion;
  user_type?: Maybe<UserType>;
};

export type StudentTutorUnion = TutorModel | StudentModel;

export type InviteToFamilyGroupOutput = {
  __typename?: 'InviteToFamilyGroupOutput';
  invitation: JoinGroupRequestModel;
  invitation_link?: Maybe<Scalars['String']>;
};

export type UserWithChildren = {
  __typename?: 'UserWithChildren';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  first_name?: Maybe<Scalars['String']>;
  middle_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  phone_verified?: Maybe<Scalars['Boolean']>;
  phone?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['Boolean']>;
  password_set?: Maybe<Scalars['Boolean']>;
  status: UserStatusType;
  profile_image?: Maybe<Scalars['String']>;
  languages?: Maybe<Array<Scalars['ID']>>;
  dob?: Maybe<Scalars['DateTime']>;
  gender?: Maybe<GenderType>;
  address?: Maybe<Address>;
  timezone?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<RoleModel>>;
  org_id?: Maybe<Scalars['String']>;
  google_user_id?: Maybe<Scalars['String']>;
  primary_account_id?: Maybe<Scalars['String']>;
  invited_by?: Maybe<Scalars['String']>;
  student_type?: Maybe<StudentType>;
  topics?: Maybe<Array<Scalars['String']>>;
  goals?: Maybe<Array<Scalars['String']>>;
  children?: Maybe<Array<StudentModel>>;
};

export type PopulatedMember = {
  __typename?: 'PopulatedMember';
  joined_at: Scalars['DateTime'];
  child_access?: Maybe<Scalars['Boolean']>;
  id: UserWithChildren;
};

export type MyFamilyGroupOutput = {
  __typename?: 'MyFamilyGroupOutput';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  created_by?: Maybe<Scalars['String']>;
  last_updated_by?: Maybe<Scalars['String']>;
  org_id?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  room_id?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  image_url?: Maybe<Scalars['String']>;
  group_type: GroupType;
  is_active?: Maybe<Scalars['Boolean']>;
  visibility?: Maybe<Scalars['String']>;
  topic?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Scalars['String']>>;
  tag_text?: Maybe<Array<Scalars['String']>>;
  admins: Array<Scalars['String']>;
  members: Array<PopulatedMember>;
};

export type UserFamilyGroupInvitationsOutput = {
  __typename?: 'UserFamilyGroupInvitationsOutput';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  answered_at?: Maybe<Scalars['DateTime']>;
  group_id: Scalars['String'];
  type: JoinGroupRequestType;
  status?: Maybe<Scalars['String']>;
  org_id?: Maybe<Scalars['String']>;
  child_access?: Maybe<Scalars['Boolean']>;
  relationship_to_children_id?: Maybe<Scalars['String']>;
  relationship_to_me_id?: Maybe<Scalars['String']>;
  from?: Maybe<StudentModel>;
  to?: Maybe<StudentTutorUnion>;
};

export type UserJoinGroupRequestOutput = {
  __typename?: 'UserJoinGroupRequestOutput';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  answered_at?: Maybe<Scalars['DateTime']>;
  group_id: Scalars['String'];
  type: JoinGroupRequestType;
  status?: Maybe<Scalars['String']>;
  org_id?: Maybe<Scalars['String']>;
  child_access?: Maybe<Scalars['Boolean']>;
  relationship_to_children_id?: Maybe<Scalars['String']>;
  relationship_to_me_id?: Maybe<Scalars['String']>;
  from: UserUnion;
  to: UserUnion;
};

export type UserUnion = TutorModel | StudentModel | UserModel;

export type UserReportModel = IUserRelationModel & {
  __typename?: 'UserReportModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  created_by?: Maybe<Scalars['String']>;
  last_updated_by?: Maybe<Scalars['String']>;
  org_id?: Maybe<Scalars['String']>;
  user_id: UserModel;
  reasons: Array<UserReportReason>;
  description?: Maybe<Scalars['String']>;
  status: UserReportStatus;
};

export enum UserReportReason {
  Spam = 'spam',
  DontLikeIt = 'dont_like_it',
  HateSpeech = 'hate_speech',
  FalseInformation = 'false_information',
  Violence = 'violence',
  Scam = 'scam',
}

export enum UserReportStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export type PayoutAccountModel = ITimestampModel & {
  __typename?: 'PayoutAccountModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  user_id: Scalars['String'];
  connected_account_id: Scalars['String'];
  status: Scalars['String'];
  earnings?: Maybe<Scalars['Float']>;
  org_id: Scalars['String'];
};

export type NotificationPreferenceModel = ITimestampModel & {
  __typename?: 'NotificationPreferenceModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  user_id: Scalars['String'];
  notification_type: NotificationType;
  notification_method: NotificationMethod;
  org_id: Scalars['String'];
};

export enum NotificationType {
  UserHasUpcomingSession = 'user_has_upcoming_session',
}

export enum NotificationMethod {
  Email = 'email',
  Sms = 'sms',
}

export type DifficultyLevelInput = {
  level: Scalars['Int'];
  text: Scalars['String'];
};

export type AgeGroupInput = {
  id: Scalars['Int'];
  name: Scalars['String'];
  min_age: Scalars['Int'];
  max_age: Scalars['Int'];
};

export type FeaturesInput = {
  family_members: Scalars['Boolean'];
  phone_verification: Scalars['Boolean'];
  development: Scalars['Boolean'];
};

export type AppFeaturesInput = {
  invite_family_member: Scalars['Boolean'];
  schedule_session: Scalars['Boolean'];
  app_subscription: Scalars['Boolean'];
  payout_for_content: Scalars['Boolean'];
};

export type SubscriptionFeaturesInput = {
  can_add_family_members: Scalars['Boolean'];
  can_have_children: Scalars['Boolean'];
};

export type PromoCodeInput = {
  stripe_id: Scalars['String'];
  code: Scalars['String'];
  active: Scalars['Boolean'];
  customer: Scalars['String'];
  created?: InputMaybe<Scalars['Float']>;
  amount_off?: InputMaybe<Scalars['Float']>;
  currency?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<PromoCodeDurationEnum>;
  max_redemptions?: InputMaybe<Scalars['Float']>;
  metadata?: InputMaybe<Scalars['JSONObject']>;
};

export type Query = {
  __typename?: 'Query';
  user: UserModel;
  student: StudentModel;
  tutor: TutorModel;
  me: StudentTutorUnion;
  users: PaginatedStudentTutorUnion;
  myGroups: Array<UserGroupModel>;
  myOrganization: OrganizationModel;
  profileCompletion: ProfileCompletionOutput;
  myFamilyGroup: MyFamilyGroupOutput;
  myClassRoomGroup: UserGroupModel;
  groupMembers: Array<Member>;
  group: UserGroupModel;
  groups: PaginatedUserGroupModel;
  groupsCreatedByUser: Array<UserGroupModel>;
  groupsJoinedByUser: Array<UserGroupModel>;
  role: RoleModel;
  roles: Array<RoleModel>;
  organization: OrganizationModel;
  organizationByDomain: OrganizationModel;
  organizations: PaginatedOrganizationModel;
  minorChildren: Array<StudentModel>;
  adultChildren: Array<StudentModel>;
  userPendingJoinGroupRequests: Array<UserJoinGroupRequestOutput>;
  userFamilyGroupInvitations: Array<UserFamilyGroupInvitationsOutput>;
  groupPendingJoinGroupRequests: Array<JoinGroupRequestModel>;
  educationLevels: PaginatedEducationLevelModel;
  experienceYears: PaginatedExperienceYearsModel;
  userRelationship: UserRelationshipModel;
  userRelationships: Array<UserRelationshipModel>;
  relationships: Array<RelationshipModel>;
  relationship: RelationshipModel;
  goals: Array<GoalModel>;
  userReport: UserReportModel;
  userReports: Array<UserReportModel>;
  userReportsCreatedByUser: Array<UserReportModel>;
  payoutAccount?: Maybe<PayoutAccountModel>;
  userSubscription?: Maybe<UserSubscriptionModel>;
  myUserSubscription?: Maybe<UserSubscriptionModel>;
  tutorInvitations: PaginatedTutorInvitationsModel;
  userNotificationPreferences: Array<NotificationPreferenceModel>;
};

export type QueryUserArgs = {
  userInput: UserInput;
};

export type QueryStudentArgs = {
  userInput: UserInput;
};

export type QueryTutorArgs = {
  userInput: UserInput;
};

export type QueryUsersArgs = {
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterUsersInput>;
};

export type QueryGroupMembersArgs = {
  group_id: Scalars['String'];
};

export type QueryGroupArgs = {
  group_id: Scalars['String'];
};

export type QueryGroupsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterGroupsInput>;
};

export type QueryRoleArgs = {
  id: Scalars['String'];
};

export type QueryOrganizationArgs = {
  id: Scalars['String'];
};

export type QueryOrganizationByDomainArgs = {
  domain: Scalars['String'];
};

export type QueryOrganizationsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterOrganizationsInput>;
};

export type QueryUserPendingJoinGroupRequestsArgs = {
  userJoinGroupRequestsInput: UserJoinGroupRequestsInput;
};

export type QueryUserFamilyGroupInvitationsArgs = {
  userFamilyGroupInvitationsInput?: InputMaybe<UserFamilyGroupInvitationsInput>;
};

export type QueryGroupPendingJoinGroupRequestsArgs = {
  joinGroupRequestsInput: JoinGroupRequestsInput;
};

export type QueryEducationLevelsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterEducationLevelsInput>;
};

export type QueryExperienceYearsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterExperienceYearsInput>;
};

export type QueryUserRelationshipArgs = {
  id: Scalars['String'];
};

export type QueryRelationshipArgs = {
  id: Scalars['String'];
};

export type QueryUserReportArgs = {
  id: Scalars['String'];
};

export type QueryUserReportsArgs = {
  filter?: InputMaybe<FilterUserReportInput>;
};

export type QueryPayoutAccountArgs = {
  user_id?: InputMaybe<Scalars['String']>;
};

export type QueryUserSubscriptionArgs = {
  filter?: InputMaybe<FilterUserSubscriptionInput>;
};

export type QueryTutorInvitationsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type UserInput = {
  id?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  google_user_id?: InputMaybe<Scalars['String']>;
  with_deleted?: InputMaybe<Scalars['Boolean']>;
};

export type PaginatedStudentTutorUnion = {
  __typename?: 'PaginatedStudentTutorUnion';
  docs?: Maybe<Array<StudentTutorUnion>>;
  total: Scalars['Int'];
  pageInfo: PageInfo;
};

export type PaginationInput = {
  take?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
};

export type FilterUsersInput = {
  email?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Array<Scalars['ID']>>;
  first_name?: InputMaybe<Scalars['String']>;
  middle_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<UserStatusType>;
  user_type?: InputMaybe<UserType>;
  roles?: InputMaybe<Array<Scalars['ID']>>;
  phone?: InputMaybe<Scalars['String']>;
  student_type?: InputMaybe<Array<StudentType>>;
};

export type PaginatedUserGroupModel = {
  __typename?: 'PaginatedUserGroupModel';
  docs?: Maybe<Array<UserGroupModel>>;
  total: Scalars['Int'];
  pageInfo: PageInfo;
};

export type FilterGroupsInput = {
  name?: InputMaybe<Scalars['String']>;
  group_type?: InputMaybe<Array<GroupType>>;
  created_by?: InputMaybe<Scalars['String']>;
  visibility?: InputMaybe<GroupVisibility>;
  topic?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  exclude?: InputMaybe<ExcludeValueInput>;
};

export enum GroupVisibility {
  Public = 'public',
  Restricted = 'restricted',
  Private = 'private',
}

export type ExcludeValueInput = {
  field: Scalars['String'];
  value: Scalars['String'];
};

export type PaginatedOrganizationModel = {
  __typename?: 'PaginatedOrganizationModel';
  docs?: Maybe<Array<OrganizationModel>>;
  total: Scalars['Int'];
  pageInfo: PageInfo;
};

export type FilterOrganizationsInput = {
  name?: InputMaybe<Scalars['String']>;
  domain?: InputMaybe<Scalars['String']>;
  difficulty_levels?: InputMaybe<Array<DifficultyLevelInput>>;
  age_groups?: InputMaybe<Array<AgeGroupInput>>;
  status?: InputMaybe<OrganizationStatus>;
  categories?: InputMaybe<Array<Scalars['JSONObject']>>;
  app_features?: InputMaybe<AppFeaturesInput>;
};

export type UserJoinGroupRequestsInput = {
  type: JoinGroupRequestType;
};

export type UserFamilyGroupInvitationsInput = {
  status: JoinGroupRequestStatusType;
};

export enum JoinGroupRequestStatusType {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export type JoinGroupRequestsInput = {
  type: JoinGroupRequestType;
  group_id: Scalars['String'];
};

export type PaginatedEducationLevelModel = {
  __typename?: 'PaginatedEducationLevelModel';
  docs?: Maybe<Array<EducationLevelModel>>;
  total: Scalars['Int'];
  pageInfo: PageInfo;
};

export type FilterEducationLevelsInput = {
  value?: InputMaybe<Scalars['String']>;
};

export type PaginatedExperienceYearsModel = {
  __typename?: 'PaginatedExperienceYearsModel';
  docs?: Maybe<Array<ExperienceYearsModel>>;
  total: Scalars['Int'];
  pageInfo: PageInfo;
};

export type FilterExperienceYearsInput = {
  value?: InputMaybe<Scalars['String']>;
};

export type FilterUserReportInput = {
  user_id?: InputMaybe<Scalars['ID']>;
  created_by?: InputMaybe<Scalars['ID']>;
};

export type FilterUserSubscriptionInput = {
  subscription_id?: InputMaybe<Scalars['String']>;
  created_by?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
};

export type PaginatedTutorInvitationsModel = {
  __typename?: 'PaginatedTutorInvitationsModel';
  docs?: Maybe<Array<TutorInvitationModel>>;
  total: Scalars['Int'];
  pageInfo: PageInfo;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: UserModel;
  findOrCreateUserByEmail: FindOrCreateUserByEmailOutput;
  sendSessionInvitationByEmail: Scalars['Boolean'];
  updateTutor: TutorModel;
  updateUser: UserUnion;
  updateAdmin: UserUnion;
  deleteUser: Scalars['String'];
  changePassword: Scalars['Boolean'];
  setPassword: Scalars['Boolean'];
  verifyUniqueId: VerifyUniqueIdOutput;
  attachClassroomGroupToTutor: AttachClassroomGroupOutput;
  setEmail: Scalars['Boolean'];
  sendPhoneNumberVerificationSMS: Scalars['Boolean'];
  verifyPhoneNumber: Scalars['Boolean'];
  createGroup: UserGroupModel;
  updateGroup: UserGroupModel;
  deleteGroup: Scalars['String'];
  leaveGroup: UserModel;
  deleteUserFromGroup: UserModel;
  addAdminToGroup: UserGroupModel;
  joinGroup: UserGroupModel;
  createDefaultGroup: Scalars['Boolean'];
  createRole: RoleModel;
  updateRole: RoleModel;
  assignRole: AssignRoleOutput;
  unAssignRole: AssignRoleOutput;
  deleteRole: Scalars['String'];
  signUpTutor: SignUpTutorOutput;
  signUpStudent: UserModel;
  addAdminToMyOrganization: OrganizationModel;
  signIn: SignInOutput;
  signInMinorChild: StudentModel;
  verifyEmail: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  createOrganization: OrganizationModel;
  updateMyOrganization: OrganizationModel;
  updateOrganization: OrganizationModel;
  updateStudent: StudentModel;
  addMinorChild: StudentModel;
  updateMinorChild: StudentModel;
  inviteFamilyMemberToApp: InviteToFamilyGroupOutput;
  inviteToGroup: JoinGroupRequestModel;
  inviteToFamilyGroup: InviteToFamilyGroupOutput;
  requestToJoinGroup: JoinGroupRequestModel;
  answerPendingJoinGroupRequest: JoinGroupRequestModel;
  answerJoinFamilyGroupRequest: JoinGroupRequestModel;
  cancelPendingJoinGroupRequest: JoinGroupRequestModel;
  resendFamilyMemberInvitation: Scalars['String'];
  createEducationLevel: EducationLevelModel;
  updateEducationLevel: EducationLevelModel;
  deleteEducationLevel: Scalars['String'];
  createExperienceYears: ExperienceYearsModel;
  updateExperienceYears: ExperienceYearsModel;
  deleteExperienceYears: Scalars['String'];
  createUserRelationship: UserRelationshipModel;
  updateUserRelationship: UserRelationshipModel;
  createRelationship: RelationshipModel;
  updateRelationship: RelationshipModel;
  deleteRelationship: Scalars['String'];
  createGoal: GoalModel;
  updateGoal: GoalModel;
  deleteGoal: Scalars['String'];
  createUserReport: UserReportModel;
  updateUserReport: UserReportModel;
  deleteUserReport: Scalars['String'];
  createPayoutAccount: PayoutAccountModel;
  updatePayoutAccount: PayoutAccountModel;
  deletePayoutAccount: PayoutAccountModel;
  createUserSubscription: UserSubscriptionModel;
  updateUserSubscription: UserSubscriptionModel;
  setUserSubscriptionFeatures: UserSubscriptionModel;
  setUserSubscriptionStatus: UserSubscriptionModel;
  inviteTutorToApp: TutorInvitationModel;
  resendTutorInvitation: TutorInvitationModel;
  sendNotificationBySMS: Scalars['Boolean'];
  sendNotificationByEmail: Scalars['Boolean'];
  sendNotificationInApp: Scalars['Boolean'];
  createNotificationPreference: NotificationPreferenceModel;
  createDefaultNotificationPreferences: Scalars['Boolean'];
  deleteNotificationPreference: Scalars['String'];
};

export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};

export type MutationFindOrCreateUserByEmailArgs = {
  email: Scalars['String'];
};

export type MutationSendSessionInvitationByEmailArgs = {
  sendSessionInvitationByEmailInput: SendSessionInvitationByEmailInput;
};

export type MutationUpdateTutorArgs = {
  updateTutorInput: UpdateTutorInput;
};

export type MutationUpdateUserArgs = {
  user_id: Scalars['String'];
  updateUserInput: BaseUpdateUserInput;
};

export type MutationUpdateAdminArgs = {
  updateUserInput: BaseUpdateUserInput;
};

export type MutationDeleteUserArgs = {
  id: Scalars['String'];
};

export type MutationChangePasswordArgs = {
  changePasswordInput: ChangePasswordInput;
};

export type MutationSetPasswordArgs = {
  setPasswordInput: SetPasswordInput;
};

export type MutationVerifyUniqueIdArgs = {
  unique_id: Scalars['String'];
};

export type MutationAttachClassroomGroupToTutorArgs = {
  attachClassroomGroupInput: AttachClassroomGroupInput;
};

export type MutationSetEmailArgs = {
  setEmailInput: SetEmailInput;
};

export type MutationSendPhoneNumberVerificationSmsArgs = {
  phone_number: Scalars['String'];
};

export type MutationVerifyPhoneNumberArgs = {
  verifyPhoneNumberInput: VerifyPhoneNumberInput;
};

export type MutationCreateGroupArgs = {
  createGroupInput: CreateGroupInput;
};

export type MutationUpdateGroupArgs = {
  updateGroupInput: UpdateGroupInput;
};

export type MutationDeleteGroupArgs = {
  id: Scalars['String'];
};

export type MutationLeaveGroupArgs = {
  group_id: Scalars['String'];
};

export type MutationDeleteUserFromGroupArgs = {
  deleteUserFromGroupInput: DeleteUserFromGroupInput;
};

export type MutationAddAdminToGroupArgs = {
  addAdminToGroupInput: AddUserToGroupInput;
};

export type MutationJoinGroupArgs = {
  group_id: Scalars['String'];
};

export type MutationCreateDefaultGroupArgs = {
  createDefaultGroupInput: CreateDefaultGroupInput;
};

export type MutationCreateRoleArgs = {
  createRoleInput: CreateRoleInput;
};

export type MutationUpdateRoleArgs = {
  updateRoleInput: UpdateRoleInput;
};

export type MutationAssignRoleArgs = {
  assignRoleInput: AssignRoleInput;
};

export type MutationUnAssignRoleArgs = {
  unAssignRoleInput: AssignRoleInput;
};

export type MutationDeleteRoleArgs = {
  id: Scalars['String'];
};

export type MutationSignUpTutorArgs = {
  signUpTutorInput: SignUpTutorInput;
};

export type MutationSignUpStudentArgs = {
  signUpStudentInput: SignUpStudentInput;
};

export type MutationAddAdminToMyOrganizationArgs = {
  addAdminToOrganizationInput: AddAdminToOrganizationInput;
};

export type MutationSignInArgs = {
  signInInput: SignInInput;
};

export type MutationSignInMinorChildArgs = {
  signInMinorChildInput: SignInMinorChildInput;
};

export type MutationVerifyEmailArgs = {
  unique_id: Scalars['String'];
};

export type MutationForgotPasswordArgs = {
  forgotPasswordInput: ForgotPasswordInput;
};

export type MutationCreateOrganizationArgs = {
  createOrganizationInput: CreateOrganizationInput;
};

export type MutationUpdateMyOrganizationArgs = {
  updateOrganizationInput: UpdateOrganizationInput;
};

export type MutationUpdateOrganizationArgs = {
  org_id: Scalars['String'];
  updateOrganizationInput: UpdateOrganizationInput;
};

export type MutationUpdateStudentArgs = {
  updateStudentInput: UpdateStudentInput;
};

export type MutationAddMinorChildArgs = {
  addMinorChildInput: AddMinorChildInput;
};

export type MutationUpdateMinorChildArgs = {
  updateMinorChildInput: UpdateMinorChildInput;
};

export type MutationInviteFamilyMemberToAppArgs = {
  inviteFamilyMemberToAppInput: InviteFamilyMemberToAppInput;
};

export type MutationInviteToGroupArgs = {
  inviteToGroupInput: InviteToGroupInput;
};

export type MutationInviteToFamilyGroupArgs = {
  inviteToFamilyGroupInput: InviteToFamilyGroupInput;
};

export type MutationRequestToJoinGroupArgs = {
  group_id: Scalars['String'];
};

export type MutationAnswerPendingJoinGroupRequestArgs = {
  answerPendingJoinGroupRequestInput: AnswerPendingJoinGroupRequestInput;
};

export type MutationAnswerJoinFamilyGroupRequestArgs = {
  answerJoinFamilyGroupRequestInput: AnswerJoinFamilyGroupRequestInput;
};

export type MutationCancelPendingJoinGroupRequestArgs = {
  id: Scalars['String'];
};

export type MutationResendFamilyMemberInvitationArgs = {
  invitation_id: Scalars['String'];
};

export type MutationCreateEducationLevelArgs = {
  createEducationLevelInput: CreateEducationLevelInput;
};

export type MutationUpdateEducationLevelArgs = {
  updateEducationLevelInput: UpdateEducationLevelInput;
};

export type MutationDeleteEducationLevelArgs = {
  id: Scalars['String'];
};

export type MutationCreateExperienceYearsArgs = {
  createExperienceYearsInput: CreateExperienceYearsInput;
};

export type MutationUpdateExperienceYearsArgs = {
  updateExperienceYearsInput: UpdateExperienceYearsInput;
};

export type MutationDeleteExperienceYearsArgs = {
  id: Scalars['String'];
};

export type MutationCreateUserRelationshipArgs = {
  createUserRelationshipInput: CreateUserRelationshipInput;
};

export type MutationUpdateUserRelationshipArgs = {
  updateUserRelationshipInput: UpdateUserRelationshipInput;
};

export type MutationCreateRelationshipArgs = {
  createRelationshipInput: CreateRelationshipInput;
};

export type MutationUpdateRelationshipArgs = {
  updateRelationshipInput: UpdateRelationshipInput;
};

export type MutationDeleteRelationshipArgs = {
  id: Scalars['String'];
};

export type MutationCreateGoalArgs = {
  createGoalInput: TextInput;
};

export type MutationUpdateGoalArgs = {
  updateGoalInput: UpdateGoalInput;
};

export type MutationDeleteGoalArgs = {
  goal_id: Scalars['String'];
};

export type MutationCreateUserReportArgs = {
  createUserReportInput: CreateUserReportInput;
};

export type MutationUpdateUserReportArgs = {
  updateUserReportInput: UpdateUserReportInput;
};

export type MutationDeleteUserReportArgs = {
  id: Scalars['String'];
};

export type MutationCreatePayoutAccountArgs = {
  createPayoutAccountInput: CreatePayoutAccountInput;
};

export type MutationUpdatePayoutAccountArgs = {
  updatePayoutAccountInput: UpdatePayoutAccountInput;
};

export type MutationDeletePayoutAccountArgs = {
  deletePayoutAccountInput: DeletePayoutAccountInput;
};

export type MutationCreateUserSubscriptionArgs = {
  createUserSubscriptionInput: CreateUserSubscriptionInput;
};

export type MutationUpdateUserSubscriptionArgs = {
  updateUserSubscriptionInput: UpdateUserSubscriptionInput;
};

export type MutationSetUserSubscriptionFeaturesArgs = {
  setUserSubscriptionFeaturesInput: SetUserSubscriptionFeaturesInput;
};

export type MutationSetUserSubscriptionStatusArgs = {
  setUserSubscriptionStatusInput: SetUserSubscriptionStatusInput;
};

export type MutationInviteTutorToAppArgs = {
  createTutorInvitationInput: CreateTutorInvitationInput;
};

export type MutationResendTutorInvitationArgs = {
  resendTutorInvitationInput: ResendTutorInvitationInput;
};

export type MutationSendNotificationBySmsArgs = {
  sendNotificationBySmsInput: SendNotificationBySmsInput;
};

export type MutationSendNotificationByEmailArgs = {
  sendNotificationByEmailInput: SendNotificationByEmailInput;
};

export type MutationSendNotificationInAppArgs = {
  sendNotificationInAppInput: SendNotificationInAppInput;
};

export type MutationCreateNotificationPreferenceArgs = {
  createNotificationPreferenceInput: CreateNotificationPreferenceInput;
};

export type MutationDeleteNotificationPreferenceArgs = {
  id: Scalars['String'];
};

export type CreateUserInput = {
  first_name?: InputMaybe<Scalars['String']>;
  middle_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  dob?: InputMaybe<Scalars['DateTime']>;
  gender?: InputMaybe<GenderType>;
  email?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  user_type?: InputMaybe<UserType>;
  google_user_id?: InputMaybe<Scalars['String']>;
  roles?: InputMaybe<Array<InputRoleModel>>;
  status?: InputMaybe<UserStatusType>;
  email_verified?: InputMaybe<Scalars['Boolean']>;
  languages?: InputMaybe<Array<Scalars['ID']>>;
};

export type InputRoleModel = {
  _id?: InputMaybe<Scalars['ID']>;
  created_at?: InputMaybe<Scalars['DateTime']>;
  last_updated_at?: InputMaybe<Scalars['DateTime']>;
  deleted?: InputMaybe<Scalars['Boolean']>;
  created_by?: InputMaybe<Scalars['String']>;
  last_updated_by?: InputMaybe<Scalars['String']>;
  org_id?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  default_type?: InputMaybe<DefaultUserType>;
  permissions?: InputMaybe<Array<DefaultPermissions>>;
};

export type SendSessionInvitationByEmailInput = {
  email?: InputMaybe<Scalars['String']>;
  invitation_id: Scalars['String'];
  user_id?: InputMaybe<Scalars['String']>;
};

export type UpdateTutorInput = {
  first_name?: InputMaybe<Scalars['String']>;
  middle_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  dob?: InputMaybe<Scalars['DateTime']>;
  gender?: InputMaybe<GenderType>;
  languages?: InputMaybe<Array<Scalars['ID']>>;
  profile_image?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<AddressInput>;
  username?: InputMaybe<Scalars['String']>;
  timezone?: InputMaybe<Scalars['String']>;
  education_level?: InputMaybe<Scalars['String']>;
  experience_years?: InputMaybe<Scalars['String']>;
  certificate?: InputMaybe<Array<Scalars['String']>>;
  additional_certificates?: InputMaybe<Array<Scalars['String']>>;
  current_profession?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  hobbies?: InputMaybe<Array<Scalars['String']>>;
  is_private?: InputMaybe<Scalars['Boolean']>;
  conference_sessions_enabled?: InputMaybe<Scalars['Boolean']>;
  google_refresh_token?: InputMaybe<Scalars['String']>;
  google_calendar_id?: InputMaybe<Scalars['String']>;
  sync_sessions_with_google_calendar?: InputMaybe<Scalars['Boolean']>;
};

export type AddressInput = {
  address_line1?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<State>;
  zip?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Country>;
};

export type BaseUpdateUserInput = {
  first_name?: InputMaybe<Scalars['String']>;
  middle_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  dob?: InputMaybe<Scalars['DateTime']>;
  gender?: InputMaybe<GenderType>;
  languages?: InputMaybe<Array<Scalars['ID']>>;
  profile_image?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<AddressInput>;
  username?: InputMaybe<Scalars['String']>;
  timezone?: InputMaybe<Scalars['String']>;
};

export type ChangePasswordInput = {
  previous_password: Scalars['String'];
  new_password: Scalars['String'];
};

export type SetPasswordInput = {
  password: Scalars['String'];
  token: Scalars['String'];
  user_id: Scalars['String'];
  timezone?: InputMaybe<Scalars['String']>;
};

export type AttachClassroomGroupInput = {
  org_name: Scalars['String'];
  classroom_name: Scalars['String'];
};

export type SetEmailInput = {
  email: Scalars['String'];
  unique_id: Scalars['String'];
};

export type VerifyPhoneNumberInput = {
  code: Scalars['String'];
};

export type CreateGroupInput = {
  name: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  image_url?: InputMaybe<Scalars['String']>;
  group_type: GroupType;
  is_active?: InputMaybe<Scalars['Boolean']>;
  visibility?: InputMaybe<GroupVisibility>;
  topic?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  tag_text?: InputMaybe<Array<Scalars['String']>>;
};

export type UpdateGroupInput = {
  name?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  image_url?: InputMaybe<Scalars['String']>;
  is_active?: InputMaybe<Scalars['Boolean']>;
  visibility?: InputMaybe<GroupVisibility>;
  topic?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  tag_text?: InputMaybe<Array<Scalars['String']>>;
  id: Scalars['String'];
};

export type DeleteUserFromGroupInput = {
  user_to_delete_id: Scalars['String'];
  group_id: Scalars['String'];
};

export type AddUserToGroupInput = {
  user_id: Scalars['String'];
  group_id: Scalars['String'];
};

export type CreateDefaultGroupInput = {
  user_id: Scalars['String'];
  token: Scalars['String'];
};

export type CreateRoleInput = {
  name: Scalars['String'];
  permissions: Array<DefaultPermissions>;
};

export type UpdateRoleInput = {
  name?: InputMaybe<Scalars['String']>;
  permissions?: InputMaybe<Array<DefaultPermissions>>;
  id?: InputMaybe<Scalars['String']>;
};

export type AssignRoleInput = {
  id: Scalars['String'];
  role_id: Scalars['String'];
};

export type SignUpTutorInput = {
  email?: InputMaybe<Scalars['String']>;
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  domain?: InputMaybe<Scalars['String']>;
  invitation_code: Scalars['String'];
};

export type SignUpStudentInput = {
  email?: InputMaybe<Scalars['String']>;
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  domain?: InputMaybe<Scalars['String']>;
  student_type: StudentType;
};

export type AddAdminToOrganizationInput = {
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  email: Scalars['String'];
};

export type SignInInput = {
  password: Scalars['String'];
  email: Scalars['String'];
};

export type SignInMinorChildInput = {
  child_id: Scalars['ID'];
  domain?: InputMaybe<Scalars['String']>;
};

export type ForgotPasswordInput = {
  email: Scalars['String'];
  password_set: Scalars['Boolean'];
  user_type?: InputMaybe<UserType>;
  org_name?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
};

export type CreateOrganizationInput = {
  name: Scalars['String'];
  domain: Scalars['String'];
  difficulty_levels: Array<DifficultyLevelInput>;
  age_groups: Array<AgeGroupInput>;
  features?: InputMaybe<FeaturesInput>;
  status?: InputMaybe<OrganizationStatus>;
  categories?: InputMaybe<Array<Scalars['JSONObject']>>;
  app_features?: InputMaybe<AppFeaturesInput>;
};

export type UpdateOrganizationInput = {
  name?: InputMaybe<Scalars['String']>;
  domain?: InputMaybe<Scalars['String']>;
  difficulty_levels?: InputMaybe<Array<DifficultyLevelInput>>;
  age_groups?: InputMaybe<Array<AgeGroupInput>>;
  features?: InputMaybe<FeaturesInput>;
  status?: InputMaybe<OrganizationStatus>;
  categories?: InputMaybe<Array<Scalars['JSONObject']>>;
  app_features?: InputMaybe<AppFeaturesInput>;
  coin_to_usd_rate?: InputMaybe<Scalars['Float']>;
  default_group_session_rate?: InputMaybe<Scalars['Float']>;
  default_private_session_rate?: InputMaybe<Scalars['Float']>;
};

export type UpdateStudentInput = {
  first_name?: InputMaybe<Scalars['String']>;
  middle_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  dob?: InputMaybe<Scalars['DateTime']>;
  gender?: InputMaybe<GenderType>;
  languages?: InputMaybe<Array<Scalars['ID']>>;
  profile_image?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<AddressInput>;
  username?: InputMaybe<Scalars['String']>;
  timezone?: InputMaybe<Scalars['String']>;
  topics?: InputMaybe<Array<Scalars['String']>>;
  goals?: InputMaybe<Array<Scalars['String']>>;
};

export type AddMinorChildInput = {
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  dob: Scalars['DateTime'];
  topics?: InputMaybe<Array<Scalars['String']>>;
  goals: Array<Scalars['String']>;
  profile_image: Scalars['String'];
  languages: Array<Scalars['ID']>;
};

export type UpdateMinorChildInput = {
  first_name?: InputMaybe<Scalars['String']>;
  middle_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  dob?: InputMaybe<Scalars['DateTime']>;
  gender?: InputMaybe<GenderType>;
  languages?: InputMaybe<Array<Scalars['ID']>>;
  profile_image?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<AddressInput>;
  timezone?: InputMaybe<Scalars['String']>;
  topics?: InputMaybe<Array<Scalars['String']>>;
  goals?: InputMaybe<Array<Scalars['String']>>;
  id: Scalars['String'];
};

export type InviteFamilyMemberToAppInput = {
  email?: InputMaybe<Scalars['String']>;
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  phone?: InputMaybe<Scalars['String']>;
  relationship_to_children_id: Scalars['String'];
  relationship_to_me_id: Scalars['String'];
  child_access?: InputMaybe<Scalars['Boolean']>;
};

export type InviteToGroupInput = {
  user_id: Scalars['String'];
  group_id: Scalars['String'];
};

export type InviteToFamilyGroupInput = {
  child_access: Scalars['Boolean'];
  user_id: Scalars['String'];
  relationship_to_children_id: Scalars['String'];
  relationship_to_me_id: Scalars['String'];
};

export type AnswerPendingJoinGroupRequestInput = {
  id: Scalars['String'];
  answer: Scalars['Boolean'];
};

export type AnswerJoinFamilyGroupRequestInput = {
  child_access?: InputMaybe<Scalars['Boolean']>;
  unique_id?: InputMaybe<Scalars['String']>;
  invitation_id?: InputMaybe<Scalars['String']>;
  answer: Scalars['Boolean'];
};

export type CreateEducationLevelInput = {
  value: Scalars['String'];
};

export type UpdateEducationLevelInput = {
  value: Scalars['String'];
  id: Scalars['String'];
};

export type CreateExperienceYearsInput = {
  value: Scalars['String'];
};

export type UpdateExperienceYearsInput = {
  value: Scalars['String'];
  id: Scalars['String'];
};

export type CreateUserRelationshipInput = {
  family_member_id: Scalars['String'];
  relationship_to_me_id?: InputMaybe<Scalars['String']>;
  relationship_to_children_id: Scalars['String'];
};

export type UpdateUserRelationshipInput = {
  family_member_id?: InputMaybe<Scalars['String']>;
  relationship_to_me_id?: InputMaybe<Scalars['String']>;
  relationship_to_children_id?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
};

export type CreateRelationshipInput = {
  name: Scalars['String'];
};

export type UpdateRelationshipInput = {
  name: Scalars['String'];
  id: Scalars['String'];
};

export type TextInput = {
  text: Scalars['String'];
};

export type UpdateGoalInput = {
  text: Scalars['String'];
  id: Scalars['String'];
};

export type CreateUserReportInput = {
  user_id: Scalars['ID'];
  reasons: Array<UserReportReason>;
  description?: InputMaybe<Scalars['String']>;
};

export type UpdateUserReportInput = {
  reasons?: InputMaybe<Array<UserReportReason>>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type CreatePayoutAccountInput = {
  account_id: Scalars['String'];
};

export type UpdatePayoutAccountInput = {
  updated_earnings?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<PayoutAccountStatusEnum>;
};

export enum PayoutAccountStatusEnum {
  Active = 'active',
  Inactive = 'inactive',
}

export type DeletePayoutAccountInput = {
  payout_account_id: Scalars['String'];
};

export type CreateUserSubscriptionInput = {
  customer_id?: InputMaybe<Scalars['String']>;
  status: Scalars['String'];
  features: SubscriptionFeaturesInput;
  subscription_id?: InputMaybe<Scalars['String']>;
  promo_code_id?: InputMaybe<Scalars['String']>;
  children_count?: InputMaybe<Scalars['Float']>;
};

export type UpdateUserSubscriptionInput = {
  customer_id: Scalars['String'];
  user_id: Scalars['String'];
  status: Scalars['String'];
  subscription_id: Scalars['String'];
  product_id: Scalars['String'];
  promo_code_id?: InputMaybe<Scalars['String']>;
  quantity: Scalars['Float'];
  student_type: Scalars['String'];
  promo_codes?: InputMaybe<Array<PromoCodeInput>>;
};

export type SetUserSubscriptionFeaturesInput = {
  id: Scalars['String'];
  features: SubscriptionFeaturesInput;
};

export type SetUserSubscriptionStatusInput = {
  id: Scalars['String'];
  status: Scalars['String'];
};

export type CreateTutorInvitationInput = {
  email: Scalars['String'];
  info?: InputMaybe<Scalars['JSONObject']>;
};

export type ResendTutorInvitationInput = {
  email: Scalars['String'];
};

export type SendNotificationBySmsInput = {
  phone_number: Scalars['String'];
  message: Scalars['String'];
};

export type SendNotificationByEmailInput = {
  email: Scalars['String'];
  template: Scalars['JSONObject'];
};

export type SendNotificationInAppInput = {
  room_id: Scalars['String'];
  type: RoomApiMessages;
  payload?: InputMaybe<Scalars['JSONObject']>;
};

export enum RoomApiMessages {
  SessionHasStarted = 'session_has_started',
  SessionWasEnded = 'session_was_ended',
  SessionWasCreatedInGroup = 'session_was_created_in_group',
  LiveSessionWasCreatedInGroup = 'live_session_was_created_in_group',
  YouWereInvitedToSession = 'you_were_invited_to_session',
  UserJoinedSession = 'user_joined_session',
  UserWasAddedToSessionParticipants = 'user_was_added_to_session_participants',
  UserLeftSession = 'user_left_session',
  UserWasBlockedFromTheSession = 'user_was_blocked_from_the_session',
  YouWereBlockedFromTheSession = 'you_were_blocked_from_the_session',
  UserCancelledInvitation = 'user_cancelled_invitation',
  UserAcceptedSessionInvitation = 'user_accepted_session_invitation',
  UserJoinedGroup = 'user_joined_group',
  UserLeftGroup = 'user_left_group',
  YouWereInvitedToGroup = 'you_were_invited_to_group',
  YouWereInvitedToFamilyGroup = 'you_were_invited_to_family_group',
  UserAcceptedGroupInvitation = 'user_accepted_group_invitation',
  RequestToJoinGroupWasAccepted = 'request_to_join_group_was_accepted',
  SubscriptionUpdated = 'subscription_updated',
  ContentEditRequested = 'content_edit_requested',
  UserHasUpcomingSession = 'user_has_upcoming_session',
  YourVideoHasChangedStatus = 'your_video_has_changed_status',
}

export type CreateNotificationPreferenceInput = {
  notification_type: NotificationType;
  notification_method: NotificationMethod;
};
