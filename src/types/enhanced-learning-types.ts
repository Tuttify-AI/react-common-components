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
  JSONObject: any;
  //eslint-disable-next-line
  DateTime: any;
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

export enum QuestionType {
  MultipleChoice = 'multiple_choice',
  MultipleSelect = 'multiple_select',
  TrueFalse = 'true_false',
  AgreeDisagree = 'agree_disagree',
  Range = 'range',
  InputText = 'input_text',
  InputNumber = 'input_number',
}

export type QuestionModel = IUserRelationModel & {
  __typename?: 'QuestionModel';
  _id: Scalars['ID'];
  created_at?: Maybe<Scalars['DateTime']>;
  last_updated_at: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  created_by?: Maybe<Scalars['String']>;
  last_updated_by?: Maybe<Scalars['String']>;
  org_id?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  micro_lesson_id?: Maybe<Scalars['String']>;
  assessment_id?: Maybe<Scalars['String']>;
  type: QuestionType;
  active?: Maybe<Scalars['Boolean']>;
  url?: Maybe<Scalars['String']>;
  users_viewed?: Maybe<Array<Scalars['String']>>;
  allow_user_suggest_answer?: Maybe<Scalars['Boolean']>;
  has_correct_answer: Scalars['Boolean'];
  answers?: Maybe<Array<Answer>>;
  tags?: Maybe<Array<Scalars['String']>>;
  tag_text?: Maybe<Array<Scalars['String']>>;
  is_archived: Scalars['Boolean'];
  labels?: Maybe<Array<Scalars['String']>>;
};

export type Answer = {
  __typename?: 'Answer';
  text: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  weight?: Maybe<Scalars['Float']>;
  original?: Maybe<Scalars['Boolean']>;
  active?: Maybe<Scalars['Boolean']>;
  metadata?: Maybe<Scalars['JSONObject']>;
  is_correct?: Maybe<Scalars['Boolean']>;
  reason?: Maybe<Scalars['String']>;
};

export type AnsweredByType = {
  user_id: string;
  answer_id: string;
  reason: string;
};

export type AskedQuestionType = {
  question: QuestionModel;
  asked_by: string[];
  answered_by: AnsweredByType[];
};

export type InteractQuestionPayload = {
  interaction_type: string;
  entity_id: string;
  tab_id: string | null;
  extra_data?: Record<string, unknown>;
};

export type InteractResponse = {
  detail: string;
  is_correct: boolean;
  correct_answer: string;
  history?: Record<string, unknown>;
};
