export type CreateGoalRequest = {
  name: string;
  type: string;
  description?: string;
  is_completed?: boolean;
  tasks?: Record<string, boolean>;
};

export type UpdateGoalRequest = {
  id: string;
  request: CreateGoalRequest;
};

export type GetGoalResponse = {
  id: string;
  name: string;
  type: 'networking' | 'interviewing' | 'compensation' | 'organization';
  user_id: string;
  created_at: string;
  updated_at: string;
  description: string;
  is_completed: boolean;
  tasks: {
    [key: string]: boolean;
  };
};
