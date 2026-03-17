export declare type Maybe<T> = T | null;
export declare type InputMaybe<T> = Maybe<T>;
export declare type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
export declare type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export declare type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    DateTime: any;
    JSONObject: any;
};
export declare type PageInfo = {
    __typename?: 'PageInfo';
    hasNextPage: Scalars['Boolean'];
    after?: Maybe<Scalars['String']>;
};
export declare type DifficultyLevelType = {
    __typename?: 'DifficultyLevelType';
    level: Scalars['Int'];
    text: Scalars['String'];
};
export declare type AgeGroupType = {
    __typename?: 'AgeGroupType';
    id: Scalars['Int'];
    name: Scalars['String'];
    min_age: Scalars['Int'];
    max_age: Scalars['Int'];
};
export declare type FeaturesType = {
    __typename?: 'FeaturesType';
    family_members: Scalars['Boolean'];
    phone_verification: Scalars['Boolean'];
    development: Scalars['Boolean'];
};
export declare type AppFeaturesType = {
    __typename?: 'AppFeaturesType';
    invite_family_member: Scalars['Boolean'];
    schedule_session: Scalars['Boolean'];
    app_subscription: Scalars['Boolean'];
    payout_for_content: Scalars['Boolean'];
};
export declare type OrganizationModel = ITimestampModel & {
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
export declare type ITimestampModel = {
    _id: Scalars['ID'];
    created_at?: Maybe<Scalars['DateTime']>;
    last_updated_at: Scalars['DateTime'];
    deleted?: Maybe<Scalars['Boolean']>;
};
export declare enum OrganizationStatus {
    Pending = "pending",
    Active = "active",
    Inactive = "inactive"
}
export declare type Address = {
    __typename?: 'Address';
    address_line1?: Maybe<Scalars['String']>;
    city?: Maybe<Scalars['String']>;
    state?: Maybe<State>;
    zip?: Maybe<Scalars['String']>;
    country?: Maybe<Country>;
};
export declare enum State {
    Al = "al",
    Ak = "ak",
    Az = "az",
    Ar = "ar",
    Ca = "ca",
    Co = "co",
    Ct = "ct",
    De = "de",
    Fl = "fl",
    Ga = "ga",
    Hi = "hi",
    Id = "id",
    Il = "il",
    In = "in",
    Ia = "ia",
    Ks = "ks",
    Ky = "ky",
    La = "la",
    Me = "me",
    Md = "md",
    Ma = "ma",
    Mi = "mi",
    Mn = "mn",
    Ms = "ms",
    Mo = "mo",
    Mt = "mt",
    Ne = "ne",
    Nv = "nv",
    Nh = "nh",
    Nj = "nj",
    Nm = "nm",
    Ny = "ny",
    Nc = "nc",
    Nd = "nd",
    Oh = "oh",
    Ok = "ok",
    Or = "or",
    Pa = "pa",
    Ri = "ri",
    Sc = "sc",
    Sd = "sd",
    Tn = "tn",
    Tx = "tx",
    Ut = "ut",
    Vt = "vt",
    Va = "va",
    Wa = "wa",
    Wv = "wv",
    Wi = "wi",
    Wy = "wy"
}
export declare enum Country {
    Usa = "USA",
    Canada = "Canada",
    China = "China",
    Russia = "Russia",
    India = "India",
    Japan = "Japan",
    Australia = "Australia",
    Ukraine = "Ukraine"
}
export declare type Member = {
    __typename?: 'Member';
    id: UserModel;
    joined_at: Scalars['DateTime'];
    child_access?: Maybe<Scalars['Boolean']>;
};
export declare type UserGroupModel = IUserRelationModel & {
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
export declare type IUserRelationModel = {
    _id: Scalars['ID'];
    created_at?: Maybe<Scalars['DateTime']>;
    last_updated_at: Scalars['DateTime'];
    deleted?: Maybe<Scalars['Boolean']>;
    created_by?: Maybe<Scalars['String']>;
    last_updated_by?: Maybe<Scalars['String']>;
    org_id?: Maybe<Scalars['String']>;
};
export declare enum GroupType {
    Tutor = "tutor",
    Study = "study",
    Family = "family",
    Classroom = "classroom"
}
export declare type RoleModel = IUserRelationModel & {
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
export declare enum DefaultUserType {
    Tutor = "tutor",
    Student = "student",
    Admin = "admin",
    SuperAdmin = "super_admin"
}
export declare enum DefaultPermissions {
    SwitchOrganization = "switch_organization",
    ViewAnyOrganization = "view_any_organization",
    ViewAllOrganizations = "view_all_organizations",
    ManageAnyOrganization = "manage_any_organization",
    AddAdminToMyOrganization = "add_admin_to_my_organization",
    ManageMyOrganization = "manage_my_organization",
    ManageTutorInvitations = "manage_tutor_invitations",
    ViewAnyUser = "view_any_user",
    ViewAllUsers = "view_all_users",
    ManageAnyUser = "manage_any_user",
    UpdateUserRole = "update_user_role",
    ViewRoles = "view_roles",
    ManageRole = "manage_role",
    ManageTag = "manage_tag",
    ManageTopic = "manage_topic",
    ManageOthers = "manage_others_content",
    ManageSceneTemplate = "manage_scene_template",
    ManageGoal = "manage_goal",
    ManageLanguage = "manage_language",
    ManageRelationship = "manage_relationship",
    ManageEducationLevel = "manage_education_level",
    ManageExperienceYears = "manage_experience_years",
    ManageFeedbackQuestions = "manage_feedback_questions",
    ViewFeedbacks = "view_feedbacks",
    ManagePrivateMediaContent = "manage_private_media_content",
    UploadMediaToGlobalCollection = "upload_media_to_global_collection",
    BlockUnblockMedia = "block_unblock_media",
    ReviewContent = "review_content",
    CreateContent = "create_content",
    ManageContent = "manage_content",
    ManagePayouts = "manage_payouts",
    ManagePayoutPolicies = "manage_payout_policies",
    ViewAllAnalytics = "view_all_analytics",
    ManageGoogleCalendar = "manage_google_calendar"
}
export declare type UserModel = IUser & {
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
export declare type IUser = {
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
export declare enum UserStatusType {
    Pending = "pending",
    Active = "active",
    Deactivated = "deactivated"
}
export declare enum GenderType {
    Male = "male",
    Female = "female",
    Other = "other"
}
export declare type SubscriptionFeaturesType = {
    __typename?: 'SubscriptionFeaturesType';
    can_add_family_members: Scalars['Boolean'];
    can_have_children: Scalars['Boolean'];
};
export declare type PromoCodeType = {
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
export declare enum PromoCodeDurationEnum {
    Once = "once",
    Repeating = "repeating",
    Forever = "forever"
}
export declare type UserSubscriptionModel = IUserRelationModel & {
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
export declare type JoinGroupRequestModel = ITimestampModel & {
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
export declare enum JoinGroupRequestType {
    Invitation = "invitation",
    Request = "request"
}
export declare type RelationshipModel = ITimestampModel & {
    __typename?: 'RelationshipModel';
    _id: Scalars['ID'];
    created_at?: Maybe<Scalars['DateTime']>;
    last_updated_at: Scalars['DateTime'];
    deleted?: Maybe<Scalars['Boolean']>;
    name: Scalars['String'];
};
export declare type UserRelationshipModel = IUserRelationModel & {
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
export declare type EducationLevelModel = ITimestampModel & {
    __typename?: 'EducationLevelModel';
    _id: Scalars['ID'];
    created_at?: Maybe<Scalars['DateTime']>;
    last_updated_at: Scalars['DateTime'];
    deleted?: Maybe<Scalars['Boolean']>;
    value: Scalars['String'];
};
export declare type ExperienceYearsModel = ITimestampModel & {
    __typename?: 'ExperienceYearsModel';
    _id: Scalars['ID'];
    created_at?: Maybe<Scalars['DateTime']>;
    last_updated_at: Scalars['DateTime'];
    deleted?: Maybe<Scalars['Boolean']>;
    value: Scalars['String'];
};
export declare type GoalModel = ITimestampModel & {
    __typename?: 'GoalModel';
    _id: Scalars['ID'];
    created_at?: Maybe<Scalars['DateTime']>;
    last_updated_at: Scalars['DateTime'];
    deleted?: Maybe<Scalars['Boolean']>;
    text: Scalars['String'];
    created_by?: Maybe<Scalars['ID']>;
};
export declare type TutorInvitationModel = {
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
export declare type UserPayloadType = {
    __typename?: 'UserPayloadType';
    user_id: Scalars['ID'];
    org_id?: Maybe<Scalars['ID']>;
    user_type?: Maybe<UserType>;
    first_name: Scalars['String'];
    last_name: Scalars['String'];
};
export declare enum UserType {
    Tutor = "tutor",
    Student = "student"
}
export declare type SignInOutput = {
    __typename?: 'SignInOutput';
    payload: UserPayloadType;
};
export declare type SignUpTutorOutput = {
    __typename?: 'SignUpTutorOutput';
    user: UserModel;
    org_name: Scalars['String'];
};
export declare type StudentModel = IUser & {
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
export declare enum StudentType {
    Student = "student",
    Minor = "minor",
    Adult = "adult",
    Parent = "parent",
    FamilyLead = "family_lead"
}
export declare type AssignRoleOutput = {
    __typename?: 'AssignRoleOutput';
    id?: Maybe<Scalars['String']>;
    role_id?: Maybe<Scalars['String']>;
};
export declare type TutorModel = IUser & {
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
export declare type FindOrCreateUserByEmailOutput = {
    __typename?: 'FindOrCreateUserByEmailOutput';
    user_id: Scalars['String'];
    is_exist: Scalars['Boolean'];
};
export declare type ProfileCompletionOutput = {
    __typename?: 'ProfileCompletionOutput';
    fields_to_be_filled: Array<Maybe<Scalars['String']>>;
    fill_percentage: Scalars['Float'];
};
export declare type UserWithPopulatedGroupsOutput = IUser & {
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
export declare type AttachClassroomGroupOutput = {
    __typename?: 'AttachClassroomGroupOutput';
    user: UserWithPopulatedGroupsOutput;
    unique_id: Scalars['String'];
};
export declare type VerifyUniqueIdOutput = {
    __typename?: 'VerifyUniqueIdOutput';
    user: StudentTutorUnion;
    user_type?: Maybe<UserType>;
};
export declare type StudentTutorUnion = TutorModel | StudentModel;
export declare type InviteToFamilyGroupOutput = {
    __typename?: 'InviteToFamilyGroupOutput';
    invitation: JoinGroupRequestModel;
    invitation_link?: Maybe<Scalars['String']>;
};
export declare type UserWithChildren = {
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
export declare type PopulatedMember = {
    __typename?: 'PopulatedMember';
    joined_at: Scalars['DateTime'];
    child_access?: Maybe<Scalars['Boolean']>;
    id: UserWithChildren;
};
export declare type MyFamilyGroupOutput = {
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
export declare type UserFamilyGroupInvitationsOutput = {
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
export declare type UserJoinGroupRequestOutput = {
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
export declare type UserUnion = TutorModel | StudentModel | UserModel;
export declare type UserReportModel = IUserRelationModel & {
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
export declare enum UserReportReason {
    Spam = "spam",
    DontLikeIt = "dont_like_it",
    HateSpeech = "hate_speech",
    FalseInformation = "false_information",
    Violence = "violence",
    Scam = "scam"
}
export declare enum UserReportStatus {
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected"
}
export declare type PayoutAccountModel = ITimestampModel & {
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
export declare type NotificationPreferenceModel = ITimestampModel & {
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
export declare enum NotificationType {
    UserHasUpcomingSession = "user_has_upcoming_session"
}
export declare enum NotificationMethod {
    Email = "email",
    Sms = "sms"
}
export declare type DifficultyLevelInput = {
    level: Scalars['Int'];
    text: Scalars['String'];
};
export declare type AgeGroupInput = {
    id: Scalars['Int'];
    name: Scalars['String'];
    min_age: Scalars['Int'];
    max_age: Scalars['Int'];
};
export declare type FeaturesInput = {
    family_members: Scalars['Boolean'];
    phone_verification: Scalars['Boolean'];
    development: Scalars['Boolean'];
};
export declare type AppFeaturesInput = {
    invite_family_member: Scalars['Boolean'];
    schedule_session: Scalars['Boolean'];
    app_subscription: Scalars['Boolean'];
    payout_for_content: Scalars['Boolean'];
};
export declare type SubscriptionFeaturesInput = {
    can_add_family_members: Scalars['Boolean'];
    can_have_children: Scalars['Boolean'];
};
export declare type PromoCodeInput = {
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
export declare type Query = {
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
export declare type QueryUserArgs = {
    userInput: UserInput;
};
export declare type QueryStudentArgs = {
    userInput: UserInput;
};
export declare type QueryTutorArgs = {
    userInput: UserInput;
};
export declare type QueryUsersArgs = {
    pagination?: InputMaybe<PaginationInput>;
    filter?: InputMaybe<FilterUsersInput>;
};
export declare type QueryGroupMembersArgs = {
    group_id: Scalars['String'];
};
export declare type QueryGroupArgs = {
    group_id: Scalars['String'];
};
export declare type QueryGroupsArgs = {
    pagination?: InputMaybe<PaginationInput>;
    filter?: InputMaybe<FilterGroupsInput>;
};
export declare type QueryRoleArgs = {
    id: Scalars['String'];
};
export declare type QueryOrganizationArgs = {
    id: Scalars['String'];
};
export declare type QueryOrganizationByDomainArgs = {
    domain: Scalars['String'];
};
export declare type QueryOrganizationsArgs = {
    pagination?: InputMaybe<PaginationInput>;
    filter?: InputMaybe<FilterOrganizationsInput>;
};
export declare type QueryUserPendingJoinGroupRequestsArgs = {
    userJoinGroupRequestsInput: UserJoinGroupRequestsInput;
};
export declare type QueryUserFamilyGroupInvitationsArgs = {
    userFamilyGroupInvitationsInput?: InputMaybe<UserFamilyGroupInvitationsInput>;
};
export declare type QueryGroupPendingJoinGroupRequestsArgs = {
    joinGroupRequestsInput: JoinGroupRequestsInput;
};
export declare type QueryEducationLevelsArgs = {
    pagination?: InputMaybe<PaginationInput>;
    filter?: InputMaybe<FilterEducationLevelsInput>;
};
export declare type QueryExperienceYearsArgs = {
    pagination?: InputMaybe<PaginationInput>;
    filter?: InputMaybe<FilterExperienceYearsInput>;
};
export declare type QueryUserRelationshipArgs = {
    id: Scalars['String'];
};
export declare type QueryRelationshipArgs = {
    id: Scalars['String'];
};
export declare type QueryUserReportArgs = {
    id: Scalars['String'];
};
export declare type QueryUserReportsArgs = {
    filter?: InputMaybe<FilterUserReportInput>;
};
export declare type QueryPayoutAccountArgs = {
    user_id?: InputMaybe<Scalars['String']>;
};
export declare type QueryUserSubscriptionArgs = {
    filter?: InputMaybe<FilterUserSubscriptionInput>;
};
export declare type QueryTutorInvitationsArgs = {
    pagination?: InputMaybe<PaginationInput>;
};
export declare type UserInput = {
    id?: InputMaybe<Scalars['String']>;
    email?: InputMaybe<Scalars['String']>;
    google_user_id?: InputMaybe<Scalars['String']>;
    with_deleted?: InputMaybe<Scalars['Boolean']>;
};
export declare type PaginatedStudentTutorUnion = {
    __typename?: 'PaginatedStudentTutorUnion';
    docs?: Maybe<Array<StudentTutorUnion>>;
    total: Scalars['Int'];
    pageInfo: PageInfo;
};
export declare type PaginationInput = {
    take?: InputMaybe<Scalars['Int']>;
    after?: InputMaybe<Scalars['String']>;
};
export declare type FilterUsersInput = {
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
export declare type PaginatedUserGroupModel = {
    __typename?: 'PaginatedUserGroupModel';
    docs?: Maybe<Array<UserGroupModel>>;
    total: Scalars['Int'];
    pageInfo: PageInfo;
};
export declare type FilterGroupsInput = {
    name?: InputMaybe<Scalars['String']>;
    group_type?: InputMaybe<Array<GroupType>>;
    created_by?: InputMaybe<Scalars['String']>;
    visibility?: InputMaybe<GroupVisibility>;
    topic?: InputMaybe<Scalars['String']>;
    tags?: InputMaybe<Array<Scalars['String']>>;
    exclude?: InputMaybe<ExcludeValueInput>;
};
export declare enum GroupVisibility {
    Public = "public",
    Restricted = "restricted",
    Private = "private"
}
export declare type ExcludeValueInput = {
    field: Scalars['String'];
    value: Scalars['String'];
};
export declare type PaginatedOrganizationModel = {
    __typename?: 'PaginatedOrganizationModel';
    docs?: Maybe<Array<OrganizationModel>>;
    total: Scalars['Int'];
    pageInfo: PageInfo;
};
export declare type FilterOrganizationsInput = {
    name?: InputMaybe<Scalars['String']>;
    domain?: InputMaybe<Scalars['String']>;
    difficulty_levels?: InputMaybe<Array<DifficultyLevelInput>>;
    age_groups?: InputMaybe<Array<AgeGroupInput>>;
    status?: InputMaybe<OrganizationStatus>;
    categories?: InputMaybe<Array<Scalars['JSONObject']>>;
    app_features?: InputMaybe<AppFeaturesInput>;
};
export declare type UserJoinGroupRequestsInput = {
    type: JoinGroupRequestType;
};
export declare type UserFamilyGroupInvitationsInput = {
    status: JoinGroupRequestStatusType;
};
export declare enum JoinGroupRequestStatusType {
    Pending = "pending",
    Accepted = "accepted",
    Rejected = "rejected"
}
export declare type JoinGroupRequestsInput = {
    type: JoinGroupRequestType;
    group_id: Scalars['String'];
};
export declare type PaginatedEducationLevelModel = {
    __typename?: 'PaginatedEducationLevelModel';
    docs?: Maybe<Array<EducationLevelModel>>;
    total: Scalars['Int'];
    pageInfo: PageInfo;
};
export declare type FilterEducationLevelsInput = {
    value?: InputMaybe<Scalars['String']>;
};
export declare type PaginatedExperienceYearsModel = {
    __typename?: 'PaginatedExperienceYearsModel';
    docs?: Maybe<Array<ExperienceYearsModel>>;
    total: Scalars['Int'];
    pageInfo: PageInfo;
};
export declare type FilterExperienceYearsInput = {
    value?: InputMaybe<Scalars['String']>;
};
export declare type FilterUserReportInput = {
    user_id?: InputMaybe<Scalars['ID']>;
    created_by?: InputMaybe<Scalars['ID']>;
};
export declare type FilterUserSubscriptionInput = {
    subscription_id?: InputMaybe<Scalars['String']>;
    created_by?: InputMaybe<Scalars['String']>;
    id?: InputMaybe<Scalars['String']>;
};
export declare type PaginatedTutorInvitationsModel = {
    __typename?: 'PaginatedTutorInvitationsModel';
    docs?: Maybe<Array<TutorInvitationModel>>;
    total: Scalars['Int'];
    pageInfo: PageInfo;
};
export declare type Mutation = {
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
export declare type MutationCreateUserArgs = {
    createUserInput: CreateUserInput;
};
export declare type MutationFindOrCreateUserByEmailArgs = {
    email: Scalars['String'];
};
export declare type MutationSendSessionInvitationByEmailArgs = {
    sendSessionInvitationByEmailInput: SendSessionInvitationByEmailInput;
};
export declare type MutationUpdateTutorArgs = {
    updateTutorInput: UpdateTutorInput;
};
export declare type MutationUpdateUserArgs = {
    user_id: Scalars['String'];
    updateUserInput: BaseUpdateUserInput;
};
export declare type MutationUpdateAdminArgs = {
    updateUserInput: BaseUpdateUserInput;
};
export declare type MutationDeleteUserArgs = {
    id: Scalars['String'];
};
export declare type MutationChangePasswordArgs = {
    changePasswordInput: ChangePasswordInput;
};
export declare type MutationSetPasswordArgs = {
    setPasswordInput: SetPasswordInput;
};
export declare type MutationVerifyUniqueIdArgs = {
    unique_id: Scalars['String'];
};
export declare type MutationAttachClassroomGroupToTutorArgs = {
    attachClassroomGroupInput: AttachClassroomGroupInput;
};
export declare type MutationSetEmailArgs = {
    setEmailInput: SetEmailInput;
};
export declare type MutationSendPhoneNumberVerificationSmsArgs = {
    phone_number: Scalars['String'];
};
export declare type MutationVerifyPhoneNumberArgs = {
    verifyPhoneNumberInput: VerifyPhoneNumberInput;
};
export declare type MutationCreateGroupArgs = {
    createGroupInput: CreateGroupInput;
};
export declare type MutationUpdateGroupArgs = {
    updateGroupInput: UpdateGroupInput;
};
export declare type MutationDeleteGroupArgs = {
    id: Scalars['String'];
};
export declare type MutationLeaveGroupArgs = {
    group_id: Scalars['String'];
};
export declare type MutationDeleteUserFromGroupArgs = {
    deleteUserFromGroupInput: DeleteUserFromGroupInput;
};
export declare type MutationAddAdminToGroupArgs = {
    addAdminToGroupInput: AddUserToGroupInput;
};
export declare type MutationJoinGroupArgs = {
    group_id: Scalars['String'];
};
export declare type MutationCreateDefaultGroupArgs = {
    createDefaultGroupInput: CreateDefaultGroupInput;
};
export declare type MutationCreateRoleArgs = {
    createRoleInput: CreateRoleInput;
};
export declare type MutationUpdateRoleArgs = {
    updateRoleInput: UpdateRoleInput;
};
export declare type MutationAssignRoleArgs = {
    assignRoleInput: AssignRoleInput;
};
export declare type MutationUnAssignRoleArgs = {
    unAssignRoleInput: AssignRoleInput;
};
export declare type MutationDeleteRoleArgs = {
    id: Scalars['String'];
};
export declare type MutationSignUpTutorArgs = {
    signUpTutorInput: SignUpTutorInput;
};
export declare type MutationSignUpStudentArgs = {
    signUpStudentInput: SignUpStudentInput;
};
export declare type MutationAddAdminToMyOrganizationArgs = {
    addAdminToOrganizationInput: AddAdminToOrganizationInput;
};
export declare type MutationSignInArgs = {
    signInInput: SignInInput;
};
export declare type MutationSignInMinorChildArgs = {
    signInMinorChildInput: SignInMinorChildInput;
};
export declare type MutationVerifyEmailArgs = {
    unique_id: Scalars['String'];
};
export declare type MutationForgotPasswordArgs = {
    forgotPasswordInput: ForgotPasswordInput;
};
export declare type MutationCreateOrganizationArgs = {
    createOrganizationInput: CreateOrganizationInput;
};
export declare type MutationUpdateMyOrganizationArgs = {
    updateOrganizationInput: UpdateOrganizationInput;
};
export declare type MutationUpdateOrganizationArgs = {
    org_id: Scalars['String'];
    updateOrganizationInput: UpdateOrganizationInput;
};
export declare type MutationUpdateStudentArgs = {
    updateStudentInput: UpdateStudentInput;
};
export declare type MutationAddMinorChildArgs = {
    addMinorChildInput: AddMinorChildInput;
};
export declare type MutationUpdateMinorChildArgs = {
    updateMinorChildInput: UpdateMinorChildInput;
};
export declare type MutationInviteFamilyMemberToAppArgs = {
    inviteFamilyMemberToAppInput: InviteFamilyMemberToAppInput;
};
export declare type MutationInviteToGroupArgs = {
    inviteToGroupInput: InviteToGroupInput;
};
export declare type MutationInviteToFamilyGroupArgs = {
    inviteToFamilyGroupInput: InviteToFamilyGroupInput;
};
export declare type MutationRequestToJoinGroupArgs = {
    group_id: Scalars['String'];
};
export declare type MutationAnswerPendingJoinGroupRequestArgs = {
    answerPendingJoinGroupRequestInput: AnswerPendingJoinGroupRequestInput;
};
export declare type MutationAnswerJoinFamilyGroupRequestArgs = {
    answerJoinFamilyGroupRequestInput: AnswerJoinFamilyGroupRequestInput;
};
export declare type MutationCancelPendingJoinGroupRequestArgs = {
    id: Scalars['String'];
};
export declare type MutationResendFamilyMemberInvitationArgs = {
    invitation_id: Scalars['String'];
};
export declare type MutationCreateEducationLevelArgs = {
    createEducationLevelInput: CreateEducationLevelInput;
};
export declare type MutationUpdateEducationLevelArgs = {
    updateEducationLevelInput: UpdateEducationLevelInput;
};
export declare type MutationDeleteEducationLevelArgs = {
    id: Scalars['String'];
};
export declare type MutationCreateExperienceYearsArgs = {
    createExperienceYearsInput: CreateExperienceYearsInput;
};
export declare type MutationUpdateExperienceYearsArgs = {
    updateExperienceYearsInput: UpdateExperienceYearsInput;
};
export declare type MutationDeleteExperienceYearsArgs = {
    id: Scalars['String'];
};
export declare type MutationCreateUserRelationshipArgs = {
    createUserRelationshipInput: CreateUserRelationshipInput;
};
export declare type MutationUpdateUserRelationshipArgs = {
    updateUserRelationshipInput: UpdateUserRelationshipInput;
};
export declare type MutationCreateRelationshipArgs = {
    createRelationshipInput: CreateRelationshipInput;
};
export declare type MutationUpdateRelationshipArgs = {
    updateRelationshipInput: UpdateRelationshipInput;
};
export declare type MutationDeleteRelationshipArgs = {
    id: Scalars['String'];
};
export declare type MutationCreateGoalArgs = {
    createGoalInput: TextInput;
};
export declare type MutationUpdateGoalArgs = {
    updateGoalInput: UpdateGoalInput;
};
export declare type MutationDeleteGoalArgs = {
    goal_id: Scalars['String'];
};
export declare type MutationCreateUserReportArgs = {
    createUserReportInput: CreateUserReportInput;
};
export declare type MutationUpdateUserReportArgs = {
    updateUserReportInput: UpdateUserReportInput;
};
export declare type MutationDeleteUserReportArgs = {
    id: Scalars['String'];
};
export declare type MutationCreatePayoutAccountArgs = {
    createPayoutAccountInput: CreatePayoutAccountInput;
};
export declare type MutationUpdatePayoutAccountArgs = {
    updatePayoutAccountInput: UpdatePayoutAccountInput;
};
export declare type MutationDeletePayoutAccountArgs = {
    deletePayoutAccountInput: DeletePayoutAccountInput;
};
export declare type MutationCreateUserSubscriptionArgs = {
    createUserSubscriptionInput: CreateUserSubscriptionInput;
};
export declare type MutationUpdateUserSubscriptionArgs = {
    updateUserSubscriptionInput: UpdateUserSubscriptionInput;
};
export declare type MutationSetUserSubscriptionFeaturesArgs = {
    setUserSubscriptionFeaturesInput: SetUserSubscriptionFeaturesInput;
};
export declare type MutationSetUserSubscriptionStatusArgs = {
    setUserSubscriptionStatusInput: SetUserSubscriptionStatusInput;
};
export declare type MutationInviteTutorToAppArgs = {
    createTutorInvitationInput: CreateTutorInvitationInput;
};
export declare type MutationResendTutorInvitationArgs = {
    resendTutorInvitationInput: ResendTutorInvitationInput;
};
export declare type MutationSendNotificationBySmsArgs = {
    sendNotificationBySmsInput: SendNotificationBySmsInput;
};
export declare type MutationSendNotificationByEmailArgs = {
    sendNotificationByEmailInput: SendNotificationByEmailInput;
};
export declare type MutationSendNotificationInAppArgs = {
    sendNotificationInAppInput: SendNotificationInAppInput;
};
export declare type MutationCreateNotificationPreferenceArgs = {
    createNotificationPreferenceInput: CreateNotificationPreferenceInput;
};
export declare type MutationDeleteNotificationPreferenceArgs = {
    id: Scalars['String'];
};
export declare type CreateUserInput = {
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
export declare type InputRoleModel = {
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
export declare type SendSessionInvitationByEmailInput = {
    email?: InputMaybe<Scalars['String']>;
    invitation_id: Scalars['String'];
    user_id?: InputMaybe<Scalars['String']>;
};
export declare type UpdateTutorInput = {
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
export declare type AddressInput = {
    address_line1?: InputMaybe<Scalars['String']>;
    city?: InputMaybe<Scalars['String']>;
    state?: InputMaybe<State>;
    zip?: InputMaybe<Scalars['String']>;
    country?: InputMaybe<Country>;
};
export declare type BaseUpdateUserInput = {
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
export declare type ChangePasswordInput = {
    previous_password: Scalars['String'];
    new_password: Scalars['String'];
};
export declare type SetPasswordInput = {
    password: Scalars['String'];
    token: Scalars['String'];
    user_id: Scalars['String'];
    timezone?: InputMaybe<Scalars['String']>;
};
export declare type AttachClassroomGroupInput = {
    org_name: Scalars['String'];
    classroom_name: Scalars['String'];
};
export declare type SetEmailInput = {
    email: Scalars['String'];
    unique_id: Scalars['String'];
};
export declare type VerifyPhoneNumberInput = {
    code: Scalars['String'];
};
export declare type CreateGroupInput = {
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
export declare type UpdateGroupInput = {
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
export declare type DeleteUserFromGroupInput = {
    user_to_delete_id: Scalars['String'];
    group_id: Scalars['String'];
};
export declare type AddUserToGroupInput = {
    user_id: Scalars['String'];
    group_id: Scalars['String'];
};
export declare type CreateDefaultGroupInput = {
    user_id: Scalars['String'];
    token: Scalars['String'];
};
export declare type CreateRoleInput = {
    name: Scalars['String'];
    permissions: Array<DefaultPermissions>;
};
export declare type UpdateRoleInput = {
    name?: InputMaybe<Scalars['String']>;
    permissions?: InputMaybe<Array<DefaultPermissions>>;
    id?: InputMaybe<Scalars['String']>;
};
export declare type AssignRoleInput = {
    id: Scalars['String'];
    role_id: Scalars['String'];
};
export declare type SignUpTutorInput = {
    email?: InputMaybe<Scalars['String']>;
    first_name: Scalars['String'];
    last_name: Scalars['String'];
    domain?: InputMaybe<Scalars['String']>;
    invitation_code: Scalars['String'];
};
export declare type SignUpStudentInput = {
    email?: InputMaybe<Scalars['String']>;
    first_name: Scalars['String'];
    last_name: Scalars['String'];
    domain?: InputMaybe<Scalars['String']>;
    student_type: StudentType;
};
export declare type AddAdminToOrganizationInput = {
    first_name: Scalars['String'];
    last_name: Scalars['String'];
    email: Scalars['String'];
};
export declare type SignInInput = {
    password: Scalars['String'];
    email: Scalars['String'];
};
export declare type SignInMinorChildInput = {
    child_id: Scalars['ID'];
    domain?: InputMaybe<Scalars['String']>;
};
export declare type ForgotPasswordInput = {
    email: Scalars['String'];
    password_set: Scalars['Boolean'];
    user_type?: InputMaybe<UserType>;
    org_name?: InputMaybe<Scalars['String']>;
    id: Scalars['String'];
};
export declare type CreateOrganizationInput = {
    name: Scalars['String'];
    domain: Scalars['String'];
    difficulty_levels: Array<DifficultyLevelInput>;
    age_groups: Array<AgeGroupInput>;
    features?: InputMaybe<FeaturesInput>;
    status?: InputMaybe<OrganizationStatus>;
    categories?: InputMaybe<Array<Scalars['JSONObject']>>;
    app_features?: InputMaybe<AppFeaturesInput>;
};
export declare type UpdateOrganizationInput = {
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
export declare type UpdateStudentInput = {
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
export declare type AddMinorChildInput = {
    first_name: Scalars['String'];
    last_name: Scalars['String'];
    dob: Scalars['DateTime'];
    topics?: InputMaybe<Array<Scalars['String']>>;
    goals: Array<Scalars['String']>;
    profile_image: Scalars['String'];
    languages: Array<Scalars['ID']>;
};
export declare type UpdateMinorChildInput = {
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
export declare type InviteFamilyMemberToAppInput = {
    email?: InputMaybe<Scalars['String']>;
    first_name: Scalars['String'];
    last_name: Scalars['String'];
    phone?: InputMaybe<Scalars['String']>;
    relationship_to_children_id: Scalars['String'];
    relationship_to_me_id: Scalars['String'];
    child_access?: InputMaybe<Scalars['Boolean']>;
};
export declare type InviteToGroupInput = {
    user_id: Scalars['String'];
    group_id: Scalars['String'];
};
export declare type InviteToFamilyGroupInput = {
    child_access: Scalars['Boolean'];
    user_id: Scalars['String'];
    relationship_to_children_id: Scalars['String'];
    relationship_to_me_id: Scalars['String'];
};
export declare type AnswerPendingJoinGroupRequestInput = {
    id: Scalars['String'];
    answer: Scalars['Boolean'];
};
export declare type AnswerJoinFamilyGroupRequestInput = {
    child_access?: InputMaybe<Scalars['Boolean']>;
    unique_id?: InputMaybe<Scalars['String']>;
    invitation_id?: InputMaybe<Scalars['String']>;
    answer: Scalars['Boolean'];
};
export declare type CreateEducationLevelInput = {
    value: Scalars['String'];
};
export declare type UpdateEducationLevelInput = {
    value: Scalars['String'];
    id: Scalars['String'];
};
export declare type CreateExperienceYearsInput = {
    value: Scalars['String'];
};
export declare type UpdateExperienceYearsInput = {
    value: Scalars['String'];
    id: Scalars['String'];
};
export declare type CreateUserRelationshipInput = {
    family_member_id: Scalars['String'];
    relationship_to_me_id?: InputMaybe<Scalars['String']>;
    relationship_to_children_id: Scalars['String'];
};
export declare type UpdateUserRelationshipInput = {
    family_member_id?: InputMaybe<Scalars['String']>;
    relationship_to_me_id?: InputMaybe<Scalars['String']>;
    relationship_to_children_id?: InputMaybe<Scalars['String']>;
    id: Scalars['String'];
};
export declare type CreateRelationshipInput = {
    name: Scalars['String'];
};
export declare type UpdateRelationshipInput = {
    name: Scalars['String'];
    id: Scalars['String'];
};
export declare type TextInput = {
    text: Scalars['String'];
};
export declare type UpdateGoalInput = {
    text: Scalars['String'];
    id: Scalars['String'];
};
export declare type CreateUserReportInput = {
    user_id: Scalars['ID'];
    reasons: Array<UserReportReason>;
    description?: InputMaybe<Scalars['String']>;
};
export declare type UpdateUserReportInput = {
    reasons?: InputMaybe<Array<UserReportReason>>;
    description?: InputMaybe<Scalars['String']>;
    id: Scalars['ID'];
};
export declare type CreatePayoutAccountInput = {
    account_id: Scalars['String'];
};
export declare type UpdatePayoutAccountInput = {
    updated_earnings?: InputMaybe<Scalars['Int']>;
    status?: InputMaybe<PayoutAccountStatusEnum>;
};
export declare enum PayoutAccountStatusEnum {
    Active = "active",
    Inactive = "inactive"
}
export declare type DeletePayoutAccountInput = {
    payout_account_id: Scalars['String'];
};
export declare type CreateUserSubscriptionInput = {
    customer_id?: InputMaybe<Scalars['String']>;
    status: Scalars['String'];
    features: SubscriptionFeaturesInput;
    subscription_id?: InputMaybe<Scalars['String']>;
    promo_code_id?: InputMaybe<Scalars['String']>;
    children_count?: InputMaybe<Scalars['Float']>;
};
export declare type UpdateUserSubscriptionInput = {
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
export declare type SetUserSubscriptionFeaturesInput = {
    id: Scalars['String'];
    features: SubscriptionFeaturesInput;
};
export declare type SetUserSubscriptionStatusInput = {
    id: Scalars['String'];
    status: Scalars['String'];
};
export declare type CreateTutorInvitationInput = {
    email: Scalars['String'];
    info?: InputMaybe<Scalars['JSONObject']>;
};
export declare type ResendTutorInvitationInput = {
    email: Scalars['String'];
};
export declare type SendNotificationBySmsInput = {
    phone_number: Scalars['String'];
    message: Scalars['String'];
};
export declare type SendNotificationByEmailInput = {
    email: Scalars['String'];
    template: Scalars['JSONObject'];
};
export declare type SendNotificationInAppInput = {
    room_id: Scalars['String'];
    type: RoomApiMessages;
    payload?: InputMaybe<Scalars['JSONObject']>;
};
export declare enum RoomApiMessages {
    SessionHasStarted = "session_has_started",
    SessionWasEnded = "session_was_ended",
    SessionWasCreatedInGroup = "session_was_created_in_group",
    LiveSessionWasCreatedInGroup = "live_session_was_created_in_group",
    YouWereInvitedToSession = "you_were_invited_to_session",
    UserJoinedSession = "user_joined_session",
    UserWasAddedToSessionParticipants = "user_was_added_to_session_participants",
    UserLeftSession = "user_left_session",
    UserWasBlockedFromTheSession = "user_was_blocked_from_the_session",
    YouWereBlockedFromTheSession = "you_were_blocked_from_the_session",
    UserCancelledInvitation = "user_cancelled_invitation",
    UserAcceptedSessionInvitation = "user_accepted_session_invitation",
    UserJoinedGroup = "user_joined_group",
    UserLeftGroup = "user_left_group",
    YouWereInvitedToGroup = "you_were_invited_to_group",
    YouWereInvitedToFamilyGroup = "you_were_invited_to_family_group",
    UserAcceptedGroupInvitation = "user_accepted_group_invitation",
    RequestToJoinGroupWasAccepted = "request_to_join_group_was_accepted",
    SubscriptionUpdated = "subscription_updated",
    ContentEditRequested = "content_edit_requested",
    UserHasUpcomingSession = "user_has_upcoming_session",
    YourVideoHasChangedStatus = "your_video_has_changed_status"
}
export declare type CreateNotificationPreferenceInput = {
    notification_type: NotificationType;
    notification_method: NotificationMethod;
};
