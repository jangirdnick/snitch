export interface GoogleUser {
  id: string;
  displayName: string;
  name: {
    givenName: string;
    familyName: string;
  };
  emails: {
    value: string;
    verified: boolean;
  }[];
  photos: {
    value: string;
  }[];
}

export interface Profile {
  id: string;
  displayName: string;
  emails: {
    value: string;
    verified: boolean;
  }[];
  photos: {
    value: string;
  }[];
  provider: 'google';
}
