export interface UserTableData {
  id: number;
  businessName: string;
  robotProcess: string;
  noteTaking: string;
  createdAt: string;
  users?: UserDetail[];
}

export interface UserDetail {
  id: number;
  name: string;
  email: string;
} 