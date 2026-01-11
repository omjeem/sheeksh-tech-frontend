export interface Category {
  id: string;
  category: string;
}

export interface Template {
  id: string;
  name: string;
  templatePayload: {
    subject: string;
    bodyHtml: string;
    variables: string[];
  };
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    category: string;
  };
}
