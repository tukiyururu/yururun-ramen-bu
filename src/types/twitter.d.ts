declare namespace Twitter {
  interface Parameters {
    [key: string]: number | string;
  }

  interface Retweets {
    id_str: string,
    screen_name: string;
  }

  namespace JSON {
    interface Status {
      id_str: string;
      text: string;
      user: User;
      retweeted_status: User | undefined;
      entities: Entities;
    }

    interface User {
      id_str: string;
      screen_name: string;
    }

    interface Entities {
      hashtags: Hashtags[]
    }

    interface Hashtags {
      text: string
    }
  }
}
