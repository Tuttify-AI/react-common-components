export type ModerationMessage = {
  room_id: [string];
  _id: string;
  from_user: string;
  from_user_data: {
    first_name: string;
    last_name: string;
    org_id: string;
  };
  payload: {
    additionalProp1: string;
    additionalProp2: string;
  };
  created_at: string;
  updated_at: string;
};
