export interface Post {
  __typename: string;
  id: string;
  profile: {
    id: string;
    name: string;
  };
  metadata: {
    content: string;
  };
  stats: {
    totalAmountOfCollects: number;
    totalAmountOfComments: number;
    totalAmountOfMirrors: number;
  };
}
