export interface Todo {
  _id: string;
  owner: string;
  status: boolean;
  category: string;
  body: string;
}

export type statusType = 'complete' | 'incomplete' ;

export type TodoOwner = 'admin' | 'editor' | 'viewer';
