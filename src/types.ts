export interface Platform {
  id: string;
  url: string;
  name: string;
  description: string;
  domain: string;
  logoUrl?: string;
  createdAt: number;
}

export type ModalType = 'submit' | 'edit' | 'delete' | 'about' | 'resources' | 'suggest' | 'contact' | 'database' | null;
