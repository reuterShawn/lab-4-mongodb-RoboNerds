export interface Todo {
  _id: string;
  owner: string;
  status: boolean;
  category: string;
  body: string;
}

export type TodoOwner = 'admin' | 'editor' | 'viewer';
