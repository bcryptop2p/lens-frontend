export interface Post {
  __typename: string;
  id: string;
  profile: {
    id: string;
    handle: string;
    name: string;
    picture: {
      original: {
        url: string;
      };
    };
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
